import { truncateAddress } from "@utils/helpers";
import { ConnectKitButton } from "connectkit";
import { AvatarGenerator } from 'random-avatar-generator';



export const CustomConnectButton = () => {

    const generator = new AvatarGenerator();

    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                return (
                    <button type="button" onClick={show} className="bg-primary_5 text-white justify-center rounded-md py-2 px-3 font-semibold flex gap-2 items-center">
                        {isConnected && <img src={generator.generateRandomAvatar(address)} className="w-10 h-10 rounded-full" />}
                        {isConnected ? truncateAddress(String(address), 5, 5, 15) : "Connect Wallet"}
                    </button>
                );
            }}
        </ConnectKitButton.Custom>
    );
};

export default CustomConnectButton