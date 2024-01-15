import { viem } from "hardhat"
import { Address } from "viem"

export const deploy = async (gho: Address, ghoPriceFeeds: Address) => {
    const perpTrader = await viem.deployContract("PerpTrades", [gho, ghoPriceFeeds, "agho", "agho"])
    return {perpTrader}
}


export const depositLiquidity = async(_gho: Address, _perpTrader: Address,  amount: bigint) => {

    const perpTrader = await viem.getContractAt("PerpTrades", _perpTrader)

    const gho = await viem.getContractAt("MockERC20", _gho)

    await gho.write.approve([perpTrader.address, amount])

    await perpTrader.write.deposit([amount])

}


export const calculatePrice = () => {
    return 10000000000000000000000000000000000000000000000000000000000n
}