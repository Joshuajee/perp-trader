import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "@assets/images/logo.png"
// import { ConnectKitButton } from "connectkit";
import CustomConnectButton from "@components/Shared/CustomConnectButton";
import { ToastContainer } from "react-toastify";

const Layout = () => {
    const location = useLocation()

    return (
        <>
            <ToastContainer autoClose={8000} />
            <nav className="h-16 px-5 flex justify-between border-b border-primary_4">
                <div className="w-[70%] h-full flex gap-7 items-center">
                    <Link to="/">
                        <img src={logo} className="w-32" />
                    </Link>
                    <ul className="flex gap-3 h-full  items-center">
                        <Link to="/"><li className={`px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center ${(location.pathname == "/") ? "text-white" : ""}`}>Dashboard</li></Link>
                        <Link to="/trades"><li className={`px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center ${(location.pathname == "/trades") ? "text-white" : ""}`}>Trades</li></Link>
                        <Link to="/vault"><li className={`px-4 py-2  text-sm font-semibold hover:text-white cursor-pointer flex items-center ${(location.pathname == "/vault") ? "text-white" : ""}`}>Vault</li></Link>

                    </ul>
                </div>
                <div className=" flex items-center justify-end">
                    {/* <ConnectKitButton /> */}
                    <CustomConnectButton />
                </div>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout; 