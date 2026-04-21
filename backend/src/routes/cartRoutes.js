const express = require('express');

const router = express.Router();

const DISCOUNTS = {
    SAVE10: { code: 'SAVE10', type: 'Percentage', value: 10, minPurchase: 500, maxDiscount: 500 },
    WELCOME20: { code: 'WELCOME20', type: 'Percentage', value: 20, minPurchase: 1200, maxDiscount: 700 },
    FREESHIP: { code: 'FREESHIP', type: 'FreeShipping', value: 0, minPurchase: 700 },
    BUNA150: { code: 'BUNA150', type: 'Fixed', value: 150, minPurchase: 1500 },
};

router.get('/', (req, res) => {
    res.json({ items: [], savedItems: [], message: 'Cart state is managed on the frontend for guest sessions.' });
});

router.post('/add', (req, res) => {
    res.status(201).json({ success: true, item: req.body });
});

router.put('/update/:itemId', (req, res) => {
    res.json({ success: true, itemId: req.params.itemId, updates: req.body });
});

router.delete('/remove/:itemId', (req, res) => {
    res.json({ success: true, removed: req.params.itemId });
});

router.post('/clear', (req, res) => {
    res.json({ success: true, message: 'Cart cleared.' });
});

router.post('/save-for-later', (req, res) => {
    res.json({ success: true, saved: req.body });
});

router.post('/apply-discount', (req, res) => {
    const code = String(req.body.code || '').trim().toUpperCase();
    const subtotal = Number(req.body.subtotal || 0);
    const shippingFee = Number(req.body.shippingFee || 0);
    const discount = DISCOUNTS[code];

    if (!discount) {
        return res.status(404).json({ valid: false, message: 'Discount code not found.' });
    }

    if (subtotal < discount.minPurchase) {
        return res.status(400).json({
            valid: false,
            message: `Minimum purchase for ${code} is ${discount.minPurchase} ETB.`,
        });
    }

    let amount = 0;
    if (discount.type === 'Percentage') {
        amount = subtotal * (discount.value / 100);
        if (discount.maxDiscount) {
            amount = Math.min(amount, discount.maxDiscount);
        }
    }
    if (discount.type === 'Fixed') {
        amount = discount.value;
    }
    if (discount.type === 'FreeShipping') {
        amount = shippingFee;
    }

    return res.json({
        valid: true,
        code,
        type: discount.type,
        amount: Math.round(amount),
        message: `${code} applied successfully.`,
    });
});

module.exports = router;
