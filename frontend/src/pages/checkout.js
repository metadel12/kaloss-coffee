import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, initiatePayment } from '../utils/api';
import {
    ADDIS_SUBCITIES,
    BANK_ACCOUNTS,
    DELIVERY_OPTIONS,
    ETHIOPIAN_REGIONS,
    PAYMENT_METHODS,
    formatETB,
} from '../utils/cart';

const initialPaymentDetails = {
    telebirrPhone: '',
    cbeReference: '',
    bankReference: '',
    bankReceiptUrl: '',
};

export default function CheckoutPage() {
    const router = useRouter();
    const { user, hydrated } = useAuth();
    const {
        cart,
        summary,
        checkoutState,
        updateShippingAddress,
        setDeliveryOption,
        setPaymentMethod,
        clearCart,
        resetCheckout,
        isCodAvailable,
    } = useCart();
    const [step, setStep] = useState(1);
    const [paymentDetails, setPaymentDetails] = useState(initialPaymentDetails);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [confirmDetails, setConfirmDetails] = useState(false);
    const [subscribe, setSubscribe] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const customer = checkoutState.shippingAddress;
    const selectedPayment = useMemo(
        () => PAYMENT_METHODS.find(method => method.id === checkoutState.paymentMethod),
        [checkoutState.paymentMethod],
    );

    const handleField = event => {
        updateShippingAddress({ [event.target.name]: event.target.value });
    };

    useEffect(() => {
        if (!hydrated || !user) return;

        const updates = {};
        if (!checkoutState.shippingAddress.fullName && user.name) {
            updates.fullName = user.name;
        }
        if (!checkoutState.shippingAddress.email && user.email) {
            updates.email = user.email;
        }

        if (Object.keys(updates).length) {
            updateShippingAddress(updates);
        }
    }, [hydrated, user, checkoutState.shippingAddress.fullName, checkoutState.shippingAddress.email, updateShippingAddress]);

    const canMoveToPayment = cart.length > 0
        && customer.fullName.trim()
        && customer.email.trim()
        && customer.phone.trim()
        && customer.region.trim()
        && customer.houseNumber.trim()
        && (customer.region !== 'Addis Ababa' || customer.subCity.trim());

    const missingShippingFields = [
        !customer.fullName.trim() ? 'full name' : null,
        !customer.email.trim() ? 'email' : null,
        !customer.phone.trim() ? 'phone number' : null,
        !customer.houseNumber.trim() ? 'house number and street' : null,
        customer.region === 'Addis Ababa' && !customer.subCity.trim() ? 'sub-city' : null,
    ].filter(Boolean);

    const handlePlaceOrder = async () => {
        if (!acceptedTerms || !confirmDetails) {
            setError('Please confirm the terms and order details before placing your order.');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            const orderPayload = {
                customer,
                items: cart.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    variant: item.variant?.weight,
                    quantity: item.quantity,
                    priceETB: item.price,
                    subtotal: item.price * item.quantity,
                    giftWrap: item.giftWrap,
                    noteToSeller: item.noteToSeller,
                })),
                summary,
                paymentMethod: checkoutState.paymentMethod,
                deliveryOption: checkoutState.deliveryOption,
                specialInstructions,
                paymentReference: paymentDetails.bankReference || paymentDetails.cbeReference || paymentDetails.telebirrPhone,
                paymentReceipt: paymentDetails.bankReceiptUrl,
                gatewayResponse: {
                    selectedPaymentMethod: checkoutState.paymentMethod,
                    paymentDetails,
                    subscribe,
                },
            };

            const { data: order } = await createOrder(orderPayload);
            const { data: payment } = await initiatePayment({
                orderId: order._id,
                paymentMethod: checkoutState.paymentMethod,
                amount: summary.totalETB,
                phoneNumber: paymentDetails.telebirrPhone || customer.phone,
                email: customer.email,
                firstName: customer.fullName.split(' ')[0],
                lastName: customer.fullName.split(' ').slice(1).join(' ') || 'Customer',
            });

            clearCart();
            resetCheckout();

            if (checkoutState.paymentMethod === 'bank_transfer' || checkoutState.paymentMethod === 'cod') {
                router.push(`/checkout/success?orderId=${order._id}`);
                return;
            }

            if (payment.checkoutUrl || payment.paymentUrl) {
                router.push(`/checkout/success?orderId=${order._id}&gateway=${encodeURIComponent(payment.checkoutUrl || payment.paymentUrl)}`);
                return;
            }

            router.push(`/checkout/failed?orderId=${order._id}`);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to place this order right now.');
        } finally {
            setProcessing(false);
        }
    };

    if (!cart.length) {
        return (
            <Layout title="Checkout">
                <section className="checkout-empty-shell">
                    <h1>Your cart is empty.</h1>
                    <p>Add a few coffees first, then we’ll guide you through delivery and Ethiopian payment options.</p>
                    <Link href="/products" className="primary-link">Browse coffees</Link>
                </section>
            </Layout>
        );
    }

    return (
        <Layout title="Checkout">
            <section className="checkout-shell">
                <div className="section-heading">
                    <p>Checkout</p>
                    <h1>Fast Ethiopian checkout for Kaloss Coffee</h1>
                </div>

                <div className="checkout-steps">
                    {[1, 2, 3, 4].map(number => (
                        <button
                            key={number}
                            type="button"
                            className={`checkout-step-pill ${step === number ? 'active' : ''}`}
                            onClick={() => setStep(number)}
                        >
                            Step {number}
                        </button>
                    ))}
                </div>

                <div className="checkout-layout-grid">
                    <div className="checkout-main-panel">
                        {step === 1 ? (
                            <section className="checkout-card">
                                <h2>Contact & shipping information</h2>
                                <div className="checkout-form-grid">
                                    <label><span>Full Name</span><input name="fullName" value={customer.fullName} onChange={handleField} required /></label>
                                    <label><span>Email Address</span><input type="email" name="email" value={customer.email} onChange={handleField} required /></label>
                                    <label><span>Phone Number</span><input name="phone" value={customer.phone} onChange={handleField} placeholder="0912345678" required /></label>
                                    <label><span>Alternative Phone</span><input name="alternativePhone" value={customer.alternativePhone} onChange={handleField} /></label>
                                    <label>
                                        <span>Region / City</span>
                                        <select name="region" value={customer.region} onChange={handleField}>
                                            {ETHIOPIAN_REGIONS.map(region => <option key={region} value={region}>{region}</option>)}
                                        </select>
                                    </label>
                                    <label>
                                        <span>Sub-city / Woreda</span>
                                        {customer.region === 'Addis Ababa' ? (
                                            <select name="subCity" value={customer.subCity} onChange={handleField}>
                                                {ADDIS_SUBCITIES.map(subCity => <option key={subCity} value={subCity}>{subCity}</option>)}
                                            </select>
                                        ) : (
                                            <input name="subCity" value={customer.subCity} onChange={handleField} placeholder="Town, woreda, or district" />
                                        )}
                                    </label>
                                    <label className="checkout-field-wide"><span>House Number & Street</span><input name="houseNumber" value={customer.houseNumber} onChange={handleField} required /></label>
                                    <label><span>Landmark</span><input name="landmark" value={customer.landmark} onChange={handleField} placeholder="Near Edna Mall" /></label>
                                    <label><span>Delivery Instructions</span><input name="deliveryInstructions" value={customer.deliveryInstructions} onChange={handleField} placeholder="Call before arrival" /></label>
                                </div>

                                <div className="delivery-option-grid">
                                    {Object.values(DELIVERY_OPTIONS).map(option => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={`delivery-card ${checkoutState.deliveryOption === option.id ? 'active' : ''}`}
                                            onClick={() => setDeliveryOption(option.id)}
                                        >
                                            <strong>{option.label}</strong>
                                            <span>{option.eta}</span>
                                            <em>{formatETB(option.fee)}</em>
                                        </button>
                                    ))}
                                </div>

                                <div className="checkout-actions-row">
                                    <label className="checkbox-line">
                                        <input type="checkbox" defaultChecked={Boolean(user)} />
                                        Save this information for next time
                                    </label>
                                    <button type="button" className="primary-link button-reset" disabled={!canMoveToPayment} onClick={() => setStep(2)}>Continue to payment</button>
                                </div>
                                {!canMoveToPayment && missingShippingFields.length ? (
                                    <p className="summary-helper-copy">
                                        Complete: {missingShippingFields.join(', ')}.
                                    </p>
                                ) : null}
                            </section>
                        ) : null}

                        {step === 2 ? (
                            <section className="checkout-card">
                                <h2>Select payment method</h2>
                                <div className="payment-grid">
                                    {PAYMENT_METHODS.map(method => {
                                        const disabled = method.id === 'cod' && !isCodAvailable();
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                disabled={disabled}
                                                className={`payment-method-card ${checkoutState.paymentMethod === method.id ? 'active' : ''}`}
                                                onClick={() => setPaymentMethod(method.id)}
                                            >
                                                <strong>{method.title}</strong>
                                                <span>{method.description}</span>
                                                {disabled ? <em>Addis Ababa only</em> : <em>Select</em>}
                                            </button>
                                        );
                                    })}
                                </div>

                                {checkoutState.paymentMethod === 'telebirr' ? (
                                    <div className="payment-detail-panel">
                                        <label><span>Telebirr phone number</span><input value={paymentDetails.telebirrPhone} onChange={event => setPaymentDetails(previous => ({ ...previous, telebirrPhone: event.target.value }))} placeholder="251912345678" /></label>
                                    </div>
                                ) : null}

                                {checkoutState.paymentMethod === 'cbebirr' ? (
                                    <div className="payment-detail-panel">
                                        <label><span>CBE account number or phone</span><input value={paymentDetails.cbeReference} onChange={event => setPaymentDetails(previous => ({ ...previous, cbeReference: event.target.value }))} /></label>
                                    </div>
                                ) : null}

                                {checkoutState.paymentMethod === 'bank_transfer' ? (
                                    <div className="payment-detail-panel">
                                        <div className="bank-account-grid">
                                            {BANK_ACCOUNTS.map(account => (
                                                <article key={account.bank} className="bank-account-card">
                                                    <strong>{account.bank}</strong>
                                                    <span>{account.accountName}</span>
                                                    <span>{account.accountNumber}</span>
                                                    <span>{account.branch}</span>
                                                    {account.swiftCode ? <span>{account.swiftCode}</span> : null}
                                                </article>
                                            ))}
                                        </div>
                                        <div className="checkout-form-grid">
                                            <label><span>Transaction reference</span><input value={paymentDetails.bankReference} onChange={event => setPaymentDetails(previous => ({ ...previous, bankReference: event.target.value }))} /></label>
                                            <label><span>Receipt URL or file path</span><input value={paymentDetails.bankReceiptUrl} onChange={event => setPaymentDetails(previous => ({ ...previous, bankReceiptUrl: event.target.value }))} placeholder="Paste uploaded receipt URL" /></label>
                                        </div>
                                    </div>
                                ) : null}

                                {selectedPayment ? (
                                    <div className="payment-helper-banner">
                                        <strong>{selectedPayment.title}</strong>
                                        <p>
                                            {checkoutState.paymentMethod === 'cod'
                                                ? 'Cash on Delivery adds 30 ETB and stays available only inside Addis Ababa.'
                                                : checkoutState.paymentMethod === 'bank_transfer'
                                                    ? 'Your order will be marked Pending Payment until the receipt is verified.'
                                                    : 'We use hosted payment handoff and never store card or mobile money PIN details.'}
                                        </p>
                                    </div>
                                ) : null}

                                <div className="checkout-actions-row">
                                    <button type="button" className="secondary-dark-link button-reset" onClick={() => setStep(1)}>Previous Step</button>
                                    <button type="button" className="primary-link button-reset" disabled={!checkoutState.paymentMethod} onClick={() => setStep(3)}>Review order</button>
                                </div>
                            </section>
                        ) : null}

                        {step === 3 ? (
                            <section className="checkout-card">
                                <h2>Review & confirm</h2>
                                <div className="review-stack">
                                    {cart.map(item => (
                                        <div key={item.cartKey} className="review-line-item">
                                            <div>
                                                <strong>{item.name}</strong>
                                                <span>{item.variant?.weight} x {item.quantity}</span>
                                            </div>
                                            <strong>{formatETB(item.price * item.quantity)}</strong>
                                        </div>
                                    ))}
                                </div>

                                <div className="review-summary-grid">
                                    <div className="review-summary-card">
                                        <span>Shipping address</span>
                                        <strong>{customer.fullName}</strong>
                                        <p>{customer.region}, {customer.subCity}</p>
                                        <p>{customer.houseNumber}</p>
                                    </div>
                                    <div className="review-summary-card">
                                        <span>Payment method</span>
                                        <strong>{selectedPayment?.title || 'Not selected'}</strong>
                                        <p>{checkoutState.deliveryOption} delivery</p>
                                        <p>Estimated total {formatETB(summary.totalETB)}</p>
                                    </div>
                                </div>

                                <label className="checkout-field-stack">
                                    <span>Order notes</span>
                                    <textarea rows="3" value={specialInstructions} onChange={event => setSpecialInstructions(event.target.value)} placeholder="Optional roasting, gifting, or delivery notes" />
                                </label>

                                <div className="terms-stack">
                                    <label className="checkbox-line"><input type="checkbox" checked={acceptedTerms} onChange={event => setAcceptedTerms(event.target.checked)} />I agree to the Terms & Conditions</label>
                                    <label className="checkbox-line"><input type="checkbox" checked={subscribe} onChange={event => setSubscribe(event.target.checked)} />Subscribe to newsletter for coffee tips & offers</label>
                                    <label className="checkbox-line"><input type="checkbox" checked={confirmDetails} onChange={event => setConfirmDetails(event.target.checked)} />I confirm my order details are correct</label>
                                </div>

                                {error ? <p className="form-error">{error}</p> : null}

                                <div className="checkout-actions-row">
                                    <Link href="/cart" className="secondary-dark-link">Back to Cart</Link>
                                    <button type="button" className="secondary-dark-link button-reset" onClick={() => setStep(2)}>Previous Step</button>
                                    <button type="button" className="primary-link button-reset" onClick={() => setStep(4)}>Place Order & Pay</button>
                                </div>
                            </section>
                        ) : null}

                        {step === 4 ? (
                            <section className="checkout-card processing-card">
                                <div className="coffee-loader">
                                    <div className="coffee-loader-cup" />
                                    <div className="coffee-loader-drop" />
                                </div>
                                <h2>Processing your payment...</h2>
                                <p>Do not refresh or close this page while we create your order and hand off to the selected payment method.</p>
                                {error ? <p className="form-error">{error}</p> : null}
                                <div className="checkout-actions-row">
                                    <button type="button" className="secondary-dark-link button-reset" onClick={() => setStep(3)} disabled={processing}>Previous Step</button>
                                    <button type="button" className="primary-link button-reset" onClick={handlePlaceOrder} disabled={processing}>
                                        {processing ? 'Processing...' : 'Confirm & Pay'}
                                    </button>
                                </div>
                            </section>
                        ) : null}
                    </div>

                    <aside className="checkout-sidebar">
                        <div className="summary-card-advanced sticky">
                            <h2>Order summary</h2>
                            {cart.map(item => (
                                <div key={item.cartKey} className="summary-line compact">
                                    <span>{item.name} x {item.quantity}</span>
                                    <strong>{formatETB(item.price * item.quantity)}</strong>
                                </div>
                            ))}
                            <div className="summary-line"><span>Subtotal</span><strong>{formatETB(summary.subtotal)}</strong></div>
                            <div className="summary-line"><span>Shipping</span><strong>{formatETB(summary.shippingFee)}</strong></div>
                            <div className="summary-line"><span>Gift wrap</span><strong>{formatETB(summary.giftWrapFee)}</strong></div>
                            <div className="summary-line"><span>VAT</span><strong>{formatETB(summary.taxAmount)}</strong></div>
                            {summary.discountAmount ? <div className="summary-line discount"><span>Discount</span><strong>-{formatETB(summary.discountAmount)}</strong></div> : null}
                            <div className="summary-total-line"><span>Total</span><strong>{formatETB(summary.totalETB)}</strong></div>
                        </div>
                    </aside>
                </div>
            </section>
        </Layout>
    );
}
