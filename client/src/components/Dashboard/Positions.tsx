import { TbArrowBigDownLinesFilled, TbArrowBigUpLinesFilled } from 'react-icons/tb'
import useCurrentChainId from "@hooks/useCurrentChainId"
import { useAccount, useContractRead } from "wagmi";
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"


interface IPosition {
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


export function Positions() {

    const { address } = useAccount();
    const currentChainId = useCurrentChainId()


    const { data: traderPositions }: { data: IPosition[] } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getTraderPositions",
        args: [address],
        watch: true,
        chainId: currentChainId
    })


    return (
        <div className="bg-primary_4 rounded-md py-3 h-[100vh] overflow-auto">
            <div className="flex items-center border-b border-primary_2 h-10">
                <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">Pair</div>
                <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">Size</div>
                <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">P/L</div>
                <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center gap-2">Size <TbArrowBigDownLinesFilled size={18} /></div>
                <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center  gap-2">Size <TbArrowBigUpLinesFilled size={18} /></div>
                <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">Position</div>
            </div>
            {traderPositions ? (<>
                {traderPositions.map((position, idx) => (
                    <div key={idx} className="flex items-center border-b border-primary_2 h-10">
                        <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">{position.position.pair.baseCurrency.toLocaleUpperCase()}/{position.position.pair.quoteCurrency.toLocaleUpperCase()}</div>
                        <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center">{Number(position.position.size)}</div>
                        <div className={`w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center ${Number(position.pnl) > 0 ? "text-green-600" : "text-red-600"} `}>{Number(position.pnl)}</div>
                        <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-red-600 hover:text-white  ">Decrease</button></div>
                        <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-green-600 hover:text-white  ">Increase</button></div>
                        <div className="w-[16.6%]  h-full font-semibold text-sm flex items-center justify-center"><button className=" w-fit px-3 py-2 flex items-center text-xs  hover:bg-blue-600 hover:text-white  ">Close</button></div>

                    </div>
                ))}
            </>) : (<></>)}

        </div>
    )
}
