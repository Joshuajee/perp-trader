
import { useNetwork } from "wagmi"

const useCurrentChainId = () => {

    const { chain } = useNetwork()


    if (chain) {
        return chain.id
    }

    return 11155111

}

export default useCurrentChainId