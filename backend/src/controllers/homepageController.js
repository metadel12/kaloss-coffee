const Product = require('../models/Product');
const QuizResult = require('../models/QuizResult');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Review = require('../models/Review');
const cacheService = require('../services/cacheService');

const fallbackProducts = [
    {
        _id: 'fallback-yirgacheffe',
        name: 'Yirgacheffe Crown',
        title: 'Yirgacheffe Crown',
        slug: 'yirgacheffe-crown',
        description: 'Washed heirloom Arabica with jasmine aromatics, bergamot lift, and a honeyed black tea finish.',
        price: 980,
        grade: 'Grade 1',
        roastDate: '2026-04-10',
        image: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
        countInStock: 18,
        inStock: true,
        origin: { region: 'Yirgacheffe', country: 'Ethiopia', altitude: '2,000-2,200 masl' },
        pricing: { current: 980, original: 1140, currency: 'ETB' },
        roastLevel: { type: 'light', percentage: 34 },
        tastingNotes: [{ name: 'Jasmine' }, { name: 'Lemon Blossom' }, { name: 'Tea Rose' }],
        stats: { rating: 4.9, reviewCount: 148, soldCount: 4200, views: 320 },
        isFeatured: true,
        displayOrder: 1,
    },
    {
        _id: 'fallback-sidama',
        name: 'Sidama Ember',
        title: 'Sidama Ember',
        slug: 'sidama-ember',
        description: 'A berry-rich natural process coffee with cocoa sweetness and a long winey finish.',
        price: 1020,
        grade: 'Grade 1',
        roastDate: '2026-04-12',
        image: 'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
        countInStock: 14,
        inStock: true,
        origin: { region: 'Sidama', country: 'Ethiopia', altitude: '1,850-2,150 masl' },
        pricing: { current: 1020, original: 1180, currency: 'ETB' },
        roastLevel: { type: 'medium', percentage: 52 },
        tastingNotes: [{ name: 'Blueberry' }, { name: 'Cocoa' }, { name: 'Red Wine' }],
        stats: { rating: 4.8, reviewCount: 124, soldCount: 3900, views: 294 },
        isFeatured: true,
        displayOrder: 2,
    },
    {
        _id: 'fallback-guji',
        name: 'Guji Canopy',
        title: 'Guji Canopy',
        slug: 'guji-canopy',
        description: 'Forest-grown lots from Guji with peach sweetness, florals, and a bright citrus snap.',
        price: 1090,
        grade: 'Grade 2',
        roastDate: '2026-04-14',
        image: 'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
        countInStock: 11,
        inStock: true,
        origin: { region: 'Guji', country: 'Ethiopia', altitude: '1,900-2,250 masl' },
        pricing: { current: 1090, original: 1250, currency: 'ETB' },
        roastLevel: { type: 'medium-light', percentage: 46 },
        tastingNotes: [{ name: 'Peach' }, { name: 'Wildflower' }, { name: 'Orange Zest' }],
        stats: { rating: 4.8, reviewCount: 96, soldCount: 2740, views: 210 },
        isFeatured: true,
        displayOrder: 3,
    },
    {
        _id: 'fallback-limu',
        name: 'Limu Morning',
        title: 'Limu Morning',
        slug: 'limu-morning',
        description: 'Balanced and sweet with stone fruit, caramel, and a calm milk-chocolate finish.',
        price: 920,
        grade: 'Grade 2',
        roastDate: '2026-04-08',
        image: 'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
        countInStock: 16,
        inStock: true,
        origin: { region: 'Limu', country: 'Ethiopia', altitude: '1,650-1,950 masl' },
        pricing: { current: 920, original: 1050, currency: 'ETB' },
        roastLevel: { type: 'medium', percentage: 58 },
        tastingNotes: [{ name: 'Caramel' }, { name: 'Apricot' }, { name: 'Milk Chocolate' }],
        stats: { rating: 4.7, reviewCount: 88, soldCount: 2310, views: 176 },
        isFeatured: true,
        displayOrder: 4,
    },
    {
        _id: 'fallback-harrar',
        name: 'Harrar Moon',
        title: 'Harrar Moon',
        slug: 'harrar-moon',
        description: 'A dramatic cup with dried fruit, spice, and dark chocolate depth for ceremony-style brewing.',
        price: 1120,
        grade: 'Grade 1',
        roastDate: '2026-04-11',
        image: 'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        countInStock: 9,
        inStock: true,
        origin: { region: 'Harrar', country: 'Ethiopia', altitude: '1,500-2,100 masl' },
        pricing: { current: 1120, original: 1290, currency: 'ETB' },
        roastLevel: { type: 'medium-dark', percentage: 67 },
        tastingNotes: [{ name: 'Blueberry' }, { name: 'Cinnamon' }, { name: 'Dark Chocolate' }],
        stats: { rating: 4.9, reviewCount: 132, soldCount: 3150, views: 265 },
        isFeatured: true,
        displayOrder: 5,
    },
];

