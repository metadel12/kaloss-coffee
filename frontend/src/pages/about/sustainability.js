import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { fetchImpact } from '../../utils/api';

const goals = [
    { label: 'Plastic-free packaging', progress: 85 },
    { label: 'Carbon negative operations', progress: 40 },
    { label: '100,000 trees planted', progress: 50 },
    { label: '50% women in leadership', progress: 65 },
];

const certifications = [
    'Organic Certified',
    'Fair Trade International',
    'Rainforest Alliance',
    'SCA Premium Member',
    'Best Ethiopian Coffee 2023',
    'Direct Trade Verified',
];

export default function SustainabilityPage() {
    const [impact, setImpact] = useState([]);

    useEffect(() => {
        fetchImpact()
            .then(response => {
                setImpact(response.data || []);
            })
            .catch(() => {
                setImpact([]);
            });
    }, []);

    return (
        <Layout title="Kaloss Sustainability">
            <section className="subpage-hero sustainability-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Sustainability</span>
                    <h1>Brewing a better future</h1>
                    <p>Our impact work ties together forests, producer incomes, women-led leadership, and practical reforestation goals.</p>
                </div>
            </section>

            <section className="sustainability-grid">
                <article className="impact-program-card">
                    <span>50,000 trees planted</span>
                    <h3>Reforestation in coffee zones</h3>
                    <p>Tree planting supports soil stability, biodiversity, and long-term shade conditions in origin communities.</p>
                </article>
                <article className="impact-program-card">
                    <span>80% water recycled</span>
                    <h3>Water conservation</h3>
                    <p>Wet-mill improvements reduce waste while maintaining washed-coffee quality standards.</p>
                </article>
                <article className="impact-program-card">
                    <span>40% women farmers</span>
                    <h3>Women's coffee initiative</h3>
                    <p>Leadership pathways and premium access remain central to our sourcing partnerships.</p>
                </article>
            </section>

            <section className="about-impact">
                <div className="section-heading">
                    <span className="section-kicker">Economic Impact</span>
                    <h2>Metrics tied to real producer outcomes</h2>
                </div>
                <div className="about-stats-grid">
                    {impact.slice(0, 4).map(metric => (
                        <article key={metric.metricName} className="about-stat-card">
                            <strong>{metric.value.toLocaleString()}{metric.unit || ''}</strong>
                            <span>{metric.metricName}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className="sustainability-goals">
                <div className="section-heading">
                    <span className="section-kicker">2030 Goals</span>
                    <h2>Targets that keep us accountable</h2>
                </div>
                <div className="goal-list">
                    {goals.map(goal => (
                        <article key={goal.label} className="goal-item">
                            <div className="goal-copy">
                                <strong>{goal.label}</strong>
                                <span>{goal.progress}% achieved</span>
                            </div>
                            <div className="goal-bar">
                                <div style={{ width: `${goal.progress}%` }} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="sustainability-certifications">
                <div className="section-heading">
                    <span className="section-kicker">Certifications And Awards</span>
                    <h2>External signals that support our standards</h2>
                </div>
                <div className="heritage-equipment-grid">
                    {certifications.map(item => (
                        <article key={item} className="heritage-equipment-card">
                            <strong>{item}</strong>
                            <p>Recognition connected to sourcing discipline, environmental stewardship, and product quality.</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-cta-banner">
                <div>
                    <span className="section-kicker">Get Involved</span>
                    <h2>Every bag can fund trees, transparency, and stronger coffee communities.</h2>
                </div>
                <div className="about-hero-actions">
                    <Link href="/products">Buy Coffee</Link>
                    <Link href="/about/press">Read The Press Story</Link>
                </div>
            </section>
        </Layout>
    );
}
