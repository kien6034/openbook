import { BN, Wallet } from "@project-serum/anchor";

import { getFixture } from "./utils/fixture";
import { getWallets, ROLES } from "./utils/provider";
import { env } from "./env";
import { PublicKey } from "@solana/web3.js";

import { Market } from "@openbook-dex/openbook";
import * as marketLister from "./genesis/market-lister";
import { DEX_PID } from "./genesis";

const PROXY_PROGRAM_ID = new PublicKey(env.PROXY_PROGRAM_ID);

const main = async () => {
  const wallets = getWallets([ROLES.DEPLOYER, ROLES.USER]);
  const deployerKeypair = wallets[ROLES.DEPLOYER];

  const provider = await getFixture(deployerKeypair);

  const result = await marketLister.list({
    provider: provider,
    wallet: deployerKeypair,
    baseMint: new PublicKey(env.BASE_MINT),
    quoteMint: new PublicKey(env.QUOTE_MINT),
    baseLotSize: 100000,
    quoteLotSize: 100,
    dexProgramId: DEX_PID,
    feeRateBps: 0,
    proxyProgramId: PROXY_PROGRAM_ID,
  });

  console.log("result: ", result);
};

main().catch((error) => console.log(error));
