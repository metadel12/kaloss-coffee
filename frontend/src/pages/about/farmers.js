import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { fetchFarmers } from '../../utils/api';

const programs = [
    { title: 'Education', metric: '420 growers trained', text: 'Seasonal workshops on pruning, picking, and cup quality.' },
    { title: 'Healthcare', metric: '2,000+ visits', text: 'Mobile clinics supporting remote producer communities.' },
    { title: 'Women in Coffee', metric: '25 co-ops supported', text: 'Leadership and market access for women-led groups.' },
    { title: 'Youth Program', metric: '180 young growers mentored', text: 'Next-generation training across major coffee zones.' },
];

export default function FarmersPage() {
    const [farmers, setFarmers] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        fetchFarmers({ page, limit: 4 })
            .then(response => {
                if (!mounted) {
                    return;
                }

                setFarmers(response.data.farmers || []);
                setPagination(response.data.pagination || { totalPages: 1 });
            })
            .catch(() => {
                if (!mounted) {
                    return;
                }

                setFarmers([]);
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [page]);

    return (
        <Layout title="Kaloss Farmers">
            <section className="subpage-hero farmers-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Our Farmers</span>
                    <h1>Meet the hands behind your cup</h1>
                    <p>Each harvest carries the judgment, patience, and pride of farmers who know their trees by season, slope, and soil.</p>
                </div>
            </section>

            <section className="farmers-feature">
                <div className="section-heading">
                    <span className="section-kicker">Featured Farmers</span>
                    <h2>Stories from the cooperatives that shape our coffee</h2>
                </div>
                {loading ? (
                    <div className="about-loading-grid">
                        {[1, 2, 3, 4].map(item => <div key={item} className="about-skeleton" />)}
                    </div>
                ) : (
                    <div className="farmers-grid">
                        {farmers.map(farmer => (
                            <article key={farmer.id} className="farmer-card">
                                <div className="farmer-card-image" style={{ backgroundImage: `url(${farmer.imageUrl})` }} />
                                <div className="farmer-card-body">
                                    <span>{farmer.region} | {farmer.cooperative}</span>
                                    <h3>{farmer.name}</h3>
                                    <p>{farmer.quote}</p>
                                    <ul>
                                        <li>{farmer.farmSize} hectares</li>
                                        <li>{farmer.yearsGrowing} years growing coffee</li>
                                        <li>{farmer.impactMetrics.treesPlanted} trees planted</li>
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                <div className="pagination-row">
                    <button type="button" disabled={page <= 1} onClick={() => setPage(previous => previous - 1)}>Previous</button>
                    <span>Page {page} of {pagination.totalPages || 1}</span>
                    <button type="button" disabled={page >= (pagination.totalPages || 1)} onClick={() => setPage(previous => previous + 1)}>Load More Farmers</button>
                </div>
            </section>

            <section className="farmers-trade-model">
                <div className="section-heading">
                    <span className="section-kicker">Direct Trade Model</span>
                    <h2>Shorter chain, clearer value, stronger producer economics</h2>
                </div>
                <div className="trade-model-grid">
                    <article>
                        <h3>Traditional chain</h3>
                        <p>Grower to collector to trader to exporter to importer to roaster</p>
                    </article>
                    <article>
                        <h3>Kaloss chain</h3>
                        <p>Grower or co-op to Kaloss quality team to customer</p>
                    </article>
                    <article>
                        <h3>Why it matters</h3>
                        <p>Higher transparency, steadier premiums, and more room to invest in quality at the farm level.</p>
                    </article>
                </div>
            </section>

            <section className="farmers-programs">
                <div className="section-heading">
                    <span className="section-kicker">Empowerment Programs</span>
                    <h2>Support that goes beyond the harvest window</h2>
                </div>
                <div className="about-card-grid">
                    {programs.map(program => (
                        <article key={program.title} className="impact-program-card">
                            <span>{program.metric}</span>
                            <h3>{program.title}</h3>
                            <p>{program.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-cta-banner">
                <div>
                    <span className="section-kicker">Support Direct Trade</span>
                    <h2>Choose coffees that keep value closer to origin.</h2>
                </div>
                <div className="about-hero-actions">
                    <Link href="/products">Shop Coffee</Link>
                    <Link href="/about/sustainability">See Our Impact</Link>
                </div>
            </section>
        </Layout>
    );
}
