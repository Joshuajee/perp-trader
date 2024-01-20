import gho from "@assets/icons/gho.png"
import { TbTransferIn, TbTransferOut } from "react-icons/tb";
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import tokenAbi from "@abis/contracts/mocks/MockERC20.sol/MockERC20.json"
import { useAccount, useContractRead } from "wagmi";
import { ContractFunctionExecutionError, InsufficientFundsError, formatEther, parseEther } from "viem"
import { useState } from "react";
import { publicClient, walletClient } from "@utils/helpers";
import useCurrentChainId from "@hooks/useCurrentChainId";
import { Oval } from "react-loader-spinner";
import CustomConnectButton from "@components/Shared/CustomConnectButton";
import { toast } from "react-toastify";

export default function Vault() {
    const { address, isConnected } = useAccount();
    const currentChainId = useCurrentChainId()
    const [depositVolume, setDepositVolume] = useState<string | null>(null)
    const [withdrawalVolume, setWithdrawalVolume] = useState<string | null>(null)
    const [isLoadingDeposit, setIsLoadingDeposit] = useState<boolean>(false)
    const [isLoadingWithdrawal, setIsLoadingWithdrawal] = useState<boolean>(false)


    //@ts-ignore
    const { data: interestRate }: { data: string } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "interestRate",
        watch: true,
        chainId: currentChainId,
        account: address
    })

    //@ts-ignore
    const { data: vaultInfo }: {
        data: []
    } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getVaultInfo",
        watch: true,
        chainId: currentChainId,
        account: address
    })


    //@ts-ignore
    const { data: perpBalance }: {
        data: bigint
    } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "balanceOf",
        watch: true,
        args: [address],
        chainId: currentChainId,
        account: address
    })

    console.log(perpBalance)


    const approve = async (weiValue: bigint) => {
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
        await publicClient.waitForTransactionReceipt(
            { hash: approvalHash }
        )

    }

    const deposit = async () => {
        if (Number(depositVolume) == 0) return
        setIsLoadingDeposit(true)
        const weiValue = parseEther(`${depositVolume}`, "wei")

        try {
            await approve(weiValue)
            const { request } = await publicClient.simulateContract({
                address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
                abi: perpAbi,
                functionName: 'deposit',
                args: [weiValue],
                account: address,
            })
            //@ts-ignore
            const hash = await walletClient.writeContract(request)
            await publicClient.waitForTransactionReceipt(
                { hash: hash }
            )
        } catch (error) {
            if (error instanceof ContractFunctionExecutionError) {
                toast.error(error.shortMessage);
            } else if (error instanceof InsufficientFundsError) {
                toast.error("Insufficient funds for transaction.");
            } else {
                // Handle other error types 
                //@ts-ignore
                toast.error(error.shortMessage)
            }
        }
        setDepositVolume(null)
        setIsLoadingDeposit(false)
    }

    const withdraw = async () => {
        if (Number(withdrawalVolume) == 0) return

        setIsLoadingWithdrawal(true)

        const weiValue = parseEther(`${withdrawalVolume}`, "wei")

        try {
            const { request } = await publicClient.simulateContract({
                address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
                abi: perpAbi,
                functionName: 'withdraw',
                args: [weiValue],
                account: address,
            })
            //@ts-ignore
            const hash = await walletClient.writeContract(request)
            await publicClient.waitForTransactionReceipt(
                { hash: hash }
            )
        } catch (error) {
            if (error instanceof ContractFunctionExecutionError) {
                toast.error(error.shortMessage);
            } else if (error instanceof InsufficientFundsError) {
                toast.error("Insufficient funds for transaction.");
            } else {
                // Handle other error types 
                //@ts-ignore
                toast.error(error.shortMessage)
            }
        }
        setWithdrawalVolume(null)
        setIsLoadingWithdrawal(false)
    }

    return (
        <div className='flex flex-col justify-center gap-8 mt-4'>
            <div className='w-[90%] max-w-[500px] h-24 rounded-xl bg-primary_4 m-auto flex  items-center'>
                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Total Value</p>
                    {/* @ts-ignore */}
                    <p className='text-sm text-white text-center'>GHO {vaultInfo ? Number(formatEther(vaultInfo[0])).toFixed(2) : ""}</p>
                </div>
                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Available Funds</p>
                    {/* @ts-ignore */}
                    <p className='text-sm text-white text-center'>GHO {vaultInfo ? Number(formatEther(vaultInfo[1])).toFixed(2) : ""}</p>
                </div>

                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>Interest Rate</p>
                    {/* @ts-ignore */}
                    <p className='text-sm text-white text-center'>{vaultInfo ? vaultInfo[2] : ""}%</p>
                </div>
                <div className='w-[25%] h-full flex flex-col item-center justify-center gap-2'>
                    <p className='text-xs text-center font-semibold '>PERP-GHO</p>
                    {/* @ts-ignore */}
                    <p className='text-sm text-white text-center'>{perpBalance ? Number(formatEther(perpBalance)).toFixed(2) : ""}</p>
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

                    {isConnected && <button disabled={isLoadingDeposit} onClick={deposit} type="button" className="bg-green-700 text-white w-full py-3 rounded-lg mt-2 flex justify-center">
                        {!isLoadingDeposit && <span className=" text-white">Deposit </span>}
                        <Oval visible={isLoadingDeposit} height={20} color='#fff' secondaryColor='#000' />
                    </button>}
                    {!isConnected && <div className="flex justify-center pt-2"><CustomConnectButton /> </div>}
                </div>
                <div>
                    <h3 className="text-md mb-2 flex  gap-2 items-center"> <TbTransferOut size={16} /> <span>Withdraw Token</span></h3>
                    <div className="h-12 rounded-md border border-primary_2 bg-primary_1 flex">
                        <input type="number" min={0} value={withdrawalVolume ? withdrawalVolume : ""} onChange={(e) => setWithdrawalVolume(e.target.value)} placeholder="0.0" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                        <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
                    </div>

                    {isConnected && <button disabled={isLoadingWithdrawal} onClick={withdraw} type="button" className="bg-purple-700 text-white w-full py-3 rounded-lg mt-2 flex justify-center">
                        {!isLoadingWithdrawal && <span className=" text-white">Withdraw </span>} <Oval visible={isLoadingWithdrawal} height={20} color='#fff' secondaryColor='#000' />
                    </button>}
                    {!isConnected && <div className="flex justify-center pt-2"><CustomConnectButton /> </div>}
                </div>
            </form>
        </div>
    )
}
