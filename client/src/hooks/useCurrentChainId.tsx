
import { useNetwork } from "wagmi"

const useCurrentChainId = () => {

    const { chain } = useNetwork()


    if (chain) {
        return chain.id
    }

    return import.meta.env.VITE_CHAIN_ID

}

export default useCurrentChainId