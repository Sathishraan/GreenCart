import React, { useEffect, useState } from 'react';
import { assets, dummyOrders } from '../assets/assets';
import axios from 'axios';
import toast from 'react-hot-toast';

const Orders = () => {

    const [orders, setOrders] = useState([]);



    const fetchOder = async () => {
        try {

            const { data } = await axios.get('/api/order/admin');

            if (data.success) {
                setOrders(data.orders)

            } else {
                toast.error(data.message);
            }

        } catch (error) {

            toast.error(error.message);

        }
    }

    useEffect(() => {
        fetchOder()


    }, [])

    return (

        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {orders.map((order, index) => (
                <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
                    <div className="flex gap-5">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                                <img
                                    className="w-25 h-25 object-cover "
                                    src={item.product.image[0]}   // ✅ first image from product
                                    alt={item.product.name}
                                />
                               
                            </div>
                        ))}

                        <div>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-row justify-center">
                                    <p className="font-medium">
                                        {item.product.name} <span className='text-primary'>x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm">
                        <p className='font-medium mb-1'>{order.address.firstName} {order.address.lastName}</p>
                        <p>{order.address.street}, {order.address.city}, {order.address.state},{order.address.zipcode}, {order.address.country}</p>
                    </div>

                    <p className="font-medium text-base my-auto text-black/70">${order.amount}</p>

                    <div className="flex flex-col text-sm">
                        <p>Method: {order.paymentType}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Orders