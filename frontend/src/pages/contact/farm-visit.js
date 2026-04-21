import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { submitFarmVisitRequest } from '../../utils/api';

export default function FarmVisitPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        visitors: '1',
        preferredDates: '',
        regionPreference: 'Yirgacheffe',
        purpose: 'Educational/Tourist',
        specialRequirements: '',
        budget: '',
    });

    const handleChange = event => {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const response = await submitFarmVisitRequest(form);
        router.push(`/contact/thank-you?ref=${response.data.inquiryId}`);
    };

    return (
        <Layout title="Kaloss Farm Visit">
            <section className="subpage-hero contact-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Farm Visit Request</span>
                    <h1>Plan a visit to Ethiopian coffee origin</h1>
                    <p>Travel, sourcing, photography, and educational visits can start with a few details here.</p>
                </div>
            </section>
            <form className="contact-form-card contact-form-wide" onSubmit={handleSubmit}>
                <div className="contact-form-grid">
                    <label><span>Full Name</span><input name="fullName" value={form.fullName} onChange={handleChange} required /></label>
                    <label><span>Email</span><input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
                    <label><span>Phone</span><input name="phone" value={form.phone} onChange={handleChange} required /></label>
                    <label><span>Country of Residence</span><input name="country" value={form.country} onChange={handleChange} required /></label>
                    <label><span>Number of Visitors</span><input name="visitors" value={form.visitors} onChange={handleChange} type="number" min="1" max="20" /></label>
                    <label><span>Preferred Visit Dates</span><input name="preferredDates" value={form.preferredDates} onChange={handleChange} placeholder="October 12-16, 2026" /></label>
                    <label><span>Farm Region Preference</span><select name="regionPreference" value={form.regionPreference} onChange={handleChange}><option>Yirgacheffe</option><option>Sidama</option><option>Guji</option><option>Multiple regions</option></select></label>
                    <label><span>Purpose of Visit</span><select name="purpose" value={form.purpose} onChange={handleChange}><option>Educational/Tourist</option><option>Business/Sourcing</option><option>Photography/Film</option><option>Research</option></select></label>
                    <label><span>Budget Per Person</span><input name="budget" value={form.budget} onChange={handleChange} placeholder="850 USD or 95000 ETB" /></label>
                    <label className="contact-form-full"><span>Special Requirements</span><textarea name="specialRequirements" rows="5" value={form.specialRequirements} onChange={handleChange} /></label>
                </div>
                <button type="submit" className="contact-submit-button">Request Visit Planning</button>
            </form>
        </Layout>
    );
}
