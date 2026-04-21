const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const { parseCookies, verifyRefreshToken } = require('../utils/authTokens');

const ADMIN_ROLES = ['admin', 'super_admin'];

const getBearerToken = req => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }

    const rawCookie = req.headers.cookie || '';
    const match = rawCookie.match(/(?:^|;\s*)kalossToken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
};

const getUserFromRefreshCookie = async req => {
    const cookies = parseCookies(req.headers.cookie || '');
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) return null;

    const decoded = verifyRefreshToken(refreshToken);
    const session = await Session.findById(decoded.sid);
    if (!session || !session.isActive || session.expiresAt < new Date()) {
        return null;
    }

    return User.findById(session.userId).select('-password -backupCodes -refreshTokens -twoFactorSecret');
};

exports.protect = async (req, res, next) => {
    const token = getBearerToken(req);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password -backupCodes -refreshTokens -twoFactorSecret');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user missing' });
            }
            if (req.user.banned) {
                return res.status(403).json({ message: req.user.bannedReason || 'Your account has been restricted.' });
            }
            next();
        } catch (error) {
            try {
                req.user = await getUserFromRefreshCookie(req);
                if (!req.user) {
                    return res.status(401).json({ message: 'Not authorized, token failed' });
                }
                if (req.user.banned) {
                    return res.status(403).json({ message: req.user.bannedReason || 'Your account has been restricted.' });
                }
                return next();
            } catch (refreshError) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }
        }
    } else {
        try {
            req.user = await getUserFromRefreshCookie(req);
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, no token' });
            }
            if (req.user.banned) {
                return res.status(403).json({ message: req.user.bannedReason || 'Your account has been restricted.' });
            }
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
    }
};

exports.optionalAuth = async (req, res, next) => {
    const token = getBearerToken(req);
    if (!token) {
        try {
            req.user = await getUserFromRefreshCookie(req);
        } catch (error) {
            req.user = null;
        }
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = await User.findById(decoded.id).select('-password -backupCodes -refreshTokens -twoFactorSecret');
    } catch (error) {
        try {
            req.user = await getUserFromRefreshCookie(req);
        } catch (refreshError) {
            req.user = null;
        }
    }

    next();
};

exports.adminOnly = (req, res, next) => {
    if (!req.user || !ADMIN_ROLES.includes(req.user.role)) {
        return res.status(403).json({ message: 'Admin access required.' });
    }

    next();
};

exports.superAdminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Super admin access required.' });
    }

    next();
};
