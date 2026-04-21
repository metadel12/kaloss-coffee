const Product = require('../models/Product');
const Review = require('../models/Review');

const fallbackProducts = [
    {
        _id: 'fallback-yirgacheffe-g1-washed',
        name: 'Yirgacheffe G1 Washed',
        title: 'Yirgacheffe G1 Washed',
        slug: 'yirgacheffe-g1-washed',
        region: 'Yirgacheffe',
        subRegion: 'Kochere',
        elevation: 1950,
        process: 'Washed',
        grade: 'Grade 1',
        varietal: 'Heirloom',
        description: 'A floral and citrus-bright lot from Kochere with a tea-like finish and honeyed structure.',
        farmerStory: 'Sourced from smallholder producers around Kochere and curated for transparency, florality, and elegance.',
        brewingGuide: 'V60: 15g coffee, 240g water, 2:45. Jebena: medium-fine grind, slow simmer, serve in rounds.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
        images: {
            hero: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
            ],
        },
        origin: { region: 'Yirgacheffe', country: 'Ethiopia', altitude: '1,850 - 2,100 masl', coordinates: { lat: 6.14, lng: 38.2 } },
        pricing: { current: 450, original: 520, currency: 'ETB' },
        roastLevel: { type: 'light', percentage: 30 },
        tastingNotes: [{ name: 'Jasmine' }, { name: 'Bergamot' }, { name: 'Lemon' }, { name: 'Honey' }],
        variants: [
            { weight: '250g', priceETB: 450, stock: 24, sku: 'YIRG-250' },
            { weight: '500g', priceETB: 850, stock: 18, sku: 'YIRG-500' },
            { weight: '1kg', priceETB: 1600, stock: 9, sku: 'YIRG-1000' },
        ],
        stats: { rating: 4.8, reviewCount: 128, soldCount: 420, views: 1200 },
        countInStock: 51,
        inStock: true,
        isFeatured: true,
        bestSeller: true,
        displayOrder: 1,
        createdAt: '2026-04-01T00:00:00.000Z',
    },
    {
        _id: 'fallback-sidama-natural',
        name: 'Sidama Natural',
        title: 'Sidama Natural',
        slug: 'sidama-natural',
        region: 'Sidama',
        subRegion: 'Bensa',
        elevation: 2050,
        process: 'Natural',
        grade: 'Grade 1',
        varietal: 'Heirloom',
        description: 'Jammy berry sweetness, cocoa depth, and a creamy body built for espresso and immersion.',
        farmerStory: 'Produced by drying-bed specialists in Bensa where high elevations and patient drying create syrupy fruit notes.',
        brewingGuide: 'Espresso: 18g in, 38g out, 28 seconds. French Press: 30g coffee, 450g water, 4 minutes.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
        images: {
            hero: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80',
            ],
        },
        origin: { region: 'Sidama', country: 'Ethiopia', altitude: '1,900 - 2,200 masl', coordinates: { lat: 6.7, lng: 38.6 } },
        pricing: { current: 420, original: 490, currency: 'ETB' },
        roastLevel: { type: 'medium', percentage: 56 },
        tastingNotes: [{ name: 'Blueberry' }, { name: 'Wine' }, { name: 'Cocoa' }],
        variants: [
            { weight: '250g', priceETB: 420, stock: 32, sku: 'SIDA-250' },
            { weight: '500g', priceETB: 790, stock: 17, sku: 'SIDA-500' },
            { weight: '1kg', priceETB: 1500, stock: 8, sku: 'SIDA-1000' },
        ],
        stats: { rating: 4.7, reviewCount: 94, soldCount: 380, views: 980 },
        countInStock: 57,
        inStock: true,
        isFeatured: true,
        bestSeller: true,
        displayOrder: 2,
        createdAt: '2026-04-03T00:00:00.000Z',
    },
    {
        _id: 'fallback-guji-g1',
        name: 'Guji G1',
        title: 'Guji G1',
        slug: 'guji-g1',
        region: 'Guji',
        subRegion: 'Uraga',
        elevation: 2100,
        process: 'Honey',
        grade: 'Grade 1',
        varietal: 'Ethiopian Landrace',
        description: 'Peach, wildflower, and citrus sparkle from misty Guji forests and slow honey processing.',
        farmerStory: 'Picked in Uraga and dried with controlled mucilage to highlight sweetness without muting florals.',
        brewingGuide: 'V60: 16g coffee, 256g water, 3:00. Aeropress: 15g coffee, 210g water, 1:45.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80',
        images: {
            hero: 'https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=1200&q=80',
            ],
        },
        origin: { region: 'Guji', country: 'Ethiopia', altitude: '1,950 - 2,250 masl', coordinates: { lat: 5.9, lng: 39.0 } },
        pricing: { current: 480, original: 560, currency: 'ETB' },
        roastLevel: { type: 'medium-light', percentage: 44 },
        tastingNotes: [{ name: 'Peach' }, { name: 'Wildflower' }, { name: 'Orange' }],
        variants: [
            { weight: '250g', priceETB: 480, stock: 21, sku: 'GUJI-250' },
            { weight: '500g', priceETB: 900, stock: 12, sku: 'GUJI-500' },
            { weight: '1kg', priceETB: 1700, stock: 7, sku: 'GUJI-1000' },
        ],
        stats: { rating: 4.9, reviewCount: 76, soldCount: 250, views: 860 },
        countInStock: 40,
        inStock: true,
        isFeatured: true,
        limitedEdition: true,
        displayOrder: 3,
        createdAt: '2026-04-07T00:00:00.000Z',
    },
    {
        _id: 'fallback-harrar-longberry',
        name: 'Harrar Longberry',
        title: 'Harrar Longberry',
        slug: 'harrar-longberry',
        region: 'Harrar',
        subRegion: 'East Hararghe',
        elevation: 1800,
        process: 'Natural',
        grade: 'Grade 1',
        varietal: 'Longberry Heirloom',
        description: 'Spiced fruit, dark chocolate, and a bold aromatic profile inspired by Harrar market energy.',
        farmerStory: 'An expressive natural lot from eastern Ethiopia that layers fruit with dry spice and heavy body.',
        brewingGuide: 'Jebena: medium grind and low simmer. French Press: 32g coffee, 480g water, 4:15.',
        price: 400,
        image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80',
        images: {
            hero: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
            ],
        },
        origin: { region: 'Harrar', country: 'Ethiopia', altitude: '1,500 - 2,100 masl', coordinates: { lat: 9.3, lng: 42.1 } },
        pricing: { current: 400, original: 460, currency: 'ETB' },
        roastLevel: { type: 'medium-dark', percentage: 72 },
        tastingNotes: [{ name: 'Blueberry' }, { name: 'Spice' }, { name: 'Dark Chocolate' }],
        variants: [
            { weight: '250g', priceETB: 400, stock: 13, sku: 'HARR-250' },
            { weight: '500g', priceETB: 750, stock: 8, sku: 'HARR-500' },
            { weight: '1kg', priceETB: 1400, stock: 4, sku: 'HARR-1000' },
        ],
        stats: { rating: 4.6, reviewCount: 58, soldCount: 212, views: 700 },
        countInStock: 25,
        inStock: true,
        isFeatured: true,
        displayOrder: 4,
        createdAt: '2026-03-27T00:00:00.000Z',
    },
    {
        _id: 'fallback-limu-g2',
        name: 'Limu G2',
        title: 'Limu G2',
        slug: 'limu-g2',
        region: 'Limu',
        subRegion: 'Jimma Zone',
        elevation: 1850,
        process: 'Washed',
        grade: 'Grade 2',
        varietal: 'Heirloom',
        description: 'A balanced cup with caramel, apricot, and soft citrus from careful wet processing.',
        farmerStory: 'A cooperative selection from western Ethiopia focused on sweetness, cleanliness, and comfort.',
        brewingGuide: 'Batch brew: 60g coffee, 1L water, 4:45. Espresso: 18g in, 40g out, 30 seconds.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=1200&q=80',
        images: {
            hero: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1200&q=80',
            ],
        },
        origin: { region: 'Limu', country: 'Ethiopia', altitude: '1,700 - 1,950 masl', coordinates: { lat: 8.0, lng: 36.1 } },
        pricing: { current: 380, original: 430, currency: 'ETB' },
        roastLevel: { type: 'medium', percentage: 58 },
        tastingNotes: [{ name: 'Caramel' }, { name: 'Apricot' }, { name: 'Milk Chocolate' }],
        variants: [
            { weight: '250g', priceETB: 380, stock: 30, sku: 'LIMU-250' },
            { weight: '500g', priceETB: 720, stock: 16, sku: 'LIMU-500' },
            { weight: '1kg', priceETB: 1350, stock: 10, sku: 'LIMU-1000' },
        ],
        stats: { rating: 4.5, reviewCount: 44, soldCount: 165, views: 540 },
        countInStock: 56,
        inStock: true,
        isFeatured: true,
        displayOrder: 5,
        createdAt: '2026-03-18T00:00:00.000Z',
    },
    {
        _id: 'fallback-espresso-blend',
        name: 'Espresso Blend',
        title: 'Espresso Blend',
        slug: 'espresso-blend',
        region: 'Jimma',
        subRegion: 'Kaloss Roastery',
        elevation: 1750,
        process: 'Natural',
        grade: 'Grade 2',
        varietal: 'Heirloom Blend',
        description: 'Chocolate-forward espresso blend designed for cafes, milk drinks, and everyday service.',
        farmerStory: 'A house blend balancing body and sweetness for busy bars and home espresso setups.',
        brewingGuide: 'Espresso: 18g in, 36g out, 29 seconds. Moka pot: fine grind and medium heat.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=1200&q=80',
        images: {
            hero: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=1200&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=1200&q=80',
            gallery: [
                'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
            ],
        },
        origin: { region: 'Jimma', country: 'Ethiopia', altitude: '1,600 - 1,850 masl', coordinates: { lat: 7.67, lng: 36.83 } },
        pricing: { current: 350, original: 410, currency: 'ETB' },
        roastLevel: { type: 'dark', percentage: 84 },
        tastingNotes: [{ name: 'Chocolate' }, { name: 'Toffee' }, { name: 'Clove' }],
        variants: [
            { weight: '250g', priceETB: 350, stock: 22, sku: 'ESPR-250' },
            { weight: '500g', priceETB: 650, stock: 14, sku: 'ESPR-500' },
            { weight: '1kg', priceETB: 1200, stock: 7, sku: 'ESPR-1000' },
        ],
        stats: { rating: 4.6, reviewCount: 61, soldCount: 310, views: 620 },
        countInStock: 43,
        inStock: true,
        bestSeller: true,
        displayOrder: 6,
        createdAt: '2026-04-10T00:00:00.000Z',
    },
    {
        _id: 'fallback-jimma-heritage',
        name: 'Jimma Heritage',
        title: 'Jimma Heritage',
        slug: 'jimma-heritage',
        region: 'Jimma',
        subRegion: 'Agaro',
        elevation: 1820,
        process: 'Washed',
        grade: 'Grade 2',
        varietal: 'Heirloom',
        description: 'Chocolate-forward western Ethiopian coffee with soft spice and round sweetness.',
        farmerStory: 'A reliable Jimma selection built for everyday brewing and café batch programs.',
        brewingGuide: 'Drip: 62g/L for 4:30. Espresso: 18g in, 39g out.',
        price: 360,
        image: 'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200',
        images: {
            hero: 'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200',
            thumbnail: 'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
            gallery: [
                'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
            ],
        },
        origin: { region: 'Jimma', country: 'Ethiopia', altitude: '1,700 - 1,950 masl', coordinates: { lat: 7.7, lng: 36.8 } },
        pricing: { current: 360, original: 420, currency: 'ETB' },
        roastLevel: { type: 'medium', percentage: 60 },
        tastingNotes: [{ name: 'Chocolate' }, { name: 'Toffee' }, { name: 'Spice' }],
        variants: [
            { weight: '250g', priceETB: 360, stock: 20, sku: 'JIMM-250' },
            { weight: '500g', priceETB: 690, stock: 12, sku: 'JIMM-500' },
            { weight: '1kg', priceETB: 1280, stock: 6, sku: 'JIMM-1000' },
        ],
        stats: { rating: 4.5, reviewCount: 42, soldCount: 188, views: 510 },
        countInStock: 38,
        inStock: true,
        displayOrder: 7,
        createdAt: '2026-04-11T00:00:00.000Z',
    },
    {
        _id: 'fallback-guji-forest-natural',
        name: 'Guji Forest Natural',
        title: 'Guji Forest Natural',
        slug: 'guji-forest-natural',
        region: 'Guji',
        subRegion: 'Hambela',
        elevation: 2140,
        process: 'Natural',
        grade: 'Grade 1',
        varietal: 'Landrace',
        description: 'Juicy forest-fruit profile with bright sweetness and floral aromatics.',
        farmerStory: 'Natural-process Guji lots from Hambela selected for fruit clarity and vibrant cups.',
        brewingGuide: 'Pour-over: 15g/250g in 2:50. Aeropress: 14g/210g in 1:40.',
        price: 490,
        image: 'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
        images: {
            hero: 'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
            thumbnail: 'https://images.pexels.com/photos/669161/pexels-photo-669161.jpeg?auto=compress&cs=tinysrgb&w=1200',
            gallery: [
                'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/669161/pexels-photo-669161.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
            ],
        },
        origin: { region: 'Guji', country: 'Ethiopia', altitude: '2,000 - 2,250 masl', coordinates: { lat: 6.0, lng: 39.2 } },
        pricing: { current: 490, original: 560, currency: 'ETB' },
        roastLevel: { type: 'light', percentage: 34 },
        tastingNotes: [{ name: 'Berry' }, { name: 'Floral' }, { name: 'Honey' }],
        variants: [
            { weight: '250g', priceETB: 490, stock: 18, sku: 'GFOR-250' },
            { weight: '500g', priceETB: 920, stock: 10, sku: 'GFOR-500' },
            { weight: '1kg', priceETB: 1740, stock: 5, sku: 'GFOR-1000' },
        ],
        stats: { rating: 4.8, reviewCount: 52, soldCount: 176, views: 498 },
        countInStock: 33,
        inStock: true,
        seasonal: true,
        displayOrder: 8,
        createdAt: '2026-04-12T00:00:00.000Z',
    },
    {
        _id: 'fallback-sidama-espresso-reserve',
        name: 'Sidama Espresso Reserve',
        title: 'Sidama Espresso Reserve',
        slug: 'sidama-espresso-reserve',
        region: 'Sidama',
        subRegion: 'Aleta Wondo',
        elevation: 1980,
        process: 'Natural',
        grade: 'Grade 1',
        varietal: 'Heirloom',
        description: 'Berry-lifted espresso roast with dense body and sweet cocoa finish.',
        farmerStory: 'Built for espresso bars and home machines needing consistency and sweetness.',
        brewingGuide: 'Espresso: 18g in, 38g out, 29 seconds. Milk drinks: best for cappuccino and flat white.',
        price: 430,
        image: 'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
        images: {
            hero: 'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
            thumbnail: 'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
            gallery: [
                'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
            ],
        },
        origin: { region: 'Sidama', country: 'Ethiopia', altitude: '1,850 - 2,100 masl', coordinates: { lat: 6.6, lng: 38.5 } },
        pricing: { current: 430, original: 500, currency: 'ETB' },
        roastLevel: { type: 'medium-dark', percentage: 70 },
        tastingNotes: [{ name: 'Berry' }, { name: 'Cocoa' }, { name: 'Molasses' }],
        variants: [
            { weight: '250g', priceETB: 430, stock: 26, sku: 'SESP-250' },
            { weight: '500g', priceETB: 810, stock: 14, sku: 'SESP-500' },
            { weight: '1kg', priceETB: 1540, stock: 7, sku: 'SESP-1000' },
        ],
        stats: { rating: 4.7, reviewCount: 68, soldCount: 232, views: 610 },
        countInStock: 47,
        inStock: true,
        bestSeller: true,
        displayOrder: 9,
        createdAt: '2026-04-13T00:00:00.000Z',
    },
    {
        _id: 'fallback-limu-reserve-washed',
        name: 'Limu Reserve Washed',
        title: 'Limu Reserve Washed',
        slug: 'limu-reserve-washed',
        region: 'Limu',
        subRegion: 'Goma',
        elevation: 1885,
        process: 'Washed',
        grade: 'Grade 1',
        varietal: 'Heirloom',
        description: 'Clean washed Limu reserve with caramel sweetness and crisp citrus finish.',
        farmerStory: 'A sharper, cleaner Limu selection for filter and café drip service.',
        brewingGuide: 'Batch brew: 60g/L, 4:35. V60: 15g/250g, 2:50.',
        price: 395,
        image: 'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
        images: {
            hero: 'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
            thumbnail: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
            gallery: [
                'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
            ],
        },
        origin: { region: 'Limu', country: 'Ethiopia', altitude: '1,750 - 1,950 masl', coordinates: { lat: 8.2, lng: 36.0 } },
        pricing: { current: 395, original: 455, currency: 'ETB' },
        roastLevel: { type: 'medium-light', percentage: 48 },
        tastingNotes: [{ name: 'Caramel' }, { name: 'Citrus' }, { name: 'Apricot' }],
        variants: [
            { weight: '250g', priceETB: 395, stock: 22, sku: 'LRES-250' },
            { weight: '500g', priceETB: 745, stock: 13, sku: 'LRES-500' },
            { weight: '1kg', priceETB: 1390, stock: 6, sku: 'LRES-1000' },
        ],
        stats: { rating: 4.6, reviewCount: 47, soldCount: 164, views: 470 },
        countInStock: 41,
        inStock: true,
        displayOrder: 10,
        createdAt: '2026-04-14T00:00:00.000Z',
    },
    {
        _id: 'fallback-harrar-market-reserve',
        name: 'Harrar Market Reserve',
        title: 'Harrar Market Reserve',
        slug: 'harrar-market-reserve',
        region: 'Harrar',
        subRegion: 'Harar City',
        elevation: 1760,
        process: 'Natural',
        grade: 'Grade 1',
        varietal: 'Longberry',
        description: 'Spiced berry cup with deep body and lingering dark cocoa.',
        farmerStory: 'A bolder Harrar selection inspired by street coffee, spice markets, and ceremony service.',
        brewingGuide: 'Jebena and French press perform especially well with this roast.',
        price: 415,
        image: 'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        images: {
            hero: 'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
            thumbnail: 'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
            gallery: [
                'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
            ],
        },
        origin: { region: 'Harrar', country: 'Ethiopia', altitude: '1,600 - 2,000 masl', coordinates: { lat: 9.3, lng: 42.1 } },
        pricing: { current: 415, original: 475, currency: 'ETB' },
        roastLevel: { type: 'dark', percentage: 86 },
        tastingNotes: [{ name: 'Blueberry' }, { name: 'Spice' }, { name: 'Cacao' }],
        variants: [
            { weight: '250g', priceETB: 415, stock: 18, sku: 'HMAR-250' },
            { weight: '500g', priceETB: 775, stock: 11, sku: 'HMAR-500' },
            { weight: '1kg', priceETB: 1460, stock: 5, sku: 'HMAR-1000' },
        ],
        stats: { rating: 4.6, reviewCount: 51, soldCount: 171, views: 520 },
        countInStock: 34,
        inStock: true,
        limitedEdition: true,
        displayOrder: 11,
        createdAt: '2026-04-15T00:00:00.000Z',
    },
    {
        _id: 'fallback-yirgacheffe-sunset',
        name: 'Yirgacheffe Sunset',
        title: 'Yirgacheffe Sunset',
        slug: 'yirgacheffe-sunset',
        region: 'Yirgacheffe',
        subRegion: 'Gedeb',
        elevation: 2020,
        process: 'Washed',
        grade: 'Grade 1',
        varietal: 'Heirloom',
        description: 'A softer floral Yirgacheffe with honey sweetness and tea-like clarity.',
        farmerStory: 'Selected for calm, elegant filter brewing and refined café service.',
        brewingGuide: 'V60 and Kalita are ideal for this lighter profile.',
        price: 455,
        image: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
        images: {
            hero: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
            thumbnail: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
            gallery: [
                'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
                'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
            ],
        },
        origin: { region: 'Yirgacheffe', country: 'Ethiopia', altitude: '1,950 - 2,200 masl', coordinates: { lat: 6.1, lng: 38.3 } },
        pricing: { current: 455, original: 530, currency: 'ETB' },
        roastLevel: { type: 'light', percentage: 26 },
        tastingNotes: [{ name: 'Floral' }, { name: 'Honey' }, { name: 'Lemon' }],
        variants: [
            { weight: '250g', priceETB: 455, stock: 24, sku: 'YSUN-250' },
            { weight: '500g', priceETB: 860, stock: 15, sku: 'YSUN-500' },
            { weight: '1kg', priceETB: 1620, stock: 8, sku: 'YSUN-1000' },
        ],
        stats: { rating: 4.8, reviewCount: 72, soldCount: 219, views: 650 },
        countInStock: 47,
        inStock: true,
        displayOrder: 12,
        createdAt: '2026-04-16T00:00:00.000Z',
    },
];

