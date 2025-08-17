import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const AdminLogin = () => {

    const { isAdmin, setIsAdmin, navigate, axios } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandle = async (e) => {

        try {

            e.preventDefault();

            const { data } = await axios.post('/api/admin/login', { email, password });
    
            if (data.success) {
    
                setIsAdmin(true);
                navigate('/admin')
    
            } else {
    
                toast.error(data.message)
    
            }
            
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong");

            
            
        }

    }

    useEffect(() => {

        if (isAdmin) {

            navigate('/admin')

        }


    }, [isAdmin])


    return !isAdmin && (
        <form onSubmit={onSubmitHandle} className='m-h-screen flex items-center  mt-18 text-sm text-gray-600'>

            <div className='flex flex-col gap-5 m-auto items-start p-8 py-16 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-300'>

                <p className='text-2xl font-medium m-auto'> <span className='text-primary'>Admin</span> Login</p>

                <div className='w-full'>
                    <p>Email</p>
                    <input type="text" placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} value={email}
                        className='border boder-gray-300  rounded-lg w-full p-2 mt-2 outline-primary' />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input type="text" placeholder='Enter Email' onChange={(e) => setPassword(e.target.value)} value={password}
                        className='border boder-gray-300  rounded-lg w-full p-2 mt-2 outline-primary' />
                </div>

                <button className='text-white bg-primary w-full py-2 mt-1 rounded-lg cursor-pointer'>Login</button>

            </div>

        </form>
    )
}

export default AdminLogin