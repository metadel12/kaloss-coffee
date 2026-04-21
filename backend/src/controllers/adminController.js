const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');

const getAdminName = admin => admin?.fullName || admin?.name || admin?.email || 'Admin';

const logAdminAction = async (req, action, targetType, targetId, details = {}) => {
    if (!req.user?._id || !targetId) return;

    await AdminLog.create({
        adminId: req.user._id,
        adminName: getAdminName(req.user),
        action,
        targetType,
        targetId,
        details,
        ipAddress: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '',
    });
};

const buildProductPayload = (body, userId) => {
    const title = body.title || body.name || '';
    const slug = body.slug || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const variants = Array.isArray(body.variants) ? body.variants : [];
    const mainImage = body.image || body.imageUrl || body.images?.hero || '';
    const status = body.status || 'draft';

    return {
        name: body.name || title,
        title,
        slug,
        description: body.description || '',
        price: Number(body.price || variants[0]?.priceETB || body.pricing?.current || 0),
        image: mainImage,
        imageUrl: mainImage,
        countInStock: Number(body.countInStock ?? variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0)),
        region: body.region || body.origin?.region || '',
        subRegion: body.subRegion || '',
        elevation: Number(body.elevation || 0) || undefined,
        process: body.process || '',
        varietal: body.varietal || 'Heirloom',
        farmerStory: body.farmerStory || '',
        brewingGuide: body.brewingGuide || '',
        grade: body.grade || '',
        roastDate: body.roastDate || '',
        inStock: body.inStock ?? true,
        origin: {
            region: body.region || body.origin?.region || '',
            country: body.origin?.country || 'Ethiopia',
            altitude: body.origin?.altitude || (body.elevation ? `${body.elevation} masl` : ''),
            coordinates: body.origin?.coordinates || {},
        },
        images: {
            hero: body.images?.hero || mainImage,
            thumbnail: body.images?.thumbnail || body.images?.hero || mainImage,
            gallery: Array.isArray(body.images?.gallery) ? body.images.gallery : [mainImage].filter(Boolean),
        },
        pricing: {
            current: Number(body.pricing?.current || body.price || variants[0]?.priceETB || 0),
            original: body.pricing?.original ? Number(body.pricing.original) : null,
            currency: body.pricing?.currency || 'ETB',
        },
        roastLevel: {
            type: body.roastLevel?.type || body.roastLevel || 'medium',
            percentage: Number(body.roastLevel?.percentage || 0),
        },
        tastingNotes: Array.isArray(body.tastingNotes)
            ? body.tastingNotes.map(note => typeof note === 'string' ? { name: note } : note)
            : String(body.tastingNotes || '')
                .split(',')
                .map(note => note.trim())
                .filter(Boolean)
                .map(name => ({ name })),
        variants: variants.map(variant => ({
            weight: variant.weight,
            priceETB: Number(variant.priceETB || 0),
            stock: Number(variant.stock || 0),
            sku: variant.sku || '',
        })),
        stats: body.stats || {},
        status,
        rejectionReason: status === 'rejected' ? body.rejectionReason || '' : '',
        submittedBy: userId,
        submittedAt: status === 'pending' ? new Date() : null,
        reviewedBy: ['approved', 'rejected'].includes(status) ? userId : null,
        reviewedAt: ['approved', 'rejected'].includes(status) ? new Date() : null,
        approvedBy: status === 'approved' ? userId : null,
        approvedAt: status === 'approved' ? new Date() : null,
    };
};

