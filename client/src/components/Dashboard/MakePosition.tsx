import { publicClient, walletClient } from '@utils/helpers';
import React, { useEffect, useRef, useState } from 'react'
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
// import tokenAbi from "@abis/contracts/mocks/MockERC20.sol/MockERC20.json"
import { useAccount, useContractRead } from "wagmi";
import useCurrentChainId from "@hooks/useCurrentChainId"

interface FormData {
    // Define form fields
    pair: {
        baseCurrency: string,
        quoteCurrency: string,
    };
    sizeAmount: number;
    collateralAmount: number | null;
    position: string | null
}

interface IPair {

    baseCurrency: string,
    quoteCurrency: string

}

export function MakePosition() {
    const { address } = useAccount();
    const currentChainId = useCurrentChainId()
    const [pairPrice, setPairPrice] = useState<string | null>(null)
    const form = useRef<HTMLFormElement>(null)
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
        watch: true
        // chainId: currentChainId
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
        formData.pair = pairsData[e.target.value]
        getPairPrice(pairsData[e.target.value])
    }


    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        const { request } = await publicClient.simulateContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'openPosition',
            args: [formData.pair, formData.sizeAmount, formData.collateralAmount, Boolean(formData.position)],
            account: address,
        })

        //@ts-ignore
        const hash = await walletClient.writeContract(request)
        form.current.reset()
        setFormData({
            pair: {
                baseCurrency: "",
                quoteCurrency: ""
            },
            sizeAmount: null,
            collateralAmount: 0,
            position: null
        })
        console.log(hash, "transaction completed")
    }


    return (
        <form ref={form} onSubmit={submitForm} className=' rounded-xl bg-primary_4 m-auto flex flex-col gap-2   pb-3'>
            <select name="pair" onChange={handlePairChange} id="large" className="block py-3 px-4 w-full text-base text-gray-900  rounded-lg border border-primary_2 focus:ring-0 focus:outline-none dark:bg-primary_1
                                 dark:border-primary_2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-0 dark:focus:border-primary_2  appearance-none">
                <option defaultValue={""}>Choose a Pair</option>
                {pairsData && pairsData.map((pair, idx) => (
                    <option value={idx} key={idx}>{pair.baseCurrency.toUpperCase()}/{pair.quoteCurrency.toUpperCase()}</option>
                ))}

            </select>
            <p>{pairPrice ? pairPrice : ""}</p>
            <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                <input type="number" min="0" name="sizeAmount" value={formData.sizeAmount ? formData.sizeAmount : ""} onChange={handleInputChange} placeholder="Size amount" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
            </div>

            <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1  hidden">
                <input type="number" min="0" name="collateralAmount" value={formData.collateralAmount ? formData.collateralAmount : ""} onChange={handleInputChange} placeholder="Collateral amount" className="h-full w-[85%]
                 bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
            </div>

            <div className="flex gap-10 justify-center space-x-10">
                <div className="flex items-center">
                    <input
                        id="option1"
                        name="position"
                        type="radio"
                        value="true"
                        checked={formData.position === "true"}
                        onChange={handleInputChange}
                        hidden
                    />
                    <label htmlFor="option1" className={`${formData.position === "true" ? "bg-green-500" : ""} inline-flex items-center justify-center px-4 py-2 border border-green-500 rounded cursor-pointer hover:bg-green-500`}>
                        <span className=" text-white">Long </span>
                    </label>
                </div>

                <div className="flex items-center ">
                    <input
                        id="option2"
                        name="position"
                        type="radio"
                        value="false"
                        checked={formData.position === "false"}
                        onChange={handleInputChange}
                        hidden

                    />
                    <label htmlFor="option2" className={`${formData.position === "false" ? "bg-red-500" : ""} inline-flex items-center justify-center px-4 py-2 border border-red-500 rounded cursor-pointer hover:bg-red-500`}>
                        <span className=" text-white">Short </span>
                    </label>
                </div>

            </div>
            <button type="submit" className="bg-blue-700 text-white  py-3 rounded-lg mt-2 w-full">Trade  </button>
        </form>
    )
}
