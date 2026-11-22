import React, { useState, useRef, useEffect } from 'react';
import './checkout.css';

export default function CheckoutPage({ onNavigateHome }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showWhopModal, setShowWhopModal] = useState(false);
  const [checkoutSessionId, setCheckoutSessionId] = useState(() => Date.now());
  const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);

  const googleDriveLink = "https://drive.google.com/drive/folders/1YoZi8c-TgnPtGeVP5c3Va1Y9f3yEsB0U?usp=sharing";

  const videoRef = useRef(null);

  // Listen for Whop completion postMessage events
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        const type = String(data?.type || data?.event || data?.action || '').toLowerCase();
        const status = String(data?.status || data?.result || '').toLowerCase();
        if (
          type.includes('complete') ||
          type.includes('success') ||
          type.includes('purchased') ||
          type.includes('paid') ||
          status === 'payment' ||
          status === 'succeeded' ||
          status === 'complete'
        ) {
          setIsOrderSuccessful(true);
        }
      } catch {
        if (typeof event.data === 'string') {
          const str = event.data.toLowerCase();
          if (str.includes('complete') || str.includes('success') || str.includes('paid')) {
            setIsOrderSuccessful(true);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    const code = coupon.trim().toUpperCase();
    setAppliedCoupon(code);
    setCouponError('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('LIMITED10');
    setCopied(true);
    setCoupon('LIMITED10');
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
        setIsPlayingVideo(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlayingVideo(true);
        }).catch(() => {});
      }
    }
  };

  const basePrice = 149.00;
  const isFreeCode = appliedCoupon && (appliedCoupon.includes('FREE') || appliedCoupon.includes('100') || appliedCoupon.includes('TEST'));
  const discount = isFreeCode
    ? 149.00
    : appliedCoupon === 'LIMITED10'
      ? 14.90
      : 0.00;
  const totalPrice = Math.max(0, basePrice - discount).toFixed(2);

  const customerName = `${formData.firstName} ${formData.lastName}`.trim();
  const whopCheckoutUrl = `https://whop.com/margam360/ai-reel-system/?email=${encodeURIComponent(formData.email || '')}&name=${encodeURIComponent(customerName)}${appliedCoupon ? `&coupon=${encodeURIComponent(appliedCoupon)}` : ''}`;

  const faqs = [
    {
      q: 'What exactly will I receive after I pay?',
      a: 'You will receive a download link on your email and WhatsApp containing the full AI Reel System, plus the Step-by-Step Video Guide and 5000+ prompt bundle as a free bonus. Everything arrives in a single email immediately after checkout.'
    },
    {
      q: 'Will I also receive "Step by Step Setup Videos"?',
      a: 'YES, you will receive a complete step by step video on how to set up this system and how to generate the reels.'
    },
    {
      q: 'Do I need coding or video editing skills to use these?',
      a: "No. You don't need any editing or coding skills. Just download the folder, add it to Claude Code and type what you want in plain words. Claude checks your setup and walks you through every step. You will also receive a Step by Step Video Guide with your purchase so you don't get stuck on anything."
    },
    {
      q: 'Can I generate these reels from my mobile phone?',
      a: 'No. These motion graphic reels are made and rendered on a laptop or PC (Windows or Mac). Once a reel is ready, send it to your phone and post it like any other video.'
    },
    {
      q: 'How many languages does it support?',
      a: 'It supports all languages.'
    },
    {
      q: 'Do I need to show my face or record my voice?',
      a: 'No. You don\'t need to show your face to make animated reels. The reels are fully animated with an AI voiceover, and Claude does everything. So they work for faceless pages.'
    },
    {
      q: 'Can I use these for my client work?',
      a: 'Yes, you can use it for commercial and client purposes.'
    },
    {
      q: 'Is $149 a one-time payment, or does it renew?',
      a: 'THIS IS A ONE TIME PAYMENT ONLY with LIFETIME VALIDITY. No subscription or recurring charges.'
    },
    {
      q: 'How can I contact support?',
      a: 'You can contact us on our official WhatsApp number +91 88855 54621.'
    }
  ];

  return (
    <div className="checkout-page-root">
      {/* Top Urgent Notice Banner */}
      <div className="checkout-notice-bar">
        Complete Your Order Before 21 NOVEMBER to Claim FREE Gifts Worth $200
      </div>

      {/* Brand Header Navigation */}
      <header className="checkout-header-nav">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="checkout-header-logo">
          <img src="/assets/website-logo.png" alt="Margam 360" style={{ height: '54px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
        </a>
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="checkout-header-back">
          ← Back to Homepage
        </a>
      </header>

      {/* 2-Step Checkout Card */}
      <div className="checkout-card-wrapper">
        <div className="checkout-card">
          {/* Step Navigation Tabs */}
          <div className="checkout-steps-nav">
            <div
              className={`checkout-step-tab ${step === 1 ? 'active' : ''}`}
              onClick={() => setStep(1)}
            >
              <span className="checkout-step-num">1</span>
              <div className="checkout-step-labels">
                <span className="checkout-step-title">Contact</span>
                <span className="checkout-step-subtitle">Your Contact info</span>
              </div>
            </div>
            <div
              className={`checkout-step-tab ${step === 2 ? 'active' : ''}`}
              onClick={() => setStep(2)}
            >
              <span className="checkout-step-num">2</span>
              <div className="checkout-step-labels">
                <span className="checkout-step-title">Payment</span>
                <span className="checkout-step-subtitle">Of your order</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="checkout-form-body">
            {step === 1 ? (
              <form onSubmit={handleNextStep}>
                <div className="checkout-form-row-2col">
                  <div className="checkout-field-group">
                    <label className="checkout-field-label">
                      First name<span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your First Name"
                      className="checkout-input"
                      required
                    />
                    {formErrors.firstName && <span style={{ color: '#E5261F', fontSize: '12px', marginTop: '4px' }}>{formErrors.firstName}</span>}
                  </div>
                  <div className="checkout-field-group">
                    <label className="checkout-field-label">
                      Last name<span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your Last Name"
                      className="checkout-input"
                      required
                    />
                    {formErrors.lastName && <span style={{ color: '#E5261F', fontSize: '12px', marginTop: '4px' }}>{formErrors.lastName}</span>}
                  </div>
                </div>

                <div className="checkout-field-group">
                  <label className="checkout-field-label">
                    Phone<span className="required-star">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your Phone Number"
                    className="checkout-input"
                    required
                  />
                  {formErrors.phone && <span style={{ color: '#E5261F', fontSize: '12px', marginTop: '4px' }}>{formErrors.phone}</span>}
                </div>

                <div className="checkout-field-group">
                  <label className="checkout-field-label">
                    Email address<span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your Email Address"
                    className="checkout-input"
                    required
                  />
                  {formErrors.email && <span style={{ color: '#E5261F', fontSize: '12px', marginTop: '4px' }}>{formErrors.email}</span>}
                </div>

                <button type="submit" className="checkout-next-btn">
                  <span className="checkout-next-btn-main">
                    Next Step →
                  </span>
                  <span className="checkout-next-btn-sub">
                    Next: Select your offer
                  </span>
                </button>
              </form>
            ) : (
              <div className="checkout-order-review">
                <table className="checkout-order-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th></th>
                      <th className="price-col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="checkout-product-cell">
                          <img
                            src="/assets/Automated-AI-Video-Editing-Skills-Complete-System.webp"
                            alt="AI Reel System"
                            className="checkout-product-thumb"
                          />
                          <span className="checkout-product-name">
                            AI Reel System for Claude Code (One-Time Payment)
                          </span>
                        </div>
                      </td>
                      <td className="checkout-product-qty">× 1</td>
                      <td className="checkout-product-price">$149.00</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="checkout-product-cell">
                          <img
                            src="/assets/free-step-by-step-video-guide-ai-video-editing-skill.webp"
                            alt="Step by Step Setup Video Guide"
                            className="checkout-product-thumb"
                          />
                          <span className="checkout-product-name">
                            Step by Step Setup Video Guide
                          </span>
                        </div>
                      </td>
                      <td className="checkout-product-qty">× 1</td>
                      <td className="checkout-product-price">$0.00</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="checkout-product-cell">
                          <img
                            src="/assets/chatgpt-prompts-logo.webp"
                            alt="5000+ ChatGPT Prompts Bundle"
                            className="checkout-product-thumb"
                          />
                          <span className="checkout-product-name">
                            5000+ ChatGPT Prompts Bundle
                          </span>
                        </div>
                      </td>
                      <td className="checkout-product-qty">× 1</td>
                      <td className="checkout-product-price">$0.00</td>
                    </tr>
                    <tr className="subtotal-row">
                      <td colSpan="2" style={{ fontWeight: 500 }}>Subtotal</td>
                      <td className="checkout-product-price">$149.00</td>
                    </tr>
                    {appliedCoupon && (
                      <tr className="subtotal-row">
                        <td colSpan="2" style={{ color: '#E5261F', fontWeight: 600 }}>Discount ({appliedCoupon === 'LIMITED10' ? '10% OFF' : '100% OFF'} - {appliedCoupon})</td>
                        <td className="checkout-product-price" style={{ color: '#E5261F' }}>-${discount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="total-row">
                      <td colSpan="2">Total</td>
                      <td className="checkout-product-price" style={{ fontSize: '16px', fontWeight: 700 }}>${totalPrice}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Coupon Code Row (Blue Button as in Image) */}
                <div className="checkout-coupon-row">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon Code"
                    className="checkout-coupon-input"
                  />
                  <button type="button" onClick={handleApplyCoupon} className="checkout-coupon-btn">
                    Apply
                  </button>
                </div>
                {couponError && <p style={{ color: '#E5261F', fontSize: '13px', margin: '-16px 0 16px' }}>{couponError}</p>}
                {appliedCoupon && <p style={{ color: '#2fd36e', fontSize: '13px', margin: '-16px 0 16px' }}>Coupon "{appliedCoupon}" applied!</p>}

                {/* Payment Option with Whop Badge */}
                <div className="checkout-payment-box">
                  <div className="checkout-payment-method-header">
                    <input type="radio" checked readOnly id="pay-method" />
                    <label htmlFor="pay-method" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Whop Trusted &amp; Secure Checkout
                      <span className="whop-badge-tag">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                          <path d="M19.3 5.3L15.6 19h-3.2l-2.6-8.2L7.2 19H4L7.7 5.3h3.2l2.6 8.3 2.6-8.3h3.2z" />
                        </svg>
                        Whop
                      </span>
                    </label>
                  </div>
                  <div className="checkout-payment-method-desc">
                    Pay securely via Credit/Debit Card, Apple Pay, Google Pay or Crypto through Whop. 256-bit encrypted checkout.
                  </div>
                </div>

                {/* Place Order Button with Lock Icon */}
                <button
                  type="button"
                  className="checkout-place-order-btn"
                  onClick={() => {
                    setCheckoutSessionId(Date.now());
                    setShowWhopModal(true);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Place Order &nbsp;${totalPrice}
                </button>

                <div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="checkout-back-step-btn"
                  >
                    ← Edit Contact Info
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="checkout-trust-badges">
        <ul className="checkout-trust-list">
          <li className="checkout-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm-1.2 4.6v6.5l-2.4-2.4-1.7 1.7 5.3 5.3 5.3-5.3-1.7-1.7-2.4 2.4V6.6z"/>
            </svg>
            Instant Delivery
          </li>
          <li className="checkout-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            100% Verified Assets
          </li>
          <li className="checkout-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.6 10.5V7.4a4.4 4.4 0 0 1 8.8 0v3.1"/>
              <rect x="5" y="10" width="14" height="11" rx="2"/>
            </svg>
            256-bit Payment Encryption
          </li>
          <li className="checkout-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 6h14M10 8.6v6.8l5.4-3.4z"/>
            </svg>
            Secure Checkout
          </li>
          <li className="checkout-trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 12c-2-2.7-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.3 6-4zm0 0c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4z"/>
            </svg>
            Lifetime Access
          </li>
        </ul>
      </div>

      {/* Section 1: How it Works */}
      <section className="checkout-section">
        <div className="checkout-container-w">
          <div className="checkout-section-header">
            <span className="checkout-section-eyebrow">HOW IT WORKS</span>
            <h2 className="checkout-section-title">
              From checkout to first reel, in three simple steps.
            </h2>
          </div>

          <div className="checkout-cards-3grid">
            <div className="checkout-step-card">
              <span className="checkout-card-num-circle">01</span>
              <h3>Complete checkout</h3>
              <p>Pay $149 on a secure payment page. No account needed.</p>
            </div>
            <div className="checkout-step-card active-step">
              <span className="checkout-card-num-circle">02</span>
              <h3>Get instant delivery</h3>
              <p>Get the AI Reel System and both free gifts on your email and WhatsApp as soon as you pay.</p>
            </div>
            <div className="checkout-step-card">
              <span className="checkout-card-num-circle">03</span>
              <h3>Plug in and use</h3>
              <p>Add the folder in Claude Code, type one line and get your first finished reel.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href="https://wa.me/918885554621?text=Hii"
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-whatsapp-btn"
            >
              Having issues? <strong style={{ textDecoration: 'underline' }}>Let's chat on WhatsApp</strong>
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Video Tutorial */}
      <section className="checkout-section">
        <div className="checkout-container-w">
          <div className="checkout-section-header">
            <span className="checkout-section-eyebrow-pill">VIDEO TUTORIAL</span>
            <h2 className="checkout-section-title">How to Use the AI Reel System?</h2>
            <p className="checkout-section-desc">
              Simply download it, add it to Claude Code and type one line. That's it!
            </p>
          </div>

          {/* Video Player Box */}
          <div className="checkout-video-box">
            <div className="checkout-video-topbar">
              <i className="checkout-window-dot dot-red"></i>
              <i className="checkout-window-dot dot-yellow"></i>
              <i className="checkout-window-dot dot-green"></i>
              <span className="checkout-video-topbar-title">how-to · ai-reel-system.mp4</span>
              <span className="checkout-video-topbar-badge">0:33</span>
            </div>

            <div className="checkout-video-player-wrap" onClick={handlePlayVideo}>
              <video
                ref={videoRef}
                src="/assets/How-to-Use-AI-Video-Editing-System-Blizmatt-Digital.mp4"
                poster="/assets/how-to-use-claude-ai-reels-system-poster-1.webp"
                controls={isPlayingVideo}
                playsInline
                preload="metadata"
              />
              {!isPlayingVideo && (
                <>
                  <div className="checkout-video-play-overlay">
                    <div className="checkout-video-play-icon">
                      <svg viewBox="0 0 24 24" width="30" height="30" fill="#ffffff" style={{ marginLeft: '4px' }}>
                        <path d="M7 4.5v15l12.5-7.5z"/>
                      </svg>
                    </div>
                  </div>
                  <span className="checkout-video-sound-pill" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    Watch with sound · 0:33
                  </span>
                </>
              )}
            </div>

            <div className="checkout-video-footer" aria-hidden="true">
              <span>checkout → files → Claude → reel</span>
              <span>0:33</span>
            </div>
          </div>

          {/* 3 Step cards below video */}
          <div className="checkout-cards-3grid">
            <div className="checkout-step-card">
              <span className="checkout-card-num-circle">01</span>
              <h3>Download the system</h3>
              <p>After purchase, you get an email and a WhatsApp message with the download link for the AI Reel System folder and both free gifts.</p>
            </div>
            <div className="checkout-step-card active-step">
              <span className="checkout-card-num-circle">02</span>
              <h3>Add it to Claude Code</h3>
              <p>Open Claude Code, drop the folder in and say "set up". Claude checks your laptop and installs what it needs.</p>
            </div>
            <div className="checkout-step-card">
              <span className="checkout-card-num-circle">03</span>
              <h3>Type one line, get a reel</h3>
              <p>Type /reel and your topic, like "/reel 5 money habits, Hinglish". Claude writes, voices, animates and renders it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: FAQ */}
      <section className="checkout-section">
        <div className="checkout-container-w">
          <div className="checkout-section-header">
            <span className="checkout-section-eyebrow">QUESTIONS</span>
            <h2 className="checkout-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="checkout-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className={`checkout-faq-item ${isOpen ? 'open' : ''}`}>
                  <div className="checkout-faq-summary" onClick={() => toggleFaq(index)}>
                    <span>{faq.q}</span>
                    <span className="checkout-faq-toggle">{isOpen ? '−' : '+'}</span>
                  </div>
                  {isOpen && (
                    <div className="checkout-faq-content">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Coupon Bar */}
      <div className="checkout-sticky-footer-bar">
        <div className="checkout-sticky-bar-inner">
          <div className="checkout-sticky-left">
            <div className="checkout-sticky-heading">
              Get FLAT 10% OFF
              <span className="checkout-sticky-offer-badge">[Limited Time Offer]</span>
            </div>
            <div className="checkout-sticky-features">
              <span>✓ Instant Access</span>
              <span>✓ Lifetime Validity</span>
            </div>
          </div>

          <div className="checkout-coupon-pill">
            <div className="checkout-coupon-code">LIMITED10</div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="checkout-coupon-copy-btn"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <footer className="checkout-footer-bottom">
        <div className="checkout-footer-inner">
          <div>Margam © 2026. All rights reserved.</div>
          <div>
            WhatsApp Support:{' '}
            <a
              href="https://wa.me/918885554621?text=Hii"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#E5261F', textDecoration: 'none', fontWeight: 600 }}
            >
              +91 88855 54621
            </a>
          </div>
        </div>
      </footer>

      {/* Whop In-Page Embedded Checkout Modal (Option B) */}
      {showWhopModal && (
        <div className="whop-modal-backdrop" onClick={() => setShowWhopModal(false)}>
          <div className="whop-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="whop-modal-header">
              <div className="whop-modal-title-group">
                <span className="whop-modal-title">
                  {isOrderSuccessful ? 'Order Confirmed!' : 'Complete Your Purchase'}
                </span>
                <span className="whop-modal-subtitle">
                  {isOrderSuccessful ? 'Payment Received · Instant Access Unlocked' : 'Secure 256-bit Encrypted Checkout · Powered by Whop'}
                </span>
              </div>
              <div className="whop-modal-header-actions">
                {!isOrderSuccessful && (
                  <a
                    href={whopCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whop-modal-external-link"
                  >
                    Open in new window ↗
                  </a>
                )}
                <button
                  type="button"
                  className="whop-modal-close-btn"
                  onClick={() => setShowWhopModal(false)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="whop-modal-body">
              {isOrderSuccessful ? (
                <div className="checkout-success-container">
                  <div className="checkout-success-icon-wrap">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#2fd36e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="checkout-success-title">🎉 Payment Successful!</h3>
                  <p className="checkout-success-desc">
                    Thank you, <strong>{formData.firstName || 'Creator'}</strong>! Your order for the <strong>AI Reel System</strong> has been confirmed.
                  </p>
                  <p className="checkout-success-subdesc">
                    We've sent your welcome receipt to <strong>{formData.email || 'your email'}</strong>. You can access your full system files directly via Google Drive right now:
                  </p>

                  <a
                    href={googleDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="checkout-success-drive-btn"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm9.58 11.5H6.29l3.43 6h11.01l-3.44-6zm2.85-2.5L13.59 1 10.16 7l6.55 11.5 3.43-6z" />
                    </svg>
                    Open Google Drive Folder ↗
                  </a>

                  <div className="checkout-success-help">
                    Need help? Contact our support team on WhatsApp at{' '}
                    <a href="https://wa.me/918885554621?text=Hii" target="_blank" rel="noopener noreferrer">
                      +91 88855 54621
                    </a>
                  </div>

                  <button
                    type="button"
                    className="checkout-success-close-btn"
                    onClick={() => {
                      setShowWhopModal(false);
                      onNavigateHome();
                    }}
                  >
                    ← Return to Homepage
                  </button>
                </div>
              ) : (
                <>
                  <iframe
                    key={checkoutSessionId}
                    src={whopCheckoutUrl}
                    title="Whop Checkout"
                    className="whop-checkout-iframe"
                    allow="payment; accelerometer; gyroscope; magnetometer; clipboard-read; clipboard-write; fullscreen"
                  />
                  <div className="whop-modal-footer-bar">
                    <span>Already completed payment or entered OTP?</span>
                    <button
                      type="button"
                      className="whop-modal-confirm-btn"
                      onClick={() => setIsOrderSuccessful(true)}
                    >
                      ✓ I've Completed Payment &amp; Claim Files
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
