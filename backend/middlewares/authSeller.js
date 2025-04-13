import jwt from 'jsonwebtoken'

const authSeller = async(req,res,next)=>{
    const {sellerToken} = req.cookies;

    if(!sellerToken) {
        return res.json({ success: false, message: 'Not Authorized'})
    }
    try {
        const jwtResponse = jwt.verify(sellerToken, process.env.JWT_SECRET)
        if(jwtResponse.email === process.env.SELLER_EMAIL) {
            next()
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized'})
        }  
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }
}

export default authSeller
