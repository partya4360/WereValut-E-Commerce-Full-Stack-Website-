import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { API_BASE_URL } from '../config';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Bypass Payment function with Backend Validation Fixes
  const bypassPayment = async () => {
    try {
      // 'productId' sabat adhi check kara, karan tumchya cart madhe tiich key ahe
      const formattedItems = cartItems.map((item) => {
        const productId = item.productId || item.product || item._id || item.id;
        
        console.log("Mapping item:", item, "Extracted ID:", productId);

        return {
          product: productId,
          quantity: Number(item.qty || item.quantity || 1),
          price: Number(item.price || 0)
        };
      });

      const formattedAddress = {
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        postalcode: address.postalCode,
        country: address.country
      };

      const saveOrderRes = await fetch(`https://werevalut-e-commerce-full-stack-website.onrender.com/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: formattedItems,
          totalAmount: totalPrice,
          address: formattedAddress,
          paymentId: 'bypass_txn_' + Date.now()
        })
      });

      const data = await saveOrderRes.json();
      console.log("Order save response:", data);

      if (saveOrderRes.ok) {
        dispatch(clearCart());
        navigate('/ordersuccess', {
          state: { emailSent: data.emailSent, email: user.email }
        });
      } else {
        alert('Order saving failed: ' + (data.message || 'Validation Error'));
      }
    } catch (error) {
      console.error("Bypass Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }

    // Demo sathi direct bypass payment call hot ahe
    bypassPayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">Place Order (Demo Mode)</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;