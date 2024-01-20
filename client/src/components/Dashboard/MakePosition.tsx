import { publicClient, walletClient } from '@utils/helpers';
import React, { useEffect, useRef, useState } from 'react'
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
// import tokenAbi from "@abis/contracts/mocks/MockERC20.sol/MockERC20.json"
import { useAccount, useContractRead } from "wagmi";
import useCurrentChainId from "@hooks/useCurrentChainId"
import { ContractFunctionExecutionError, InsufficientFundsError, parseEther } from 'viem';
import { Oval } from 'react-loader-spinner';
import CustomConnectButton from '@components/Shared/CustomConnectButton';
import { ToastContainer, toast } from 'react-toastify';


interface FormData {
    // Define form fields
    pair: {
        baseCurrency: string,
        quoteCurrency: string,
    };
    sizeAmount: number | null;
    collateralAmount: number | null;
    position: string | null
}

interface IPair {

    baseCurrency: string,
    quoteCurrency: string

}

export function MakePosition({ authPair, setAuthPair }: { authPair: number, setAuthPair: (id: number) => void }) {
    const { address, isConnected } = useAccount();
    const currentChainId = useCurrentChainId()
    const [pairPrice, setPairPrice] = useState<string | null>(null)
    const form = useRef<HTMLFormElement>(null)
    const [isLoadingLong, setIsLoadingLong] = useState<boolean>(false)
    const [isLoadingShort, setIsLoadingShort] = useState<boolean>(false)


    const [formData, setFormData] = useState<FormData>({
        pair: {
            baseCurrency: "",
            quoteCurrency: ""
        },
        sizeAmount: null,
        collateralAmount: 0,
        position: null
    });


    // Update form data on input changes
    const handleInputChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const { data: pairsData }: {
        data: IPair[] | undefined
    } = useContractRead({
        address: import.meta.env.VITE_PERP_TRADER_ADDRESS,
        abi: perpAbi,
        functionName: "getSupportedPairs",
        watch: true,
        chainId: currentChainId
    })


    const getPairPrice = async (pair: any) => {

        const data = await publicClient.readContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'getPairPrice',
            args: [formData.pair]
        })


        const val = Number(data) / Math.pow(10, 38)
        setPairPrice(val.toFixed(4))
    }

    const handlePairChange = (e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>) => {
        if (pairsData) {
            formData.pair = pairsData[Number(e.target.value)]
            setAuthPair(Number(e.target.value))
            getPairPrice(pairsData[Number(e.target.value)])
        }
    }


    const openPosition = async (position: boolean) => {
        console.log(formData.pair)

        if (!formData.sizeAmount || !formData.pair.baseCurrency) return
        if (position) {
            setIsLoadingLong(true)
        } else {
            setIsLoadingShort(true)
        }


        try {
            const { request } = await publicClient.simulateContract({
                address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
                abi: perpAbi,
                functionName: 'openPosition',
                args: [formData.pair, parseEther(String(formData.sizeAmount), "wei"), formData.collateralAmount, position],
                account: address,
            })

            //@ts-ignore
            const hash = await walletClient.writeContract(request)
            console.log(hash, "transaction completed")
            //reset form leaving pair
            form.current && form.current.reset()
            setFormData({
                pair: {
                    baseCurrency: formData.pair.baseCurrency,
                    quoteCurrency: formData.pair.quoteCurrency
                },
                sizeAmount: null,
                collateralAmount: 0,
                position: null
            })
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

        if (position) {
            setIsLoadingLong(false)
        } else {
            setIsLoadingShort(false)
        }

    }

    useEffect(() => {
        if (pairsData) {
            formData.pair = pairsData[authPair]
            getPairPrice(pairsData[authPair])
        }
    }, [authPair])




    return (
        <form ref={form} className=' rounded-xl bg-primary_4 m-auto flex flex-col gap-2   pb-3'>
            <select value={authPair} name="pair" onChange={handlePairChange} id="large" className="block py-3 px-4 w-full text-base text-gray-900  rounded-lg border border-primary_2 focus:ring-0 focus:outline-none dark:bg-primary_1
                                 dark:border-primary_2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-0 dark:focus:border-primary_2  appearance-none">
                <option defaultValue={""}>Choose a Pair</option>
                {pairsData && pairsData.map((pair, idx) => (
                    <option value={idx} key={idx}>{pair.baseCurrency.toUpperCase()}/{pair.quoteCurrency.toUpperCase()}</option>
                ))}

            </select>
            <p>{pairPrice ? "Price Ratio: " + pairPrice : ""}</p>
            <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                <input type="number" min="0" name="sizeAmount" value={formData.sizeAmount ? formData.sizeAmount : ""} onChange={handleInputChange} placeholder="Size amount" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
            </div>

            <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1  hidden">
                <input type="number" min="0" name="collateralAmount" value={formData.collateralAmount ? formData.collateralAmount : ""} onChange={handleInputChange} placeholder="Collateral amount" className="h-full w-[85%]
                 bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
            </div>

            {isConnected && <div className="flex gap-6 justify-between ">
                <button disabled={isLoadingShort} onClick={() => openPosition(false)} type='button' className="bg-red-500 w-1/2 inline-flex items-center justify-center px-4 py-2 border border-red-500 rounded cursor-pointer hover:bg-red-500">
                    {!isLoadingShort && <span className=" text-white">Short </span>} <Oval visible={isLoadingShort} height={20} color='#fff' secondaryColor='#000' />
                </button>

                <button disabled={isLoadingLong} onClick={() => openPosition(true)} type='button' className="bg-green-500 w-1/2 inline-flex items-center justify-center px-4 py-2 border border-green-500 rounded cursor-pointer hover:bg-green-500">
                    {!isLoadingLong && <span className=" text-white">Long </span>} <Oval visible={isLoadingLong} height={20} color='#fff' secondaryColor='#000' />
                </button>
            </div>}
            {!isConnected && <CustomConnectButton />}

        </form>
    )
}
