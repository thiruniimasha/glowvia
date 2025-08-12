import Order from "../models/Order.js";
import Product from "../models/Product.js";


// place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) =>{
    try{
        const{ userId, items, address} = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid Data0"})
        }

        //Calculate amount using items
        let amount = await items.reduce(async (acc, item) =>{
            const product = await Product.offerPrice * item.quantity;
        }, 0)

        //add tax charge(2%)
        amount += Math.floor(amount * 0.02);
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({success:true, message: "Order Places Successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message})
    }
}

//get orders by user id : /api/order/user
export const getUserOrders = async (req, res) => {
    try{
        const {userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD"}, {ispaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders})
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}

//get all orders (for seller/admin) : api/order/seller
export const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({
            $or: [{ paymentType: "COD"}, {ispaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders})
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}