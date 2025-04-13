import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/snap-cart`)
    } catch (error) {
        console.error('Failed to connect to database:', error.message)
    }
}

export default connectDB
