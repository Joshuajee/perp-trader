import { viem } from "hardhat"


export async function deployPriceAggregator() {

    const DECIMALS = 18
    const INITIAL_PRICE = 200000000000000000000n

    const ghoPriceFeeds = await viem.deployContract("MockV3Aggregator", [DECIMALS, INITIAL_PRICE])

    const btcPriceFeeds = await viem.deployContract("MockV3Aggregator", [DECIMALS, INITIAL_PRICE])

    const ethPriceFeeds = await viem.deployContract("MockV3Aggregator", [DECIMALS, INITIAL_PRICE])

    // const btcPriceFeeds = await viem.deployContract("MockV3Aggregator", [DECIMALS, INITIAL_PRICE])

    // const ethPriceFeeds = await viem.deployContract("MockV3Aggregator", [DECIMALS, INITIAL_PRICE])


    return { ghoPriceFeeds, btcPriceFeeds, ethPriceFeeds }

}



export async function deployTokens() {

    const gho = await viem.deployContract("MockERC20", ["gho", "gho"])

    const btc = await viem.deployContract("MockERC20", ["btc", "btc"])

    const eth = await viem.deployContract("MockERC20", ["eth", "eth"])

    return { gho, btc, eth }
}