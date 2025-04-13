import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user,setUser] = useState(null)
    const [isSeller,setIsSeller] = useState(false)
    const [showUserLogin,setShowUserLogin] = useState(false)
    const [products,setProducts] = useState([])
    const [cartItems,setCartItems] = useState({})
    const [searchQuery,setSearchQuery] = useState({}) 


    // get seller status
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth')
            if(data.success){
                setIsSeller(true)
            }else {
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    // fetch all products
    const fetchProducts =  async()=> {
        setProducts(dummyProducts)
    }

    // add product to cart
    const addToCart = (itemId)=>{
        let cardData = structuredClone(cartItems)
        
        if(cardData[itemId]){
            cardData[itemId]+=1;
        }else{
            cardData[itemId] = 1;
        }
        setCartItems(cardData);
        toast.success("Added to Cart")
    }

    // update card item quantity
    const updateCartItem = (itemId,quantity)=> {
        let cardData = structuredClone(cartItems);
        cardData[itemId] = quantity;
        setCartItems(cardData)
        toast.success("Cart Updated")
    }

    // remove product
    const removeFromCart = (itemId)=>{
        let cardData = structuredClone(cartItems)
        if(cardData[itemId]){
            cardData[itemId] -= 1;
            if(cardData[itemId] === 0){
                delete cardData[itemId];
            }
        }
        toast.success("Removed from cart")
        setCartItems(cardData)
    }

    // get cart item count
    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item]
        }
        return totalCount
    }

    // get cart total amount
    const getCartAmount = ()=>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            if(cartItems[items]>0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount*100)/100
    }



    useEffect(()=>{
        fetchSeller()
        fetchProducts()
    },[])

    const value = {navigate, user, setUser , isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, cartItems, updateCartItem, removeFromCart, searchQuery,setSearchQuery, getCartCount, getCartAmount, axios}
    
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}