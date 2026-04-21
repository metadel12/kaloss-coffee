export const VAT_RATE = 0.15;
export const FREE_SHIPPING_THRESHOLD = 1800;
export const GIFT_WRAP_FEE = 50;
export const COD_FEE = 30;

export const DELIVERY_OPTIONS = {
    standard: { id: 'standard', label: 'Standard Delivery', eta: '3-5 business days', fee: 50 },
    express: { id: 'express', label: 'Express Delivery', eta: '1-2 business days', fee: 150 },
    pickup: { id: 'pickup', label: 'Pickup from Store', eta: 'Ready in 24 hours', fee: 0 },
    international: { id: 'international', label: 'International Shipping', eta: '5-10 business days', fee: 350 },
};

export const ADDIS_SUBCITIES = [
    'Bole', 'Kirkos', 'Lideta', 'Arada', 'Yeka', 'Kolfe Keranio', 'Nifas Silk-Lafto', 'Gulele', 'Akaky Kaliti', 'Addis Ketema',
];

export const ETHIOPIAN_REGIONS = [
    'Addis Ababa', 'Adama', 'Bahir Dar', 'Dire Dawa', 'Gondar', 'Hawassa', 'Jimma', 'Mekelle', 'Other',
];

export const PAYMENT_METHODS = [
    { id: 'telebirr', title: 'Telebirr', description: 'Pay using Telebirr mobile money', type: 'push' },
    { id: 'chapa', title: 'Chapa', description: 'Visa, Mastercard, Amex, CBEBirr', type: 'redirect' },
    { id: 'cbebirr', title: 'CBEBirr', description: 'Commercial Bank of Ethiopia mobile banking', type: 'redirect' },
    { id: 'bank_transfer', title: 'Bank Transfer', description: 'Awash, Dashen, Abyssinia, CBE direct deposit', type: 'offline' },
    { id: 'cod', title: 'Cash on Delivery', description: 'Pay when your order arrives', type: 'offline' },
    { id: 'hellocash', title: 'HelloCash / Amole', description: 'Alternative Ethiopian mobile money', type: 'redirect' },
];

export const BANK_ACCOUNTS = [
    {
        bank: 'Awash International Bank',
        accountName: 'Kaloss Coffee Trading PLC',
        accountNumber: '0132645987001',
        branch: 'Bole, Addis Ababa',
        swiftCode: 'AWINETAA',
    },
    {
        bank: 'Dashen Bank',
        accountName: 'Kaloss Coffee Trading PLC',
        accountNumber: '0458741236002',
        branch: 'Mexico, Addis Ababa',
    },
    {
        bank: 'Bank of Abyssinia',
        accountName: 'Kaloss Coffee Trading PLC',
        accountNumber: '1122365478903',
        branch: 'Edna Mall, Addis Ababa',
    },
    {
        bank: 'Commercial Bank of Ethiopia',
        accountName: 'Kaloss Coffee Trading PLC',
        accountNumber: '1000264598700',
        branch: 'Bole Medhanialem',
    },
];

export const DISCOUNT_PRESETS = {
    SAVE10: { code: 'SAVE10', type: 'percentage', value: 10, minPurchase: 500, maxDiscount: 500 },
    WELCOME20: { code: 'WELCOME20', type: 'percentage', value: 20, minPurchase: 1200, maxDiscount: 700 },
    FREESHIP: { code: 'FREESHIP', type: 'freeShipping', value: 0, minPurchase: 700 },
    BUNA150: { code: 'BUNA150', type: 'fixed', value: 150, minPurchase: 1500 },
};

export const formatETB = amount => `ETB ${Number(amount || 0).toLocaleString()}`;

