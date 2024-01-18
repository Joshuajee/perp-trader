import gho from "@assets/icons/gho.png"
import { TbTransferIn, TbTransferOut } from "react-icons/tb";
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import tokenAbi from "@abis/contracts/mocks/MockERC20.sol/MockERC20.json"
import { useAccount, useContractRead } from "wagmi";
import { formatEther, parseEther } from "viem"
import { useState } from "react";
import { publicClient, walletClient } from "@utils/helpers";
import useCurrentChainId from "@hooks/useCurrentChainId";

export default function Vault() {
    const { address } = useAccount();
    const currentChainId = useCurrentChainId()
    const [depositVolume, setDepositVolume] = useState<string | null>(null)
    const [withdrawalVolume, setWithdrawalVolume] = useState<string | null>(null)


    const { data: vaultInfo } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getVaultInfo",
        watch: true,
        chainId: currentChainId,
        account: address
    })

    console.log(vaultInfo)





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
        const weiValue = parseEther(`${depositVolume}`, "wei")

        await approve(weiValue)
        const { request } = await publicClient.simulateContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'deposit',
            args: [10],
            account: address,
        })
        //@ts-ignore
        const hash = await walletClient.writeContract(request)
        console.log(hash, "transaction completed")
    }

    return (
        <div className='flex flex-col justify-center gap-8 mt-4'>
            <div className='w-[90%] max-w-[500px] h-24 rounded-xl bg-primary_4 m-auto flex  items-center'>
                <div className='w-[33.3%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Total Value</p>
                    <p className='text-lg text-white text-center'>$1.20m</p>
                </div>
                <div className='w-[33.3%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Available Funds</p>
                    <p className='text-lg text-white text-center'>$1.20m</p>
                </div>

                <div className='w-[33.3%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Interest Rate</p>
                    <p className='text-lg text-white text-center'>1.10%</p>
                </div>
            </div>
            <form className='w-[90%] max-w-[500px] p-3 rounded-xl bg-primary_4 m-auto flex flex-col  gap-10 pb-10'>
                <img src={gho} className="m-auto h-16 w-16 rounded-ful" />
                <div>
                    <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferIn size={16} /> <span>Supply Token</span></h3>
                    <div className="h-12 rounded-md border border-primary_2 bg-primary_1 flex">
                        <input type="number" min={0} value={depositVolume ? depositVolume : ""} onChange={(e) => setDepositVolume(e.target.value)} placeholder="0.0" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                        <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
                    </div>

                    <button onClick={deposit} type="button" className="bg-green-700 text-white w-full py-3 rounded-lg mt-2">Deposit  </button>
                </div>
                <div>
                    <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferOut size={16} /> <span>Withdraw Token</span></h3>
                    <div className="h-12 rounded-md border border-primary_2 bg-primary_1 flex">
                        <input type="number" min={0} value={withdrawalVolume ? withdrawalVolume : ""} onChange={(e) => setWithdrawalVolume(e.target.value)} placeholder="0.0" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                        <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
                    </div>

                    <button type="button" className="bg-purple-700 text-white w-full py-3 rounded-lg mt-2">Withdraw </button>
                </div>
            </form>
        </div>
    )
}
