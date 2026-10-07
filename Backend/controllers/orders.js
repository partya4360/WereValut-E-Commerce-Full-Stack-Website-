const Order = require('../models/orders');
const sendEmail = require('../utils/sendEmail');

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: 'invalid order data' });
    } else {
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        address,
        paymentId
      });

      await order.save();

      // Email Content
      const message = `
        <h3>Dear ${req.user.name || 'Customer'},</h3>
        <p>Thank you for your order! Your order has been successfully created with the following details:</p>
        <ul>
          <li><b>Order ID:</b> ${order._id}</li>
          <li><b>Total Amount:</b> ₹${totalAmount}</li>
          <li><b>Shipping Address:</b> ${address.street || ''}, ${address.city || ''}, ${address.postalcode || ''}</li>
        </ul>
        <p>We will notify you once your order is shipped.</p>
        <br/>
        <p>Best Regards,<br/><b>WearValut Team</b></p>
      `;

      let emailSent = false;
      try {
        await sendEmail({
          email: req.user.email,
          subject: 'Order Created Successfully - WearValut',
          message: message
        });
        emailSent = true;
      } catch (emailError) {
        console.error(`Failed to send order confirmation to ${req.user.email}:`, emailError.message);
      }

      res.status(201).json({ message: 'Order created successfully.', emailSent });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'error creating order', error });
  }
};


const myOrders = async (req, res) => {
    try {
        // 'items.productId' ऐवजी 'items.product' वापरले आहे
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name price');

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name')
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error fetching orders.', error });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
    const normalizedStatus = typeof status === 'string' ? status.trim().toLowerCase() : '';
    const allowedStatuses = ['pending', 'shipped', 'delivered'];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name');
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }

        const shouldSendStatusEmail = ['shipped', 'delivered'].includes(normalizedStatus)
            && order.status !== normalizedStatus;
        order.status = normalizedStatus;
        await order.save();

        let emailSent = null;
        if (shouldSendStatusEmail) {
          const address = order.address || {};
          const shippingAddress = [
            address.street,
            address.city,
            address.postalcode,
            address.country
          ].filter(Boolean).join(', ');
          const customerName = order.user?.name || address.fullName || 'Customer';
          const productNames = order.items
              .map(item => item.product?.name || 'Product')
              .join(', ');
          const isDelivered = normalizedStatus === 'delivered';
          const message = `
            <h3>Dear ${customerName},</h3>
            <p>Your order has been ${isDelivered ? 'delivered' : 'shipped'}.</p>
            <ul>
              <li><b>Order ID:</b> ${order._id}</li>
              <li><b>Total Amount:</b> ₹${Number(order.totalAmount).toFixed(2)}</li>
              <li><b>Shipping Address:</b> ${shippingAddress || 'Not provided'}</li>
              <li><b>Products:</b> ${productNames || 'Not available'}</li>
            </ul>
            <p>Thank you for shopping with WearValut.</p>
            <p>Best Regards,<br/><b>WearValut Team</b></p>
          `;

          try {
            await sendEmail({
              email: order.user?.email,
              subject: isDelivered
                  ? 'Your WearValut Order Has Been Delivered'
                  : 'Your WearValut Order Has Shipped',
              message
            });
            emailSent = true;
          } catch (emailError) {
            emailSent = false;
            console.error(`Failed to send ${normalizedStatus} notification for order ${order._id}:`, emailError.message);
          }
        }

        return res.json({ message: 'Order status updated.', order, emailSent });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status..', error });
    }
};

module.exports = { updateOrderStatus, createOrder, myOrders, getOrders };