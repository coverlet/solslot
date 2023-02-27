import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Program, web3 as anchorWeb3 } from "@project-serum/anchor";
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

  let balance = await provider.connection
    .getBalance(userVault)
    .catch(function (error) {
      return 0;
    });

  const instructions: TransactionInstruction[] = [];
  let logLine = 2;

  // initialize user`s vault
  if (balance === 0) {
    // if we init users vault, log line is 9
    logLine = 9;
    instructions.push(
      await program.methods
        .createUserVault()
        .accounts({
          userVault,
          signer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );
  }

  // const transaction = new Transaction();

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
        .preInstructions(instructions)
        .rpc();
      // instructions.push(
      //   await program.methods
      //     .spin()
      //     .accounts({
      //       vault,
      //       userVault,
      //       signer: provider.wallet.publicKey,
      //       systemProgram: SystemProgram.programId,
      //     })
      //     .instruction()
      // );

      // transaction.add(...instructions);

      // const signature = await provider.wallet.signTransaction(transaction);
      // const result = await provider.connection.sendTransaction(signature);

      setTimeout(async () => {
        //@ts-ignore
        const txLogs = await provider.connection.getTransaction(tx, {
          commitment: "confirmed",
        });

        const logMessage = txLogs!.meta!.logMessages![logLine];
        const flipResult = logMessage.slice(-1);
        console.log(logMessage);
        console.log(flipResult);
        resolve(flipResult);
      }, 3000);
    } catch (error) {
      console.log(error);
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
