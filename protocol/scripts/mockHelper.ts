import { viem } from "hardhat"

export const DECIMAL = 10n ** 38n

export async function deployPriceAggregator() {

    // All the price here are quoted in USD

    const INITIAL_PRICE = 200000000000000000000n

    const ghoDecimal = 8;
    const ghoInitailPrice = INITIAL_PRICE

    const btcDecimal = 8;
    const btcInitailPrice = INITIAL_PRICE

    const ethDecimal = 8;
    const ethInitailPrice = INITIAL_PRICE

    const linkDecimal = 8;
    const linkInitailPrice = INITIAL_PRICE

    const forthDecimal = 8;
    const forthInitailPrice = INITIAL_PRICE

    const ghoPriceFeeds = await viem.deployContract("MockV3Aggregator", [ghoDecimal, ghoInitailPrice])

    const btcPriceFeeds = await viem.deployContract("MockV3Aggregator", [btcDecimal, btcInitailPrice])

    const ethPriceFeeds = await viem.deployContract("MockV3Aggregator", [ethDecimal, ethInitailPrice])

    const linkPriceFeeds = await viem.deployContract("MockV3Aggregator", [linkDecimal, linkInitailPrice])

    const forthPriceFeeds = await viem.deployContract("MockV3Aggregator", [forthDecimal, forthInitailPrice])

    return { 
        ghoPriceFeeds, btcPriceFeeds, ethPriceFeeds, linkPriceFeeds, forthPriceFeeds, 
        ghoDecimal, ghoInitailPrice, btcDecimal, btcInitailPrice, ethDecimal, 
        ethInitailPrice, linkInitailPrice, linkDecimal, forthInitailPrice, forthDecimal  
    }

}



export async function deployTokens() {

    const gho = await viem.deployContract("MockERC20", ["gho", "gho"])

    const btc = await viem.deployContract("MockERC20", ["btc", "btc"])

    const eth = await viem.deployContract("MockERC20", ["eth", "eth"])

    const link = await viem.deployContract("MockERC20", ["link", "link"])

    const forth = await viem.deployContract("MockERC20", ["forth", "forth"])

    return { gho, btc, eth, link, forth }
}