import tokenAbi from "@abis/contracts/mocks/MockERC20.sol/MockERC20.json"
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import { useAccount, useContractRead } from "wagmi";
import { formatEther } from "viem"
import useCurrentChainId from "@hooks/useCurrentChainId"

export function Balances() {

    const { address } = useAccount();
    const currentChainId = useCurrentChainId()
    const { data: ghoBalance } = useContractRead({
        address: import.meta.env.VITE_GHO_ADDRESS,
        abi: tokenAbi,
        functionName: "balanceOf",
        args: [address],
        watch: true,
        chainId: currentChainId
    })
    const { data: collateralBalance } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "myCollateral",
        args: [address],
        watch: true,
        chainId: currentChainId
    })


    return (
        <div className="h-14 flex">
            <div className="flex flex-col items-center justify-center w-1/2">
                <p className="text-xs font-semi-bold">Balance</p>
                {/* @ts-ignore */}
                <p className="text-white text-sm">{!ghoBalance ? 0 : Number(formatEther(ghoBalance)).toFixed(2)} GHO</p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2">
                <p className="text-xs font-semi-bold">Collateral</p>
                {/* @ts-ignore */}

                <p className="text-white text-sm">{!collateralBalance ? 0 : Number(formatEther(collateralBalance)).toFixed(2)} GHO</p>
            </div>
        </div>
    )
}
