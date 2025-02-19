import Header from "../components/common/Header";
import Ment from "../components/kakao/Ment";
import SpeechBubble from "../components/kakao/SpeechBubble";
import WriteName from "../components/kakao/WriteName";

const KakaoTalkName = () => {
  return (
    <div className="KakaoTalk KakaoTalkName">
      <Header />
      <Ment />
      <SpeechBubble />
      <WriteName />
    </div>
  );
};

export default KakaoTalkName;
