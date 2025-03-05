import useUser from "../../hooks/UseUser";
import "../../styles/buttons/ThemeSelectButton.css";
import LeftRibbon from "../../assets/icons/ribbon_left.svg";
import RightRibbon from "../../assets/icons/ribbon_right.svg";

const ThemeSelectButton = () => {
  const { userData, setUserData } = useUser();
  const themes = ["생일", "기념일", "집들이", "감사", "축하", "발렌타인데이"];
  const themeMapping = {
    생일: "birthday",
    기념일: "anniversary",
    집들이: "housewarming",
    감사: "thanks",
    축하: "congratulations",
    발렌타인데이: "valentine",
  };

  return (
    <div className="gift-theme-wrapper">
      <div className="gift-theme-container">
        <div className="ribbon-wrapper">
          <img src={LeftRibbon} alt="Left Ribbon" className="ribbon-left" />
          <img src={RightRibbon} alt="Right Ribbon" className="ribbon-right" />
        </div>

        <div className="gift-theme-row">
          {themes.slice(0, 3).map((item) => (
            <button
              key={item}
              className={`gift-theme-item ${
                userData.theme === themeMapping[item] ? "active" : "inactive"
              }`}
              onClick={() =>
                setUserData((prev) => ({ ...prev, theme: themeMapping[item] }))
              }
            >
              {item === "발렌타인데이" ? (
                <>
                  화이트
                  <br />
                  데이
                </>
              ) : (
                item
              )}
            </button>
          ))}
        </div>

        <div className="gift-theme-row">
          {themes.slice(3, 6).map((item) => (
            <button
              key={item}
              className={`gift-theme-item ${
                userData.theme === themeMapping[item] ? "active" : "inactive"
              }`}
              onClick={() =>
                setUserData((prev) => ({ ...prev, theme: themeMapping[item] }))
              }
            >
              {item === "발렌타인데이" ? (
                <>
                  화이트
                  <br />
                  데이
                </>
              ) : (
                item
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectButton;