const fallbackReviews = [
    { _id: 'review-1', product: 'fallback-yirgacheffe-g1-washed', username: 'Selam', rating: 5, title: 'Super clean cup', comment: 'Beautiful florals and a clean finish. Excellent for V60.', verifiedPurchase: true, helpful: 11, createdAt: '2026-04-12T00:00:00.000Z' },
    { _id: 'review-2', product: 'fallback-yirgacheffe-g1-washed', username: 'Abel', rating: 4, title: 'Bright and elegant', comment: 'The bergamot note is vivid and the honey sweetness rounds it out well.', verifiedPurchase: true, helpful: 8, createdAt: '2026-04-14T00:00:00.000Z' },
    { _id: 'review-3', product: 'fallback-sidama-natural', username: 'Martha', rating: 5, title: 'Great as espresso', comment: 'Berry and cocoa exactly as described. It holds up really well in milk.', verifiedPurchase: true, helpful: 7, createdAt: '2026-04-13T00:00:00.000Z' },
];

const legacyProductImageFallbacks = {
    yirgacheffe: [
        'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    sidama: [
        'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/53399/pexels-photo-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    guji: [
        'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/669161/pexels-photo-669161.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    limu: [
        'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    harrar: [
        'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    jimma: [
        'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    espresso: [
        'https://images.pexels.com/photos/10992757/pexels-photo-10992757.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/942801/pexels-photo-942801.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    default: [
        'https://images.pexels.com/photos/53399/pexels-photo-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
};

const getLegacyImageSet = (slug = '', region = '', image = '') => {
    const lookup = String(`${slug} ${region} ${image}`).toLowerCase();
    return Object.entries(legacyProductImageFallbacks).find(([key]) => key !== 'default' && lookup.includes(key))?.[1]
        || legacyProductImageFallbacks.default;
};

const resolveProductImage = (image, slug = '', region = '', index = 0) => {
    if (typeof image === 'string' && image.trim() && (/^https?:\/\//i.test(image) || image.startsWith('/images/'))) {
        return image;
    }

    return getLegacyImageSet(slug, region, image)[index] || getLegacyImageSet(slug, region, image)[0];
};

const getBasePrice = product => product.variants?.[0]?.priceETB || product.pricing?.current || product.price || 0;

const normalizeProduct = product => {
    if (!product) {
        return null;
    }

    const roastType = product.roastLevel?.type || product.roastLevel || 'medium';
    const region = product.region || product.origin?.region || 'Ethiopia';
    const altitude = product.origin?.altitude || (product.elevation ? `${product.elevation} masl` : '');
    const variants = Array.isArray(product.variants) && product.variants.length
        ? product.variants
        : [
            { weight: '250g', priceETB: getBasePrice(product), stock: product.countInStock ?? 0, sku: `${product.slug || 'coffee'}-250` },
        ];

    return {
        ...product,
        id: product._id?.toString?.() || product._id || product.slug,
        name: product.name || product.title,
        title: product.title || product.name,
        region,
        subRegion: product.subRegion || product.origin?.region || '',
        elevation: product.elevation || Number.parseInt(String(altitude), 10) || null,
        process: product.process || 'Washed',
        grade: product.grade || 'Grade 1',
        varietal: product.varietal || 'Heirloom',
        pricing: {
            current: getBasePrice(product),
            original: product.pricing?.original || null,
            currency: 'ETB',
        },
        images: {
            hero: resolveProductImage(product.images?.hero || product.imageUrl || product.image, product.slug, region, 0),
            thumbnail: resolveProductImage(product.images?.thumbnail || product.images?.hero || product.imageUrl || product.image, product.slug, region, 1),
            gallery: (product.images?.gallery?.length ? product.images.gallery : [product.images?.hero || product.imageUrl || product.image])
                .filter(Boolean)
                .map((image, index) => resolveProductImage(image, product.slug, region, index)),
        },
        roastLevel: {
            type: roastType,
            percentage: product.roastLevel?.percentage || 0,
        },
        tastingNotes: Array.isArray(product.tastingNotes)
            ? product.tastingNotes.map(note => typeof note === 'string' ? { name: note } : note)
            : [],
        stats: {
            rating: product.stats?.rating || 0,
            reviewCount: product.stats?.reviewCount || 0,
            soldCount: product.stats?.soldCount || 0,
            views: product.stats?.views || 0,
        },
        inventory: {
            countInStock: product.countInStock ?? variants.reduce((total, item) => total + (item.stock || 0), 0),
            inStock: product.inStock ?? variants.some(item => (item.stock || 0) > 0),
        },
        origin: {
            region,
            country: product.origin?.country || 'Ethiopia',
            altitude,
            coordinates: product.origin?.coordinates || { lat: 6.8, lng: 38.3 },
        },
        variants,
        featured: product.isFeatured ?? product.featured ?? false,
        bestSeller: product.bestSeller ?? false,
        limitedEdition: product.limitedEdition ?? product.isLimited ?? false,
        seasonal: product.seasonal ?? false,
        farmerStory: product.farmerStory || product.description || '',
        brewingGuide: product.brewingGuide || '',
    };
};

const buildQuery = filters => {
    const query = {};

    if (filters.region) {
        query.$or = [
            { region: new RegExp(String(filters.region), 'i') },
            { 'origin.region': new RegExp(String(filters.region), 'i') },
        ];
    }

    if (filters.roastLevel) {
        query['roastLevel.type'] = filters.roastLevel;
    }

    if (filters.process) {
        query.process = filters.process;
    }

    if (filters.grade) {
        query.grade = filters.grade;
    }

    if (filters.featured === 'true') {
        query.isFeatured = true;
    }

    if (filters.limited === 'true') {
        query.$or = [...(query.$or || []), { limitedEdition: true }, { isLimited: true }];
    }

    return query;
};

const applyFallbackFilters = (products, filters) => {
    let result = [...products];

    if (filters.region) {
        result = result.filter(product => String(product.region).toLowerCase() === String(filters.region).toLowerCase());
    }

    if (filters.roastLevel) {
        result = result.filter(product => product.roastLevel?.type === filters.roastLevel);
    }

    if (filters.process) {
        result = result.filter(product => product.process === filters.process);
    }

    if (filters.grade) {
        result = result.filter(product => product.grade === filters.grade);
    }

    if (filters.priceMin) {
        result = result.filter(product => getBasePrice(product) >= Number(filters.priceMin));
    }

    if (filters.priceMax) {
        result = result.filter(product => getBasePrice(product) <= Number(filters.priceMax));
    }

    return result;
};

const sortProducts = (products, sortBy) => {
    const sorted = [...products];

    if (sortBy === 'price-asc') sorted.sort((a, b) => getBasePrice(a) - getBasePrice(b));
    else if (sortBy === 'price-desc') sorted.sort((a, b) => getBasePrice(b) - getBasePrice(a));
    else if (sortBy === 'rating' || sortBy === 'highest-rated') sorted.sort((a, b) => (b.stats?.rating || 0) - (a.stats?.rating || 0));
    else if (sortBy === 'best-seller') sorted.sort((a, b) => (b.stats?.soldCount || 0) - (a.stats?.soldCount || 0));
    else if (sortBy === 'latest' || sortBy === 'newest') sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else sorted.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return sorted;
};

exports.getProducts = async (req, res) => {
    try {
        const {
            region,
            roastLevel,
            process,
            grade,
            featured,
            limited,
            priceMin,
            priceMax,
            sortBy = 'featured',
            page = 1,
            limit = 9,
        } = req.query;

        const filters = { region, roastLevel, process, grade, featured, limited, priceMin, priceMax };
        const query = buildQuery(filters);
        const isAdmin = Boolean(req.user && ['admin', 'super_admin'].includes(req.user.role));
        if (!isAdmin) {
            query.status = 'approved';
        }
        let products = await Product.find(query).lean();
        const fallbackMatches = applyFallbackFilters(fallbackProducts, filters);

        if (!products.length) {
            products = fallbackMatches;
        } else {
            products = products.filter(product => {
                const basePrice = getBasePrice(product);
                if (priceMin && basePrice < Number(priceMin)) return false;
                if (priceMax && basePrice > Number(priceMax)) return false;
                return true;
            });

            const existingSlugs = new Set(products.map(product => product.slug));
            products = [...products, ...fallbackMatches.filter(product => !existingSlugs.has(product.slug))];
        }

        const normalized = sortProducts(products.map(normalizeProduct), sortBy);
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const total = normalized.length;
        const paginated = normalized.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

        res.json({
            products: paginated,
            pagination: {
                total,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.max(1, Math.ceil(total / pageSize)),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

exports.getRegions = async (req, res) => {
    try {
        const dbRegions = await Product.distinct('region');
        const regions = Array.from(new Set([
            ...dbRegions.filter(Boolean),
            ...fallbackProducts.map(product => product.region),
        ]));
        res.json(regions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch regions' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        let product = await Product.findOne(query).lean();
        const isAdmin = Boolean(req.user && ['admin', 'super_admin'].includes(req.user.role));

        if (!product) {
            product = fallbackProducts.find(item => item.slug === id || item._id === id);
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (!isAdmin && product.status && product.status !== 'approved') {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product._id?.toString?.()?.match?.(/^[0-9a-fA-F]{24}$/)) {
            await Product.updateOne({ _id: product._id }, { $inc: { 'stats.views': 1 } });
        }

        const normalizedProduct = normalizeProduct(product);
        const reviewQuery = product._id?.toString?.()?.match?.(/^[0-9a-fA-F]{24}$/)
            ? { $or: [{ product: product._id }, { productSlug: normalizedProduct.slug }] }
            : { productSlug: normalizedProduct.slug };
        const reviews = await Review.find(reviewQuery).sort({ createdAt: -1 }).lean();
        const hasMongoId = Boolean(product._id?.toString?.()?.match?.(/^[0-9a-fA-F]{24}$/));
        const relatedSource = hasMongoId
            ? await Product.find({
                _id: { $ne: product._id },
                $or: [{ region: normalizedProduct.region }, { 'origin.region': normalizedProduct.region }, { 'roastLevel.type': normalizedProduct.roastLevel.type }],
            }).sort({ 'stats.rating': -1, displayOrder: 1 }).limit(4).lean()
            : [];

        const relatedProducts = (relatedSource.length
            ? relatedSource
            : fallbackProducts.filter(item => item.slug !== normalizedProduct.slug && (item.region === normalizedProduct.region || item.roastLevel.type === normalizedProduct.roastLevel.type)).slice(0, 4)
        ).map(normalizeProduct);

        return res.json({
            product: normalizedProduct,
            relatedProducts,
            reviews: (reviews.length ? reviews : fallbackReviews.filter(item => item.product === product._id || item.product === normalizedProduct.id)).map(review => ({
                id: review._id?.toString?.() || review._id,
                username: review.username || 'Kaloss Guest',
                title: review.title || 'Fresh cup notes',
                rating: review.rating,
                comment: review.comment,
                images: review.images || [],
                verifiedPurchase: review.verifiedPurchase || false,
                helpful: review.helpful || 0,
                createdAt: review.createdAt || new Date().toISOString(),
            })),
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch product' });
    }
};

exports.getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
        let product = await Product.findOne(query).lean();
        const isAdmin = Boolean(req.user && ['admin', 'super_admin'].includes(req.user.role));

        if (!product) {
            product = fallbackProducts.find(item => item.slug === id || item._id === id);
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (!isAdmin && product.status && product.status !== 'approved') {
            return res.status(404).json({ message: 'Product not found' });
        }

        const normalizedProduct = normalizeProduct(product);
        const related = fallbackProducts
            .filter(item => item.slug !== normalizedProduct.slug && (item.region === normalizedProduct.region || item.roastLevel.type === normalizedProduct.roastLevel.type))
            .slice(0, 4)
            .map(normalizeProduct);

        return res.json(related);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch related products' });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const clauses = [{ productSlug: productId }];
        if (productId.match(/^[0-9a-fA-F]{24}$/)) {
            clauses.unshift({ product: productId });
        }
        const reviews = await Review.find({ $or: clauses }).sort({ createdAt: -1 }).lean();
        res.json((reviews.length ? reviews : fallbackReviews.filter(review => review.product === productId)).map(review => ({
            id: review._id?.toString?.() || review._id,
            username: review.username || 'Kaloss Guest',
            title: review.title || 'Fresh cup notes',
            rating: review.rating,
            comment: review.comment,
            images: review.images || [],
            verifiedPurchase: review.verifiedPurchase || false,
            helpful: review.helpful || 0,
            createdAt: review.createdAt || new Date().toISOString(),
        })));
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { username, rating, title, comment, images = [] } = req.body;

        if (!username || !rating || !comment) {
            return res.status(400).json({ message: 'Username, rating, and comment are required' });
        }

        const review = await Review.create({
            product: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : undefined,
            productSlug: productId.match(/^[0-9a-fA-F]{24}$/) ? undefined : productId,
            username,
            rating: Number(rating),
            title,
            comment,
            images,
            verifiedPurchase: true,
        });

        return res.status(201).json(review);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create review' });
    }
};

exports.trackProductView = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { $inc: { 'stats.views': 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Unable to track product view' });
    }
};

exports.createProduct = async (req, res) => {
    const { title, description, price, image, countInStock } = req.body;
    const product = await Product.create({ title, description, price, image, countInStock });
    res.status(201).json(normalizeProduct(product.toObject()));
};
