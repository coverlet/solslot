import { useEffect, useState } from "react";
import * as buffer from "buffer";
import {
  SlotMachine,
  SlotStatus,
} from "./components/slot-machine/slot-machine";
import { initVault, spin, collectWins } from "./core/transactions";
import {
  checkIfWalletConnected,
  connectWallet,
  getBalance,
} from "./core/wallet";
import { ReactComponent as WalletSvg } from "./img/wallet.svg";

import "./App.scss";
import { formatAddress } from "./core/utils";
window.Buffer = buffer.Buffer;

function App() {
  const [walletAddress, setWalletAdresss] = useState("");
  const [Loding, setLoading] = useState(false);
  const [status, setStatus] = useState(SlotStatus.none);
  const [collect, setCollect] = useState(false);
  const [balance, setBalance] = useState("");
  const [winBalance, setWinBalance] = useState("");

  useEffect(() => {
    getBalance();
    const onLoad = () => {
      checkIfWalletConnected().then((res) => {
        setWalletAdresss(res as string);
        updateBalance();
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const updateBalance = (onlyWallet = false) => {
    getBalance().then((res) => {
      res.balance && setBalance(res.balance);
      if (!onlyWallet) {
        res.winBalance && setWinBalance(res.winBalance);
      }
    });
  };

  const spinIt = () => {
    setStatus(SlotStatus.spin);
    spin().then((result) => {
      updateBalance(true);
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
        {walletAddress && (
          <div className="wallet-info">
            {balance}
            <WalletSvg />
            {formatAddress(walletAddress)}
          </div>
        )}
        {!walletAddress && (
          <button
            className="button"
            onClick={() => {
              connectWallet().then((res) => setWalletAdresss(res as string));
            }}
          >
            Connect wallet
          </button>
        )}
      </div>
      <div className="slot-container">
        <SlotMachine
          onSpin={spinIt}
          status={status}
          winBalance={winBalance}
          collect={() => {
            collectWins().then(() => {
              updateBalance();
            });
          }}
          onSpinFinished={() => {
            updateBalance();
          }}
        />
      </div>
    </div>
  );
}

export default App;
