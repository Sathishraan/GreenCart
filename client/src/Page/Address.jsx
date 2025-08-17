
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const InputField = ({ type, placeholder, name, handlechange, address, className = '' }) => (
    <input
        type={type}
        placeholder={placeholder}
        onChange={handlechange}
        name={name}
        value={address[name] || ''}
        required
        className={`px-3 py-2 border-2 border-gray-500 rounded-xl outline-none text-gray-500 focus:border-primary transition ${className}`}
    />
);

const Address = () => {
    const { user, navigate } = useAppContext();

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        phoneNumber: '',
    });

    const handlechange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const payload = {
            ...address,
            userId: user?._id,
        };

        console.log('Submitting address payload:', JSON.stringify(payload, null, 2));

        try {
            const { data } = await axios.post('/api/address/add', payload);

            if (data.success) {
                toast.success(data.message);
                navigate('/cart');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/cart');
        }
    }, [user, navigate]);

    return (
        <div className="mt-16 m-10 pb-15">
            <p className="text-2xl sm:text-4xl text-gray-500">
                Add Shipping <span className="text-primary">Address</span>
            </p>

            <div className="mt-10 flex flex-col-reverse justify-between md:flex-row">
                <div className="flex-1 max-w-md">
                    <form onSubmit={onSubmitHandler} className="space-y-3 mt-10 text-sm">
                        <div className="flex gap-5">
                            <InputField handlechange={handlechange} address={address} placeholder="First Name" name="firstName" type="text" />
                            <InputField handlechange={handlechange} address={address} placeholder="Last Name" name="lastName" type="text" />
                        </div>

                        <div className="flex gap-5">

                            <InputField handlechange={handlechange} address={address} placeholder="Enter Email" name="email" type="email" />
                            <InputField handlechange={handlechange} address={address} placeholder="Street" name="street" type="text" />

                        </div>

                        <div className="flex gap-5">
                            <InputField handlechange={handlechange} address={address} placeholder="City" name="city" type="text" />
                            <InputField handlechange={handlechange} address={address} placeholder="State" name="state" type="text" />
                        </div>

                        <div className="flex gap-5">
                            <InputField handlechange={handlechange} address={address} placeholder="Pincode" name="pinCode" type="text" />
                            <InputField handlechange={handlechange} address={address} placeholder="Country" name="country" type="text" />
                        </div>

                        <InputField handlechange={handlechange} address={address} placeholder="Phone Number" name="phoneNumber" type="text" />

                        <br />

                        <div className='mt-5'>

                        <button
                            type="submit"
                            className="px-33 py-3 border-2  text-xl  border-gray-500 rounded-xl bg-primary hover:bg-primary-dull text-gray-500 transition"
                        >
                            Add Address
                        </button>

                        </div>
                       

                    </form>
                </div>

                <img src={assets.add_address_iamge} className="sm:mr-36 sm:mt-0 mb-16" alt="address visual" />
            </div>
        </div>
    );
};

export default Address;
