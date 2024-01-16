import { TbTransferIn } from "react-icons/tb";

export function DepositCollateral() {
    return (
        <form className=' rounded-xl bg-primary_4 m-auto flex flex-col   pb-3'>
            <div>
                <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferIn size={16} /> <span>Deposit Collateral</span></h3>
                <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                    <input type="number" min={0} placeholder="0.0" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                    <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
                </div>

                <div className="h-14 flex gap-4">
                    <button type="button" className="bg-blue-700 text-white  py-3 rounded-lg mt-2 w-1/2">Withdraw  </button>
                    <button type="button" className="bg-green-700 text-white  py-3 rounded-lg mt-2 w-1/2">Deposit  </button>
                </div>
            </div>

        </form>
    )
}
