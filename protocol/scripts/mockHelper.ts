import { viem } from "hardhat"
import { CurrencyType, PairInterface } from "./helpers";
import { Address } from "viem";

export const DECIMAL = 10n ** 38n

export async function deployPriceAggregator() {

    // All the price here are quoted in USD

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

    return { gho }
}

export const calculatePrice = async (amount: bigint, baseCurrencyAddress: Address, quoteCurrencyAddress: Address) => {
    
    const baseCurrency =  await viem.getContractAt("MockV3Aggregator", baseCurrencyAddress)
    const quoteCurrency =  await viem.getContractAt("MockV3Aggregator", quoteCurrencyAddress)

    const basePrice = await baseCurrency.read.latestAnswer()
    const quotePrice = await quoteCurrency.read.latestAnswer()

    return (basePrice * DECIMAL / quotePrice) * amount
}


export const selectPriceFeeds = (currency: CurrencyType) => {



    return 0
}