const express = require('express');
const Hero = require('../models/Hero');
const Product = require('../models/Product');
const Review = require('../models/Review');

const router = express.Router();

const sampleProducts = [
    {
        name: 'Yirgacheffe Crown',
        title: 'Yirgacheffe Crown',
        slug: 'yirgacheffe-crown',
        description: 'Washed heirloom Arabica with jasmine aromatics, bergamot lift, and a honeyed black tea finish.',
        price: 980,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        countInStock: 18,
        grade: 'Grade 1',
        roastDate: '2026-04-10',
        inStock: true,
        origin: { region: 'Yirgacheffe', country: 'Ethiopia', altitude: '2,000-2,200 masl' },
        images: {
            hero: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        },
        pricing: { current: 980, original: 1140, currency: 'ETB' },
        roastLevel: { type: 'light', percentage: 34 },
        tastingNotes: [{ name: 'Jasmine' }, { name: 'Bergamot' }, { name: 'Black Tea' }],
        stats: { rating: 4.9, reviewCount: 128, soldCount: 3456, views: 64 },
        isFeatured: true,
        isLimited: true,
        displayOrder: 1,
    },
    {
        name: 'Sidama Ember',
        title: 'Sidama Ember',
        slug: 'sidama-ember',
        description: 'Rich Ethiopian roast with berry, chocolate, and smooth winey sweetness.',
        price: 1020,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
        countInStock: 14,
        grade: 'Grade 1',
        roastDate: '2026-04-12',
        inStock: true,
        origin: { region: 'Sidama', country: 'Ethiopia', altitude: '1,850-2,150 masl' },
        images: {
            hero: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
        },
        pricing: { current: 1020, original: 1180, currency: 'ETB' },
        roastLevel: { type: 'medium', percentage: 58 },
        tastingNotes: [{ name: 'Blueberry' }, { name: 'Cocoa' }, { name: 'Wine' }],
        stats: { rating: 4.8, reviewCount: 96, soldCount: 2412, views: 41 },
        isFeatured: true,
        isLimited: false,
        displayOrder: 2,
    },
    {
        name: 'Guji Canopy',
        title: 'Guji Canopy',
        slug: 'guji-canopy',
        description: 'Silky and fragrant with ripe peach sweetness and bright floral clarity.',
        price: 1090,
        image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
        countInStock: 11,
        grade: 'Grade 2',
        roastDate: '2026-04-14',
        inStock: true,
        origin: { region: 'Guji', country: 'Ethiopia', altitude: '1,900-2,250 masl' },
        images: {
            hero: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
        },
        pricing: { current: 1090, original: 1250, currency: 'ETB' },
        roastLevel: { type: 'medium-light', percentage: 46 },
        tastingNotes: [{ name: 'Peach' }, { name: 'Wildflower' }, { name: 'Orange Zest' }],
        stats: { rating: 4.8, reviewCount: 81, soldCount: 1934, views: 33 },
        isFeatured: true,
        isLimited: false,
        displayOrder: 3,
    },
    {
        name: 'Limu Morning',
        title: 'Limu Morning',
        slug: 'limu-morning',
        description: 'Balanced medium roast with caramel, apricot, and milk chocolate comfort.',
        price: 920,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
        countInStock: 16,
        grade: 'Grade 2',
        roastDate: '2026-04-08',
        inStock: true,
        origin: { region: 'Limu', country: 'Ethiopia', altitude: '1,650-1,950 masl' },
        images: {
            hero: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
        },
        pricing: { current: 920, original: 1050, currency: 'ETB' },
        roastLevel: { type: 'medium', percentage: 58 },
        tastingNotes: [{ name: 'Caramel' }, { name: 'Apricot' }, { name: 'Milk Chocolate' }],
        stats: { rating: 4.7, reviewCount: 88, soldCount: 2310, views: 176 },
        isFeatured: true,
        isLimited: false,
        displayOrder: 4,
    },
    {
        name: 'Harrar Moon',
        title: 'Harrar Moon',
        slug: 'harrar-moon',
        description: 'Dense, winey, fruit-forward roast with spice and a dark berry finish.',
        price: 1120,
        image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80',
        countInStock: 9,
        grade: 'Grade 1',
        roastDate: '2026-04-11',
        inStock: true,
        origin: { region: 'Harrar', country: 'Ethiopia', altitude: '1,500-2,100 masl' },
        images: {
            hero: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80',
        },
        pricing: { current: 1120, original: 1290, currency: 'ETB' },
        roastLevel: { type: 'medium-dark', percentage: 67 },
        tastingNotes: [{ name: 'Blueberry' }, { name: 'Cinnamon' }, { name: 'Dark Chocolate' }],
        stats: { rating: 4.9, reviewCount: 145, soldCount: 4108, views: 78 },
        isFeatured: true,
        isLimited: true,
        displayOrder: 5,
    },
];

const sampleHero = {
    title: {
        main: 'Kaloss Coffee',
        subtitle: 'የኢትዮጵያ እውነተኛ ጣዕም',
        brand: 'From Ethiopian Highlands to Your Cup',
    },
    video: {
        desktop: 'https://example.com/ethiopian-kaloss-desktop.mp4',
        mobile: 'https://example.com/ethiopian-kaloss-mobile.mp4',
        fallbackImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80',
    },
    ctaButtons: [
        { text: 'Explore Our Blends', link: '/products', type: 'primary' },
        { text: 'Experience Ceremony', link: '#ceremony', type: 'secondary' },
    ],
    isActive: true,
};

const sampleReviews = [
    { username: 'Mahi', rating: 5, comment: 'The Sidama roast feels like blueberry jam and cocoa. Absolutely beautiful after dinner.', location: 'Addis Ababa', language: 'en' },
    { username: 'ሰላም', rating: 5, comment: 'የይርጋጨፌው ሽታ እጅግ ይማርካል፣ በጀበና ሲፈላ ቤቱን ሙሉ ያሞላል።', location: 'Dire Dawa', language: 'am' },
    { username: 'Ruth G.', rating: 4, comment: 'Fast delivery to Bole and the recipe card for buna ceremony was a lovely touch.', location: 'Addis Ababa', language: 'en' },
    { username: 'ታምራት', rating: 5, comment: 'Guji Canopy በጣም ለስላሳ ነው፣ የአበባ ሽታውም ግሩም ነው።', location: 'Hawassa', language: 'am' },
    { username: 'Abel', rating: 5, comment: 'Feels premium without losing the Ethiopian identity.', location: 'Bahir Dar', language: 'en' },
    { username: 'Lulit', rating: 4, comment: 'I liked the Guji most. Fruity, clean, and still strong enough for family service.', location: 'Adama', language: 'en' },
];

router.get('/', async (req, res) => {
    try {
        await Promise.all([
            Hero.deleteMany({}),
            Product.deleteMany({}),
            Review.deleteMany({}),
        ]);

        const [hero, products, reviews] = await Promise.all([
            Hero.create(sampleHero),
            Product.insertMany(sampleProducts),
            Review.insertMany(sampleReviews),
        ]);

        res.json({ hero, products, reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