const fallbackReviews = [
    { username: 'Mahi', rating: 5, comment: 'The Sidama roast feels like blueberry jam and cocoa. Absolutely beautiful after dinner.', location: 'Addis Ababa', language: 'en', createdAt: '2026-04-15T08:30:00.000Z' },
    { username: 'ሰላም', rating: 5, comment: 'የይርጋጨፌው ሽታ እጅግ ይማርካል፣ በጀበና ሲፈላ ቤቱን ሙሉ ያሞላል።', location: 'Dire Dawa', language: 'am', createdAt: '2026-04-14T13:12:00.000Z' },
    { username: 'Ruth G.', rating: 4, comment: 'Fast delivery to Bole and the recipe card for buna ceremony was a lovely touch.', location: 'Addis Ababa', language: 'en', createdAt: '2026-04-13T18:45:00.000Z' },
    { username: 'ታምራት', rating: 5, comment: 'Guji Canopy በጣም ለስላሳ ነው፣ የአበባ ሽታውም ግሩም ነው።', location: 'Hawassa', language: 'am', createdAt: '2026-04-12T07:10:00.000Z' },
    { username: 'Abel', rating: 5, comment: 'Feels premium without losing the Ethiopian identity. The ceremony section is especially thoughtful.', location: 'Bahir Dar', language: 'en', createdAt: '2026-04-11T11:00:00.000Z' },
    { username: 'Lulit', rating: 4, comment: 'I liked the Guji most. Fruity, clean, and still strong enough for family service.', location: 'Adama', language: 'en', createdAt: '2026-04-10T09:20:00.000Z' },
];

const legacyProductImageFallbacks = {
    yirgacheffe: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sidama: 'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
    guji: 'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
    limu: 'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
    harrar: 'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
    default: 'https://images.pexels.com/photos/53399/pexels-photo-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const resolveProductImage = (image, slug = '', region = '') => {
    if (typeof image !== 'string' || !image.trim()) {
        const fallbackKey = String(region || slug).toLowerCase();
        return Object.entries(legacyProductImageFallbacks).find(([key]) => key !== 'default' && fallbackKey.includes(key))?.[1]
            || legacyProductImageFallbacks.default;
    }

    if (/^https?:\/\//i.test(image) || image.startsWith('/images/')) {
        return image;
    }

    const fallbackKey = String(region || slug || image).toLowerCase();
    return Object.entries(legacyProductImageFallbacks).find(([key]) => key !== 'default' && fallbackKey.includes(key))?.[1]
        || legacyProductImageFallbacks.default;
};

