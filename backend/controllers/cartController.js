import User from "../models/userModel.js";

// update cartdata
export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body
        const userId  = req.userId
        await User.findByIdAndUpdate(userId, { cartItems })
        
        res.status(200).json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}