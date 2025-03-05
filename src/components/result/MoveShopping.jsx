import Button from "../common/Button";
import "../../styles/result/MoveShopping.css";

const MoveShopping = ({ img, title, link, onClose }) => {
  const clickCard = () => {
    window.open(link, "_blank");
  };

  return (
    <div className="grayBox">
      <div className="MoveShopping">
        <h6 onClick={onClose}>X</h6>
        <div className="image_title">
          <img src={img} alt="제품 이미지" />
          <p dangerouslySetInnerHTML={{ __html: title }}></p>
        </div>
        {/* 쿠팡 링크일 경우에만 해당 메시지 렌더링 */}
        {(link.startsWith("https://link.coupang.com") ||
          link.startsWith("https://www.coupang.com")) && (
          <h5 className="coupang">
            ※ 쿠팡 파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있습니다.
          </h5>
        )}
        <Button text={"스토어로 이동"} type={"white"} onClick={clickCard} />
      </div>
    </div>
  );
};

export default MoveShopping;
