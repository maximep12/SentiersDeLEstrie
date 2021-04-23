import { images } from "../Assets/sentiersImages";
import { colors } from "./colors";
import "./Styles.css";

export default function Header(): JSX.Element {
  return (
    <div className="topBanner" style={{ backgroundColor: colors.redBanner }}>
      <div className="column">
        <img src={images.logoSentiersEstrie.default} alt="logoSentiersEstrie" />
      </div>
    </div>
  );
}
