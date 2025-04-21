import Address from "../models/addressModel.js"

// add address
export const addAddress = async(req,res)=>{
    try {
        const { address } = req.body
        const userId = req.userId
        await Address.create({...address, userId})
        res.status(200).json({ success: true, message: "Address added successfully" });        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// get address
export const getAddress = async(req,res)=>{
    try {
        const userId = req.userId
        const addresses = await Address.find({userId})
        res.status(200).json({ success: true, addresses});        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}