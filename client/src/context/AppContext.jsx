
import axios from 'axios';
import { createContext, useContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Set defaults once outside of component to avoid repeated evaluations
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const initialRenderRef = useRef(true);
    
    // Application state
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loginStatus, setLoginStatus]= useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Use refs for calculations to avoid triggering reflows
    const cartCountRef = useRef(0);
    const cartAmountRef = useRef(0);

    // Separate data fetching from rendering
    const fetchData = async () => {
        if (!isMounted.current) return;
        
        setIsLoading(true);
        
        try {
            // Fetch admin status
            try {
                const { data: adminData } = await axios.get('/api/admin/is-auth');
                if (isMounted.current) {
                    setIsAdmin(adminData.success);
                }
            } catch (error) {
                if (isMounted.current) setIsAdmin(false);
            }
            
            // Fetch user data
            try {
                const { data: userData } = await axios.get('/api/user/is-auth');
                if (isMounted.current && userData.success) {
                    setUser(userData.user);
                    setCartItems(userData.user.cartItems || {});
                    setLoginStatus(true)
                }
            } catch (error) {
                if (isMounted.current) setUser(null);
            }
            
            // Fetch product data
            try {
                const { data: productData } = await axios.get('/api/product/list');
                if (isMounted.current) {
                    if (productData.success) {
                        // Create a processed version of products with all needed calculations
                        // to avoid recalculating during renders
                        setProducts(productData.message);
                        console.log("product", productData.message);
                    } else {
                        console.error(productData.message);
                    }
                }
            } catch (error) {
                console.error(error.message);
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
                setIsInitialized(true);
            }
        }
    };

    // Compute cart values without triggering unnecessary renders
    const updateCartCalculations = () => {
        // Calculate cart count
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        cartCountRef.current = totalCount;
        
        // Calculate cart amount
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find(
                (product) => product._id?.toString() === itemId?.toString()
            );
            
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }
        cartAmountRef.current = Math.floor(totalAmount * 100) / 100;
    };

    // Safe getters that don't trigger recalculations
    const getCartCount = () => cartCountRef.current;
    const getCartAmount = () => cartAmountRef.current;

    // Handle cart operations with minimal re-renders
    const addToCart = (itemId) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            newCart[itemId] = (newCart[itemId] || 0) + 1;
            return newCart;
        });
        
        // Avoid toast during initial load
        if (isInitialized) {
            toast.success("Added to cart");
        }
    };

    const updatedCartItems = (itemId, quantity) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: quantity
        }));
        
        if (isInitialized) {
            toast.success("Updated the cart");
        }
    };

    const removeCartItems = (itemId) => {
        setCartItems(prev => {
            const newCart = { ...prev };
            if (newCart[itemId]) {
                newCart[itemId] -= 1;
                if (newCart[itemId] === 0) {
                    delete newCart[itemId];
                }
            }
            return newCart;
        });
        
        if (isInitialized) {
            toast.success("Removed from cart");
        }
    };

    // Load data on mount once
    useEffect(() => {
        fetchData();
        
        // Cleanup on unmount
        return () => {
            isMounted.current = false;
        };
    }, []);

  
  

    // Update cart calculations when dependencies change
    useEffect(() => {
        updateCartCalculations();
    }, [cartItems, products]);

    // Update server cart with debouncing
    useEffect(() => {
        // Skip initial render
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            return;
        }
        
        // Skip if no user
        if (!user?._id || !isInitialized) return;
        
        const updateCart = async () => {
            try {
                await axios.post('/api/cart/cartupdate', {
                    cartItems,
                    id: user._id
                });
                // Don't show toasts for background operations
            } catch (error) {
                console.error("Cart update failed:", error.response?.data || error.message);
            }
        };
        
        // Debounce cart updates
        const timeoutId = setTimeout(updateCart, 1000);
        return () => clearTimeout(timeoutId);
    }, [cartItems, user, isInitialized]);

    // Create a simpler value object that avoids repeating complex calculations
    const contextValue = {
        navigate,
        axios,
        user,
        setUser,
        isAdmin,
        setIsAdmin,
        showLogin,
        setShowLogin,
        products,
        cartItems,
        setCartItems,
        addToCart,
        updatedCartItems,
        removeCartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        isLoading,
        isInitialized,
        fetchData,
        setLoginStatus,
        loginStatus,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

export default AppContextProvider;