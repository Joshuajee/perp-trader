
import { TbArrowBigUpLinesFilled } from "react-icons/tb";
import { TbArrowBigDownLinesFilled } from "react-icons/tb";
import { LuCandlestickChart } from "react-icons/lu";

function Trades() {
    return (
        <div className="mt-10 gap-10 px-10">
            <h1 className="text-lg font-semibold mb-4 flex gap-2 items-center">Trades <LuCandlestickChart size={18} /></h1>
            <div className="bg-primary_4 rounded-md py-3 h-fit max-h-[100vh] overflow-auto">
                <div className="flex items-center  h-10">
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">Size</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">Collateral</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">P/L</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center gap-2">Leverage </div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center  gap-2">Liquidation Fee</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">Interest</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">Action</div>
                </div>
                <div className="flex items-center border-t border-primary_2 h-10">
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center text-red-600">-50</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">40X</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">0.4 GHO</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">30%</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  bg-red-600 text-white  ">Liquidate</button></div>

                </div>
                <div className="flex items-center border-t border-primary_2 h-10">
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center text-red-600">-50</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">40X</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">0.4 GHO</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">30%</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  bg-red-600 text-white  ">Liquidate</button></div>

                </div>
                <div className="flex items-center border-t border-primary_2 h-10">
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center text-red-600">-50</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">40X</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">0.4 GHO</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">30%</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  bg-red-600 text-white  ">Liquidate</button></div>

                </div>
                <div className="flex items-center border-t border-primary_2 h-10">
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">BTC/ETH</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">100</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center text-red-600">-50</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">40X</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">0.4 GHO</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center">30%</div>
                    <div className="w-[14.2%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  bg-red-600 text-white  ">Liquidate</button></div>

                </div>


            </div>
        </div>
    )
}

export default Trades