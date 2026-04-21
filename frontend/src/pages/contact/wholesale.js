import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { submitWholesaleInquiry } from '../../utils/api';

const coffeeTypes = ['Yirgacheffe', 'Sidama', 'Guji', 'Harrar', 'Limu', 'Espresso Blend'];

export default function WholesalePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        businessName: '',
        businessType: 'Cafe/Restaurant',
        contactName: '',
        email: '',
        phone: '',
        location: '',
        monthlyQuantity: '5-10 kg',
        coffeeTypes: [],
        roastPreference: 'Whole Bean',
        packagingPreference: '1kg bags',
        currentSupplier: '',
        message: '',
        sampleRequested: false,
    });

    const handleChange = event => {
        const { name, value, type, checked } = event.target;
        setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    };

    const toggleCoffee = coffee => {
        setForm(current => ({
            ...current,
            coffeeTypes: current.coffeeTypes.includes(coffee)
                ? current.coffeeTypes.filter(item => item !== coffee)
                : [...current.coffeeTypes, coffee],
        }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const response = await submitWholesaleInquiry(form);
        router.push(`/contact/thank-you?ref=${response.data.inquiryId}`);
    };

    return (
        <Layout title="Kaloss Wholesale">
            <section className="subpage-hero contact-hero">
                <div className="subpage-hero-overlay" />
                <div className="subpage-hero-content">
                    <span className="section-kicker">Wholesale Inquiry</span>
                    <h1>Bulk coffee for cafes, hotels, and retailers</h1>
                    <p>Tell us about your business and we will come back with pricing, packaging, and sample guidance.</p>
                </div>
            </section>
            <form className="contact-form-card contact-form-wide" onSubmit={handleSubmit}>
                <div className="contact-form-grid">
                    <label><span>Business Name</span><input name="businessName" value={form.businessName} onChange={handleChange} required /></label>
                    <label><span>Business Type</span><select name="businessType" value={form.businessType} onChange={handleChange}><option>Cafe/Restaurant</option><option>Hotel/Lodge</option><option>Office/Corporate</option><option>Retail Store</option><option>Distributor</option></select></label>
                    <label><span>Full Name and Position</span><input name="contactName" value={form.contactName} onChange={handleChange} required /></label>
                    <label><span>Email</span><input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
                    <label><span>Phone</span><input name="phone" value={form.phone} onChange={handleChange} required /></label>
                    <label><span>Location/City</span><input name="location" value={form.location} onChange={handleChange} required /></label>
                    <label><span>Estimated Monthly Quantity</span><select name="monthlyQuantity" value={form.monthlyQuantity} onChange={handleChange}><option>5-10 kg</option><option>11-25 kg</option><option>26-50 kg</option><option>51-100 kg</option><option>100+ kg</option></select></label>
                    <label><span>Roast Preference</span><select name="roastPreference" value={form.roastPreference} onChange={handleChange}><option>Whole Bean</option><option>Ground (Espresso)</option><option>Ground (Filter)</option></select></label>
                    <label><span>Packaging Preference</span><select name="packagingPreference" value={form.packagingPreference} onChange={handleChange}><option>250g bags</option><option>500g bags</option><option>1kg bags</option><option>5kg bulk</option></select></label>
                    <label><span>Current Supplier</span><input name="currentSupplier" value={form.currentSupplier} onChange={handleChange} /></label>
                    <label className="contact-form-full"><span>Preferred Coffee Types</span><div className="chip-row">{coffeeTypes.map(item => <button key={item} type="button" className={`choice-chip button-chip ${form.coffeeTypes.includes(item) ? 'active' : ''}`} onClick={() => toggleCoffee(item)}>{item}</button>)}</div></label>
                    <label className="contact-form-full"><span>Message</span><textarea name="message" rows="5" value={form.message} onChange={handleChange} required /></label>
                </div>
                <label className="checkbox-line"><input type="checkbox" name="sampleRequested" checked={form.sampleRequested} onChange={handleChange} /><span>Send me a 100g sample</span></label>
                <button type="submit" className="contact-submit-button">Request Quote</button>
            </form>
        </Layout>
    );
}