exports.getDashboardStats = async (req, res) => {
    const [orders, products, users, recentLogs] = await Promise.all([
        Order.find({}).sort({ createdAt: -1 }).limit(200).lean(),
        Product.find({}).sort({ createdAt: -1 }).limit(200).lean(),
        User.find({}).sort({ createdAt: -1 }).limit(200).lean(),
        AdminLog.find({}).sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    const totalSales = orders.reduce((sum, order) => sum + Number(order.summary?.totalETB || 0), 0);
    const pendingOrders = orders.filter(order => ['Pending', 'Confirmed'].includes(order.orderStatus)).length;
    const pendingProducts = products.filter(product => product.status === 'pending').length;
    const pendingPayments = orders.filter(order => order.paymentVerification?.status === 'pending' || order.paymentStatus === 'Pending Verification').length;

    const dailySalesMap = new Map();
    orders.forEach(order => {
        const key = new Date(order.createdAt).toISOString().slice(0, 10);
        dailySalesMap.set(key, (dailySalesMap.get(key) || 0) + Number(order.summary?.totalETB || 0));
    });

    const ordersByStatus = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => ({
        name: status,
        value: orders.filter(order => order.orderStatus === status).length,
    }));

    const paymentMethodRevenue = ['Telebirr', 'Chapa', 'BankTransfer', 'COD', 'CBEBirr', 'HelloCash'].map(method => ({
        name: method,
        revenue: orders
            .filter(order => order.paymentMethod === method)
            .reduce((sum, order) => sum + Number(order.summary?.totalETB || 0), 0),
    })).filter(item => item.revenue > 0);

    const productPopularity = products
        .map(product => ({
            name: product.title || product.name,
            sold: Number(product.stats?.soldCount || 0),
        }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);

    const recentActivity = [
        ...orders.slice(0, 4).map(order => ({
            id: `order-${order._id}`,
            label: `${order.customer?.fullName || 'Customer'} placed order ${order.orderNumber}`,
            time: order.createdAt,
        })),
        ...users.slice(0, 2).map(user => ({
            id: `user-${user._id}`,
            label: `New user registered: ${user.email}`,
            time: user.createdAt,
        })),
        ...recentLogs.slice(0, 2).map(log => ({
            id: `log-${log._id}`,
            label: `${log.adminName} ${log.action.toLowerCase().replace(/_/g, ' ')}`,
            time: log.createdAt,
        })),
    ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8);

    res.json({
        stats: {
            totalSales,
            pendingOrders,
            pendingProducts,
            totalUsers: users.length,
            pendingPayments,
        },
        charts: {
            dailySales: Array.from(dailySalesMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-30).map(([date, sales]) => ({ date, sales })),
            ordersByStatus,
            popularProducts: productPopularity,
            revenueByPaymentMethod: paymentMethodRevenue,
        },
        recentActivity,
    });
};

exports.getAdminProducts = async (req, res) => {
    const { search = '', status, region, roastLevel } = req.query;
    const query = {};

    if (search) {
        query.$or = [
            { title: new RegExp(String(search), 'i') },
            { name: new RegExp(String(search), 'i') },
            { region: new RegExp(String(search), 'i') },
        ];
    }
    if (status) query.status = status;
    if (region) query.region = region;
    if (roastLevel) query['roastLevel.type'] = roastLevel;

    const products = await Product.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();
    res.json(products);
};

exports.createAdminProduct = async (req, res) => {
    const product = await Product.create(buildProductPayload(req.body, req.user._id));
    await logAdminAction(req, 'CREATED_PRODUCT', 'Product', product._id, { title: product.title, status: product.status });
    res.status(201).json(product);
};

exports.updateAdminProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    Object.assign(product, buildProductPayload({ ...product.toObject(), ...req.body }, req.user._id));
    const updated = await product.save();
    await logAdminAction(req, 'UPDATED_PRODUCT', 'Product', updated._id, { title: updated.title, status: updated.status });
    res.json(updated);
};

exports.approveProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.status = 'approved';
    product.rejectionReason = '';
    product.reviewedBy = req.user._id;
    product.reviewedAt = new Date();
    product.approvedBy = req.user._id;
    product.approvedAt = new Date();
    await product.save();
    await logAdminAction(req, 'APPROVED_PRODUCT', 'Product', product._id, { title: product.title });
    res.json(product);
};

exports.rejectProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.status = 'rejected';
    product.rejectionReason = req.body.reason || req.body.rejectionReason || 'No reason provided.';
    product.reviewedBy = req.user._id;
    product.reviewedAt = new Date();
    await product.save();
    await logAdminAction(req, 'REJECTED_PRODUCT', 'Product', product._id, { reason: product.rejectionReason });
    res.json(product);
};

exports.deleteAdminProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    await Product.deleteOne({ _id: product._id });
    await logAdminAction(req, 'DELETED_PRODUCT', 'Product', product._id, { title: product.title });
    res.json({ message: 'Product deleted.' });
};

exports.getPendingProducts = async (req, res) => {
    const products = await Product.find({ status: 'pending' }).sort({ submittedAt: 1, createdAt: 1 }).lean();
    res.json(products);
};

exports.getAdminOrders = async (req, res) => {
    const { search = '', paymentStatus, orderStatus } = req.query;
    const query = {};

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (orderStatus) query.orderStatus = orderStatus;
    if (search) {
        query.$or = [
            { orderNumber: new RegExp(String(search), 'i') },
            { 'customer.fullName': new RegExp(String(search), 'i') },
            { 'customer.phone': new RegExp(String(search), 'i') },
            { 'customer.email': new RegExp(String(search), 'i') },
        ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('userId', 'fullName email role').lean();
    res.json(orders);
};

exports.getAdminOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('userId', 'fullName email role').lean();
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
};

exports.updateAdminOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    order.adminNotes = req.body.adminNotes ?? order.adminNotes;
    order.lastUpdatedBy = req.user._id;
    order.timeline.push({
        label: 'Order updated',
        detail: `Admin changed order status to ${order.orderStatus}.`,
        timestamp: new Date(),
    });
    await order.save();
    await logAdminAction(req, 'UPDATED_ORDER_STATUS', 'Order', order._id, { orderStatus: order.orderStatus });
    res.json(order);
};

