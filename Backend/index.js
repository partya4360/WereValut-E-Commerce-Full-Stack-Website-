const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const products = require('./routes/product');
const orders = require('./routes/orders');
const payments = require('./routes/payment');
const analytics = require('./routes/analyatics');

dotenv.config();
connectDB();
const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const frontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin:['https://werevalut-e-commerce-full-stack-website.onrender.com', 'http://localhost:5173' ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'database unavailable'
  });
});

app.use('/api/auth', userRoutes);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/analytics', analytics);
app.use('/api/analyatics', analytics);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

if (isProduction) {
  const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(frontendDistPath));
  app.get('/{*path}', (req, res, next) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'), (error) => {
      if (error) next(error);
    });
  });
} else {
  app.get('/', (req, res) => {
    res.send('WereValut Backend is working...');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
