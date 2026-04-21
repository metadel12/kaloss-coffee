import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { fetchCareerOpenings, submitJobApplication } from '../../utils/api';

export default function CareersPage() {
    const router = useRouter();
    const [openings, setOpenings] = useState([]);
    const [form, setForm] = useState({
        position: '',
        fullName: '',
        email: '',
        phone: '',
        resumeUrl: '',
        coverLetter: '',
        portfolioUrl: '',
        linkedinUrl: '',
        expectedSalary: '',
        startDate: '',
        source: '',
    });

    useEffect(() => {
        fetchCareerOpenings()
            .then(response => {
                const nextOpenings = response.data || [];
                setOpenings(nextOpenings);
                if (nextOpenings[0]) {
                    setForm(current => ({ ...current, position: nextOpenings[0].title }));
                }
            })
            .catch(() => setOpenings([]));
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const response = await submitJobApplication(form);
        router.push(`/contact/thank-you?ref=${response.data.applicationId}`);
    };

    return (
        <Layout title="Kaloss Careers">
            <section className="subpage-hero contact-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Careers</span>
                    <h1>Join the Kaloss team</h1>
                    <p>Retail, roastery, marketing, and operations roles that connect Ethiopian coffee culture to everyday customers.</p>
                </div>
            </section>
            <section className="contact-support-grid">
                <div className="contact-faq-panel">
                    <div className="section-heading">
                        <span className="section-kicker">Current Openings</span>
                        <h2>Roles open now</h2>
                    </div>
                    <div className="contact-faq-list">
                        {openings.map(opening => (
                            <article key={opening.id} className="contact-faq-item">
                                <h3>{opening.title}</h3>
                                <p>{opening.department} | {opening.location} | {opening.type}</p>
                                <p>{opening.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
                <form className="contact-form-card" onSubmit={handleSubmit}>
                    <div className="section-heading">
                        <span className="section-kicker">Apply Now</span>
                        <h2>Send your application</h2>
                    </div>
                    <div className="contact-form-grid">
                        <label><span>Position Applied For</span><select name="position" value={form.position} onChange={handleChange}>{openings.map(item => <option key={item.id} value={item.title}>{item.title}</option>)}</select></label>
                        <label><span>Full Name</span><input name="fullName" value={form.fullName} onChange={handleChange} required /></label>
                        <label><span>Email</span><input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
                        <label><span>Phone</span><input name="phone" value={form.phone} onChange={handleChange} required /></label>
                        <label><span>Resume Link</span><input name="resumeUrl" value={form.resumeUrl} onChange={handleChange} placeholder="Drive or Dropbox URL" required /></label>
                        <label><span>Portfolio Link</span><input name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} /></label>
                        <label><span>LinkedIn Profile</span><input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} /></label>
                        <label><span>Expected Salary (ETB)</span><input name="expectedSalary" value={form.expectedSalary} onChange={handleChange} /></label>
                        <label><span>Earliest Start Date</span><input name="startDate" value={form.startDate} onChange={handleChange} placeholder="2026-05-15" /></label>
                        <label><span>How did you hear about us?</span><input name="source" value={form.source} onChange={handleChange} /></label>
                        <label className="contact-form-full"><span>Cover Letter</span><textarea name="coverLetter" rows="6" value={form.coverLetter} onChange={handleChange} required /></label>
                    </div>
                    <button type="submit" className="contact-submit-button">Submit Application</button>
                </form>
            </section>
        </Layout>
    );
}
