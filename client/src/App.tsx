import { useEffect, useState } from "react";
import * as buffer from "buffer";
import {
  SlotMachine,
  SlotStatus,
} from "./components/slot-machine/slot-machine";
import { initVault, spin, collectWins } from "./core/transactions";
import { checkIfWalletConnected, connectWallet } from "./core/wallet";

import "./App.scss";
window.Buffer = buffer.Buffer;

function App() {
  const [walletAddress, setWalletAdresss] = useState("");
  const [Loding, setLoading] = useState(false);
  const [status, setStatus] = useState(SlotStatus.none);
  const [collect, setCollect] = useState(false);

  useEffect(() => {
    const onLoad = () => {
      checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const spinIt = () => {
    setStatus(SlotStatus.spin);
    spin().then((result) => {
      console.log(result);
      switch (result) {
        case "1":
          setStatus(SlotStatus.win1);
          break;
        case "2":
          setStatus(SlotStatus.win2);
          break;
        case "3":
          setStatus(SlotStatus.win3);
          break;

        default:
          setStatus(SlotStatus.loose);
      }
    });
  };

  return (
    <div className="App">
      <div className="header">
        <button
          className="button"
          role="button"
          onClick={() => {
            connectWallet();
          }}
        >
          Connect wallet
        </button>
      </div>
      <div className="slot-container">
        <SlotMachine onSpin={spinIt} status={status} collect={collect} />
      </div>
      <div className="collect-container">
        <button
          className="button"
          role="button"
          onClick={() => {
            collectWins()
          }}
        >
          Collect
        </button>
      </div>
    </div>
  );
}

export default App;
