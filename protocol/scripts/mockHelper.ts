import { viem } from "hardhat"
import { parseEther } from "viem";

export const DECIMAL = 10n ** 38n

export async function deployPriceAggregator() {

    const INITIAL_PRICE = 200000000000000000000n

    const ghoDecimal = 8;
    const ghoInitailPrice = INITIAL_PRICE

    const btcDecimal = 8;
    const btcInitailPrice = INITIAL_PRICE

    const ethDecimal = 8;
    const ethInitailPrice = INITIAL_PRICE

    const ghoPriceFeeds = await viem.deployContract("MockV3Aggregator", [ghoDecimal, ghoInitailPrice])

    const btcPriceFeeds = await viem.deployContract("MockV3Aggregator", [btcDecimal, btcInitailPrice])

    const ethPriceFeeds = await viem.deployContract("MockV3Aggregator", [ethDecimal, ethInitailPrice])

    return { ghoPriceFeeds, btcPriceFeeds, ethPriceFeeds, ghoDecimal, ghoInitailPrice, btcDecimal, btcInitailPrice, ethDecimal, ethInitailPrice }

}



export async function deployTokens() {

    const gho = await viem.deployContract("MockERC20", ["gho", "gho"])

    const btc = await viem.deployContract("MockERC20", ["btc", "btc"])

    const eth = await viem.deployContract("MockERC20", ["eth", "eth"])

    return { gho, btc, eth }
}