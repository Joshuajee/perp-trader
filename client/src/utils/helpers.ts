import { createPublicClient, createWalletClient, http, custom } from "viem";

import { sepolia, localhost } from "viem/chains";

export const publicClient = createPublicClient({
  chain: import.meta.env.DEV ? localhost : sepolia,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: import.meta.env.DEV ? localhost : sepolia,
  //@ts-ignore
  transport: custom(window.ethereum),
});
