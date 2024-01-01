import { PublicKey, Connection, Keypair, Commitment } from "@solana/web3.js";
import { AnchorProvider, Wallet, Idl, Program } from "@project-serum/anchor";
import { env } from "../env";

export const getFixture = async function (
  feePayerAuthority: Keypair
): Promise<AnchorProvider> {
  const commitment: Commitment = "confirmed";
  const connection = new Connection(env.RPC_END_POINT);

  const wallet = new Wallet(feePayerAuthority);
  const provider = new AnchorProvider(connection, wallet, { commitment });

  return provider;
};
