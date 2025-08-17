
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const Login = () => {
    const { setShowLogin, axios,user, setUser,navigate } = useAppContext();
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const onSubmitHandle = async (e) => {
        try {
            e.preventDefault();
    
            let data;
    
            if (state === "register") {
                ({ data } = await axios.post('/api/user/register', { name, email, password }));
            } else {
                ({ data } = await axios.post('/api/user/login', { email, password }));
            }
    
            if (data.success) {
                setUser(data.user);
                navigate('/');
                setShowLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        }
    };
    

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);

    return (

        <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm
        text-gray-600 bg-black/50'>


            <form onClick={(e)=> e.stopPropagation()} onSubmit={onSubmitHandle} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() =>{ setState("register"), setEmail(""),setPassword("")}} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                )}
                <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>

        </div>


    );
};

export default Login;
