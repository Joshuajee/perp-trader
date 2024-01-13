import { GoGraph } from "react-icons/go";
import { BsGraphDown } from "react-icons/bs";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { PriceSummary } from "@components/Home";
import { FaChevronDown } from "react-icons/fa";
import { TbArrowBigUpLinesFilled } from "react-icons/tb";
import { TbArrowBigDownLinesFilled } from "react-icons/tb";


function Home() {
    return (
        <>
            <div className="flex mt-10 gap-10">
                <div className="w-[70%] h-fit flex flex-col gap-8 ">
                    <PriceSummary />
                    <div className="bg-primary_4 h-[60vh] rounded-md">Chart</div>
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
                    <div className="w-full bg-primary_4 rounded-md py-5 px-4  flex flex-col gap-8">
                        <div className="m-auto h-10 w-full bg-primary_5 flex">
                            <button className="bg-transparent hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/3 space-x-3">
                                <GoGraph size={20} /> <span>Long</span>
                            </button>
                            <button className="bg-transparent hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/3 space-x-3">
                                <BsGraphDown size={20} /> <span>Short</span>
                            </button>
                            <button className="bg-transparent hover:bg-primary_3 hover:text-white
                         font-semibold text-sm h-full  flex items-center justify-center w-1/3 space-x-3">
                                <MdOutlineSwapHoriz size={20} /> <span>Swap</span>
                            </button>
                        </div>

                        <div className="py-3 border-b border-primary_2">
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
                                <p className="text-md">Entry Price</p>
                                <p className="text-nd text-white">$45,459.50</p>
                            </div>
                            <div className="flex justify-between  gap-2">
                                <p className="text-md">Liq.Price</p>
                                <p className="text-nd text-white">$-</p>
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

export default Home