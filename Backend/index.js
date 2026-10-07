const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const products =require('./routes/product');
 const orders = require('./routes/orders');
 const payments = require('./routes/payment');
 const analyatics = require('./routes/analyatics');

dotenv.config();
connectDB();
const app = express();
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send("WereValut Backend is working...");
});
app.use('/api/auth', userRoutes);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/analyatics', analyatics);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('WereValut API is running in Development mode...');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on ${PORT

    }`);
});
