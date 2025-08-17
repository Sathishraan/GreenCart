import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrder = () => {
    const [myOder, setMyOder] = useState([]);
    const { user } = useAppContext();

    const fetchOrder = async () => {
        try {

            const { data } = await axios.get('/api/order/user')
            console.log("Fetched data:", data);

            console.log("User data:", JSON.stringify(user, null, 2));

            if (data.success) {

                setMyOder(data.orders)

            }


            console.log("Order details:", JSON.stringify(myOder, null, 2));


        } catch (error) {
            console.log(error)

        }
    };

    useEffect(() => {

        if (user) {
            fetchOrder();

        }

    }, [user]);

    return (
        <div className='px-4 sm:px-10 mt-16'>

            <h2 className='text-2xl sm:text-5xl font-semibold'>
                My <span className='text-primary'>Order</span>
            </h2>

            <div className='mt-10 space-y-6'>
                {myOder.map((order, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg p-4 space-y-4'>

                        {/* Order Info */}
                        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm sm:text-base gap-2 sm:gap-0'>
                            <p><span className='font-medium'>Order ID:</span> {order._id}</p>
                            <p><span className='font-medium'>Payment:</span> {order.paymentType}</p>
                            <p><span className='font-medium'>Total Amount:</span> ${order.amount}</p>
                        </div>

                        {/* Order Items */}
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-lg`}
                            >
                                <div className='flex items-center'>
                                    <div className='bg-primary/10 p-3 rounded-lg'>
                                        <img src={item.product.image[0]} alt="product" className='w-16 h-16 object-cover' />
                                    </div>
                                </div>

                                <div className='flex-1 space-y-1'>
                                    <p className='font-semibold text-lg'>{item.product.name}</p>
                                    <p className='text-sm text-gray-600'>Category: {item.product.category}</p>
                                    <p className='text-sm text-gray-600'>Status: {order.status}</p>
                                    <p className='text-sm text-gray-600'>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className='text-sm text-gray-600'>Quantity: {item.quantity || '1'}</p>
                                </div>

                                <p className='text-primary font-semibold text-lg'>
                                    ${item.product.offerPrice * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrder;
