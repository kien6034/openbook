import { Keypair } from "@solana/web3.js";

export const ROLES = {
  DEPLOYER: "deployer_authority",
  USER: "user_authority",
};
type RoleType = (typeof ROLES)[keyof typeof ROLES];

export type Account = { [key in RoleType]: Keypair };

export const getWallets = (
  requiredRoles: RoleType[] = Object.values(ROLES) as RoleType[]
) => {
  return requiredRoles.reduce<Account>((acc, roleName) => {
    try {
      acc[roleName] = Keypair.fromSecretKey(
        Uint8Array.from(require(`../.wallets/${roleName}.json`))
      );
    } catch {
      throw new Error(`${roleName} is not valid`);
    }
    return acc;
  }, Object.create(null) as Account);
};
