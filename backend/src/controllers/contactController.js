const Inquiry = require('../models/Inquiry');
const FAQ = require('../models/FAQ');
const ChatMessage = require('../models/ChatMessage');
const WholesaleInquiry = require('../models/WholesaleInquiry');
const FarmVisitRequest = require('../models/FarmVisitRequest');
const JobApplication = require('../models/JobApplication');
const CareerOpening = require('../models/CareerOpening');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const fallbackFaqs = [
    {
        id: 'faq-1',
        question: 'How long does shipping take within Ethiopia?',
        answer: 'Most Addis Ababa orders arrive within 2 to 3 business days, and regional deliveries usually arrive within 2 to 5 business days.',
        category: 'Orders',
        helpfulCount: 18,
        notHelpfulCount: 1,
        searchKeywords: ['shipping', 'delivery', 'ethiopia'],
        featured: true,
    },
    {
        id: 'faq-2',
        question: 'Do you ship internationally?',
        answer: 'Yes. We offer export-friendly shipping options for retail and wholesale customers outside Ethiopia.',
        category: 'Orders',
        helpfulCount: 12,
        notHelpfulCount: 0,
        searchKeywords: ['international', 'export', 'worldwide'],
        featured: true,
    },
    {
        id: 'faq-3',
        question: 'What is the difference between Grade 1 and Grade 2 coffee?',
        answer: 'Grade 1 lots have fewer defects and higher cup clarity, while Grade 2 lots still offer strong quality with a more accessible price point.',
        category: 'Products',
        helpfulCount: 24,
        notHelpfulCount: 2,
        searchKeywords: ['grade', 'grade 1', 'grade 2'],
        featured: true,
    },
    {
        id: 'faq-4',
        question: 'What is the best brew method for Ethiopian coffee?',
        answer: 'We love Jebena for ceremony, V60 for floral clarity, and French press for heavier fruit and body.',
        category: 'Products',
        helpfulCount: 15,
        notHelpfulCount: 1,
        searchKeywords: ['brew', 'v60', 'jebena', 'french press'],
        featured: false,
    },
    {
        id: 'faq-5',
        question: 'How can my cafe stock Kaloss Coffee?',
        answer: 'Use the wholesale inquiry form and our team will send a quote and sample guidance within 48 hours.',
        category: 'Wholesale',
        helpfulCount: 10,
        notHelpfulCount: 0,
        searchKeywords: ['cafe', 'wholesale', 'stock'],
        featured: false,
    },
    {
        id: 'faq-6',
        question: 'Do you host coffee ceremonies for events?',
        answer: 'Yes. We offer traditional ceremony experiences for private events, hospitality partners, and branded activations.',
        category: 'Ceremony',
        helpfulCount: 9,
        notHelpfulCount: 0,
        searchKeywords: ['event', 'ceremony', 'booking'],
        featured: false,
    },
];

const fallbackCareerOpenings = [
    {
        id: 'career-1',
        title: 'Barista',
        department: 'Retail Experience',
        location: 'Addis Ababa',
        type: 'Full-time',
        description: 'Lead guest service, brew consistency, and ceremony presentation in our flagship cafe.',
        requirements: ['1+ years specialty coffee experience', 'Strong hospitality skills', 'Weekend availability'],
        isActive: true,
        postedDate: '2026-04-01',
        closingDate: '2026-05-15',
    },
    {
        id: 'career-2',
        title: 'Roastery Assistant',
        department: 'Production',
        location: 'Addis Ababa',
        type: 'Full-time',
        description: 'Support production roasting, packaging, inventory checks, and QA preparation.',
        requirements: ['Detail-oriented workflow', 'Warehouse comfort', 'Coffee curiosity'],
        isActive: true,
        postedDate: '2026-04-05',
        closingDate: '2026-05-20',
    },
    {
        id: 'career-3',
        title: 'Marketing Coordinator',
        department: 'Brand',
        location: 'Addis Ababa',
        type: 'Full-time',
        description: 'Coordinate campaigns, content calendars, events, and partnership storytelling.',
        requirements: ['Content planning', 'Social media fluency', 'Campaign reporting'],
        isActive: true,
        postedDate: '2026-04-08',
        closingDate: '2026-05-25',
    },
];

