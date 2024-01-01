import { BN, Wallet } from "@project-serum/anchor";

import { getFixture } from "./utils/fixture";
import { getWallets, ROLES } from "./utils/provider";
import { env } from "./env";
import { PublicKey } from "@solana/web3.js";

import { Market } from "@openbook-dex/openbook";
import * as marketLister from "./genesis/market-lister";
import { DEX_PID } from "./genesis";
import { Dex } from "@project-serum/serum-dev-tools";

const main = async () => {
  const wallets = getWallets([ROLES.DEPLOYER, ROLES.USER]);
  const deployerKeypair = wallets[ROLES.DEPLOYER];

  const provider = await getFixture(deployerKeypair);

  console.log("provider: ", provider.connection.rpcEndpoint);
  console.log("deployer: ", deployerKeypair.publicKey.toBase58());
  console.log("dex pid: ", DEX_PID.toBase58());
  const dex = new Dex(DEX_PID, provider.connection);

  const baseCoin = await dex.createCoin(
    "SAYA",
    9,
    deployerKeypair,
    deployerKeypair,
    deployerKeypair
  );

  console.log("base coin: ", baseCoin.mint.toBase58());

  const quoteCoin = await dex.createCoin(
    "SRM",
    9,
    deployerKeypair,
    deployerKeypair,
    deployerKeypair
  );

  // Fund the FileKeypair object to place orders.
  // console.log("fund account");
  // await baseCoin.fundAccount(1000000, deployerKeypair, provider.connection);

  // console.log("finish fund account");
  // await quoteCoin.fundAccount(2000000, deployerKeypair, provider.connection);

  const market = await dex.initDexMarket(deployerKeypair, baseCoin, quoteCoin, {
    lotSize: 1e-3,
    tickSize: 1e-2,
  });

  console.log("market: ", market);
};

main().catch((error) => console.log(error));
