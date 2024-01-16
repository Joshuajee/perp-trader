

export function Balances() {
    return (
        <div className="h-14 flex">
            <div className="flex flex-col items-center justify-center w-1/2">
                <p className="text-xs font-semi-bold">Balance</p>
                <p className="text-white text-sm">0.00 1GHO</p>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2">
                <p className="text-xs font-semi-bold">Collateral</p>
                <p className="text-white text-sm">0.00 1GHO</p>
            </div>
        </div>
    )
}
