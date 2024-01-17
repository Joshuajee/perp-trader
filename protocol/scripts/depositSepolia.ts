import { deployPriceAggregator, deployTokens } from "./mockHelper";
import { deploy, depositLiquidity, tokenSymbols } from "./helpers";
import { parseEther } from "viem";
import { viem } from "hardhat";

const amount = parseEther("100", "wei")


async function main() {

  const _gho = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60"

  const _perpTrader = "0xdc0c61e97ffcd248dd9b4ebab4dbb5c8d0b62da0"

  const perpTrader = await viem.getContractAt("PerpTrades", _perpTrader)

  const gho = await viem.getContractAt("MockERC20", _gho)

  await gho.write.approve([_perpTrader, amount])
  
  await perpTrader.write.deposit([amount])

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
