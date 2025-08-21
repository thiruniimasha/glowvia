import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import stripe from "stripe"


// place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" })
        }

        //Calculate amount using items
        let amount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.json({ success: false, message: `Product not found : ${item.productId}` });
            }

            const itemTotal = product.offerPrice * item.quantity;
            amount += itemTotal;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                name: product.name,
                price: product.offerPrice,
                image: product.image[0]
            });
        }



        //add tax charge(2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items: orderItems,
            amount,
            address,
            paymentType: "COD",
        });

        await User.findByIdAndUpdate(userId, { $set: { cartItems: {} } });



        return res.json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// place order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;
        const { origin } = req.headers;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" })
        }

        let productData = [];


        //Calculate amount using items
        let amount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
                image: product.image[0]
            });

            if (!product) {
                return res.json({ success: false, message: `Product not found : ${item.productId}` });
            }

            const itemTotal = product.offerPrice * item.quantity;
            amount += itemTotal;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                name: product.name,
                price: product.offerPrice,
                image: product.image[0]
            });


        }



        //add tax charge(2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items: orderItems,
            amount,
            address,
            paymentType: "Online",
        });

        //stripe gateway
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "lkr",
                    product_data: {
                        name: item.name,

                    },
                    unit_amount: (item.price + item.price * 0.2) * 100
                },
                quantity: item.quantity,
            }
        })

        //create session
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

        await User.findByIdAndUpdate(userId, { $set: { cartItems: {} } });



        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


//Stripe webhook to verify payment action : /stripe
export const stripeWebhooks = async (request, response) => {
    //stripe gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (error) {
        response.status(400).send(`Webhook Error : ${error.message}`)

    }

    //handle event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;

            //mark payment as paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true })
            // clear user cart
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            //getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.error(`Unhandled event type ${event.type}`)
            break;

    }
    response.json({ received: true })


}

//get orders by user id : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({
            userId
        }).populate('items.productId', 'name image category offerPrice')


            .populate('address')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders })
    } catch (error) {
        console.error('Get orders error:', error);
        res.json({ success: false, message: error.message })
    }
}

//get all orders (for seller/admin) : api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        console.log('Fetching all orders...');
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate('items.productId')
            .populate('address')
            .sort({ createdAt: -1 });

        console.log('Found orders:', orders);


        res.json({ success: true, orders })
    } catch (error) {
        console.error('Get all orders error:', error);
        res.json({ success: false, message: error.message })
    }
}