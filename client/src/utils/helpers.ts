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

export const truncateAddress = (
  text: string,
  startChars: number,
  endChars: number,
  maxLength: number
) => {
  if (text.length > maxLength) {
    var start = text.substring(0, startChars);
    var end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};
