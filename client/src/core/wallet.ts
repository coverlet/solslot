import { PublicKey } from "@solana/web3.js";
import { getProvider } from "./conn";
import { lamportsToSol } from "./utils";
import idl from "../slots.json";
import { Program } from "@project-serum/anchor";

const programID = new PublicKey(idl.metadata.address);

export const checkIfWalletConnected = async () => {
  const { solana } = window;
  return new Promise(async (resolve, reject) => {
    try {
      // setLoading(true);
      if (solana && solana.isPhantom) {
        const response = await solana.connect({
          onlyIfTrusted: true,
        });
        resolve(response.publicKey.toString());
        console.log("public key", response.publicKey.toString());
      } else {
        resolve("");
      }
    } catch (err) {
      console.log("errror");
      resolve("");
    }
  });
};

export const connectWallet = async () => {
  const { solana } = window;
  return new Promise(async (resolve, reject) => {
    try {
      // setLoading(true);
      if (solana) {
        const response = await solana.connect(); //to disconnect use "solana.disconnect()"
        resolve(response.publicKey.toString());
        // setWalletAdresss(response.publicKey.toString());

        // initUserAccount();
      } else {
        alert("Please Install Solana's Phantom Wallet");
        resolve("");
      }
    } catch (err) {
      resolve("");
      console.log(err);
    }
  });
};

export const getBalance = async () => {
  const provider = getProvider();
  //@ts-ignore
  const program = new Program(idl, programID, provider);
  if (!provider.publicKey) {
    return { balance: "", winBalance: "" };
  }


  let vaultBalance = await provider.connection
    .getBalance(new PublicKey("DNifDbg6Mj2NrFWP31cUDTHt5mdqBAz7EHMwmY8ZAs9j"))
    .then(function (data) {
      return lamportsToSol(data).toFixed(2);
    })
    .catch(function (error) {
      console.log(error);
      return "";
    });

  let balance = await provider.connection
    .getBalance(provider.publicKey)
    .then(function (data) {
      console.log("Wallet balance: " + lamportsToSol(data).toFixed(2));
      return lamportsToSol(data).toFixed(2);
    })
    .catch(function (error) {
      console.log(error);
      return "";
    });

  const [userVault, ubump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("uvault"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  let winBalance = await provider.connection
    .getBalance(userVault)
    .then(function (data) {
      console.log("Winning balance : " + lamportsToSol(data).toFixed(2));
      return lamportsToSol(data).toFixed(2);
    })
    .catch(function (error) {
      console.log(error);
      return "";
    });

  return { balance, winBalance, vaultBalance };
};
