const productStories = {
    'yirgacheffe-mist': {
        headline: 'Floral clarity with jasmine perfume and sparkling citrus.',
        atmosphere: 'A bright Yirgacheffe-style profile with a light, elegant finish.',
        badges: ['Yirgacheffe', 'Washed', 'Light Roast'],
        flavorWheel: { floral: 90, citrus: 82, stoneFruit: 42, cacao: 16, spice: 10, sweetness: 75 },
        farmerHighlights: ['High-tone aromatics', 'Great for filter brewing', 'Elegant and tea-like'],
    },
    'sidama-dawn': {
        headline: 'Berry sweetness and cocoa body for expressive daily cups.',
        atmosphere: 'A fuller Sidama profile that works beautifully for espresso and immersion.',
        badges: ['Sidama', 'Medium Roast', 'Berry Notes'],
        flavorWheel: { floral: 32, citrus: 38, stoneFruit: 60, cacao: 84, spice: 28, sweetness: 78 },
        farmerHighlights: ['Espresso-friendly', 'Sweet and syrupy', 'Great in milk drinks'],
    },
    'limu-eclipse': {
        headline: 'Balanced caramel sweetness with gentle fruit and clean finish.',
        atmosphere: 'An approachable Limu profile made for all-day brewing.',
        badges: ['Limu', 'Balanced', 'Daily Brew'],
        flavorWheel: { floral: 28, citrus: 49, stoneFruit: 52, cacao: 62, spice: 22, sweetness: 74 },
        farmerHighlights: ['Comforting sweetness', 'Great on batch brew', 'Approachable and balanced'],
    },
    'harrar-legacy': {
        headline: 'Big berry aromatics and dark chocolate depth in a bold roast.',
        atmosphere: 'A dramatic Harrar cup built for rich body and long finish.',
        badges: ['Harrar', 'Natural', 'Bold Finish'],
        flavorWheel: { floral: 18, citrus: 24, stoneFruit: 70, cacao: 82, spice: 69, sweetness: 60 },
        farmerHighlights: ['Long finish', 'Deep berry profile', 'Excellent in Jebena'],
    },
    'guji-horizon': {
        headline: 'Peach, honey, and floral lift from bright Guji lots.',
        atmosphere: 'A softer Guji profile with delicate aromatics and sweet finish.',
        badges: ['Guji', 'Light Roast', 'Tea-like'],
        flavorWheel: { floral: 70, citrus: 56, stoneFruit: 84, cacao: 16, spice: 12, sweetness: 81 },
        farmerHighlights: ['Elegant sweetness', 'Excellent for pour-over', 'High-elevation clarity'],
    },
    'djimmah-reserve': {
        headline: 'Full body, spice, and bittersweet depth for slow ritual brewing.',
        atmosphere: 'A deeper western Ethiopian roast suited to ceremony and rich daily cups.',
        badges: ['Jimma', 'Dark Roast', 'Full Body'],
        flavorWheel: { floral: 10, citrus: 14, stoneFruit: 22, cacao: 80, spice: 76, sweetness: 58 },
        farmerHighlights: ['Richer profile', 'Great for French press', 'Ceremony-friendly body'],
    },
    'yirgacheffe-g1-washed': {
        headline: 'Floral clarity with jasmine perfume and sparkling citrus.',
        atmosphere: 'Washed Kochere lots that feel delicate, bright, and refined from first aroma to final sip.',
        badges: ['Grade 1', 'Washed', 'Light Roast'],
        flavorWheel: { floral: 92, citrus: 88, stoneFruit: 46, cacao: 18, spice: 14, sweetness: 76 },
        farmerHighlights: [
            'Kochere smallholders',
            'Roasted to order within 24 hours',
            'Best for V60 and Jebena service',
        ],
    },
    'sidama-natural': {
        headline: 'Berry-rich sweetness with cocoa depth and espresso-friendly body.',
        atmosphere: 'Natural lots from Bensa that bring ripe fruit, syrupy texture, and café-ready structure.',
        badges: ['Best Seller', 'Natural', 'Espresso Favorite'],
        flavorWheel: { floral: 38, citrus: 44, stoneFruit: 71, cacao: 81, spice: 35, sweetness: 84 },
        farmerHighlights: [
            'Raised-bed natural process',
            'Excellent for espresso and French press',
            'Deep sweetness and syrupy finish',
        ],
    },
    'guji-g1': {
        headline: 'Peach, wildflower, and honey-like sweetness from misty Guji hills.',
        atmosphere: 'An elegant honey-process lot that stays expressive whether brewed hot or flash chilled.',
        badges: ['Limited Edition', 'Honey Process', 'Medium-Light Roast'],
        flavorWheel: { floral: 74, citrus: 58, stoneFruit: 86, cacao: 16, spice: 12, sweetness: 80 },
        farmerHighlights: [
            'Uraga highland selection',
            'Honey processed for layered sweetness',
            'Great for pour-over and Aeropress',
        ],
    },
    'harrar-longberry': {
        headline: 'Spiced fruit and dark chocolate with bold Harrar character.',
        atmosphere: 'An aromatic natural coffee that leans dramatic, textured, and memorable in traditional service.',
        badges: ['Natural', 'Longberry', 'Ceremony Favorite'],
        flavorWheel: { floral: 22, citrus: 28, stoneFruit: 64, cacao: 88, spice: 72, sweetness: 62 },
        farmerHighlights: [
            'Fruit-forward and spiced',
            'Ideal for Jebena and French press',
            'Big body with long finish',
        ],
    },
    'limu-g2': {
        headline: 'Balanced caramel sweetness with clean citrus lift.',
        atmosphere: 'Wet-processed Limu coffee designed for daily brewing, comfort, and versatile brewing methods.',
        badges: ['Washed', 'Balanced Cup', 'Daily Brew'],
        flavorWheel: { floral: 26, citrus: 49, stoneFruit: 54, cacao: 67, spice: 24, sweetness: 71 },
        farmerHighlights: [
            'Clean cup profile',
            'Reliable on batch brew and espresso',
            'Sweet and approachable',
        ],
    },
    'espresso-blend': {
        headline: 'Chocolate, toffee, and spice tuned for milk drinks and café service.',
        atmosphere: 'A Kaloss house blend designed to stay rich and sweet under pressure on busy bar programs.',
        badges: ['Dark Roast', 'House Espresso', 'Cafe Ready'],
        flavorWheel: { floral: 12, citrus: 18, stoneFruit: 20, cacao: 92, spice: 64, sweetness: 68 },
        farmerHighlights: [
            'Built for espresso bars',
            'Holds up in milk drinks',
            'Consistent and easy to dial in',
        ],
    },
    'jimma-heritage': {
        headline: 'Chocolate depth and warm spice from western Ethiopian highlands.',
        atmosphere: 'A fuller cup profile for batch brew, moka pot, and everyday espresso service.',
        badges: ['Jimma', 'Dark Roast', 'Cafe Favorite'],
        flavorWheel: { floral: 18, citrus: 24, stoneFruit: 28, cacao: 86, spice: 66, sweetness: 61 },
        farmerHighlights: ['Bulk-friendly profile', 'Balanced body and sweetness', 'Reliable all-day brew'],
    },
    'guji-forest-natural': {
        headline: 'Forest fruit, soft florals, and a juicy natural-process finish.',
        atmosphere: 'A vivid Guji profile with layered fruit and bright sweetness.',
        badges: ['Guji', 'Natural', 'Seasonal'],
        flavorWheel: { floral: 66, citrus: 54, stoneFruit: 82, cacao: 22, spice: 18, sweetness: 79 },
        farmerHighlights: ['High-elevation fruit clarity', 'Best for pour-over', 'Seasonal release'],
    },
    'sidama-espresso-reserve': {
        headline: 'Dense crema, cocoa sweetness, and berry lift for espresso bars.',
        atmosphere: 'Built for milk drinks and straight shots with balanced fruit and body.',
        badges: ['Sidama', 'Best Seller', 'Espresso'],
        flavorWheel: { floral: 24, citrus: 30, stoneFruit: 58, cacao: 84, spice: 31, sweetness: 72 },
        farmerHighlights: ['Designed for espresso', 'Great in cappuccino', 'Stable extraction profile'],
    },
    'limu-reserve-washed': {
        headline: 'Clean citrus and caramel sweetness with an easy-drinking finish.',
        atmosphere: 'A polished washed Limu lot ideal for batch brew and cafe drip.',
        badges: ['Limu', 'Washed', 'Balanced'],
        flavorWheel: { floral: 28, citrus: 61, stoneFruit: 45, cacao: 52, spice: 20, sweetness: 73 },
        farmerHighlights: ['Clean wet mill processing', 'Approachable daily profile', 'Comforting sweetness'],
    },
    'harrar-market-reserve': {
        headline: 'Wild berry aromatics with spice-market depth and long finish.',
        atmosphere: 'A theatrical Harrar roast for slow ritual brewing and rich cups.',
        badges: ['Harrar', 'Natural', 'Limited'],
        flavorWheel: { floral: 18, citrus: 22, stoneFruit: 68, cacao: 79, spice: 77, sweetness: 59 },
        farmerHighlights: ['Spiced and fruit-forward', 'Excellent for Jebena', 'Distinctive long finish'],
    },
    'yirgacheffe-sunset': {
        headline: 'Tea-like body, soft florals, and honeyed citrus in a clean light roast.',
        atmosphere: 'A gentle Yirgacheffe expression for delicate filter brews and elegant service.',
        badges: ['Yirgacheffe', 'Light Roast', 'Filter Favorite'],
        flavorWheel: { floral: 88, citrus: 76, stoneFruit: 36, cacao: 12, spice: 10, sweetness: 74 },
        farmerHighlights: ['High-tone aromatics', 'Great on V60', 'Floral and refined'],
    },
};

