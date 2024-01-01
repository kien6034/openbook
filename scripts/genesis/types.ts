import { PublicKey, Account, Keypair } from "@solana/web3.js";

// token in mapping of
//  marketMaker.tokens[mint.toString()] = marketMakerTokenA;
export type MarketMakerAccount = {
  baseToken: PublicKey;
  quoteToken: PublicKey;
  account: Keypair;
};
