import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  useEffect(() => {
    fetchUser()
    fetchSeller()
    fetchProducts()
  }, [])


  //fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth')
      if (data.success) {
        setIsSeller(true)
      } else {
        setIsSeller(false)
      }
    } catch (error) {
      setIsSeller(false)
    }
  }

  //fetch user auth status, user data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        setUser(data.user);
        // Set cart items from user data
        if (data.user.cartItems) {
          setCartItems(data.user.cartItems);
        }
      } else {
        setUser(null);
        setCartItems({}); // Clear cart on failed auth
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
      console.error("Auth error:", error);
    }
  };

  const handleUserChange = (userData) => {
    if (userData) {
      setUser(userData);
        setCartItems(userData.cartItems || {});
      
    } else {
      setUser(null);
      setCartItems({}); // Clear cart when logging out
    }
  }

  const clearCart = () => {
    setCartItems({});
  }

  //fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list')
      if (data.success) {
        setProducts(data.products)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;

    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  }

  //update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  }

  //remove item from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from Cart")
    setCartItems(cartData);
  }

  //get cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  }

  //total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items]
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  }



  
  //update database cart items
  useEffect(() => {
     if (user && Object.keys(cartItems).length > 0) {
    const updateCart = async () => {
      try {
       await axios.post('/api/cart/update', { cartItems });
       
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    };

      updateCart();
  }
    

  }, [cartItems, user]);


  const value = {
    navigate,
    user,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setSearchQuery,
    searchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setUser: handleUserChange,
    clearCart,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  return useContext(AppContext);
}

