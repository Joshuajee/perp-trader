import { createPublicClient, createWalletClient, http, custom } from "viem";

import { localhost } from "viem/chains";

export const publicClient = createPublicClient({
  chain: localhost,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: localhost,
  //@ts-ignore
  transport: custom(window.ethereum),
});
