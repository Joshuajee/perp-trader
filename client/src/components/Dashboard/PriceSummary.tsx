import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useContractRead } from "wagmi";
import perpAbi from "@abis/contracts/PerpTrades.sol/PerpTrades.json"
import { publicClient } from "@utils/helpers";
import { ethers } from "ethers";
import { formatEther } from "viem";


interface IPair {

    baseCurrency: string,
    quoteCurrency: string

}

export function PriceSummary({ authPair, setAuthPair }: { authPair: number, setAuthPair: (id: number) => void }) {
    const [drop, setDrop] = useState<boolean>(false)
    const [pair, setPair] = useState<number>(0)
    const [longInterest, setLongInterest] = useState<bigint | null>(null)
    const [shortInterest, setShortInterest] = useState<bigint | null>(null)
    const [pairPrice, setPairPrice] = useState<string | null>(null)

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
            args: [pair]
        })

        const val = Number(data) / Math.pow(10, 38)
        setPairPrice(val.toFixed(4))
    }

    const getPairKey = async (pair: IPair) => {
        const data = await publicClient.readContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'getPairKey',
            args: [pair]
        })

        return (data)
    }
    const getOpenLongInterest = async (pair: IPair) => {

        const hash = await getPairKey(pair)

        // Encode data using Ethereum ABI encoding
        // const encodedData = ethers.utils.defaultAbiCoder.encode(
        //     ['string', 'string'],
        //     [pair.baseCurrency.toLowerCase(), pair.quoteCurrency.toLowerCase()]
        // );


        // console.log(ethers.utils.keccak256(encodedData))
        const data = await publicClient.readContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'openLongInterestInGho',
            args: [hash]
        })

        // @ts-ignore
        setLongInterest(data)

    }
    const getOpenShortInterest = async (pair: IPair) => {
        const hash = await getPairKey(pair)
        // Encode data using Ethereum ABI encoding
        // const encodedData = ethers.utils.defaultAbiCoder.encode(
        //     ['string', 'string'],
        //     [pair.baseCurrency, pair.quoteCurrency]
        // );

        const data = await publicClient.readContract({
            address: `0x${import.meta.env.VITE_PERP_TRADER_ADDRESS.substring(2)}`,
            abi: perpAbi,
            functionName: 'openShortInterestInGho',
            args: [hash]
        })

        // @ts-ignore
        setShortInterest(data)

    }

    useEffect(() => {
        if (pairsData) {
            getPairPrice(pairsData[pair])
            getOpenLongInterest(pairsData[pair])
            getOpenShortInterest(pairsData[pair])

        }
    }, [pairsData])


    useEffect(() => {
        setPair(authPair)
        if (pairsData) {
            getPairPrice(pairsData[authPair])
        }

    }, [authPair])


    return (
        <div className="h-20 w-full rounded-md bg-primary_4 flex gap-x-2 relative pl-3">
            <div className={` ${drop ? "flex" : "hidden"} absolute top-16 bg-primary_5 rounded-b-md w-[20%]  h-auto  flex-col gap-1`}>

                {pairsData && pairsData.map((pair, idx) => (

                    <div key={idx} onClick={() => {
                        setPair(idx)
                        setAuthPair(idx)
                        setDrop(false)
                        getPairPrice(pair)
                    }} className="h-10 w-full flex items-center  space-x-3  p-2 hover:bg-primary_4 cursor-pointer">

                        <p className="font-semibold text-white text-sm w-[70%] text-center">{pair.baseCurrency.toUpperCase()}/{pair.quoteCurrency.toUpperCase()}</p>

                    </div>
                ))}

            </div>
            {pairsData && pairsData.length > 0 && <div className="h-full w-[20%] flex items-center p-3 space-x-3 ">

                <p className="font-semibold text-white text-xl w-[70%] text-center">{pairsData[pair].baseCurrency.toUpperCase()}/{pairsData[pair].quoteCurrency.toUpperCase()}</p>
                <FaChevronDown size={18} className="text-white cursor-pointer pt-1" onClick={() => setDrop(!drop)} />
            </div>}
            <div className="h-full w-[15%] flex flex-col justify-center font-semibold">
                <p className="text-white text-md"> Price Ratio</p>
                <p className=" text-sm">{pairPrice ? pairPrice : ""}</p>
            </div>
            <div className="h-full w-[15%] flex flex-col justify-center font-semibold">
                <p className="text-white text-md"> Long Interest</p>
                <p className=" text-sm">GHO {longInterest ? Number(formatEther(longInterest)).toFixed(1) : 0}</p>
            </div>
            <div className="h-full w-[15%] flex flex-col justify-center font-semibold">
                <p className="text-white text-md"> Short Interest</p>
                <p className=" text-sm">GHO {shortInterest ? Number(formatEther(shortInterest)).toFixed(1) : 0}</p>
            </div>
        </div>
    )
}
