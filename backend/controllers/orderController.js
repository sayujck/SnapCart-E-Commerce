import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import stripe from 'stripe'
import User from '../models/userModel.js'


// place cod order
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        if (!address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid data" })
        }
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerprice * item.quantity
        }, 0)
        amount += Math.floor(amount * 0.02)
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        })
        return res.status(200).json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// place online order- stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body
        const { origin } = req.headers

        if (!address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid data" })
        }
        let productData = []
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({ name: product.name, price: product.offerprice, quantity: item.quantity })
            return (await acc) + product.offerprice * item.quantity
        }, 0)
        amount += Math.floor(amount * 0.02)
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        })

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity
            }
        })

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({ success: true, url: session.url })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// stripe webhooks to verify payments actions
export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]
    let event
    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        Response.status(400).send(`Webhook Error: ${error.message}`)
    }
    // handle the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object
            const paymentIntentId = paymentIntent.id

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId, userId } = session.data[0].metadata;
            // mark  payment as paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true })
            // clear cart
            await User.findByIdAndUpdate(userId, { cartItems: {} })
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object
            const paymentIntentId = paymentIntent.id

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
            break
    }
    response.json({received:true})
}

// get all orders by userId
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

// get all orders (seller)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address")
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}