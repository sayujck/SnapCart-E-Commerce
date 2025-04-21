import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            res.json({
                success: false,
                message: 'Missing Details'
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.json({ success: false, message: 'user already exists' })
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({ name, email, password: hashedPassword })
            await newUser.save()
            res.status(200).json({
                newUser,
                message: "Successfully Registered",
                success: true,
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.json({
                success: false,
                message: 'Missing Details'
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password)
            if (!isPasswordValid) {
                res.json({
                    success: false,
                    message: 'Invalid Password'
                })
            }

            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
            })
            return res.status(200).json({
                user: existingUser,
                message: 'Login Successfull',
                success: true
            })
        }
        else {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// check auth
export const isAuth = async (req, res) => {
    try {
        const  userId  = req.userId
        const user = await User.findById(userId).select("-password")
        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
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