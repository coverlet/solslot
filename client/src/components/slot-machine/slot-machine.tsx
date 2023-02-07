import React, { ReactElement, useState } from "react";
import "./slot-machine.scss";
import { SlotScreen } from "../slot-screen/slot-screen";

export enum SlotStatus {
  none,
  spin,
  loose,
  win1,
  win2,
  win3,
}

export const SlotMachine = ({ onSpin, status }: any): ReactElement => {
  const [spin, setSpin] = useState(0);
  // const [target, setTarget] = useState(-1);

  const [message, setMessage] = useState("");

  return (
    <div className="slot-machine">
      <div className="screen-container">
        <SlotScreen
          spin={spin}
          onSpinFinished={() => {
            switch (status) {
              case SlotStatus.spin:
                setMessage("");
                break;

              case SlotStatus.loose:
                setMessage("YOU LOST");
                break;

              case SlotStatus.win1:
                setMessage("WON 0.05");
                break;

              case SlotStatus.win2:
                setMessage("WON 0.01");
                break;
              case SlotStatus.win3:
                setMessage("WON 0.03");
                break;

              default:
                setMessage("");
                break;
            }
          }}
          status={status}
        />
      </div>
      <div className="message">
        {message}
      </div>
      {/* {!collect && ( */}
      <div className="buttons-container">
        <button
          className="push--skeuo"
          onClick={() => {
            // setStatus(SlotStatus.spin);
            setMessage("");
            setSpin(spin + 1);
            onSpin();
          }}
        >
          SPIN
        </button>
      </div>
      {/* )} */}
    </div>
  );
};
