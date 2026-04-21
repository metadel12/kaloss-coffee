import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../components/Layout';

const timeline = [
    {
        title: 'Handpicking',
        label: 'Gala',
        text: 'Only ripe red cherries are selected, often across several passes through the same trees.',
    },
    {
        title: 'Sorting and floating',
        label: 'Tefaye',
        text: 'Density checks separate stronger candidates for specialty preparation from lower-value material.',
    },
    {
        title: 'Processing',
        label: 'Washed, natural, honey',
        text: 'Each process changes the cup, from floral clarity to berried sweetness to syrupy body.',
    },
    {
        title: 'Milling and grading',
        label: 'Wash',
        text: 'Beans are dried, hulled, and sorted by size and density to preserve consistency lot by lot.',
    },
    {
        title: 'Roasting and export',
        label: 'Qolo',
        text: 'Roast curves are matched to origin so Yirgacheffe stays lifted while Guji keeps its chocolate depth.',
    },
    {
        title: 'Cupping and quality control',
        label: 'Q-grader review',
        text: 'Lots are cupped multiple times before release to keep defects low and clarity high.',
    },
    {
        title: 'Packaging and shipping',
        label: 'Final journey',
        text: 'Traditional pattern cues meet modern freshness protection and traceability notes.',
    },
];

const processModes = {
    washed: {
        title: 'Washed',
        text: 'Expect cleaner florals, citrus brightness, and precise acidity often associated with Yirgacheffe and some Sidama lots.',
    },
    natural: {
        title: 'Natural',
        text: 'Fruit-dried coffees bring heavier berry sweetness, layered aromatics, and more ferment complexity.',
    },
    honey: {
        title: 'Honey',
        text: 'A middle path that keeps some mucilage on the bean for rounded sweetness and a polished texture.',
    },
};

export default function ProcessPage() {
    const [mode, setMode] = useState('washed');

    return (
        <Layout title="Kaloss Process">
            <section className="subpage-hero process-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Our Process</span>
                    <h1>From cherry to cup, the Kaloss way</h1>
                    <p>We design the process around flavor clarity, respectful sourcing, and the discipline Ethiopian coffee deserves.</p>
                </div>
            </section>

            <section className="process-timeline">
                <div className="section-heading">
                    <span className="section-kicker">Step By Step</span>
                    <h2>A vertical journey from harvest to final bag</h2>
                </div>
                <div className="process-timeline-list">
                    {timeline.map((step, index) => (
                        <article key={step.title} className="process-step-card">
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <div>
                                <strong>{step.label}</strong>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="process-mode-section">
                <div className="section-heading">
                    <span className="section-kicker">Processing Methods</span>
                    <h2>How process shifts the cup profile</h2>
                </div>
                <div className="process-mode-tabs">
                    {Object.keys(processModes).map(key => (
                        <button key={key} type="button" className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>
                            {processModes[key].title}
                        </button>
                    ))}
                </div>
                <article className="process-mode-panel">
                    <h3>{processModes[mode].title}</h3>
                    <p>{processModes[mode].text}</p>
                </article>
            </section>

            <section className="process-dashboard">
                <div className="section-heading">
                    <span className="section-kicker">Transparency Dashboard</span>
                    <h2>Operational numbers we want customers to understand</h2>
                </div>
                <div className="about-stats-grid">
                    <article className="about-stat-card"><strong>2 hours ago</strong><span>Last roast completed</span></article>
                    <article className="about-stat-card"><strong>12,450 kg</strong><span>Current green inventory</span></article>
                    <article className="about-stat-card"><strong>1.2M ETB</strong><span>Farmers paid this month</span></article>
                    <article className="about-stat-card"><strong>45 tons</strong><span>Carbon offset this year</span></article>
                </div>
            </section>

            <section className="about-cta-banner">
                <div>
                    <span className="section-kicker">See The Results</span>
                    <h2>Our process is built to protect flavor, people, and origin story all at once.</h2>
                </div>
                <div className="about-hero-actions">
                    <Link href="/products">Taste The Coffees</Link>
                    <Link href="/about/press">See Recognition</Link>
                </div>
            </section>
        </Layout>
    );
}
