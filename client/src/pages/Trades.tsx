import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import { LuCandlestickChart } from "react-icons/lu";
import { useAccount, useContractRead } from "wagmi";
import useCurrentChainId from "@hooks/useCurrentChainId";
import { ContractFunctionExecutionError, InsufficientFundsError, formatEther } from "viem";
import { publicClient, walletClient } from "@utils/helpers";
import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";

interface ITrades {
    collateral: bigint,
    liquidationFee: bigint,
    maxLeverage: bigint,
    pnl: bigint,
    trader: string,
    usedLeverage: bigint
}

function Trades() {
    const { address } = useAccount();
    const currentChainId = useCurrentChainId()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    //@ts-ignore
    const { data: tradersInfo }: { data: ITrades[] } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getTradersInfo",
        watch: true,
        chainId: currentChainId
    })

    const liquidate = async (trader: string) => {
        setIsLoading(true)
        try {
            const { request } = await publicClient.simulateContract({
                address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
                abi: perpAbi,
                functionName: 'liquidateTrader',
                args: [trader],
                account: address,
            })
            //@ts-ignore
            const hash = await walletClient.writeContract(request)
            console.log(hash, "transaction completed")
        } catch (error) {
            if (error instanceof ContractFunctionExecutionError) {
                toast.error(error.shortMessage);
            } else if (error instanceof InsufficientFundsError) {
                toast.error("Insufficient funds for transaction.");
            } else {
                // Handle other error types 
                //@ts-ignore
                toast.error(error.shortMessage)
            }
        }

        setIsLoading(false)
    }


    return (
        <div className="mt-10 gap-10 px-10">
            <h1 className="text-lg font-semibold mb-4 flex gap-2 items-center">Trades <LuCandlestickChart size={18} /></h1>
            <div className="bg-primary_4 rounded-md py-3 h-fit max-h-[100vh] overflow-auto">
                <div className="flex items-center  h-10">
                    <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">Collateral</div>
                    <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">P/L</div>
                    <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center ">Used Leverage </div>
                    <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">Max Leverage</div>
                    <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center  gap-2">Liquidation Fee</div>

                    <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">Action</div>
                </div>
                {
                    tradersInfo ? (tradersInfo.map((trades, idx) => (
                        <div key={idx} className="flex items-center border-t border-primary_2 h-10">

                            <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">{Number(formatEther(trades.collateral)).toFixed(2)}</div>
                            <div className={`w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center ${Number(formatEther(trades.pnl)) > 0 ? "text-green-500" : "text-red-500"}`}>{Number(formatEther(trades.pnl)).toFixed(2)}</div>
                            <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">{String(trades.usedLeverage)} x</div>
                            <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">{String(trades.maxLeverage)} x</div>
                            <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center">{Number(formatEther(trades.liquidationFee)).toFixed(2)} GHO</div>

                            <div className="w-[16.66%]  h-full font-semibold text-sm flex items-center justify-center"><button disabled={Number(formatEther(trades.liquidationFee)) > 0 && !isLoading ? false : true} onClick={() => liquidate(trades.trader)} className={`w-fit px-3 py-2 flex items-center text-xs ${Number(formatEther(trades.liquidationFee)) > 0 ? "bg-red-600" : ""}  text-white  `}>
                                {!isLoading && <span className=" text-white">Liquidate </span>} <Oval visible={isLoading} height={20} color='#fff' secondaryColor='#000' />
                            </button></div>

                        </div>
                    ))) : (
                        <></>
                    )
                }
            </div>
        </div>
    )
}

export default Trades