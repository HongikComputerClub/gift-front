import "../../styles/kakao/Agree.css";
import Button from "../common/Button";
import AgreePopup from "./AgreePopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Agree = () => {
  const nav = useNavigate();
  const [checked, setChecked] = useState(false);
  const [click, setClick] = useState(false);
  return (
    <>
      <div className="blackBox">
        <div className="Agree">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            id="agreeCheckbox"
          />
          <label htmlFor="agreeCheckbox"></label>
          <h6
            className="whiteMent"
            onClick={() => {
              setClick(true);
            }}
          >
            개인정보 수집 및 이용 동의
          </h6>
          <p>약관 동의하고 파일 업로드 하기</p>
          <Button
            text={"다음"}
            type={checked ? "white" : "gray"}
            onClick={() => {
              if (!checked) {
                alert("약관에 동의해야 진행할 수 있습니다!");
                return;
              }
              nav("/kakao_talk2");
            }}
            disabled={!checked}
          />
        </div>
      </div>
      {click && (
        <AgreePopup
          onCheck={() => {
            setChecked(true);
            setClick(false);
          }}
        />
      )}
    </>
  );
};

export default Agree;
