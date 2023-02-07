import { PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { getProvider } from "./conn";
import { SystemProgram } from "@solana/web3.js";
import idl from "../slots.json";

const programID = new PublicKey(idl.metadata.address);

export const spin = async () => {
  const provider = getProvider();
  //@ts-ignore
  const program = new Program(idl, programID, provider);

  const [vault, bump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    program.programId
  );
  const [userVault, ubump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("uvault"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  return new Promise(async (resolve, reject) => {
    try {
      const tx = await program.methods
        .spin()
        .accounts({
          vault,
          userVault,
          signer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(tx);

      setTimeout(async () => {
        //@ts-ignore
        const txLogs = await provider.connection.getTransaction(tx, {
          commitment: "confirmed",
        });

        const logMessage = txLogs!.meta!.logMessages![2];
        const flipResult = logMessage.slice(-1);
        console.log(logMessage);
        console.log(flipResult);
        resolve(flipResult);
      }, 3000);
    } catch (error) {
      resolve(0);
    }
  });
};

export const collectWins = async () => {
  const provider = getProvider();
  //@ts-ignore
  const program = new Program(idl, programID, provider);

  const [userVault, ubump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("uvault"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .claimWinnings()
    .accounts({
      userVault,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  console.log(tx);
};

export const initUserAccount = async () => {
  const provider = getProvider();
  //@ts-ignore
  const program = new Program(idl, programID, provider);

  const [userVault, ubump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("uvault"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .createUserVault()
    .accounts({
      userVault,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  console.log(tx);
};

export const initVault = async () => {
  const provider = getProvider();
  //@ts-ignore
  const program = new Program(idl, programID, provider);

  const [vault, bump] = await PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    program.programId
  );

  const tx = await program.methods
    .init()
    .accounts({
      vault,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  console.log(tx);
};
