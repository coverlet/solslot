import React, { ReactElement, useState } from "react";
import "./lever.scss";
import bulb from "../../img/bulb.png";
import lever from "../../img/lever.png";

export const Lever = ({ onSpin }: any): ReactElement => {
  const [pulled, setPulled] = useState(false);
  return (
    <div
      className={`lever ${pulled && "pulled"}`}
      onClick={() => {
        if (!pulled) {
          setPulled(true);
          onSpin();
        }
      }}
      onAnimationEnd={() => setPulled(false)}
    >
      <img src={bulb} className="bulb" alt="Spin"></img>
      <img src={lever} className="arm" alt="Spin"></img>
    </div>
  );
};
