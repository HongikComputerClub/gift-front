import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Ment2 from "./Ment2";
import useUser from "../../hooks/UseUser";
import Category from "./Category";
import Card from "./Card";
import Loading from "./Loading";
import "../../styles/result/Inventory.css";
import axios from "axios";
import { FaChevronUp } from "react-icons/fa"; //up 아이콘
import { TbReload } from "react-icons/tb"; //reload 아이콘

const Inventory = () => {
  const { userData } = useUser();
  const [inventory, setInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentItems, setCurrentItems] = useState({});
  const inventoryItemRef = useRef(null);
  const [lastItems, setLastItems] = useState({});
  const [page, setPage] = useState({});
  const [reasons, setReasons] = useState([]);

  // userData 변하면 API 호출, 똑같으면 sessionStorage
  const getInventory = useCallback(async () => {
    const savedUserData = sessionStorage.getItem("userData");
    const savedInventory = sessionStorage.getItem("inventory");
    const savedReason = sessionStorage.getItem("reason");

    if (!userData || Object.values(userData).every((value) => value === null)) {
      // userData가 없으면 세션에서 가져오기
      if (savedInventory) {
        const parsedInventory = JSON.parse(savedInventory);
        setInventory(parsedInventory);
        setReasons(savedReason ? JSON.parse(savedReason) : []);
        setLoading(false);
      }
    } else {
      // userData가 있고, savedUserData와 같으면 savedInventory를 사용
      if (
        savedUserData &&
        JSON.parse(savedUserData).name === userData.name &&
        JSON.parse(savedUserData).changed === userData.changed
      ) {
        if (savedInventory) {
          const parsedInventory = JSON.parse(savedInventory);
          setInventory(parsedInventory);
          setReasons(savedReason ? JSON.parse(savedReason) : []);
          setLoading(false);
        }
      } else {
        // userData가 있고, savedUserData와 다르면 API 호출
        const formData = new FormData();
        formData.append("file", userData.file);

        try {
          const queryString = new URLSearchParams({
            targetName: userData.name,
            relation: userData.relationship,
            sex: userData.gender,
            theme: userData.theme,
          }).toString();

          const response = await axios.post(
            `https://app.presentalk.store/api/gpt/process?${queryString}`,
            formData,
            { headers: { Accept: "application/json" } }
          );
          const inventoryData = response.data.product || [];
          const reasonData = response.data.reason || [];

          const updatedInventory = await Promise.all(
            inventoryData.map(async (item) => {
              const changedImage = await changeImage(item.image);
              return { ...item, changedImage };
            })
          );

          setInventory(updatedInventory);
          setReasons(reasonData);

          // sessionStorage에 저장
          sessionStorage.setItem("userData", JSON.stringify(userData));
          sessionStorage.setItem("inventory", JSON.stringify(updatedInventory));
          sessionStorage.setItem("reason", JSON.stringify(reasonData));
        } catch (error) {
          console.log("선물 리스트 받아오기 실패", error);
        } finally {
          setLoading(false);
        }
      }
    }
  }, [userData]);

  const changeImage = async (url) => {
    if (!url.startsWith("https://kream")) {
      return url; // 변환 필요 없음
    }

    try {
      console.log("요청 URL", url);
      const response = await axios.get(
        `https://app.presentalk.store/api/proxy/kream?url=${encodeURIComponent(
          url
        )}`,
        { responseType: "blob" }
      );
      const objectUrl = URL.createObjectURL(response.data);
      console.log("이미지 변환은 성공");
      return objectUrl;
    } catch (error) {
      console.log("이미지 변환 실패", error);
      return url; // 변환 실패 시 원본 URL 유지
    }
  };

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  const categories = useMemo(() => {
    return [...new Set(inventory.map((item) => item.keyword))];
  }, [inventory]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // 처음에만
  const loadFirstItems = useCallback(() => {
    if (!selectedCategory) return;

    const filteredInventory = inventory.filter(
      (item) => item.keyword === selectedCategory
    );

    // currentItems[selectedCategory]가 없으면 처음 20개 로드
    if (!currentItems[selectedCategory]) {
      const newItems = filteredInventory.slice(0, 20); // 처음 20개만 로드

      setCurrentItems((prevItems) => ({
        ...prevItems,
        [selectedCategory]: newItems, // 해당 카테고리 아이템만 새로 업데이트
      }));
      setPage((prevPage) => ({
        ...prevPage,
        [selectedCategory]: 1, // 페이지 초기화
      }));
    }
  }, [inventory, selectedCategory, currentItems]);

  // 재분석 시 아이템 로드
  const loadNextItems = useCallback(() => {
    if (!selectedCategory) return;
    const filteredInventory = inventory.filter(
      (item) => item.keyword === selectedCategory
    );
    const currentPage = page[selectedCategory] || 0;
    const start = currentPage * 20;
    const end = start + 20;
    const newItems = filteredInventory.slice(start, end);

    if (newItems.length === 0) {
      // console.log(`마지막 아이템 확인 - ${selectedCategory}는 더 이상 없음`);
      setLastItems((prev) => ({ ...prev, [selectedCategory]: true }));
    } else {
      setCurrentItems((prevItems) => ({
        ...prevItems,
        [selectedCategory]: newItems,
      }));
      setPage((prevPage) => ({
        ...prevPage,
        [selectedCategory]: currentPage + 1,
      }));
    }
  }, [inventory, selectedCategory, page, setLastItems]);

  // 스크롤 처리
  useEffect(() => {
    const checkAndAttachListener = () => {
      if (inventoryItemRef.current) {
        const handleScroll = () => {
          setIsScrolled(inventoryItemRef.current.scrollTop > 0);
        };

        inventoryItemRef.current.addEventListener("scroll", handleScroll);
        handleScroll(); // 초기 실행

        return () => {
          inventoryItemRef.current?.removeEventListener("scroll", handleScroll);
        };
      } else {
        setTimeout(checkAndAttachListener, 100); // 0.1초 후 다시 확인
      }
    };

    checkAndAttachListener();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadFirstItems();
    }
  }, [selectedCategory, loadFirstItems]);

  useEffect(() => {
    if (selectedCategory && !currentItems[selectedCategory]) {
      loadNextItems();
    }
  }, [selectedCategory, currentItems, loadNextItems]);

  // 로딩 중일 때
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {reasons.some((item) => item.keyword === selectedCategory) ? (
        reasons
          .filter((item) => item.keyword === selectedCategory)
          .map((item, index) => (
            <Ment2
              content={item.reason.replace(/\[|\]/g, "")} // [] 제거
              key={index}
            />
          ))
      ) : (
        <Ment2 content="소중한 상대방을 위해 이런 선물은 어떠세요?" />
      )}
      <div className="Inventory">
        <div className="Inventory_category">
          {categories.map((category, index) => (
            <Category
              key={index}
              text={category}
              type={selectedCategory === category ? "black" : "gray"}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
        <div className="Inventory_item" ref={inventoryItemRef}>
          {(currentItems[selectedCategory] || []).map((item) => (
            <Card key={item.id} inventory={item} />
          ))}

          {isScrolled ? (
            <FaChevronUp
              className="icon up"
              onClick={() => (inventoryItemRef.current.scrollTop = 0)}
            />
          ) : (
            !lastItems[selectedCategory] && (
              <TbReload className="icon reload" onClick={loadNextItems} />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Inventory;
