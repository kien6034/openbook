import { AnchorProvider, BN, Wallet } from "@project-serum/anchor";

import { getFixture } from "./utils/fixture";
import { getWallets, ROLES } from "./utils/provider";
import { env } from "./env";
import {
  Account,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import { Market, MarketProxy } from "@openbook-dex/openbook";
import * as marketLister from "./genesis/market-lister";
import * as marketMaker from "./genesis/market-maker";
import { MARKET_KP } from "./genesis/market-lister";
import * as marketProxy from "./genesis/market-proxy";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { MarketMakerAccount } from "./genesis";
import { deriveATA } from "@orca-so/common-sdk";

const PROXY_PROGRAM_ID = new PublicKey(env.PROXY_PROGRAM_ID);
const DEX_PROGRAM_ID = new PublicKey(env.PROGRAM_ID);

const main = async () => {
  const wallets = getWallets([ROLES.DEPLOYER, ROLES.USER]);
  const deployerKeypair = wallets[ROLES.DEPLOYER];

  const provider = await getFixture(deployerKeypair);

  const marketProxyClient = await marketProxy.load(
    provider.connection,
    PROXY_PROGRAM_ID,
    DEX_PROGRAM_ID,
    MARKET_KP.publicKey
  );

  const baseToken = new PublicKey(env.BASE_MINT);
  const quoteToken = new PublicKey(env.QUOTE_MINT);

  const marketMakerTokenA = await deriveATA(
    deployerKeypair.publicKey,
    baseToken
  );
  const marketMakerTokenB = await deriveATA(
    deployerKeypair.publicKey,
    quoteToken
  );

  const mm: MarketMakerAccount = {
    baseToken: baseToken,
    quoteToken: quoteToken,

    account: deployerKeypair,
  };

  const marketMarkerAccounts = await marketMaker.postOrders(
    provider,
    marketProxyClient,
    mm
  );
};

main().catch((error) => console.log(error));
