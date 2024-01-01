const { PublicKey, Account } = require("@project-serum/anchor").web3;

export const DEX_PID = new PublicKey(
  "ALgrGkAVEFCsfzVSfhhH9ULoy6xDveTMf4a71STiLGcJ"
);

// This msut be kept in sync with `scripts/localnet.sh`.
export const PROGRAM_KP = new Account([
  205, 122, 4, 244, 46, 43, 79, 73, 218, 199, 177, 70, 100, 162, 2, 56, 150,
  216, 82, 215, 187, 238, 223, 161, 104, 14, 245, 194, 201, 154, 184, 253, 138,
  196, 70, 147, 187, 53, 35, 252, 134, 91, 197, 83, 109, 34, 234, 60, 232, 109,
  170, 83, 182, 195, 16, 22, 183, 97, 208, 89, 31, 61, 224, 35,
]);

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
