import { useEffect, useState } from "react";
import { assets, dummyAddress } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
    const { products, navigate, cartItems, setCartItems, 
        getCartCount, user, getCartAmount, removeCartItems, 
        loginStatus, updateCartItems } = useAppContext();
    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [isLoading, setIsLoading] = useState(false);
    const [userInitialized, setUserInitialized] = useState(false);
    const [isAddressLoading, setIsAddressLoading] = useState(true);

    const getCart = () => {
        try {
            let tempArray = [];
            for (const key in cartItems) {
                const product = products.find((item) => item._id === key);
                if (product) {
                    tempArray.push({ ...product, quantity: cartItems[key] });
                }
            }
            setCartArray(tempArray);
        } catch (error) {
            console.error("Error getting cart items:", error);
            toast.error("Error loading cart items");
        }
    };

    useEffect(() => {

        const storedCart = localStorage.getItem("cartArray");

        console.log("storedcart",storedCart)

        if (storedCart) {
            setCartArray(JSON.parse(storedCart));
    

        }

    }, []);

    useEffect(() => {
        localStorage.setItem("cartArray", JSON.stringify(cartArray));
        console.log(JSON.parse(localStorage.getItem("cartArray"))); // just to check
    }, [cartArray]);
    


    const getUserAddress = async () => {
        console.log("getUserAddress called. Current user state:", user);

        setUserInitialized(true);

        if (!user || !user._id) {
            console.warn("No user found in getUserAddress");
            setSelectedAddress(dummyAddress?.[0] || null);
            setIsAddressLoading(false);
            return;
        }

        try {
            setIsAddressLoading(true);

            console.log("Fetching addresses for user:", user._id);

            const token = localStorage.getItem('token');


            const { data } = await axios.get(`/api/address/get?userId=${user._id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            console.log("Address API response:", data);

            if (data.success) {
                const addressList = data.addresses || [];
                setAddresses(addressList);
                setSelectedAddress(addressList[0] || dummyAddress?.[0] || null);
            } else {
                toast.error(data.message || "Failed to load addresses");
                setSelectedAddress(dummyAddress?.[0] || null);
            }

        } catch (error) {
            console.error("Error fetching addresses:", error);

            if (error.response?.status === 401) {
                console.warn("Authentication error while fetching addresses");
                // Optional: logout or redirect to login
            }

            toast.error(error.response?.data?.message || "Failed to load addresses");
            setSelectedAddress(dummyAddress?.[0] || null);

        } finally {
            setIsAddressLoading(false);
        }
    };

    const placeOrder = async () => {
        if (!cartArray || cartArray.length === 0) {
            return toast.error("Your cart is empty");
        }

        if (!selectedAddress) {
            return toast.error("Please select an address");
        }

        // Enhanced user check with better error message
        if (!user || !user._id) {
            console.log("User not found for order placement. Current user state:", user);
            return toast.error("Authentication issue detected. Please try logging in again.");
        }

        try {
            setIsLoading(true);

            // Prepare the order data
            const orderData = {
                userId: user._id,
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id || selectedAddress // Handle both address object and ID
            };

          

            // Get the auth token
            const token = localStorage.getItem('token');


            if (paymentOption === 'COD') {
                // Make sure to set the correct Content-Type header and include auth token
                const { data } = await axios.post('/api/order/cod', orderData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (data.success) {
                    toast.success(data.message || "Order placed successfully");
                    setCartItems({});
                    navigate('/myorder');
                } else {
                    toast.error(data.message || "Failed to place order");
                }
            } else {
                // Make sure to set the correct Content-Type header and include auth token
                const { data } = await axios.post('/api/order/stripe', orderData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (data.success && data.url) {
                    window.location.replace(data.url);
                } else {
                    toast.error(data.message || "Failed to initialize payment");
                }
            }
        } catch (error) {
            console.error("Order placement error:", error);
            console.error("Error response:", error.response?.data); // Debug log

            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                // Optionally redirect to login
                // navigate('/login');
            } else {
                toast.error(error.response?.data?.message || error.message || "Failed to process order");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (products && products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
        // This effect runs on mount and when user changes
        console.log("User effect triggered. User state:", user);

        // Fix for race condition: delay checking user state
        // This gives any auth providers time to initialize
        const timeoutId = setTimeout(() => {
            getUserAddress();
        }, 300); // Small delay to ensure auth has time to load

        // Cleanup timeout
        return () => clearTimeout(timeoutId);
    }, [user]); // Runs when user changes

    // Handle empty cart or loading state
    if (!products || products.length === 0 || !cartItems || Object.keys(cartItems).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 max-w-6xl w-full px-6 mx-auto">
                <h1 className="text-2xl font-medium mb-4">Your Shopping Cart is Empty</h1>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button
                    onClick={() => { navigate('/product'); scrollTo(0, 0); }}
                    className="px-6 py-2 bg-primary text-white font-medium rounded hover:bg-primary-dull transition"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    // Initial loading state (before user state is resolved)
    if (isAddressLoading && !userInitialized) {
        return (
            <div className="flex items-center justify-center py-16 max-w-6xl w-full px-6 mx-auto">
                <p>Loading user information...</p>
            </div>
        );
    }



    console.log("Current login status:", loginStatus, "User initialized:", userInitialized);

    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className="flex-1 max-w-4xl">
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>
                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>
                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div
                                onClick={() => {
                                    navigate(`/product/${product.category?.toLowerCase()}/${product._id}`);
                                    scrollTo(0, 0);
                                }}
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                            >
                                <img
                                    className="max-w-full h-full object-cover"
                                    src={product.image && product.image[0]}
                                    alt={product.name}
                                    onError={(e) => {
                                        console.log("Image load error for:", product.name);
                                        e.target.src = assets.placeholder_image || "https://via.placeholder.com/150";
                                    }}
                                />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select
                                            className="outline-none"
                                            value={cartItems[product._id]}
                                            onChange={(e) => updateCartItems(product._id, Number(e.target.value))}
                                        >
                                            {Array.from({ length: Math.max(cartItems[product._id] || 1, 9) }).map((_, index) => (
                                                <option key={index} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">${(product.offerPrice * product.quantity).toFixed(2)}</p>
                        <button
                            onClick={() => removeCartItems(product._id)}
                            className="cursor-pointer mx-auto"
                        >
                            <img src={assets.remove_icon} alt="Remove" className="inline-block w-6 h-6" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => { navigate('/product'); scrollTo(0, 0); }}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
                >
                    <img src={assets.arrow_right_icon_colored} alt="arrow" className="group-hover:-translate-x-1 transition" />
                    Continue Shopping
                </button>
            </div>
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {selectedAddress ?
                                `${selectedAddress.street || ''}, ${selectedAddress.city || ''}, ${selectedAddress.state || ''}, ${selectedAddress.country || ''}`
                                : "No address selected"
                            }
                        </p>
                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="text-indigo-500 hover:underline cursor-pointer"
                        >
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                                {addresses && addresses.length > 0 ? (
                                    addresses.map((address, index) => (
                                        <p
                                            key={index}
                                            onClick={() => setSelectedAddress(address)}
                                            className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {address.street || ''}, {address.city || ''}, {address.state || ''}, {address.country || ''}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-gray-500 p-2">No saved addresses</p>
                                )}
                                <p
                                    onClick={() => navigate('/add-address')}
                                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                                >
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                    <select
                        onChange={e => setPaymentOption(e.target.value)}
                        value={paymentOption}
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>
                <hr className="border-gray-300" />
                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>${getCartAmount().toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>${(getCartAmount() * 0.02).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>${(getCartAmount() * 1.02).toFixed(2)}</span>
                    </p>
                </div>
                {!loginStatus && userInitialized ? (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <p className="font-medium text-yellow-700">You need to be logged in to place an order</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-2 mt-2 bg-primary text-white font-medium transition hover:bg-primary-dull"
                        >
                            Login to Continue
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={placeOrder}
                        disabled={isAddressLoading || !loginStatus}
                        className={`w-full py-3 mt-6 cursor-pointer ${isAddressLoading ? 'bg-gray-400' : loginStatus ? 'bg-primary hover:bg-primary-dull' : 'bg-gray-400'} text-white font-medium transition`}
                    >
                        {isAddressLoading ? 'Loading...' : paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Cart;