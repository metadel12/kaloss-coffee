import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { fetchAwards, fetchPress } from '../../utils/api';

export default function PressPage() {
    const [press, setPress] = useState([]);
    const [awards, setAwards] = useState([]);

    useEffect(() => {
        Promise.all([fetchPress(), fetchAwards()])
            .then(([pressResponse, awardsResponse]) => {
                setPress(pressResponse.data || []);
                setAwards(awardsResponse.data || []);
            })
            .catch(() => {
                setPress([]);
                setAwards([]);
            });
    }, []);

    return (
        <Layout title="Kaloss Press">
            <section className="subpage-hero press-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Press And Awards</span>
                    <h1>Recognized worldwide</h1>
                    <p>Coverage and awards that reflect quality, cultural storytelling, and farmer-first sourcing.</p>
                </div>
            </section>

            <section className="press-awards">
                <div className="section-heading">
                    <span className="section-kicker">Awards</span>
                    <h2>Recognition earned through consistency and origin integrity</h2>
                </div>
                <div className="about-card-grid">
                    {awards.map(item => (
                        <article key={item.id} className="heritage-tradition-card">
                            <span>{item.year} | {item.organization}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="press-mentions">
                <div className="section-heading">
                    <span className="section-kicker">Press Mentions</span>
                    <h2>Stories that frame Kaloss within the wider coffee conversation</h2>
                </div>
                <div className="press-grid">
                    {press.map(item => (
                        <article key={item.id} className="press-card">
                            <div className="press-card-image" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                            <div className="press-card-body">
                                <span>{item.publication} | {item.type}</span>
                                <h3>{item.title}</h3>
                                <p>{item.excerpt}</p>
                                <small>{item.date}</small>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="media-kit-grid">
                <article className="heritage-equipment-card"><strong>Press Release PDF</strong><p>Company overview, sourcing philosophy, and founder story.</p></article>
                <article className="heritage-equipment-card"><strong>Logo Pack ZIP</strong><p>Primary marks, export variants, and social assets.</p></article>
                <article className="heritage-equipment-card"><strong>High-res Photo ZIP</strong><p>Ceremony, farms, products, and portrait photography for editorial use.</p></article>
                <article className="heritage-equipment-card"><strong>Brand Guidelines PDF</strong><p>Voice, color references, and cultural presentation notes.</p></article>
            </section>
        </Layout>
    );
}
