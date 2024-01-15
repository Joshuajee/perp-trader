import { GoGraph } from "react-icons/go";
import { BsGraphDown } from "react-icons/bs";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { Chart, PriceSummary } from "@components/Dashboard";
import { FaChevronDown } from "react-icons/fa";
import { TbArrowBigUpLinesFilled, TbTransferIn, TbTransferOut } from "react-icons/tb";
import { TbArrowBigDownLinesFilled } from "react-icons/tb";
import { TbPigMoney } from "react-icons/tb";
import TradingViewWidget from "@components/Dashboard/TradingViewWidget";


function Dashboard() {
    return (
        <>
            <div className="flex mt-10 gap-10 px-10">
                <div className="w-[70%] h-fit flex flex-col gap-8 ">
                    <PriceSummary />
                    <div className="bg-primary_4 h-[60vh] rounded-md p-1 overflow-hidden">
                        {/* <Chart /> */}
                        <TradingViewWidget />
                    </div>
                    <div className="bg-primary_4 rounded-md py-3 h-[100vh] overflow-auto">
                        <div className="flex items-center border-b border-primary_2 h-10">
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">Pair</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">Size</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">P/L</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center gap-2">Size <TbArrowBigDownLinesFilled size={18} /></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center  gap-2">Size <TbArrowBigUpLinesFilled size={18} /></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">Position</div>
                        </div>
                        <div className="flex items-center border-b border-primary_2 h-10">
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center text-red-600">-50</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-red-600 hover:text-white  ">Decrease</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-green-600 hover:text-white  ">Increase</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-blue-600 hover:text-white  ">Close</button></div>

                        </div>
                        <div className="flex items-center border-b border-primary_2 h-10">
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center text-green-600">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-red-600 hover:text-white  ">Decrease</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-green-600 hover:text-white  ">Increase</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-blue-600 hover:text-white  ">Close</button></div>

                        </div>
                        <div className="flex items-center border-b border-primary_2 h-10">
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center text-red-600">-50</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-red-600 hover:text-white  ">Decrease</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-green-600 hover:text-white  ">Increase</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-blue-600 hover:text-white  ">Close</button></div>

                        </div>
                        <div className="flex items-center border-b border-primary_2 h-10">
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center text-green-600">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-red-600 hover:text-white  ">Decrease</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-green-600 hover:text-white  ">Increase</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-blue-600 hover:text-white  ">Close</button></div>

                        </div>
                        <div className="flex items-center border-b border-primary_2 h-10">
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center text-red-600">-50</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-red-600 hover:text-white  ">Decrease</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-green-600 hover:text-white  ">Increase</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-blue-600 hover:text-white  ">Close</button></div>

                        </div>
                        <div className="flex items-center border-b border-primary_2 h-10">
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center text-green-600">100</div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-red-600 hover:text-white  ">Decrease</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-green-600 hover:text-white  ">Increase</button></div>
                            <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-blue-600 hover:text-white  ">Close</button></div>

                        </div>
                    </div>
                </div>
                <div className="w-[30%] h-fit">
                    <div className="w-full bg-primary_4 rounded-md py-5 px-4  flex flex-col gap-3">
                        <div className="m-auto h-10 w-full bg-primary_5 flex">
                            <button className="bg-transparent hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/2 space-x-3">
                                <GoGraph size={20} /> <span>Trade</span>
                            </button>
                            <button className="bg-transparent hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/2 space-x-3">
                                <TbPigMoney size={18} /> <span>Deposit</span>
                            </button>

                        </div>

                        <div className="h-14 flex">
                            <div className="flex flex-col items-center justify-center w-1/2">
                                <p className="text-xs font-semi-bold">Balance</p>
                                <p className="text-white text-sm">0.00 1GHO</p>
                            </div>
                            <div className="flex flex-col items-center justify-center w-1/2">
                                <p className="text-xs font-semi-bold">Collateral</p>
                                <p className="text-white text-sm">0.00 1GHO</p>
                            </div>
                        </div>

                        <div>
                            <form className=' rounded-xl bg-primary_4 m-auto flex flex-col   pb-3'>

                                <div>
                                    <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferIn size={16} /> <span>Deposit Collateral</span></h3>
                                    <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                                        <input type="text" placeholder="0.0" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                                        <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
                                    </div>

                                    <button type="button" className="bg-green-700 text-white w-full py-3 rounded-lg mt-2">Deposit  </button>
                                </div>

                            </form>
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