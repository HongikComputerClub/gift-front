import "./Button.css";

const Button = ({ text, type, onClick }) => {
  return (
    // 배경색에 따라 type은 black, white, gray 3개로 분리
    <button onClick={onClick} className={`Button Button_${type}`}>
      {text}
    </button>
  );
};

export default Button;
