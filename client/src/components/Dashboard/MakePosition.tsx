import React, { useState } from 'react'

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

export function MakePosition() {

    const [formData, setFormData] = useState<FormData>({
        pair: {
            baseCurrency: "",
            quoteCurrency: ""
        },
        sizeAmount: null,
        collateralAmount: null,
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

    const handlePairChange = (e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>) => {
        let pair;
        switch (e.target.value) {
            case "1":
                pair = {
                    baseCurrency: "BTC",
                    quoteCurrency: "ETH"
                }
                break;
            case "2":
                pair = {
                    baseCurrency: "BTC",
                    quoteCurrency: "LINKS"
                }
                break;
            case "3":
                pair = {
                    baseCurrency: "BTC",
                    quoteCurrency: "GHO"
                }
                break;
            case "4":
                pair = {
                    baseCurrency: "ETH",
                    quoteCurrency: "FORTH"
                }
                break;
            case "5":
                pair = {
                    baseCurrency: "ETH",
                    quoteCurrency: "LINKS"
                }
                break;
            case "6":
                pair = {
                    baseCurrency: "ETH",
                    quoteCurrency: "GHO"
                }
                break;
            case "7":
                pair = {
                    baseCurrency: "LINKS",
                    quoteCurrency: "FORTH"
                }
                break;

            default:
                break;
        }
        formData.pair = pair
    }


    const submitForm = (e: React.FormEvent) => {
        e.preventDefault()

        console.log(formData)
    }
    return (
        <form onSubmit={submitForm} className=' rounded-xl bg-primary_4 m-auto flex flex-col gap-2   pb-3'>
            <select name="pair" onChange={handlePairChange} id="large" className="block py-3 px-4 w-full text-base text-gray-900  rounded-lg border border-primary_2 focus:ring-0 focus:outline-none dark:bg-primary_1
                                 dark:border-primary_2 dark:placeholder-gray-400 dark:text-white dark:focus:ring-0 dark:focus:border-primary_2  appearance-none">
                <option defaultValue={""}>Choose a Pair</option>
                <option value="1">BTC/ETH</option>
                <option value="2">BTC/LINKS</option>
                <option value="3">BTC/GHO</option>
                <option value="4">ETH/FORTH</option>
                <option value="5">ETH/LINKS</option>
                <option value="6">ETH/GHO</option>
                <option value="7">LINKS/FORTH</option>
            </select>

            <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                <input type="number" min="0" name="sizeAmount" value={formData.sizeAmount} onChange={handleInputChange} placeholder="Size amount" className="h-full w-[85%] bg-transparent rounded-l-md outline-none focus:ring-0 focus:outline-none text-white px-3 " />
                <div className="w-[15%] h-full flex items-center text-sm border-l border-primary_2 justify-center">GHO</div>
            </div>
            <div className="h-12 rounded-md border border-primary_2 mb-2 bg-primary_1 flex">
                <input type="number" min="0" name="collateralAmount" value={formData.collateralAmount} onChange={handleInputChange} placeholder="Collateral amount" className="h-full w-[85%]
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
                        className="w-4 h-4 text-primary cursor-pointer bg-primary_4 border-primary_4 focus:ring-primary accent-primary outline-none"
                    />
                    <label
                        htmlFor="option1"
                        className="ml-2 text-xs font-medium text-primary cursor-pointer"
                    >
                        Long
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
                        className="w-4 h-4 text-primary cursor-pointer bg-primary_4 border-primary_4 focus:ring-primary accent-primary outline-none"
                    />
                    <label
                        htmlFor="option2"
                        className="ml-2 text-xs font-medium cursor-pointer text-primary"
                    >
                        Short
                    </label>
                </div>

            </div>
            <button type="submit" className="bg-blue-700 text-white  py-3 rounded-lg mt-2 w-full">Trade  </button>
        </form>
    )
}
