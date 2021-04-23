import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./Styles.css";
/*
Le component pour chacun des boutons de la plateforme web 
*/

export enum MyButtonTypes {
  small = "small",
  medium = "medium",
  large = "large",
}

type MyButtonProps = {
  text: string;
  type: MyButtonTypes;
  color: string;
  hover: string;
  textColor: string;
  textColorHover?: string;
  icon?: any;
  borderColor: string;
  onClick: () => void;
};

export default function SentiersButton({
  text,
  type,
  color,
  hover,
  textColor,
  textColorHover,
  icon,
  borderColor,
  onClick,
}: MyButtonProps): JSX.Element {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [stateBackground, setBackgroundColor] = useState<string>(color);
  const [stateColor, setStateColor] = useState<string>(textColor);

  useEffect(() => {
    if (isHover) {
      setBackgroundColor(hover);
      setStateColor(textColorHover!);
    } else {
      setBackgroundColor(color);
      setStateColor(textColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHover]);

  return (
    <button
      style={{
        backgroundColor: stateBackground,
        color: stateColor,
        borderColor: borderColor,
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={"button " + type}
      onClick={onClick}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          style={{
            marginRight: 15,
            color: stateColor,
          }}
        />
      )}
      {text}
    </button>
  );
}
