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

export const SlotMachine = ({
  onSpin,
  status,
  collect,
  winBalance,
  onSpinFinished,
  walletAddress,
}: any): ReactElement => {
  const [spin, setSpin] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  // const [target, setTarget] = useState(-1);

  const [message, setMessage] = useState("");

  return (
    <div className="slot-machine">
      <div className="screen-container">
        <SlotScreen
          spin={spin}
          onSpinFinished={() => {
            setCanSpin(true);
            onSpinFinished();

            if (!walletAddress) {
              setMessage("CONNECT WALLET");
              return;
            }
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
                setMessage("WON 0.1");
                break;
              case SlotStatus.win3:
                setMessage("WON 0.2");
                break;

              default:
                setMessage("");
                break;
            }
          }}
          status={status}
        />
      </div>

      <div className="collect-container">
        <div className="winning">{winBalance || " 0.00 "}</div>
        <button className="button" onClick={collect}>
          Collect
        </button>
      </div>
      <div className="utils">
        <div className="message">{message}</div>
      </div>
      <div className="buttons-container">
        <button
          className={`push--skeuo ${!canSpin && "is-pushed"}`}
          onClick={() => {
            if (!canSpin) {
              return false;
            }
            setCanSpin(false);
            setSpin(spin + 1);
            onSpin();
            if (!walletAddress) {
              setMessage("CONNECT WALLET");
            } else {
              setMessage("");
            }
          }}
        >
          SPIN
        </button>
      </div>
    </div>
  );
};
