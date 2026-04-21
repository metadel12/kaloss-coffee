const merchantAccounts = {
    chapa: {
        merchantName: process.env.MERCHANT_NAME || 'Kaloss Coffee Trading PLC',
        publicKey: process.env.CHAPA_PUBLIC_KEY || '',
        secretKey: process.env.CHAPA_SECRET_KEY || '',
        callbackUrl: process.env.CHAPA_CALLBACK_URL || '',
        returnUrl: process.env.CHAPA_RETURN_URL || '',
    },
    telebirr: {
        merchantName: process.env.MERCHANT_NAME || 'Kaloss Coffee Trading PLC',
        appId: process.env.TELEBIRR_APP_ID || '',
        shortCode: process.env.TELEBIRR_SHORT_CODE || '',
        notifyUrl: process.env.TELEBIRR_NOTIFY_URL || '',
    },
    cbebirr: {
        merchantName: process.env.MERCHANT_NAME || 'Kaloss Coffee Trading PLC',
        merchantId: process.env.CBEBIRR_MERCHANT_ID || '',
    },
    bankTransfer: [
        {
            bank: 'Awash International Bank',
            accountName: process.env.MERCHANT_NAME || 'Kaloss Coffee Trading PLC',
            accountNumber: process.env.AWASH_ACCOUNT_NUMBER || '0132645987001',
            branch: process.env.AWASH_BRANCH || 'Bole, Addis Ababa',
            swiftCode: process.env.AWASH_SWIFT || 'AWINETAA',
        },
        {
            bank: 'Dashen Bank',
            accountName: process.env.MERCHANT_NAME || 'Kaloss Coffee Trading PLC',
            accountNumber: process.env.DASHEN_ACCOUNT_NUMBER || '0458741236002',
            branch: process.env.DASHEN_BRANCH || 'Mexico, Addis Ababa',
        },
        {
            bank: 'Bank of Abyssinia',
            accountName: process.env.MERCHANT_NAME || 'Kaloss Coffee Trading PLC',
            accountNumber: process.env.ABYSSINIA_ACCOUNT_NUMBER || '1122365478903',
            branch: process.env.ABYSSINIA_BRANCH || 'Edna Mall, Addis Ababa',
        },
        {
            bank: 'Commercial Bank of Ethiopia',
            accountName: process.env.MERCHANT_NAME || 'Kaloss Coffee Trading PLC',
            accountNumber: process.env.CBE_ACCOUNT_NUMBER || '1000264598700',
            branch: process.env.CBE_BRANCH || 'Bole Medhanialem',
        },
    ],
};

module.exports = {
    merchantAccounts,
};
