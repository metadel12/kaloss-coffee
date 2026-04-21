const bucket = new Map();

const WINDOW_MS = 60 * 1000;
const LIMIT = 20;

const rateLimiter = (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = bucket.get(key);

    if (!entry || entry.resetAt < now) {
        bucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return next();
    }

    if (entry.count >= LIMIT) {
        return res.status(429).json({ message: 'Too many requests. Please try again shortly.' });
    }

    entry.count += 1;
    return next();
};

module.exports = { rateLimiter };
