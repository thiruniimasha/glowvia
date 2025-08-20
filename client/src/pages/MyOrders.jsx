import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
function MyOrders() {

    const [MyOrders, setMyOrders] = useState([])
    const { currency, axios, user } = useAppContext()

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user')
            console.log('API Response:', data)
            if (data.success) {
                setMyOrders(data.orders)
            }

        } catch (error) {
            console.log(error)
             toast.error('Failed to fetch orders')

        }
    }

    useEffect(() => {
        if (user) {
            fetchMyOrders()

        }

    }, [user])



    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>
                    My Orders
                </p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {MyOrders && MyOrders.map((order) => (
                <div key={order._id} className='w-full max-w-4xl border border-gray-300 rounded-lg mb-10 p-4 py-5'>
                    <p className='flex justify-between flex-wrap text-gray-500 text-sm font-medium mb-4'>
                        <span>
                            Order ID: {order._id}
                        </span>
                        <span>
                            Payment: {order.paymentType}
                        </span>
                        <span>
                            Total Amount: {currency} {order.amount}
                        </span>
                    </p>
                    {order.items && order.items.map((item, index) => (

                        <div key={index}
                            className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
                            <div className='flex items-center gap-4'>
                                <div className='bg-primary/10 p-3 rounded-lg'>
                                    <img src={item.productId?.image[0]} alt="" className='w-16 h-16' />
                                </div>
                                <div className='ml-4'>
                                    <h2 className='text-lg font-semibold text-gray-800'>
                                        {item.productId?.name}
                                    </h2>
                                    <p>
                                        Category: {item.productId?.category}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-col gap-1 text-sm text-gray-600'>
                                <p>
                                    Quantity : {item.quantity || "1"}
                                </p>

                                <p>
                                    Status : {order.status}
                                </p>

                                <p>
                                    Date : {new Date(order.createdAt).toLocaleDateString()}
                                </p>

                            </div>
                            <p className='text-primary text-lg font-medium'>
                                Amount : {currency}{item.productId?.offerPrice * item.quantity}
                            </p>

                        </div>

                    ))}
                </div>

            ))}

        </div>
    )
}

export default MyOrders
