import React  from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/home.jsx';
import About  from "./pages/about.jsx";
import Disclaimer from "./pages/desclaimer.jsx";
import ReturnPolicy from "./pages/returnPolicy.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import ProductDetail from "./pages/productDetail.jsx";
import Cart from "./pages/cart.jsx";
import Checkout from "./pages/checkOut.jsx";
import Shop from "./pages/shop.jsx";
import Profile from "./pages/profile.jsx";
import AdminDashboard from './admin/AdminDashboard';
import AddProduct from './admin/AddProduct';
import AdminProducts from './admin/AdminProducts';
import EditProduct from './admin/EditProduct';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import OrderSuccess from "./pages/orderSuccess.jsx";
import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/return" element={<ReturnPolicy/>}/>
          <Route path="/disclaimer" element={<Disclaimer/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/products/:id" element={<ProductDetail/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/shop" element={<Shop/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
         <Route path="/ordersuccess" element={<OrderSuccess />} />
        </Routes>
        <Footer/>
      </Router>
      
    </>
  );
};

export default App
