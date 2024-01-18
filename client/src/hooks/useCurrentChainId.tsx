
import { useNetwork } from "wagmi"

const useCurrentChainId = () => {

    const { chain } = useNetwork()


    return chain.id



}

export default useCurrentChainId