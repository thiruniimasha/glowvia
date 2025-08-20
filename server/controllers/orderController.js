import Order from "../models/Order.js";
import Product from "../models/Product.js";


// place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) =>{
    try{
        const{ items, address} = req.body;
        const userId = req.user.id;

        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid Data"})
        }

        //Calculate amount using items
        let amount = 0;
        const orderItems = [];
        for(const item of items){
             const product = await Product.findById(item.productId);
             if(!product) {
                return res.json({ success: false, message: `Product not found : ${item.productId}`});
             }

             const itemTotal = product.offerPrice* item.quantity;
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

        return res.json({success:true, message: "Order Placed Successfully"})
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