const ceremonySteps = [
    { id: 1, amharicName: 'Abol', title: 'Washing Beans', description: 'Fresh green beans are cleaned carefully before the first roast begins.', accent: 'Cleansed for clarity' },
    { id: 2, amharicName: 'Tona', title: 'Roasting Over Flame', description: 'The beans roast in a flat pan so guests can experience the aroma as it rises.', accent: 'Fragrance fills the room' },
    { id: 3, amharicName: 'Beraka', title: 'Grinding With Mortar', description: 'Roasted beans are ground by hand to keep the ritual tactile and intentional.', accent: 'Texture and rhythm' },
    { id: 4, amharicName: 'Jebena', title: 'Brewing In Jebena', description: 'Coffee brews slowly in the traditional clay pot, building body and depth.', accent: 'Ceremonial pour' },
    { id: 5, amharicName: 'Feresho', title: 'Serving With Popcorn', description: 'Coffee is shared with snacks and conversation, turning the drink into hospitality.', accent: 'Community and welcome' },
];

const galleryFeed = [
    { id: 'gallery-1', title: 'Ceremony Morning', image: 'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'gallery-2', title: 'Roasting Ritual', image: 'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'gallery-3', title: 'Addis Coffee House', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'gallery-4', title: 'Jebena Pour', image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

const normalizeProduct = product => ({
    ...product,
    id: product._id?.toString?.() || product._id || product.slug,
    name: product.name || product.title,
    image: resolveProductImage(product.images?.hero || product.imageUrl || product.image, product.slug, product.origin?.region || product.region),
    pricing: {
        current: product.pricing?.current || product.price || 0,
        original: product.pricing?.original || null,
        currency: product.pricing?.currency || 'ETB',
    },
    roastLevel: product.roastLevel?.type || product.roastLevel || 'medium',
    elevation: product.origin?.altitude || product.elevation || '',
    region: product.origin?.region || product.region || 'Ethiopia',
    tastingNotes: Array.isArray(product.tastingNotes)
        ? product.tastingNotes.map(note => note.name || note)
        : [],
    inStock: product.inStock ?? ((product.countInStock ?? 0) > 0),
});

const normalizeReview = review => ({
    id: review._id?.toString?.() || review._id || `${review.username}-${review.createdAt}`,
    username: review.username || review.user?.name || 'Kaloss Guest',
    rating: review.rating,
    comment: review.comment,
    location: review.location || 'Addis Ababa',
    language: review.language || 'en',
    createdAt: review.createdAt || new Date().toISOString(),
});

class HomepageController {
    async getHomepageData(req, res) {
        try {
            const cached = await cacheService.get('homepage_data');

            if (cached) {
                return res.json(cached);
            }

            const [featuredProducts, reviews] = await Promise.all([
                Product.find({ isFeatured: true }).sort({ displayOrder: 1, createdAt: -1 }).limit(5).lean(),
                Review.find({}).sort({ createdAt: -1 }).limit(5).lean(),
            ]);

            const homepageData = {
                hero: {
                    title: 'Kaloss Coffee - የኢትዮጵያ እውነተኛ ጣዕም',
                    subtitle: 'Handpicked Arabica from Yirgacheffe, Sidama, Guji, Limu, and Harrar.',
                    backgroundImage: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1600',
                },
                products: (featuredProducts.length ? featuredProducts : fallbackProducts).map(normalizeProduct),
                reviews: (reviews.length ? reviews : fallbackReviews).map(normalizeReview),
                ceremonySteps,
                galleryFeed,
                stats: {
                    yearsOfHeritage: { value: 87, suffix: '+', prefix: '' },
                    cupsServed: { value: 1250000, suffix: '+', prefix: '' },
                    farmsPartnered: { value: 36, suffix: '', prefix: '' },
                },
                hashtags: ['#EthiopianKaloss', '#BunaTetu', '#AddisCoffeeCulture'],
                lastUpdated: new Date().toISOString(),
            };

            await cacheService.set('homepage_data', homepageData, 3600);
            return res.json(homepageData);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch homepage data' });
        }
    }

    async getReviews(req, res) {
        try {
            const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(5).lean();
            return res.json((reviews.length ? reviews : fallbackReviews).map(normalizeReview));
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch reviews' });
        }
    }

    async createReview(req, res) {
        try {
            const { username, rating, comment, location, language } = req.body;

            if (!username || !comment || !rating) {
                return res.status(400).json({ message: 'Username, rating, and comment are required' });
            }

            const review = await Review.create({
                username,
                rating: Number(rating),
                comment,
                location: location || 'Addis Ababa',
                language: language || 'en',
            });

            await cacheService.del('homepage_data');
            return res.status(201).json(normalizeReview(review.toObject()));
        } catch (error) {
            return res.status(500).json({ message: 'Unable to save review right now' });
        }
    }

    async getCeremonySteps(req, res) {
        return res.json(ceremonySteps);
    }

    async incrementProductView(req, res) {
        try {
            const { productId } = req.params;
            await Product.findByIdAndUpdate(productId, { $inc: { 'stats.views': 1 } });
            await cacheService.del('homepage_data');
            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update product view' });
        }
    }

    async submitQuiz(req, res) {
        try {
            const { answers = [], sessionId, userEmail } = req.body;
            const recommendation = await this.analyzeQuizAnswers(answers);

            const quizResult = new QuizResult({
                sessionId,
                answers,
                recommendation: recommendation ? {
                    productId: recommendation.product?._id,
                    discountCode: recommendation.discountCode,
                    discountAmount: recommendation.discountAmount,
                } : undefined,
                userEmail,
            });

            await quizResult.save();

            return res.json(recommendation);
        } catch (error) {
            return res.status(500).json({ message: 'Unable to submit quiz right now' });
        }
    }

    async subscribeNewsletter(req, res) {
        try {
            const { email, phoneNumber, location, source } = req.body;

            if (!email && !phoneNumber) {
                return res.status(400).json({ message: 'An email or phone number is required' });
            }

            if (email && !String(email).includes('@')) {
                return res.status(400).json({ message: 'A valid email is required' });
            }

            await NewsletterSubscriber.findOneAndUpdate(
                email ? { email: email.toLowerCase() } : { phoneNumber },
                {
                    email: email ? email.toLowerCase() : undefined,
                    phoneNumber,
                    location,
                    source: source || 'ethiopian-homepage',
                    subscribedAt: new Date(),
                    isActive: true,
                    ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
                },
                { upsert: true, new: true, setDefaultsOnInsert: true },
            );

            await cacheService.del('homepage_data');
            return res.json({ success: true, message: 'እንኳን ደህና መጡ! (Welcome!)' });
        } catch (error) {
            return res.status(500).json({ message: 'Unable to subscribe right now' });
        }
    }

    async analyzeQuizAnswers(answers) {
        const answerMap = answers.reduce((accumulator, item) => {
            accumulator[item.questionId] = item.answer;
            return accumulator;
        }, {});

        const roastPreference = String(answerMap.roast || '').toLowerCase();
        const flavorPreference = String(answerMap.flavor || '').toLowerCase();
        const products = await Product.find({ isFeatured: true }).sort({ displayOrder: 1 }).lean();
        const sourceProducts = products.length ? products : fallbackProducts;

        const matchedProduct = sourceProducts.find(product => {
            const roast = (product.roastLevel?.type || product.roastLevel || '').toLowerCase();
            const notes = (product.tastingNotes || []).map(note => String(note.name || note).toLowerCase());

            return (roastPreference && roast.includes(roastPreference))
                || (flavorPreference && notes.some(note => note.includes(flavorPreference)));
        }) || sourceProducts[0];

        if (!matchedProduct) {
            return null;
        }

        return {
            product: normalizeProduct(matchedProduct),
            discountCode: 'QUIZ20',
            discountAmount: 20,
        };
    }
}

module.exports = new HomepageController();
