import { viem } from "hardhat"
import { Address } from "viem"

export type CurrencyType = "gho" | "btc" | "eth" | "link" | "forth"

export interface PairInterface {
    baseCurrency: string,
    quoteCurrency: string
}

export const deploy = async (gho: Address, ghoPriceFeeds: Address) => {
    const perpTrader = await viem.deployContract("PerpTrades", [gho, ghoPriceFeeds, "aGho", "aGho"])
    return {perpTrader}
}

export const depositLiquidity = async(_gho: Address, _perpTrader: Address,  amount: bigint) => {

    const perpTrader = await viem.getContractAt("PerpTrades", _perpTrader)

    const gho = await viem.getContractAt("MockERC20", _gho)

    await gho.write.approve([_perpTrader, amount])
    
    await perpTrader.write.deposit([amount])

}


export const tokenSymbols = () => {

    const ghoToken = "gho"

    const btc = "btc"

    const eth = "eth"

    const link = "link"

    const forth = "forth"

    const eur = "eur"

    const xau = "xau"

    return { ghoToken, btc, eth, link, forth, eur, xau }
}