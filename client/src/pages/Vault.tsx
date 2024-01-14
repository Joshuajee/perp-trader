import gho from "@assets/icons/gho.png"
import { TbTransferIn, TbTransferOut } from "react-icons/tb";

export default function Vault() {
    return (
        <div className='flex flex-col justify-center gap-8 mt-4'>
            <div className='w-[90%] max-w-[500px] h-24 rounded-xl bg-primary_4 m-auto flex  items-center'>
                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Total Value</p>
                    <p className='text-lg text-white text-center'>$1.20m</p>
                </div>
                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Available Funds</p>
                    <p className='text-lg text-white text-center'>$1.20m</p>
                </div>
                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Available Balance</p>
                    <p className='text-lg text-white text-center'>$45,020</p>
                </div>
                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Interest Rate</p>
                    <p className='text-lg text-white text-center'>1.10%</p>
                </div>
            </div>
            <form className='w-[90%] max-w-[500px] p-3 rounded-xl bg-primary_4 m-auto flex flex-col  gap-10 pb-10'>
                <img src={gho} className="m-auto h-16 w-16 rounded-ful" />
                <div>
                    <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferIn size={16} /> <span>Supply Token</span></h3>
                    <div className="h-12 rounded-md border border-primary_2 bg-primary_1 flex">
                        <input type="text" placeholder="0.0" className="h-full w-full bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                    </div>

                    <button type="button" className="bg-green-700 text-white w-full py-3 rounded-lg mt-2">Deposit  </button>
                </div>
                <div>
                    <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferOut size={16} /> <span>Withdraw Token</span></h3>
                    <div className="h-12 rounded-md border border-primary_2 bg-primary_1 flex">
                        <input type="text" placeholder="0.0" className="h-full w-full bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                    </div>

                    <button type="button" className="bg-purple-700 text-white w-full py-3 rounded-lg mt-2">Withdraw </button>
                </div>
            </form>
        </div>
    )
}
