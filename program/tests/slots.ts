import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Slots } from "../target/types/slots";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("slots", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Slots as Program<Slots>;
  const puppetKeypair = Keypair.generate();

  it("Creates the vault", async () => {
    const [vault, bump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );

    const tx = await program.methods
      .init()
      .accounts({
        vault: vault,
      })
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
