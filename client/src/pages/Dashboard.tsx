import { GoGraph } from "react-icons/go";
import { Balances, DepositCollateral, MakePosition, Positions, PriceSummary } from "@components/Dashboard";
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import { TbPigMoney } from "react-icons/tb";
import TradingViewWidget from "@components/Dashboard/TradingViewWidget";
import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import useCurrentChainId from "@hooks/useCurrentChainId";


interface IPosition {
    positionId: bigint,
    pnl: bigint,
    position: {
        isLong: boolean,
        isOpen: boolean,
        openedAt: number,
        pair: {
            baseCurrency: string,
            quoteCurrency: string,
        },
        size: bigint,
        trader: string,
        value: number
    }
}


function Dashboard() {
    const [tab, setTab] = useState<number>(0)
    const { address } = useAccount();
    const currentChainId = useCurrentChainId()
    const [authPair, setAuthPair] = useState<number>(0)


    const { data: leverage } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getTraderLeverage",
        args: [address],
        watch: true,
        chainId: currentChainId
    })


    const { data: maxLeverage } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "maxLeverage",
        watch: true,
        chainId: currentChainId
    })

    const { data: interestRate } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "interestRate",
        watch: true,
        chainId: currentChainId
    })

    // @ts-ignore
    const { data: traderPositions }: { data: IPosition[] } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getTraderPositions",
        args: [address],
        watch: true,
        chainId: currentChainId
    })



    return (
        <>
            <div className="flex mt-10 gap-10 px-10">
                <div className="w-[70%] h-fit flex flex-col gap-8 ">
                    <PriceSummary authPair={authPair} setAuthPair={setAuthPair} />
                    <div className="bg-primary_4 h-[60vh] rounded-md p-1 overflow-hidden">
                        {/* <Chart /> */}
                        <TradingViewWidget />
                    </div>
                    <Positions />
                </div>
                <div className="w-[30%] h-fit">
                    <div className="w-full bg-primary_4 rounded-md py-5 px-4  flex flex-col gap-3">
                        <div className="m-auto h-10 w-full bg-primary_5 flex">
                            <button onClick={() => setTab(0)} className={` ${tab === 0 ? "bg-primary_3" : "bg-transparent"} hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/2 space-x-3`}>
                                <TbPigMoney size={18} /> <span>Collateral</span>
                            </button>
                            <button onClick={() => setTab(1)} className={` ${tab === 1 ? "bg-primary_3" : "bg-transparent"} hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/2 space-x-3`}>
                                <GoGraph size={20} /> <span>Trade</span>
                            </button>

                        </div>
                        <Balances />
                        <div>
                            {tab === 0 && <DepositCollateral />}
                            {tab === 1 && <MakePosition authPair={authPair} setAuthPair={setAuthPair} />}
                        </div>

                        <div className="">
                            <div className="flex justify-between ">
                                <p className="text-md">Leverage</p>
                                <p className="text-nd text-white">{leverage && traderPositions && traderPositions.length > 0 ? Number(leverage) + "x" : ""}</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Max Leverage</p>
                                <p className="text-nd text-white">{maxLeverage ? Number(maxLeverage) + "x" : ""}</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Interest Rate</p>
                                <p className="text-nd text-white">{interestRate ? Number(interestRate) + "%" : ""}</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default Dashboard