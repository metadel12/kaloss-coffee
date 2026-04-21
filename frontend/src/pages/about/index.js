import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import { fetchAboutRegions, fetchImpact } from '../../utils/api';

const storyMilestones = [
    { year: '2010', title: 'Founded in Addis Ababa', text: 'Kaloss began with a simple belief: the birthplace of coffee should be represented with dignity, beauty, and fair value.' },
    { year: '2015', title: 'First export lots', text: 'Our first micro-lots from Yirgacheffe and Sidama reached international roasters with full farmer attribution.' },
    { year: '2020', title: 'Direct trade commitment', text: 'We formalized long-term sourcing relationships and premium payments tied to quality and sustainability goals.' },
    { year: '2024', title: 'Global cultural storytelling', text: 'Kaloss expanded into a fuller Ethiopian coffee experience that honors ceremony, craft, and origin.' },
];

const philosophyCards = [
    {
        title: 'Grade 1 Only',
        subtitle: 'Quality without compromise',
        text: 'We prioritize top-scoring Ethiopian lots with careful sorting, vibrant aromatics, and roast clarity that lets each origin speak.',
        image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
        title: 'Direct Trade',
        subtitle: 'Farm to cup without middlemen',
        text: 'We work closely with cooperatives and growers so more value remains in coffee communities across Ethiopia.',
        image: 'https://images.pexels.com/photos/7658099/pexels-photo-7658099.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
        title: 'Forest Stewardship',
        subtitle: 'Protecting origin ecosystems',
        text: 'Our sourcing model supports shade-grown coffee, reforestation, and long-term environmental resilience in the highlands.',
        image: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
];

const promises = [
    {
        title: '100% Traceable Beans',
        text: 'Every featured lot is tied back to a cooperative, a region, and a processing story that customers can understand.',
    },
    {
        title: 'Fresh Roasted in Ethiopia',
        text: 'We build our roasting schedule around freshness so floral and fruit-forward profiles stay expressive in the cup.',
    },
    {
        title: 'Heritage Packaging',
        text: 'Our bags and gift formats borrow from Ethiopian textile rhythm, ceremony colors, and artisan craft references.',
    },
    {
        title: 'Carbon-Conscious Shipping',
        text: 'Reforestation and packaging improvements are tied to every shipment as part of a broader sustainability roadmap.',
    },
];

function ImpactStat({ metric }) {
    const displayValue = useMemo(() => {
        if (metric.unit === '%') {
            return `${metric.value}%`;
        }

        if (metric.unit === '+') {
            return `${metric.value.toLocaleString()}+`;
        }

        return metric.value.toLocaleString();
    }, [metric]);

    return (
        <article className="about-stat-card">
            <strong>{displayValue}</strong>
            <span>{metric.metricName}</span>
        </article>
    );
}

export default function AboutPage() {
    const [impact, setImpact] = useState([]);
    const [regions, setRegions] = useState([]);
    const [activePromise, setActivePromise] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        Promise.all([fetchImpact(), fetchAboutRegions()])
            .then(([impactResponse, regionsResponse]) => {
                if (!mounted) {
                    return;
                }

                setImpact(impactResponse.data || []);
                setRegions(regionsResponse.data || []);
            })
            .catch(() => {
                if (!mounted) {
                    return;
                }

                setImpact([]);
                setRegions([]);
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <Layout title="About Kaloss Coffee">
            <section className="about-hero">
                <div className="about-hero-overlay" />
                <div className="about-hero-content">
                    <span className="about-eyebrow">The Birthplace of Coffee</span>
                    <h1>The Birthplace of Coffee</h1>
                    <p>For over 1,000 years, Ethiopia has shaped coffee culture. Kaloss carries that legacy with ceremony, direct trade, and single-origin clarity.</p>
                    <div className="about-hero-actions">
                        <Link href="/products">Shop Our Coffees</Link>
                        <Link href="/about/heritage">Explore Our Heritage</Link>
                    </div>
                    <div className="about-scroll-indicator">Scroll to discover</div>
                </div>
            </section>

            <section className="about-story-grid">
                <div className="about-story-copy">
                    <span className="section-kicker">Our Story</span>
                    <h2>From Kaffa forests to a modern Ethiopian coffee house</h2>
                    <p>It began in the forests of Kaffa, where stories of Kaldi and dancing goats still frame the mystery of coffee's origin. Kaloss was built to bring that origin story forward with honesty, beauty, and economic fairness.</p>
                    <p>We roast and present Ethiopian coffee as a living culture, not just a commodity. Every lot is chosen to reflect the place, people, and ritual behind the cup.</p>
                </div>
                <div className="about-story-timeline">
                    {storyMilestones.map(item => (
                        <article key={item.year} className="story-milestone">
                            <span>{item.year}</span>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-philosophy">
                <div className="section-heading">
                    <span className="section-kicker">The Kaloss Philosophy</span>
                    <h2>Built around quality, equity, and long-term stewardship</h2>
                </div>
                <div className="about-card-grid">
                    {philosophyCards.map(card => (
                        <article key={card.title} className="about-image-card">
                            <div className="about-image-card-media" style={{ backgroundImage: `url(${card.image})` }} />
                            <div className="about-image-card-body">
                                <span>{card.subtitle}</span>
                                <h3>{card.title}</h3>
                                <p>{card.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-impact">
                <div className="section-heading">
                    <span className="section-kicker">Impact By The Numbers</span>
                    <h2>Proof that coffee can be cultural and practical at the same time</h2>
                </div>
                {loading ? (
                    <div className="about-loading-grid">
                        {[1, 2, 3, 4, 5, 6].map(item => <div key={item} className="about-skeleton" />)}
                    </div>
                ) : (
                    <div className="about-stats-grid">
                        {impact.map(metric => <ImpactStat key={metric.metricName} metric={metric} />)}
                    </div>
                )}
            </section>

            <section className="about-regions">
                <div className="section-heading">
                    <span className="section-kicker">Our Regions</span>
                    <h2>Eight Ethiopian coffee landscapes, each with its own cup profile</h2>
                </div>
                <div className="about-region-grid">
                    {regions.map(region => (
                        <Link key={region.id} href={`/products?region=${encodeURIComponent(region.name)}`} className="about-region-card">
                            <div className="about-region-image" style={{ backgroundImage: `url(${region.image})` }} />
                            <div className="about-region-copy">
                                <h3>{region.name}</h3>
                                <p>{region.flavor}</p>
                                <span>{region.elevation}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="about-promise">
                <div className="section-heading">
                    <span className="section-kicker">Our Promise</span>
                    <h2>Traceability, freshness, and an origin-first presentation</h2>
                </div>
                <div className="about-accordion">
                    {promises.map((item, index) => (
                        <article key={item.title} className={`about-accordion-item ${activePromise === index ? 'active' : ''}`}>
                            <button type="button" onClick={() => setActivePromise(activePromise === index ? -1 : index)}>
                                <span>{item.title}</span>
                                <strong>{activePromise === index ? '-' : '+'}</strong>
                            </button>
                            {activePromise === index ? <p>{item.text}</p> : null}
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-cta-banner">
                <div>
                    <span className="section-kicker">Experience Ethiopia In Every Cup</span>
                    <h2>Step deeper into our heritage, farmers, process, and sustainability work.</h2>
                </div>
                <div className="about-hero-actions">
                    <Link href="/products">Shop Our Coffees</Link>
                    <Link href="/about/farmers">Meet Our Farmers</Link>
                </div>
            </section>
        </Layout>
    );
}
