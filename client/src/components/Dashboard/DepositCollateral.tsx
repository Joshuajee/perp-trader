import { TbTransferIn } from "react-icons/tb";
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import tokenAbi from "@abis/contracts/mocks/MockERC20.sol/MockERC20.json"
import { parseEther } from "viem";
import { useState } from "react";
import { publicClient, walletClient } from "@utils/helpers";
import { useAccount } from "wagmi";

export function DepositCollateral() {
    const [amount, setAmount] = useState<string>("")
    const { address } = useAccount();


    const approve = async (weiValue) => {
        //make approval

        const { request: approvalRequest } = await publicClient.simulateContract({
            address: `0x${import.meta.env.VITE_GHO_ADDRESS.substring(2)}`,
            abi: tokenAbi,
            functionName: 'approve',
            args: [`0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`, weiValue],
            account: address,
        })
        //@ts-ignore
        const approvalHash = await walletClient.writeContract(approvalRequest)

    }

    const deposit = async () => {
        if (Number(amount) == 0) return
        const weiValue = parseEther(amount, "wei")

        await approve(weiValue)
        const { request } = await publicClient.simulateContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'addCollateral',
            args: [weiValue],
            account: address,
        })
        //@ts-ignore
        const hash = await walletClient.writeContract(request)
        console.log(hash, "transaction completed")
    }

    const withdraw = async () => {
        if (Number(amount) == 0) return
        const weiValue = parseEther(amount, "wei")

        const { request } = await publicClient.simulateContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'removeCollateral',
            args: [weiValue],
            account: address,
        })
        //@ts-ignore
        const hash = await walletClient.writeContract(request)
        console.log(hash, "transaction completed")
    }

    return (
        <form className=' rounded-xl bg-primary_4 m-auto flex flex-col   pb-3'>
            <div>
                <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferIn size={16} /> <span>Deposit Collateral</span></h3>
                <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min={0} placeholder="0.0" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                    <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
                </div>

                <div className="h-14 flex gap-4">
                    <button onClick={withdraw} type="button" className="bg-blue-700 text-white  py-3 rounded-lg mt-2 w-1/2">Withdraw  </button>
                    <button onClick={deposit} type="button" className="bg-green-700 text-white  py-3 rounded-lg mt-2 w-1/2">Deposit  </button>
                </div>
            </div>

        </form>
    )
}
