import { Outlet, Link, useLocation } from "react-router-dom";

import { ConnectKitButton } from "connectkit";

const Layout = () => {
    const location = useLocation()

    return (
        <>
            <nav className="h-16 px-5 flex justify-between border-b border-primary_4">
                <div className="w-[70%] h-full flex gap-7 items-center">
                    <Link to="/"><h1 className="text-white font-semibold">PERP-TRADER</h1></Link>
                    <ul className="flex gap-3 h-full  items-center">
                        <Link to="/"><li className={`px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center ${(location.pathname == "/") ? "text-white" : ""}`}>Dashboard</li></Link>
                        <Link to="/trades"><li className={`px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center ${(location.pathname == "/trades") ? "text-white" : ""}`}>Trades</li></Link>
                        <Link to="/vault"><li className={`px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center ${(location.pathname == "/vault") ? "text-white" : ""}`}>Vault</li></Link>

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