const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const connectDatabase = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const seedRoutes = require('./src/routes/seedRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const userRoutes = require('./src/routes/userRoutes');
const homepageRoutes = require('./src/routes/homepageRoutes');
const aboutRoutes = require('./src/routes/aboutRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { errorHandler } = require('./src/middleware/errorMiddleware');

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 5001;
const FRONTEND_URLS = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'https://kaloss-coffee-97v8.onrender.com/')
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);

connectDatabase();
app.use(cors({
    origin: FRONTEND_URLS,
    credentials: true,
}));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Kaloss Coffee API',
        status: 'running',
        port: PORT,
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api', homepageRoutes);
app.use('/api', aboutRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Kaloss Coffee Backend running on port ${PORT}`);
    console.log(`Frontend origins allowed: ${FRONTEND_URLS.join(', ')}`);
});

server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Update backend/.env or stop the process using that port.`);
        process.exit(1);
    }

    throw error;
});
