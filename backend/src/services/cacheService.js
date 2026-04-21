const cacheStore = new Map();

const get = async key => {
    const entry = cacheStore.get(key);

    if (!entry) {
        return null;
    }

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
        cacheStore.delete(key);
        return null;
    }

    return entry.value;
};

const set = async (key, value, ttlSeconds) => {
    cacheStore.set(key, {
        value,
        expiresAt: ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null,
    });
};

const del = async key => {
    cacheStore.delete(key);
};

module.exports = {
    get,
    set,
    del,
};
