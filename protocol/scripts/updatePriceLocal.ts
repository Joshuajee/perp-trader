import { time } from "@nomicfoundation/hardhat-network-helpers";
import { viem } from "hardhat";

const randomChange = (price: bigint) => {
  return BigInt(Math.floor(Math.random() * Number(price * 2n)))
}

async function main() {

  await time.increase(3600)

  const btcPriceFeeds= "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"

  const btcAggregator =  await viem.getContractAt("MockV3Aggregator", btcPriceFeeds)

  const currentBtcPrice  = await btcAggregator.read.latestAnswer()

  await btcAggregator.write.updateAnswer([randomChange(currentBtcPrice)])

  const ethPriceFeeds= "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"

  const ethAggregator =  await viem.getContractAt("MockV3Aggregator", ethPriceFeeds)

  const currentEthPrice  = await ethAggregator.read.latestAnswer()

  await ethAggregator.write.updateAnswer([randomChange(currentEthPrice)])

  const linkPriceFeeds= "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9"

  const linkAggregator =  await viem.getContractAt("MockV3Aggregator", linkPriceFeeds)

  const currentLinkPrice  = await linkAggregator.read.latestAnswer()

  await linkAggregator.write.updateAnswer([randomChange(currentLinkPrice)])

  const forthPriceFeeds= "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707"

  const forthAggregator =  await viem.getContractAt("MockV3Aggregator", forthPriceFeeds)

  const currentForthPrice  = await btcAggregator.read.latestAnswer()

  await forthAggregator.write.updateAnswer([randomChange(currentForthPrice)])



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