exports.verifyPayment = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    order.paymentStatus = 'Paid';
    order.orderStatus = order.orderStatus === 'Pending' ? 'Processing' : order.orderStatus;
    order.paymentVerification = {
        ...order.paymentVerification?.toObject?.(),
        status: 'verified',
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        receiptUrl: order.paymentReceipt || order.paymentVerification?.receiptUrl || '',
        transactionReference: req.body.transactionReference || order.paymentReference || '',
        verificationNotes: req.body.verificationNotes || '',
    };
    order.lastUpdatedBy = req.user._id;
    order.timeline.push({
        label: 'Payment verified',
        detail: `Admin verified payment for ${order.orderNumber}.`,
        timestamp: new Date(),
    });
    await order.save();
    await logAdminAction(req, 'VERIFIED_PAYMENT', 'Order', order._id, { orderNumber: order.orderNumber });
    res.json(order);
};

exports.rejectPayment = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    order.paymentStatus = 'Failed';
    order.paymentVerification = {
        ...order.paymentVerification?.toObject?.(),
        status: 'rejected',
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        receiptUrl: order.paymentReceipt || order.paymentVerification?.receiptUrl || '',
        transactionReference: req.body.transactionReference || order.paymentReference || '',
        verificationNotes: req.body.verificationNotes || req.body.reason || 'Payment rejected.',
    };
    order.lastUpdatedBy = req.user._id;
    order.timeline.push({
        label: 'Payment rejected',
        detail: order.paymentVerification.verificationNotes,
        timestamp: new Date(),
    });
    await order.save();
    await logAdminAction(req, 'REJECTED_PAYMENT', 'Order', order._id, { reason: order.paymentVerification.verificationNotes });
    res.json(order);
};

exports.getPendingPayments = async (req, res) => {
    const orders = await Order.find({
        $or: [
            { paymentStatus: 'Pending Verification' },
            { 'paymentVerification.status': 'pending' },
        ],
    }).sort({ createdAt: 1 }).lean();
    res.json(orders);
};

exports.getAdminUsers = async (req, res) => {
    const { search = '', role, banned } = req.query;
    const query = {};

    if (role) query.role = role;
    if (banned === 'true') query.banned = true;
    if (banned === 'false') query.banned = false;
    if (search) {
        query.$or = [
            { fullName: new RegExp(String(search), 'i') },
            { email: new RegExp(String(search), 'i') },
            { phone: new RegExp(String(search), 'i') },
        ];
    }

    const users = await User.find(query).select('-password -backupCodes -refreshTokens -twoFactorSecret').sort({ createdAt: -1 }).lean();
    const userIds = users.map(user => user._id);
    const orders = await Order.find({ userId: { $in: userIds } }).select('userId summary.totalETB').lean();
    const totals = orders.reduce((acc, order) => {
        const key = String(order.userId || '');
        if (!acc[key]) acc[key] = { ordersCount: 0, totalSpent: 0 };
        acc[key].ordersCount += 1;
        acc[key].totalSpent += Number(order.summary?.totalETB || 0);
        return acc;
    }, {});

    res.json(users.map(user => ({
        ...user,
        ordersCount: totals[String(user._id)]?.ordersCount || 0,
        totalSpent: totals[String(user._id)]?.totalSpent || user.totalSpent || 0,
    })));
};

exports.updateUserRole = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.role = req.body.role || user.role;
    user.isAdmin = ['admin', 'super_admin'].includes(user.role);
    user.lastModifiedBy = req.user._id;
    await user.save();
    await logAdminAction(req, 'UPDATED_USER_ROLE', 'User', user._id, { role: user.role });
    res.json({ message: 'User role updated.', user });
};

exports.banUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.banned = true;
    user.bannedReason = req.body.reason || 'Restricted by admin.';
    user.bannedAt = new Date();
    user.lastModifiedBy = req.user._id;
    await user.save();
    await logAdminAction(req, 'BANNED_USER', 'User', user._id, { reason: user.bannedReason });
    res.json({ message: 'User banned.', user });
};

exports.unbanUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.banned = false;
    user.bannedReason = '';
    user.bannedAt = null;
    user.lastModifiedBy = req.user._id;
    await user.save();
    await logAdminAction(req, 'UNBANNED_USER', 'User', user._id);
    res.json({ message: 'User unbanned.', user });
};

exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    await User.deleteOne({ _id: user._id });
    await logAdminAction(req, 'DELETED_USER', 'User', user._id, { email: user.email });
    res.json({ message: 'User deleted.' });
};

exports.getAdminLogs = async (req, res) => {
    const logs = await AdminLog.find({}).sort({ createdAt: -1 }).limit(100).lean();
    res.json(logs);
};
