export * from "./market-lister";

import * as marketMaker from "./market-maker";
import * as marketLister from "./market-lister";
import { BN } from "@project-serum/anchor";

import { DEX_PID } from "./common";
import * as marketProxy from "./market-proxy";

export * from "./common";
export * from "./types";
// Initializes the genesis state for the tests and localnetwork.
// export async function genesis({ provider, proxyProgramId }) {
//   //
//   // Create all mints and funded god accounts.
//   //
//   const mintGods = await faucet.createMintGods(provider, 2);
//   const [mintGodA, mintGodB] = mintGods;

//   //
//   // Fund an additional account.
//   //
//   const fundedAccount = await faucet.createFundedAccount(
//     provider,
//     mintGods.map((mintGod) => {
//       return {
//         ...mintGod,
//         amount: new BN("10000000000000").muln(10 ** faucet.DECIMALS),
//       };
//     }),
//     marketMaker.KEYPAIR
//   );

//   //
//   // Structure the market maker object.
//   //
//   const marketMakerAccounts = {
//     ...fundedAccount,
//     baseToken: fundedAccount.tokens[mintGodA.mint.toString()],
//     quoteToken: fundedAccount.tokens[mintGodB.mint.toString()],
//   };

//   //
//   // List the market.
//   //
//   const [marketAPublicKey] = await marketLister.list({
//     connection: provider.connection,
//     wallet: provider.wallet,
//     baseMint: mintGodA.mint,
//     quoteMint: mintGodB.mint,
//     baseLotSize: 100000,
//     quoteLotSize: 100,
//     dexProgramId: DEX_PID,
//     feeRateBps: 0,
//   });

//   //
//   // Load a proxy client for the market.
//   //
//   const marketProxyClient = await marketProxy.load(
//     provider.connection,
//     proxyProgramId,
//     DEX_PID,
//     marketAPublicKey
//   );

//   //
//   // Market maker initializes an open orders account.
//   //
//   await marketMaker.initOpenOrders(
//     provider,
//     marketProxyClient,
//     marketMakerAccounts
//   );

//   //
//   // Market maker posts trades on the orderbook.
//   //
//   await marketMaker.postOrders(
//     provider,
//     marketProxyClient,
//     marketMakerAccounts
//   );

//   //
//   // Done.
//   //
//   return {
//     marketProxyClient,
//     mintA: mintGodA.mint,
//     usdc: mintGodB.mint,
//     godA: mintGodA.god,
//     godUsdc: mintGodB.god,
//   };
// }
