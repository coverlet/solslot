import React, { ReactElement } from "react";
import "./slot-screen.scss";
import { Reel } from "../reel/reel";
import { useEffect } from "react";
import { SlotStatus } from "../slot-machine/slot-machine";
import { useState } from "react";

const win2Slots = [5, 8];
const win3Slots = [4];

const reels = {
  1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  2: [1, 3, 9, 5, 7, 6, 8, 0, 4, 2],
  3: [4, 8, 7, 3, 0, 2, 5, 9, 6, 1],
};

const getWinCombination = (type: number) => {
  let winSymbol;
  switch (type) {
    case 1:
      winSymbol = win2Slots[Math.floor(Math.random() * 2)];
      return [
        reels[1].indexOf(winSymbol),
        reels[2].indexOf(winSymbol),
        reels[3].indexOf(winSymbol),
      ];
    case 2:
      winSymbol = win3Slots[0];
      return [
        reels[1].indexOf(winSymbol),
        reels[2].indexOf(winSymbol),
        reels[3].indexOf(winSymbol),
      ];
    default:
      do {
        winSymbol = Math.floor(Math.random() * 10);
      } while (win2Slots.includes(winSymbol) || win3Slots.includes(winSymbol));
      //@ts-ignore
      return [
        reels[1].indexOf(winSymbol),
        reels[2].indexOf(winSymbol),
        reels[3].indexOf(winSymbol),
      ];
  }
};

const getLooseCombination = () => {
  const target = [];
  target[0] = Math.floor(Math.random() * 7);
  target[1] = Math.floor(Math.random() * 7);
  do {
    target[2] = Math.floor(Math.random() * 7);
  } while (target[2] === target[1] && target[2] === target[0]);
  return target;
};

export const SlotScreen = ({
  spin,
  onSpinFinished,
  status,
}: any): ReactElement => {
  const [targets, setTargets] = useState([null, null, null]);

  useEffect(() => {
    switch (status) {
      case SlotStatus.spin:
        //@ts-ignore
        setTargets([-1, -1, -1]);
        break;

      case SlotStatus.loose:
        //@ts-ignore
        setTargets(getLooseCombination());
        break;

      case SlotStatus.win1:
        //@ts-ignore
        setTargets(getWinCombination(0));
        break;

      case SlotStatus.win2:
        //@ts-ignore
        setTargets(getWinCombination(1));
        break;
      case SlotStatus.win3:
        //@ts-ignore
        setTargets(getWinCombination(2));
        break;

      default:
        break;
    }
  }, [status]);

  return (
    <div className="slot-screen">
      <Reel index={1} target={targets[0]} spin={spin} />
      <Reel index={2} target={targets[1]} spin={spin} />
      <Reel
        index={3}
        target={targets[2]}
        spin={spin}
        onSpinFinished={() => onSpinFinished()}
      />
    </div>
  );
};
