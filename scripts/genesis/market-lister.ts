import * as anchor from "@project-serum/anchor";

const { BN } = anchor;
const { Account, PublicKey, Transaction, SystemProgram } = anchor.web3;

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as serum from "@openbook-dex/openbook";

const {
  DexInstructions,
  TokenInstructions,
  OpenOrdersPda,
  MARKET_STATE_LAYOUT_V3,
} = serum;
import { Identity } from "./market-proxy";
import { DEX_PID, PROGRAM_KP, sleep } from "./common";

export type ListMarketParams = {
  provider: anchor.Provider;
  wallet: anchor.web3.Keypair;
  baseMint: anchor.web3.PublicKey;
  quoteMint: anchor.web3.PublicKey;
  baseLotSize: number;
  quoteLotSize: number;
  dexProgramId: anchor.web3.PublicKey;
  proxyProgramId: anchor.web3.PublicKey;
  feeRateBps: number;
};

// Creates a market on the dex.
export async function list(listMarketParams: ListMarketParams) {
  const market = MARKET_KP;
  const requestQueue = new Account();
  const eventQueue = new Account();
  const bids = new Account();
  const asks = new Account();
  const baseVault = new Account();
  const quoteVault = new Account();
  const quoteDustThreshold = new BN(100);

  const {
    provider,
    wallet,
    baseMint,
    quoteMint,
    baseLotSize,
    quoteLotSize,
    dexProgramId,
    feeRateBps,
    proxyProgramId,
  } = listMarketParams;

  const [vaultOwner, vaultSignerNonce] = await getVaultOwnerAndNonce(
    market.publicKey,
    dexProgramId
  );

  const tx1 = new Transaction();
  tx1.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: baseVault.publicKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        165
      ),
      space: 165,
      programId: TOKEN_PROGRAM_ID,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: quoteVault.publicKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        165
      ),
      space: 165,
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeAccount({
      account: baseVault.publicKey,
      mint: baseMint,
      owner: vaultOwner,
    }),
    TokenInstructions.initializeAccount({
      account: quoteVault.publicKey,
      mint: quoteMint,
      owner: vaultOwner,
    })
  );

  const tx2 = new Transaction();
  tx2.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: market.publicKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        MARKET_STATE_LAYOUT_V3.span
      ),
      space: MARKET_STATE_LAYOUT_V3.span,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: requestQueue.publicKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        5120 + 12
      ),
      space: 5120 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: eventQueue.publicKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        262144 + 12
      ),
      space: 262144 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: bids.publicKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        65536 + 12
      ),
      space: 65536 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: asks.publicKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(
        65536 + 12
      ),
      space: 65536 + 12,
      programId: dexProgramId,
    }),
    DexInstructions.initializeMarket({
      market: market.publicKey,
      requestQueue: requestQueue.publicKey,
      eventQueue: eventQueue.publicKey,
      bids: bids.publicKey,
      asks: asks.publicKey,
      baseVault: baseVault.publicKey,
      quoteVault: quoteVault.publicKey,
      baseMint,
      quoteMint,
      baseLotSize: new BN(baseLotSize),
      quoteLotSize: new BN(quoteLotSize),
      feeRateBps,
      vaultSignerNonce,
      quoteDustThreshold,
      programId: dexProgramId,
      authority: (await OpenOrdersPda.marketAuthority(
        market.publicKey,
        DEX_PID,
        proxyProgramId
      )) as any,
      pruneAuthority: (await Identity.pruneAuthority(
        market.publicKey,
        DEX_PID,
        proxyProgramId
      )) as any,
    })
  );
  /**
   *  authority: (await OpenOrdersPda.marketAuthority(
        market.publicKey,
        DEX_PID,
        proxyProgramId
      )) as any,
      pruneAuthority: (await Identity.pruneAuthority(
        market.publicKey,
        DEX_PID,
        proxyProgramId
      )) as any,
      crankAuthority: (await Identity.consumeEventsAuthority(
        market.publicKey,
        DEX_PID,
        proxyProgramId
      )) as any,
   */

  const transactions = [
    { transaction: tx1, signers: [baseVault, quoteVault] },
    {
      transaction: tx2,
      signers: [market, requestQueue, eventQueue, bids, asks],
    },
  ];

  // Send transactions with provider

  for (let tx of transactions) {
    await provider.sendAndConfirm(tx.transaction, tx.signers);
  }
  const acc = await provider.connection.getAccountInfo(market.publicKey);

  return [market.publicKey, vaultOwner];
}

async function getVaultOwnerAndNonce(marketPublicKey, dexProgramId = DEX_PID) {
  const nonce = new BN(0);
  while (nonce.toNumber() < 255) {
    try {
      const vaultOwner = await PublicKey.createProgramAddress(
        [marketPublicKey.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
        dexProgramId
      );
      return [vaultOwner, nonce];
    } catch (e) {
      nonce.iaddn(1);
    }
  }
  throw new Error("Unable to find nonce");
}

// Dummy keypair for a consistent market address. Helpful when doing UI work.
// Don't use in production.
const MARKET_KP = new Account([
  13, 174, 53, 150, 78, 228, 12, 98, 170, 254, 212, 211, 125, 193, 2, 241, 97,
  137, 49, 209, 189, 199, 27, 215, 220, 65, 57, 203, 215, 93, 105, 203, 217, 32,
  5, 194, 157, 118, 162, 47, 102, 126, 235, 65, 99, 80, 56, 231, 217, 114, 25,
  225, 239, 140, 169, 92, 150, 146, 211, 218, 183, 139, 9, 104,
]);
