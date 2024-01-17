import tokenAbi from "@abis/contracts/mocks/MockERC20.sol/MockERC20.json"
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import { publicClient } from "@utils/helpers"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi";
import { formatEther } from "viem"

export function Balances() {
    const { address } = useAccount();

    const [tokenBalance, setTokenBalance] = useState<number>(0)
    const [collateralBalance, setCollateralBalance] = useState<number>(0)

    const getBalances = async () => {
        //get gho balance
        const ghoData = await publicClient.readContract({
            address: `0x${import.meta.env.VITE_GHO_ADDRESS.substring(2)}`,
            abi: tokenAbi,
            functionName: 'balanceOf',
            args: [`${address}`]
        })

        //get collateral balance
        const collateralData = await publicClient.readContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'myCollateral',
            args: [`${address}`],
        })


        //@ts-ignore
        setTokenBalance(formatEther(ghoData))
        //@ts-ignore
        setCollateralBalance(formatEther(collateralData))


    }


    useEffect(() => {
        getBalances()
    })

    return (
        <div className="h-14 flex">
            <div className="flex flex-col items-center justify-center w-1/2">
                <p className="text-xs font-semi-bold">Balance</p>
                <p className="text-white text-sm">{collateralBalance} GHO</p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2">
                <p className="text-xs font-semi-bold">Collateral</p>
                <p className="text-white text-sm">{tokenBalance} GHO</p>
            </div>
        </div>
    )
}
