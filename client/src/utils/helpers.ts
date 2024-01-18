import { createPublicClient, createWalletClient, http, custom } from "viem";

import { sepolia } from "viem/chains";

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: sepolia,
  //@ts-ignore
  transport: custom(window.ethereum),
});
