import { TbArrowBigDownLinesFilled, TbArrowBigUpLinesFilled } from 'react-icons/tb'
import useCurrentChainId from "@hooks/useCurrentChainId"
import { useAccount, useContractRead } from "wagmi";
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import { publicClient, walletClient } from '@utils/helpers';
import { ContractFunctionExecutionError, InsufficientFundsError, formatEther, parseEther } from 'viem';
import { useRef, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { toast } from 'react-toastify';


interface IPosition {
    positionId: bigint,
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
    const [sizeAmount, setSizeAmount] = useState<string | null>(null)
    const [modal, setModal] = useState<number | null>(null)
    const [position, setPosition] = useState<number | null>(null)
    const [closePositionId, setClosePositionId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingClose, setIsLoadingClose] = useState<boolean>(true)

    const amountInp = useRef<HTMLInputElement>(null)

    // @ts-ignore
    const { data: traderPositions }: { data: IPosition[] } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getTraderPositions",
        args: [address],
        watch: true,
        chainId: currentChainId
    })



    const closePosition = async (id: number) => {
        setIsLoadingClose(true)
        setClosePositionId(id)
        try {
            const { request } = await publicClient.simulateContract({
                address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
                abi: perpAbi,
                functionName: 'closePosition',
                args: [id],
                account: address,
            })

            //@ts-ignore
            const hash = await walletClient.writeContract(request)
            await publicClient.waitForTransactionReceipt(
                { hash }
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
        setIsLoadingClose(false)
        setClosePositionId(null)
    }

    const changePosition = async () => {
        setIsLoading(true)

        if (modal == 1) {
            try {
                const { request } = await publicClient.simulateContract({
                    address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
                    abi: perpAbi,
                    functionName: 'decreasePositionSize',
                    args: [position, parseEther(String(sizeAmount), "wei")],
                    account: address,
                })

                //@ts-ignore
                const hash = await walletClient.writeContract(request)
                await publicClient.waitForTransactionReceipt(
                    { hash }
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

        } else if (modal == 2) {
            try {
                const { request } = await publicClient.simulateContract({
                    address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
                    abi: perpAbi,
                    functionName: 'increasePositionSize',
                    args: [position, parseEther(String(sizeAmount), "wei")],
                    account: address,
                })

                //@ts-ignore
                const hash = await walletClient.writeContract(request)
                await publicClient.waitForTransactionReceipt(
                    { hash }
                )
            } catch (error) {
                // console.error("Error simulating contract:", error.message);
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

        }

        setSizeAmount(null)
        setModal(null)
        setIsLoading(false)
    }

    return (
        <div className="bg-primary_4 rounded-md py-3 h-[100vh] overflow-auto relative">
            {
                modal && <div className='absolute inset-0 bg-primary_1 bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-primary_1 rounded-md w-[90%] max-w-[300px] py-3 px-2'>
                        <form className='w-full h-full flex flex-col gap-3'>
                            <div className='flex justify-between'>
                                <h3 className='text-white text-center '>{modal == 1 ? "Decrease" : "Increase"}</h3>
                                <button onClick={() => {
                                    setModal(null)
                                    setSizeAmount(null)
                                    setIsLoading(false)
                                }} type="button" className='text-white border  px-2 text-sm'>Cancel</button>
                            </div>
                            <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                                <input ref={amountInp} type="number" min="0" name="sizeAmount" value={sizeAmount ? sizeAmount : ""} onChange={(e) => setSizeAmount(e.target.value)} placeholder="Size amount" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                                <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
                            </div>

                            <button disabled={isLoading} onClick={changePosition} type='button' className="bg-blue-500 w-full inline-flex items-center justify-center px-4 py-2 border border-blue-500 rounded cursor-pointer hover:bg-blue-500">
                                {!isLoading && <span className=" text-white">Done </span>} <Oval visible={isLoading} height={20} color='#fff' secondaryColor='#000' />
                            </button>
                        </form>
                    </div>
                </div>
            }

            <div className="flex items-center border-b border-primary_2 h-10">
                <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">Pair</div>
                <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">Type</div>
                <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">Size</div>
                <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">P/L</div>
                <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center gap-2">Size <TbArrowBigDownLinesFilled size={18} /></div>
                <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center  gap-2">Size <TbArrowBigUpLinesFilled size={18} /></div>
                <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">Position</div>
            </div>
            {traderPositions ? (<>
                {traderPositions.map((position, idx) => (
                    <div key={idx} className="flex items-center border-b border-primary_2 h-10">
                        <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">{position.position.pair.baseCurrency.toLocaleUpperCase()}/{position.position.pair.quoteCurrency.toLocaleUpperCase()}</div>
                        <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">{position.position.isLong ? "Long" : "Short"}</div>
                        <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">{String(formatEther(position.position.size))}</div>
                        <div className={`w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center ${Number(formatEther(position.pnl)) > 0 ? "text-green-600" : "text-red-600"} `}>{Number(formatEther(position.pnl)).toFixed(2)}</div>
                        <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center "><button onClick={() => {
                            setModal(1)
                            setPosition(Number(position.positionId))
                            amountInp.current && amountInp.current.focus()
                        }} className=" w-fit px-3 py-2 flex items-center text-xs  bg-red-600 hover:text-white  ">Decrease</button></div>
                        <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center"><button onClick={() => {
                            setModal(2)
                            setPosition(Number(position.positionId))
                            amountInp.current && amountInp.current.focus()
                        }} className=" w-fit px-3 py-2 flex items-center text-xs bg-green-600 hover:text-white  ">Increase</button></div>
                        <div className="w-[14.29%]  h-full font-semibold text-sm flex items-center justify-center">
                            {(!isLoadingClose || Number(position.positionId) != closePositionId) && <button disabled={isLoadingClose && Number(position.positionId) == closePositionId} onClick={() => closePosition(Number(position.positionId))} className=" w-fit px-3 py-2 flex items-center text-xs   bg-blue-600 hover:text-white  ">Close</button>}
                            {isLoadingClose && Number(position.positionId) == closePositionId && <Oval visible={isLoadingClose} height={20} color='#fff' secondaryColor='#000' />}
                        </div>

                    </div>
                ))}
            </>) : (<></>)}

        </div>
    )
}
