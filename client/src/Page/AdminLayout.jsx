import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import toast from "react-hot-toast";

const AdminLayout = () => {

    const {isAdmin, setIsAdmin  } = useAppContext();

    const logout = async () => {


        setIsAdmin(false);
        navigate('/');
        toast("logout successfully")
        
    }

    const sidebarLinks = [
        { name: "Add Product", path: "/admin", icon: assets.add_icon },
        { name: "Product List", path: "/admin/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
    ];

    return (
        <>

            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">

                <Link to="/" >
                    <img src={assets.logo} alt="logo" className="cursor-pointer w-36" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1 hover:bg-primary'>Logout</button>
                </div>
            </div>

            <div className="flex">
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
                    {sidebarLinks.map((item) => (
                        <NavLink to={item.path} key={item.name} end={item.path === "/admin"}
                            className={({isActive}) => `flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-primary text-primary"
                                    : "hover:bg-gray-1 00/90 border-white text-gray-700"
                                }`
                            }
                        >
                            <img src={item.icon} alt="icon" />
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>
        </>
    );
};

export default AdminLayout;