export const normalizeCartProduct = (product, quantity = 1, variant = null) => {
    const selectedVariant = variant || product.variants?.[0] || null;
    const baseId = product.id || product._id || product.slug;
    const price = Number(selectedVariant?.priceETB || product.price || product.pricing?.current || 0);
    const stock = Number(selectedVariant?.stock ?? product.countInStock ?? 0);

    return {
        id: baseId,
        productId: baseId,
        cartKey: `${baseId}:${selectedVariant?.sku || selectedVariant?.weight || 'default'}`,
        name: product.name || product.title || 'Kaloss Coffee',
        slug: product.slug || baseId,
        image: product.images?.thumbnail || product.images?.hero || product.image || product.imageUrl || '/favicon.svg',
        price,
        quantity,
        variant: {
            sku: selectedVariant?.sku || `${baseId}-default`,
            weight: selectedVariant?.weight || '250g',
            stock,
        },
        grade: product.grade || 'Grade 1',
        roastLevel: product.roastLevel?.label || product.roastLevel?.type || product.roastLevel || 'Medium Roast',
        inStock: stock > 0 || Boolean(product.inStock),
        stock,
        giftWrap: false,
        noteToSeller: '',
        selected: false,
        salePrice: Number(product.pricing?.original || 0) > price ? Number(product.pricing.original) : null,
    };
};

export const calculateShippingFee = ({ region, deliveryOption = 'standard', subtotal = 0 }) => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD && deliveryOption === 'standard') {
        return 0;
    }

    const delivery = DELIVERY_OPTIONS[deliveryOption] || DELIVERY_OPTIONS.standard;
    if (deliveryOption === 'pickup') {
        return 0;
    }

    if (deliveryOption === 'international') {
        return delivery.fee;
    }

    if (deliveryOption === 'express') {
        return delivery.fee;
    }

    return region === 'Addis Ababa' ? 50 : 100;
};

export const validateCodAvailability = shippingAddress => shippingAddress?.region === 'Addis Ababa';

export const calculateDiscountAmount = ({ code, subtotal, shippingFee = 0 }) => {
    const discount = DISCOUNT_PRESETS[String(code || '').trim().toUpperCase()];
    if (!discount) {
        return { valid: false, message: 'Discount code not found.', amount: 0, discount: null };
    }

    if (subtotal < discount.minPurchase) {
        return {
            valid: false,
            message: `Minimum purchase is ${formatETB(discount.minPurchase)}.`,
            amount: 0,
            discount,
        };
    }

    let amount = 0;

    if (discount.type === 'percentage') {
        amount = subtotal * (discount.value / 100);
        if (discount.maxDiscount) {
            amount = Math.min(amount, discount.maxDiscount);
        }
    }

    if (discount.type === 'fixed') {
        amount = discount.value;
    }

    if (discount.type === 'freeShipping') {
        amount = shippingFee;
    }

    return {
        valid: true,
        message: `${discount.code} applied successfully.`,
        amount: Math.max(0, Math.round(amount)),
        discount,
    };
};

export const buildCartSummary = ({
    cart = [],
    discountCode = '',
    shippingAddress = {},
    deliveryOption = 'standard',
    paymentMethod = '',
}) => {
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const giftWrapFee = cart.reduce((sum, item) => sum + (item.giftWrap ? GIFT_WRAP_FEE * Number(item.quantity) : 0), 0);
    const shippingFee = calculateShippingFee({ region: shippingAddress.region, deliveryOption, subtotal });
    const discountResult = calculateDiscountAmount({ code: discountCode, subtotal, shippingFee });
    const discountAmount = discountResult.valid ? discountResult.amount : 0;
    const taxableBase = Math.max(0, subtotal + shippingFee + giftWrapFee - discountAmount);
    const taxAmount = Math.round(taxableBase * VAT_RATE);
    const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
    const totalETB = taxableBase + taxAmount + codFee;
    const savings = cart.reduce((sum, item) => sum + (item.salePrice ? (item.salePrice - item.price) * item.quantity : 0), 0) + discountAmount;

    return {
        subtotal,
        shippingFee,
        giftWrapFee,
        discountAmount,
        discountCode: discountResult.valid ? discountResult.discount.code : '',
        discountMeta: discountResult,
        taxAmount,
        codFee,
        totalETB,
        savings,
        freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    };
};
