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
                        <Link to="/"><li className=" px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center">Trade</li></Link>
                        <li className=" px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center">Dashboard</li>
                        <Link to="/vault"><li className=" px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center">Vault</li></Link>

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