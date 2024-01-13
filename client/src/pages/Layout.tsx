import { Outlet, Link } from "react-router-dom";

import logo from "@assets/images/logo.png"
import { ConnectKitButton } from "connectkit";

const Layout = () => {
    return (
        <>
            <nav className="h-16 flex justify-between">
                <div className="w-[70%] h-full flex gap-7 items-center">
                    <img src={logo} alt="logo" className="w-24 pt-2" />
                    <ul className="flex gap-3 h-full  items-center">
                        <li className=" px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center">Trade</li>
                        <li className=" px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center">Dashboard</li>
                        <li className=" px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center">Vault</li>

                    </ul>
                </div>
                <div className=" flex items-center justify-end">
                    <ConnectKitButton />
                </div>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout; 