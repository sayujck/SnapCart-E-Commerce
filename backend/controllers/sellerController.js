import jwt from 'jsonwebtoken'

// seller login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body
    if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
        })
        return res.json({ success: true, message: 'Logged In' })
    }
    else {
        return res.json({ success: false, message: 'Invalid Credentials' })
    }
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// seller auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//seller logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
        })
        return res.status(200).json({ success: true, message: "Logged Out"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
