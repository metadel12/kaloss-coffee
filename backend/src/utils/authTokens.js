const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

const signAccessToken = userId => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
const signRefreshToken = sessionId => jwt.sign({ sid: sessionId }, REFRESH_SECRET, { expiresIn: '7d' });
const verifyRefreshToken = token => jwt.verify(token, REFRESH_SECRET);
const generateOtpCode = () => `${Math.floor(100000 + Math.random() * 900000)}`;
const hashValue = value => crypto.createHash('sha256').update(value).digest('hex');
const randomToken = (size = 32) => crypto.randomBytes(size).toString('hex');

const parseCookies = cookieHeader => {
    if (!cookieHeader) return {};

    return cookieHeader.split(';').reduce((accumulator, pair) => {
        const [rawKey, ...rawValue] = pair.trim().split('=');
        if (!rawKey) return accumulator;
        accumulator[rawKey] = decodeURIComponent(rawValue.join('=') || '');
        return accumulator;
    }, {});
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    generateOtpCode,
    hashValue,
    randomToken,
    parseCookies,
};
