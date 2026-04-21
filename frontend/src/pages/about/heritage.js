import Link from 'next/link';
import Layout from '../../components/Layout';

const ceremonySteps = [
    {
        title: 'Abol',
        subtitle: 'Washing and roasting',
        text: 'The first round begins with rinsed green beans, roasting over flame, and the aroma filling the room before the first pour.',
        image: 'https://images.pexels.com/photos/6205765/pexels-photo-6205765.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
        title: 'Tona',
        subtitle: 'Grinding by hand',
        text: 'The second round leans into the texture of mortar and pestle, where the sound of grinding becomes part of the ritual itself.',
        image: 'https://images.pexels.com/photos/6065453/pexels-photo-6065453.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
        title: 'Beraka',
        subtitle: 'Brewing in the jebena',
        text: 'The final blessing is poured from the jebena into small cups, often alongside popcorn, incense, and long conversation.',
        image: 'https://images.pexels.com/photos/6312076/pexels-photo-6312076.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
];

const equipment = [
    'Jebena clay pot',
    'Mukecha and zenezena',
    'Rekebot cups',
    'Cherecha popcorn bowl',
    'Etan incense burner',
    'Sele grass mat',
];

const traditions = [
    { region: 'Harar', detail: 'Coffee with spice notes, ceremony drama, and long hospitality traditions.' },
    { region: 'Sidama', detail: 'Leaf-lined serving and clean, fruit-led cups that feel bright and celebratory.' },
    { region: 'Jimma', detail: 'Coffee sometimes paired with honey and fuller-bodied village-style preparation.' },
    { region: 'Gondar', detail: 'Spiced coffee customs with cinnamon and ginger in more festive contexts.' },
];

export default function HeritagePage() {
    return (
        <Layout title="Kaloss Heritage">
            <section className="subpage-hero heritage-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Our Heritage</span>
                    <h1>1,000+ years of Ethiopian coffee culture</h1>
                    <p>From Kaffa to the modern ceremony room, Ethiopian coffee is a social bond, a spiritual pause, and a national inheritance.</p>
                </div>
            </section>

            <section className="about-story-grid heritage-story">
                <div className="about-story-copy">
                    <span className="section-kicker">The Legend of Kaldi</span>
                    <h2>The story that still introduces the world to Ethiopian coffee</h2>
                    <p>Around 850 AD, legend says a goat herder named Kaldi noticed his goats dancing after eating bright red coffee cherries. That image still captures the wonder of discovery and the energy of the coffee plant itself.</p>
                    <p>Whether history or myth, the story reflects something true: coffee is inseparable from Ethiopia's landscape and imagination.</p>
                </div>
                <div className="heritage-legend-image" />
            </section>

            <section className="heritage-ceremony">
                <div className="section-heading">
                    <span className="section-kicker">Coffee Ceremony</span>
                    <h2>The heart of Ethiopian hospitality</h2>
                </div>
                <div className="heritage-step-grid">
                    {ceremonySteps.map(step => (
                        <article key={step.title} className="heritage-step-card">
                            <div className="heritage-step-image" style={{ backgroundImage: `url(${step.image})` }} />
                            <div className="heritage-step-body">
                                <span>{step.subtitle}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="heritage-equipment">
                <div className="section-heading">
                    <span className="section-kicker">Traditional Equipment</span>
                    <h2>The objects that make the ritual tactile and memorable</h2>
                </div>
                <div className="heritage-equipment-grid">
                    {equipment.map(item => (
                        <article key={item} className="heritage-equipment-card">
                            <strong>{item}</strong>
                            <p>Presented with natural materials, fragrance, and ceremony pacing that invites people to stay and share the table.</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="heritage-traditions">
                <div className="section-heading">
                    <span className="section-kicker">Regional Traditions</span>
                    <h2>Different regions, different ceremony accents</h2>
                </div>
                <div className="about-card-grid">
                    {traditions.map(item => (
                        <article key={item.region} className="heritage-tradition-card">
                            <h3>{item.region}</h3>
                            <p>{item.detail}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-cta-banner">
                <div>
                    <span className="section-kicker">Keep Exploring</span>
                    <h2>See the people and process that carry this heritage forward.</h2>
                </div>
                <div className="about-hero-actions">
                    <Link href="/about/farmers">Meet Our Farmers</Link>
                    <Link href="/about/process">See Our Process</Link>
                </div>
            </section>
        </Layout>
    );
}
