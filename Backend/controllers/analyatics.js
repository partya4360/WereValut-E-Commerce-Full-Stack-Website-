const Order = require('../models/orders');
const User = require("../models/user");
const Product = require("../models/product");

const getAdminStats = async( req, res)=>{
    try{
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProduct = await Product.countDocuments();
        const orders = await Order.find({});
        const totalRevenueData = orders.reduce((acc, order)=> acc + order.totalAmount,0)

        res.json({
            totalOrders,
            totalProduct,
            totalUsers,
            totalRevenue: totalRevenueData
        });
    }catch(error){
        res.status(400).json({message:'error fetching stats', error});
    }
};

module.exports = {getAdminStats};