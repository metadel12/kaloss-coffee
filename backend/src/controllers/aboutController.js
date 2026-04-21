const farmers = [
    {
        id: 'farmer-1',
        name: 'Almaz Bekele',
        region: 'Yirgacheffe',
        cooperative: 'Kochere Women Producers Union',
        farmSize: 2.4,
        yearsGrowing: 18,
        story: 'Almaz leads a women-led cooperative focused on careful cherry selection, clean washing, and youth mentorship in Kochere.',
        quote: 'Coffee is our family memory and our future income at the same time.',
        imageUrl: 'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
        galleryImages: [
            'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
            'https://images.pexels.com/photos/9213426/pexels-photo-9213426.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ],
        impactMetrics: { treesPlanted: 320, childrenInSchool: 4 },
        featured: true,
    },
    {
        id: 'farmer-2',
        name: 'Tesfaye Dadi',
        region: 'Guji',
        cooperative: 'Uraga Forest Growers',
        farmSize: 3.1,
        yearsGrowing: 22,
        story: 'Tesfaye manages forest-grown lots in Uraga and trains nearby growers on honey and natural processing methods.',
        quote: 'When the harvest is healthy, the whole village feels stronger.',
        imageUrl: 'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
        galleryImages: [
            'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200',
            'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ],
        impactMetrics: { treesPlanted: 410, childrenInSchool: 6 },
        featured: true,
    },
    {
        id: 'farmer-3',
        name: 'Marta Hailu',
        region: 'Sidama',
        cooperative: 'Bensa Highlands Co-op',
        farmSize: 1.8,
        yearsGrowing: 14,
        story: 'Marta coordinates harvest-day quality checks and leads pruning workshops for younger farmers in Bensa.',
        quote: 'Every ripe cherry we save becomes value that stays in our community.',
        imageUrl: 'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        galleryImages: [
            'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ],
        impactMetrics: { treesPlanted: 260, childrenInSchool: 3 },
        featured: false,
    },
    {
        id: 'farmer-4',
        name: 'Abebe Worku',
        region: 'Harrar',
        cooperative: 'Harar Longberry Collective',
        farmSize: 2.9,
        yearsGrowing: 26,
        story: 'Abebe preserves traditional natural processing and local ceremony culture while helping visitors understand Harrar coffee.',
        quote: 'Coffee is hospitality first, then business.',
        imageUrl: 'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        galleryImages: [
            'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ],
        impactMetrics: { treesPlanted: 180, childrenInSchool: 5 },
        featured: false,
    },
];

const pressMentions = [
    {
        id: 'press-1',
        title: 'Why Ethiopian Single-Origin Coffee Is Defining the New Luxury Cup',
        publication: 'Bon Appetit',
        publicationLogo: 'BON',
        date: '2026-02-15',
        excerpt: 'Kaloss Coffee is highlighted for direct trade sourcing, transparent pricing, and ceremonial storytelling.',
        url: 'https://example.com/bonappetit-kaloss',
        type: 'Magazine',
        featured: true,
        imageUrl: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
        id: 'press-2',
        title: 'Inside Ethiopia\'s Coffee Forest Revival',
        publication: 'BBC',
        publicationLogo: 'BBC',
        date: '2025-11-10',
        excerpt: 'A segment on reforestation and direct trade premiums paid through Kaloss partner cooperatives.',
        url: 'https://example.com/bbc-kaloss',
        type: 'TV',
        featured: true,
        imageUrl: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
        id: 'press-3',
        title: 'How Kaloss Built a Traceable Ethiopian Coffee Brand',
        publication: 'Sprudge',
        publicationLogo: 'SPR',
        date: '2026-01-08',
        excerpt: 'An interview on packaging, traceability, and farmer-first brand building.',
        url: 'https://example.com/sprudge-kaloss',
        type: 'Blog',
        featured: false,
        imageUrl: 'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
];

const awards = [
    { id: 'award-1', title: 'Best Ethiopian Coffee Brand', year: 2024, description: 'Recognized for quality, traceability, and storytelling.', imageUrl: 'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200', certificateUrl: '#', organization: 'SCA Expo' },
    { id: 'award-2', title: 'Direct Trade Innovation Award', year: 2023, description: 'Awarded for farmer payment transparency and premium sharing.', imageUrl: 'https://images.pexels.com/photos/2196577/pexels-photo-2196577.jpeg?auto=compress&cs=tinysrgb&w=1200', certificateUrl: '#', organization: 'African Coffee Summit' },
    { id: 'award-3', title: 'Sustainability Leadership Recognition', year: 2022, description: 'Honored for reforestation and women-led cooperative support.', imageUrl: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200', certificateUrl: '#', organization: 'Global Coffee Forum' },
];

const impact = [
    { metricName: 'Smallholder Farmers Partnered', value: 1200, target: 1500, unit: '+', year: 2026, updatedAt: '2026-04-17T00:00:00.000Z' },
    { metricName: 'Coffee-Growing Regions Sourced From', value: 8, target: 8, unit: '', year: 2026, updatedAt: '2026-04-17T00:00:00.000Z' },
    { metricName: 'Trees Planted', value: 50000, target: 100000, unit: '+', year: 2026, updatedAt: '2026-04-17T00:00:00.000Z' },
    { metricName: 'Direct Trade Premium Paid', value: 100, target: 100, unit: '%', year: 2026, updatedAt: '2026-04-17T00:00:00.000Z' },
    { metricName: 'Happy Customers Worldwide', value: 15000, target: 20000, unit: '+', year: 2026, updatedAt: '2026-04-17T00:00:00.000Z' },
    { metricName: 'Women-Led Cooperatives Supported', value: 25, target: 30, unit: '+', year: 2026, updatedAt: '2026-04-17T00:00:00.000Z' },
];

const regions = [
    { id: 'yirgacheffe', name: 'Yirgacheffe', flavor: 'Floral, citrus', elevation: '1,850 - 2,200 masl', image: 'https://images.pexels.com/photos/861090/pexels-photo-861090.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'sidama', name: 'Sidama', flavor: 'Berry, wine', elevation: '1,900 - 2,200 masl', image: 'https://images.pexels.com/photos/53399/coffee-beans-coffee-cup-cup-53399.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'guji', name: 'Guji', flavor: 'Jasmine, chocolate', elevation: '1,950 - 2,250 masl', image: 'https://images.pexels.com/photos/1933379/pexels-photo-1933379.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'limu', name: 'Limu', flavor: 'Spicy, herbal', elevation: '1,700 - 1,950 masl', image: 'https://images.pexels.com/photos/261434/pexels-photo-261434.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'harrar', name: 'Harrar', flavor: 'Blueberry, mocha', elevation: '1,500 - 2,100 masl', image: 'https://images.pexels.com/photos/796609/pexels-photo-796609.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'jimma', name: 'Jimma', flavor: 'Earthy, full body', elevation: '1,600 - 1,950 masl', image: 'https://images.pexels.com/photos/942796/pexels-photo-942796.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'lekempti', name: 'Lekempti', flavor: 'Fruity, complex', elevation: '1,700 - 2,100 masl', image: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { id: 'bench-maji', name: 'Bench Maji', flavor: 'Tropical, tea-like', elevation: '1,800 - 2,100 masl', image: 'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

exports.getFarmers = async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 4);
    const start = (page - 1) * limit;
    const paginated = farmers.slice(start, start + limit);
    res.json({
        farmers: paginated,
        pagination: {
            total: farmers.length,
            page,
            limit,
            totalPages: Math.ceil(farmers.length / limit),
        },
    });
};

exports.getFarmerById = async (req, res) => {
    const farmer = farmers.find(item => item.id === req.params.id);
    if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found' });
    }
    return res.json(farmer);
};

exports.getImpact = async (req, res) => res.json(impact);
exports.getPress = async (req, res) => res.json(pressMentions);
exports.getAwards = async (req, res) => res.json(awards);
exports.getRegions = async (req, res) => res.json(regions);