const roastMeterMap = {
    light: 28,
    'medium-light': 46,
    medium: 58,
    'medium-dark': 74,
    dark: 88,
};

const processColors = {
    Washed: '#d2c5af',
    Natural: '#8d4d3c',
    Honey: '#d2a446',
};

const reliableImageSets = {
    'yirgacheffe-mist': [
        'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'sidama-dawn': [
        'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'limu-eclipse': [
        'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'harrar-legacy': [
        'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'guji-horizon': [
        'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/669161/pexels-photo-669161.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'djimmah-reserve': [
        'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'yirgacheffe-g1-washed': [
        'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'sidama-natural': [
        'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'guji-g1': [
        'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/669161/pexels-photo-669161.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'harrar-longberry': [
        'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'limu-g2': [
        'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'espresso-blend': [
        'https://images.pexels.com/photos/10992757/pexels-photo-10992757.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/942801/pexels-photo-942801.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'jimma-heritage': [
        'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'guji-forest-natural': [
        'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/669161/pexels-photo-669161.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'sidama-espresso-reserve': [
        'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'limu-reserve-washed': [
        'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'harrar-market-reserve': [
        'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/52724/pexels-photo-52724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    'yirgacheffe-sunset': [
        'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
};

const slugify = value => String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const formatCurrency = amount => `ETB ${Number(amount || 0).toLocaleString()}`;

export const formatRoastLabel = roast => String(roast || 'medium')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');

export const normalizeReview = review => ({
    id: review.id || review._id || `${review.username}-${review.createdAt}`,
    username: review.username || 'Kaloss Guest',
    title: review.title || 'Fresh cup notes',
    rating: Number(review.rating || 0),
    comment: review.comment || '',
    images: review.images || [],
    verifiedPurchase: Boolean(review.verifiedPurchase),
    helpful: Number(review.helpful || 0),
    createdAt: review.createdAt || new Date().toISOString(),
});

export const enhanceProduct = rawProduct => {
    const baseSlug = rawProduct.slug || slugify(rawProduct.name || rawProduct.title);
    const story = productStories[baseSlug] || {};
    const reliableImages = reliableImageSets[baseSlug] || [];
    const roastType = rawProduct.roastLevel?.type || rawProduct.roastLevel || 'medium';
    const variants = Array.isArray(rawProduct.variants) && rawProduct.variants.length
        ? rawProduct.variants
        : [{ weight: '250g', priceETB: rawProduct.pricing?.current || rawProduct.price || 0, stock: rawProduct.countInStock || 0, sku: `${baseSlug}-250` }];
    const basePrice = variants[0]?.priceETB || rawProduct.pricing?.current || rawProduct.price || 0;
    const tastingNotes = Array.isArray(rawProduct.tastingNotes) ? rawProduct.tastingNotes : [];

    return {
        ...rawProduct,
        id: rawProduct.id || rawProduct._id || baseSlug,
        slug: baseSlug,
        name: rawProduct.name || rawProduct.title,
        title: rawProduct.title || rawProduct.name,
        headline: story.headline || rawProduct.description || 'Single-origin Ethiopian coffee for daily ritual and bold hospitality.',
        atmosphere: story.atmosphere || rawProduct.description || '',
        description: rawProduct.description || story.atmosphere || '',
        farmerStory: rawProduct.farmerStory || '',
        brewingGuide: rawProduct.brewingGuide || '',
        featured: Boolean(rawProduct.featured || rawProduct.isFeatured),
        bestSeller: Boolean(rawProduct.bestSeller),
        limitedEdition: Boolean(rawProduct.limitedEdition || rawProduct.isLimited),
        seasonal: Boolean(rawProduct.seasonal),
        region: rawProduct.region || rawProduct.origin?.region || 'Ethiopia',
        subRegion: rawProduct.subRegion || rawProduct.origin?.region || '',
        process: rawProduct.process || 'Washed',
        grade: rawProduct.grade || 'Grade 1',
        varietal: rawProduct.varietal || 'Heirloom',
        elevation: rawProduct.elevation || null,
        origin: {
            region: rawProduct.region || rawProduct.origin?.region || 'Ethiopia',
            country: rawProduct.origin?.country || 'Ethiopia',
            altitude: rawProduct.origin?.altitude || (rawProduct.elevation ? `${rawProduct.elevation} masl` : ''),
            coordinates: rawProduct.origin?.coordinates || { lat: 6.8, lng: 38.3 },
        },
        roastLevel: {
            type: roastType,
            percentage: rawProduct.roastLevel?.percentage || roastMeterMap[roastType] || 58,
            label: formatRoastLabel(roastType),
        },
        price: basePrice,
        pricing: {
            current: basePrice,
            original: rawProduct.pricing?.original || null,
            currency: 'ETB',
        },
        displayPrice: formatCurrency(basePrice),
        images: {
            hero: reliableImages[0] || rawProduct.images?.hero || rawProduct.imageUrl || rawProduct.image,
            thumbnail: reliableImages[1] || reliableImages[0] || rawProduct.images?.thumbnail || rawProduct.images?.hero || rawProduct.imageUrl || rawProduct.image,
            gallery: reliableImages.length
                ? reliableImages
                : (rawProduct.images?.gallery?.length
                    ? rawProduct.images.gallery
                    : [rawProduct.images?.hero || rawProduct.imageUrl || rawProduct.image].filter(Boolean)),
        },
        tastingNotes: tastingNotes.map(note => (typeof note === 'string' ? { name: note, intensity: 4, color: processColors[rawProduct.process || 'Washed'] || '#d2a446' } : note)),
        primaryNotes: tastingNotes.map(note => note.name || note).slice(0, 4),
        variants,
        reviewsList: (rawProduct.reviews || rawProduct.reviewsList || []).map(normalizeReview),
        rating: Number(rawProduct.stats?.rating || rawProduct.rating || 4.7),
        reviewCount: Number(rawProduct.stats?.reviewCount || rawProduct.reviewCount || rawProduct.reviews?.length || 0),
        countInStock: Number(rawProduct.inventory?.countInStock ?? rawProduct.countInStock ?? variants.reduce((sum, item) => sum + (item.stock || 0), 0)),
        inStock: Boolean(rawProduct.inventory?.inStock ?? rawProduct.inStock ?? variants.some(item => (item.stock || 0) > 0)),
        lowStock: Number(rawProduct.inventory?.countInStock ?? rawProduct.countInStock ?? 0) > 0
            && Number(rawProduct.inventory?.countInStock ?? rawProduct.countInStock ?? 0) <= 8,
        stockLabel: !Boolean(rawProduct.inventory?.inStock ?? rawProduct.inStock ?? variants.some(item => (item.stock || 0) > 0))
            ? 'Out of Stock'
            : (Number(rawProduct.inventory?.countInStock ?? rawProduct.countInStock ?? 0) <= 8 ? `Low Stock (${rawProduct.inventory?.countInStock ?? rawProduct.countInStock} left)` : 'In Stock'),
        badges: story.badges || [],
        flavorWheel: story.flavorWheel || { floral: 45, citrus: 52, stoneFruit: 48, cacao: 46, spice: 38, sweetness: 68 },
        farmerHighlights: story.farmerHighlights || [],
        processColor: processColors[rawProduct.process || 'Washed'] || '#d2a446',
    };
};

export const enhanceProductCollection = products => (products || []).map(enhanceProduct);

export const getProductBackdrop = product => ({
    background: `linear-gradient(145deg, rgba(24, 12, 7, 0.96) 0%, rgba(88, 53, 31, 0.9) 52%, ${product.processColor || '#d2a446'} 100%)`,
});
