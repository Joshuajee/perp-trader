import { viem } from "hardhat"

export const DECIMAL = 10n ** 38n

export async function deployPriceAggregator() {

    // All the price here are quoted in USD

    const INITIAL_PRICE = 97906595n

    const ghoDecimal = 8;
    const ghoInitailPrice = 4283849655582n

    const btcDecimal = 8;
    const btcInitailPrice = 253641999999n;

    const ethDecimal = 8;
    const ethInitailPrice = 339925673n;

    const linkDecimal = 8;
    const linkInitailPrice = 97906595n;

    const forthDecimal = 8;
    const forthInitailPrice = 339925673n;

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

    const ghoToken = "gho"

    const btc = "btc"

    const eth = "eth"

    const link = "link"

    const forth = "forth"

    return { gho, ghoToken, btc, eth, link, forth }
}