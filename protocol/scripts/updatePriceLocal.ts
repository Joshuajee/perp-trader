import { deployPriceAggregator, deployTokens } from "./mockHelper";
import { deploy, depositLiquidity, tokenSymbols } from "./helpers";
import { parseEther } from "viem";
import { viem } from "hardhat";

const randomChange = () => {
  
}

async function main() {

  const btcPriceFeeds= "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9"

  const btcAggregator =  await viem.getContractAt("MockV3Aggregator", btcPriceFeeds)

  const currentBtcPrice  = await btcAggregator.read.latestAnswer()

  await btcAggregator.write.updateAnswer([currentBtcPrice / 10n])


  const linkPriceFeeds= "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9"

  const linkAggregator =  await viem.getContractAt("MockV3Aggregator", linkPriceFeeds)

  const currentLinkPrice  = await linkAggregator.read.latestAnswer()

  await linkAggregator.write.updateAnswer([currentLinkPrice / 10n])


// VITE_BTC_Price_Feeds=0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
// VITE_ETH_Price_Feeds=0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
// VITE_LINK_Price_Feeds=0xdc64a140aa3e981100a9beca4e685f962f0cf6c9
// VITE_FORTH_Price_Feeds=0x5fc8d32690cc91d4c39d9d3abcbd16989f875707
// VITE_PERP_TRADER_ADDRESS=0x0165878a594ca255338adfa4d48449f69242eb8f



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
