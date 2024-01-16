import { GoGraph } from "react-icons/go";
import { BsGraphDown } from "react-icons/bs";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { Balances, DepositCollateral, MakePosition, Positions, PriceSummary } from "@components/Dashboard";
import { FaChevronDown } from "react-icons/fa";
import { TbArrowBigUpLinesFilled, TbTransferIn, TbTransferOut } from "react-icons/tb";
import { TbArrowBigDownLinesFilled } from "react-icons/tb";
import { TbPigMoney } from "react-icons/tb";
import TradingViewWidget from "@components/Dashboard/TradingViewWidget";
import { useState } from "react";


function Dashboard() {
    const [tab, setTab] = useState<number>(0)
    return (
        <>
            <div className="flex mt-10 gap-10 px-10">
                <div className="w-[70%] h-fit flex flex-col gap-8 ">
                    <PriceSummary />
                    <div className="bg-primary_4 h-[60vh] rounded-md p-1 overflow-hidden">
                        {/* <Chart /> */}
                        <TradingViewWidget />
                    </div>
                    <Positions />
                </div>
                <div className="w-[30%] h-fit">
                    <div className="w-full bg-primary_4 rounded-md py-5 px-4  flex flex-col gap-3">
                        <div className="m-auto h-10 w-full bg-primary_5 flex">
                            <button onClick={() => setTab(0)} className={`bg-transparent ${tab === 0 ? "bg-primary_3" : ""} hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/2 space-x-3`}>
                                <GoGraph size={20} /> <span>Trade</span>
                            </button>
                            <button onClick={() => setTab(1)} className={`bg-transparent ${tab === 1 ? "bg-primary_3" : ""} hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/2 space-x-3`}>
                                <TbPigMoney size={18} /> <span>Deposit</span>
                            </button>
                        </div>
                        <Balances />
                        <div>
                            {tab === 0 && <MakePosition />}
                            {tab === 1 && <DepositCollateral />}
                        </div>
                        <div className="pb-3 border-b border-primary_2">
                            <div className="flex justify-between ">
                                <p className="text-md">Pool</p>
                                <p className="text-nd text-white">BTC-GHO</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Collateral In</p>
                                <p className="text-md text-white flex items-center gap-1 hover:text-secondary_1 cursor-pointer ">USDC <FaChevronDown size={18} className="pt-1" /> </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex justify-between ">
                                <p className="text-md">Leverage</p>
                                <p className="text-nd text-white">1.20x</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Max Leverage</p>
                                <p className="text-nd text-white">30x</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Interest Rate</p>
                                <p className="text-nd text-white">10%</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-primary_4 rounded-md py-5 px-4  flex flex-col gap-8 mt-10">
                        <h3 className="text-white">Short BTC</h3>
                        <div className="">
                            <div className="flex justify-between ">
                                <p className="text-md">Market</p>
                                <p className="text-nd text-white">BTC/USD</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Entry Price</p>
                                <p className="text-nd text-white">$45,459.50</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Exit Price</p>
                                <p className="text-nd text-white">$45,459.50</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Borrow Fee</p>
                                <p className="text-nd text-white">-0.009/h</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Funding Fee</p>
                                <p className="text-nd text-white">+0.009/h</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Available Liquidity</p>
                                <p className="text-nd text-white">$45,938,493.09</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard