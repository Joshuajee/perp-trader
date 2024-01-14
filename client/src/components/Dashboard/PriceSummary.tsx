import bitcoin from "@assets/icons/bitcoin.png"
import { FaChevronDown } from "react-icons/fa";


export function PriceSummary() {
    return (
        <div className="h-20 w-full rounded-md bg-primary_4 flex gap-x-2">
            <div className="h-full w-[20%] flex items-center p-3 space-x-3">
                <div className="w-[15%] rounded-full">
                    <img src={bitcoin} alt="btc" className="rounded-full w-full h-full" />
                </div>
                <p className="font-semibold text-white text-xl w-[70%] text-center">BTC/GHO</p>
                <FaChevronDown size={18} className="text-white cursor-pointer pt-1" />
            </div>
            <div className="h-full w-[15%] flex flex-col justify-center font-semibold">
                <p className="text-white text-md">$42,230.55</p>
                <p className=" text-sm">$41,220.25</p>
            </div>
            <div className="h-full w-[15%] flex flex-col justify-center  font-semibold">
                <p className="text-sm">24h Change</p>
                <p className=" text-sm text-green-600">+2.10%</p>
            </div>
            <div className="h-full w-[15%] flex flex-col justify-center  font-semibold">
                <p className="text-sm">24h High</p>
                <p className=" text-sm text-white">45,323.67</p>
            </div>
            <div className="h-full w-[15%] flex flex-col justify-center  font-semibold">
                <p className="text-sm">24h Low</p>
                <p className=" text-sm text-white">43,323.97</p>
            </div>


        </div>
    )
}