const buildReference = prefix => `${prefix}-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;

const getRequestMeta = req => ({
    ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
    userAgent: req.headers['user-agent'] || '',
});

const ensureFaqSeed = async () => {
    const count = await FAQ.countDocuments();
    if (!count) {
        await FAQ.insertMany(fallbackFaqs, { ordered: false }).catch(() => null);
    }
};

const ensureCareerOpeningSeed = async () => {
    const count = await CareerOpening.countDocuments();
    if (!count) {
        await CareerOpening.insertMany(fallbackCareerOpenings, { ordered: false }).catch(() => null);
    }
};

exports.submitContactInquiry = async (req, res) => {
    try {
        const inquiryId = buildReference('KAL');
        const record = await Inquiry.create({
            inquiryId,
            fullName: req.body?.fullName,
            email: req.body?.email,
            phone: req.body?.phone,
            subject: req.body?.subject || 'General Inquiry',
            orderNumber: req.body?.orderNumber,
            message: req.body?.message,
            attachments: req.body?.attachments || [],
            preferredContact: req.body?.preferredContact || 'Email',
            bestTimeToContact: req.body?.bestTimeToContact || 'Any time',
            newsletterSignup: Boolean(req.body?.newsletterSignup),
            ...getRequestMeta(req),
        });

        if (record.newsletterSignup && record.email) {
            await NewsletterSubscriber.updateOne(
                { email: record.email },
                { $set: { email: record.email, source: 'contact' } },
                { upsert: true },
            );
        }

        return res.status(201).json({
            message: 'Inquiry received',
            inquiryId: record.inquiryId,
            estimatedResponse: 'within 24 hours',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save inquiry' });
    }
};

exports.getFaqs = async (req, res) => {
    try {
        await ensureFaqSeed();
        const { category, q } = req.query;
        const filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (q) {
            const regex = new RegExp(String(q), 'i');
            filter.$or = [{ question: regex }, { answer: regex }, { searchKeywords: regex }];
        }
        const faqs = await FAQ.find(filter).sort({ featured: -1, createdAt: 1 }).lean();
        return res.json(faqs.map(item => ({ id: item._id, ...item })));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch FAQs' });
    }
};

exports.markFaqHelpful = async (req, res) => {
    try {
        await ensureFaqSeed();
        const update = req.body?.helpful === false ? { $inc: { notHelpfulCount: 1 } } : { $inc: { helpfulCount: 1 } };
        const faq = await FAQ.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        return res.json({ id: faq._id, ...faq });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update FAQ vote' });
    }
};

exports.submitWholesaleInquiry = async (req, res) => {
    try {
        const inquiryId = buildReference('WHO');
        const inquiry = await WholesaleInquiry.create({
            inquiryId,
            businessName: req.body?.businessName,
            businessType: req.body?.businessType,
            contactName: req.body?.contactName,
            email: req.body?.email,
            phone: req.body?.phone,
            location: req.body?.location,
            monthlyQuantity: req.body?.monthlyQuantity,
            coffeeTypes: req.body?.coffeeTypes || [],
            roastPreference: req.body?.roastPreference,
            packagingPreference: req.body?.packagingPreference,
            currentSupplier: req.body?.currentSupplier,
            message: req.body?.message,
            sampleRequested: Boolean(req.body?.sampleRequested),
        });
        return res.status(201).json({ message: 'Wholesale inquiry received', inquiryId: inquiry.inquiryId, estimatedResponse: 'within 48 hours' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save wholesale inquiry' });
    }
};

exports.submitFarmVisit = async (req, res) => {
    try {
        const inquiryId = buildReference('VIS');
        const visit = await FarmVisitRequest.create({
            inquiryId,
            fullName: req.body?.fullName,
            email: req.body?.email,
            phone: req.body?.phone,
            country: req.body?.country,
            visitors: Number(req.body?.visitors || 1),
            preferredDates: req.body?.preferredDates,
            regionPreference: req.body?.regionPreference,
            purpose: req.body?.purpose,
            specialRequirements: req.body?.specialRequirements,
            budget: req.body?.budget,
        });
        return res.status(201).json({ message: 'Farm visit request received', inquiryId: visit.inquiryId, estimatedResponse: 'within 48 hours' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save farm visit request' });
    }
};

exports.getCareerOpenings = async (req, res) => {
    try {
        await ensureCareerOpeningSeed();
        const openings = await CareerOpening.find({ isActive: true }).sort({ createdAt: 1 }).lean();
        return res.json(openings.map(item => ({ id: item._id, ...item })));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch career openings' });
    }
};

exports.submitJobApplication = async (req, res) => {
    try {
        const applicationId = buildReference('JOB');
        const application = await JobApplication.create({
            applicationId,
            position: req.body?.position,
            fullName: req.body?.fullName,
            email: req.body?.email,
            phone: req.body?.phone,
            resumeUrl: req.body?.resumeUrl,
            coverLetter: req.body?.coverLetter,
            portfolioUrl: req.body?.portfolioUrl,
            linkedinUrl: req.body?.linkedinUrl,
            expectedSalary: req.body?.expectedSalary ? Number(req.body.expectedSalary) : undefined,
            startDate: req.body?.startDate,
            source: req.body?.source,
        });
        return res.status(201).json({ message: 'Application received', applicationId: application.applicationId, status: 'Received' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save job application' });
    }
};

exports.sendChatMessage = async (req, res) => {
    try {
        const sessionId = req.body?.sessionId || 'demo';
        await ChatMessage.create({
            sessionId,
            sender: 'user',
            message: req.body?.message || '',
            attachments: req.body?.attachments || [],
            isRead: true,
        });
        await ChatMessage.create({
            sessionId,
            sender: 'bot',
            message: 'Thanks for reaching out. Our team can usually reply within 2 hours on Telegram and within 24 hours by email.',
            isRead: true,
        });
        const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();
        return res.status(201).json({ sessionId, messages: messages.map(item => ({ id: item._id, ...item })) });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save chat message' });
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const sessionId = req.params.sessionId || 'demo';
        let messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();
        if (!messages.length && sessionId === 'demo') {
            const seeded = await ChatMessage.insertMany([
                {
                    sessionId: 'demo',
                    sender: 'bot',
                    message: 'Selam. I can help with shipping, products, wholesale, and ceremony bookings.',
                    isRead: true,
                },
            ]);
            messages = seeded.map(item => item.toObject());
        }
        return res.json(messages.map(item => ({ id: item._id, ...item })));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch chat messages' });
    }
};

exports.newsletterSubscribe = async (req, res) => {
    try {
        const payload = {
            email: req.body?.email,
            phoneNumber: req.body?.phone,
            source: 'contact',
        };
        const filter = payload.email ? { email: payload.email } : { phoneNumber: payload.phoneNumber };
        const subscriber = await NewsletterSubscriber.findOneAndUpdate(
            filter,
            { $set: payload },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        ).lean();
        return res.status(201).json({
            message: 'Subscribed successfully',
            subscriber: subscriber.email || subscriber.phoneNumber || 'guest',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to subscribe' });
    }
};
