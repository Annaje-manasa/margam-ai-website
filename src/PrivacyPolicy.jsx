import React, { useEffect } from 'react';
import './privacy.css';

export default function PrivacyPolicy({ onNavigateHome }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prevTitle = document.title;
    document.title = 'Privacy Policy - Margam360 AI';

    // Enable the browser's native back button if opened directly in a new tab without prior history
    if (!window.history.state?.hasHomeEntry) {
      window.history.replaceState({ hasHomeEntry: true, page: 'home' }, '', '/');
      window.history.pushState({ hasHomeEntry: true, page: 'privacy' }, '', '/privacy-policy');
    }

    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="privacy-page-root">
      {/* Brand Header Navigation */}
      <header className="privacy-header-nav">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="privacy-header-logo"
        >
          <img
            src="/assets/website-logo.png"
            alt="Margam 360"
            style={{ height: '44px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
          />
        </a>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="privacy-header-back"
        >
          ← Back to Homepage
        </a>
      </header>

      {/* Main Content Area */}
      <main className="privacy-container">
        <div className="privacy-card">
          <div className="privacy-hero">
            <span className="privacy-badge">Official Policy</span>
            <h1 className="privacy-title">Privacy Policy</h1>
            <p className="privacy-updated">Last Updated: November 26, 2026</p>
          </div>

          <div className="privacy-intro">
            <p>At Margam360 AI (&quot;Margam360,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we respect your privacy and are committed to protecting your personal information.</p>
            <p>This Privacy Policy explains how we collect, use, process, disclose and protect your personal information when you visit our website (https://ai.margam360.com), purchase our digital products or interact with our services.</p>
          </div>

          <div className="privacy-toc">
            <h2 className="privacy-toc-heading">Table of Contents</h2>
            <ol className="privacy-toc-list">
              <li><a href="#sec-1">Information We Collect</a></li>
              <li><a href="#sec-2">How We Use Your Information</a></li>
              <li><a href="#sec-3">Cookies and Tracking Technologies</a></li>
              <li><a href="#sec-4">Meta Pixel, Advertising and Remarketing</a></li>
              <li><a href="#sec-5">Nature of Our Products and Services</a></li>
              <li><a href="#sec-6">Artificial Intelligence and Third-Party Integrations</a></li>
              <li><a href="#sec-7">Independent Business and Non-Affiliation</a></li>
              <li><a href="#sec-8">Responsible Use and Customer Responsibilities</a></li>
              <li><a href="#sec-9">Third-Party Misuse and Platform Limitations</a></li>
              <li><a href="#sec-10">User Content and Intellectual Property</a></li>
              <li><a href="#sec-11">Payment Processing</a></li>
              <li><a href="#sec-12">Information Sharing and Disclosure</a></li>
              <li><a href="#sec-13">Email Communications</a></li>
              <li><a href="#sec-14">Data Retention</a></li>
              <li><a href="#sec-15">Data Security</a></li>
              <li><a href="#sec-16">Your Privacy Rights</a></li>
              <li><a href="#sec-17">United States Privacy Rights</a></li>
              <li><a href="#sec-18">International Data Transfers</a></li>
              <li><a href="#sec-19">Children's Privacy</a></li>
              <li><a href="#sec-20">Third-Party Websites and Services</a></li>
              <li><a href="#sec-21">Changes to This Privacy Policy</a></li>
              <li><a href="#sec-22">Contact Us</a></li>
            </ol>
          </div>

          <div className="privacy-sections">
            <section id="sec-1" className="privacy-section">
              <h2 className="privacy-section-title">1. Information We Collect</h2>
              <p>We may collect the following categories of information when you interact with our website or services.</p>
              <h3 className="privacy-subsection-title">Personal Information</h3>
              <ul className="privacy-list">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number, where provided</li>
                <li>Billing information</li>
                <li>Country and location information</li>
                <li>Purchase and transaction details</li>
                <li>Customer support communications</li>
              </ul>
              <h3 className="privacy-subsection-title">Automatically Collected Information</h3>
              <ul className="privacy-list">
                <li>IP address</li>
                <li>Device and browser information</li>
                <li>Operating system</li>
                <li>Website activity and browsing behavior</li>
                <li>Referral sources</li>
                <li>Cookie and advertising identifiers</li>
                <li>Checkout and purchase events</li>
              </ul>
            </section>
            <section id="sec-2" className="privacy-section">
              <h2 className="privacy-section-title">2. How We Use Your Information</h2>
              <p>We may use your information for the following purposes:</p>
              <ul className="privacy-list">
                <li>Processing purchases and delivering digital products.</li>
                <li>Providing product access, updates and customer support.</li>
                <li>Sending transaction confirmations and service-related communications.</li>
                <li>Improving our website, products and customer experience.</li>
                <li>Analyzing website traffic and user behavior.</li>
                <li>Measuring and optimizing advertising performance.</li>
                <li>Delivering relevant advertisements and promotional communications.</li>
                <li>Preventing fraudulent transactions and unauthorized activity.</li>
                <li>Complying with applicable legal and regulatory obligations.</li>
              </ul>
            </section>
            <section id="sec-3" className="privacy-section">
              <h2 className="privacy-section-title">3. Cookies and Tracking Technologies</h2>
              <p>Our website may use cookies, pixels, tags and similar tracking technologies to improve website functionality, analyze visitor behavior and support our marketing activities.</p>
              <p>These technologies may include:</p>
              <ul className="privacy-list">
                <li><strong>Essential Cookies:</strong> Enable website functionality, security and transactions.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand and improve website performance.</li>
                <li><strong>Advertising Cookies:</strong> Support advertising measurement, personalization and remarketing.</li>
                <li><strong>Preference Cookies:</strong> Remember user preferences and settings.</li>
              </ul>
              <p>Where required by applicable law, we obtain consent before using non-essential cookies and tracking technologies.</p>
              <p>You may manage your cookie preferences through your browser settings or available website privacy controls.</p>
            </section>
            <section id="sec-4" className="privacy-section">
              <h2 className="privacy-section-title">4. Meta Pixel, Advertising and Remarketing</h2>
              <p>We may use advertising and measurement technologies provided by Meta Platforms, Inc., including Meta Pixel and Conversions API, to measure advertising performance, understand website interactions and deliver relevant advertisements across Facebook, Instagram and other supported platforms.</p>
              <p>These technologies may collect or receive information such as website visits, device information, IP addresses, checkout activity, purchase events and contact information used for advertising matching and measurement, where enabled and permitted by law.</p>
              <p>Third parties, including Meta, may use cookies, web beacons and other storage technologies to collect or receive information from our website and elsewhere on the internet and use that information to provide measurement services and targeted advertising.</p>
              <p>Meta may process this information in accordance with its own privacy policies, including for advertising measurement, personalization and audience matching.</p>
              <p>Users can learn more about Meta's data practices and manage their advertising preferences through the following resources:</p>
              <p className="privacy-link-item"><strong>Meta Privacy Policy:</strong> <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">https://www.facebook.com/privacy/policy/</a></p>
              <p className="privacy-link-item"><strong>Meta Advertising Preferences:</strong> <a href="https://www.facebook.com/adpreferences/" target="_blank" rel="noopener noreferrer">https://www.facebook.com/adpreferences/</a></p>
              <p className="privacy-link-item"><strong>Digital Advertising Alliance:</strong> <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">https://optout.aboutads.info/</a></p>
              <p className="privacy-link-item"><strong>Your Online Choices:</strong> <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">https://www.youronlinechoices.eu/</a></p>
              <p>We do not intentionally transmit passwords, full payment card details, sensitive personal information or private creative content to advertising platforms.</p>
              <p>Where applicable, users may opt out of targeted advertising and related data sharing by contacting us or using available privacy preference controls.</p>
            </section>
            <section id="sec-5" className="privacy-section">
              <h2 className="privacy-section-title">5. Nature of Our Products and Services</h2>
              <p>Margam360 AI is an independent digital product provider offering AI-powered workflows, tools, systems and educational resources designed to assist users with content creation, video production and editing.</p>
              <p>Our products are designed to work with compatible third-party software and artificial intelligence services.</p>
              <p>Purchasing a Margam360 AI product does not constitute the purchase of a third-party AI subscription, account or software license unless expressly stated.</p>
              <p>Margam360 AI does not own, operate or control the underlying third-party artificial intelligence platforms used in connection with our products.</p>
            </section>
            <section id="sec-6" className="privacy-section">
              <h2 className="privacy-section-title">6. Artificial Intelligence and Third-Party Integrations</h2>
              <p>Our AI Reel System is designed to operate with third-party artificial intelligence services, including Claude and Claude Code, provided by Anthropic.</p>
              <p>Users may also interact with additional third-party tools and services as part of their content creation workflow.</p>
              <p>Information submitted to these external services, including prompts, scripts, images, raw footage, audio and video files, may be processed according to their respective privacy policies and terms of service.</p>
              <p>Margam360 AI does not control the independent data collection, processing, storage, retention or AI training practices of third-party service providers.</p>
              <p>Users are encouraged to review the applicable privacy policies, terms of service and account settings of any third-party services they choose to use.</p>
              <p className="privacy-link-item"><strong>Anthropic Privacy Policy:</strong> <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">https://www.anthropic.com/legal/privacy</a></p>
              <p className="privacy-link-item"><strong>Anthropic Consumer Terms:</strong> <a href="https://www.anthropic.com/legal/consumer-terms" target="_blank" rel="noopener noreferrer">https://www.anthropic.com/legal/consumer-terms</a></p>
              <p className="privacy-link-item"><strong>Anthropic Usage Policy:</strong> <a href="https://www.anthropic.com/legal/aup" target="_blank" rel="noopener noreferrer">https://www.anthropic.com/legal/aup</a></p>
            </section>
            <section id="sec-7" className="privacy-section">
              <h2 className="privacy-section-title">7. Independent Business and Non-Affiliation</h2>
              <p>Margam360 AI operates as an independent digital product provider.</p>
              <p>Margam360 AI is not affiliated with, endorsed by, sponsored by or officially partnered with Anthropic, Claude or other third-party software providers referenced on our website, unless expressly stated otherwise.</p>
              <p>All third-party trademarks, brand names, logos and product names belong to their respective owners.</p>
              <p>References to third-party platforms are made for informational, compatibility and product functionality purposes.</p>
            </section>
            <section id="sec-8" className="privacy-section">
              <h2 className="privacy-section-title">8. Responsible Use and Customer Responsibilities</h2>
              <p>Customers are responsible for how they use Margam360 AI products and any associated third-party artificial intelligence services.</p>
              <p>Customers are expected to:</p>
              <ul className="privacy-list">
                <li>Comply with all applicable local, national and international laws and regulations.</li>
                <li>Follow the terms of service, usage policies and guidelines of Claude and other third-party platforms.</li>
                <li>Use our products responsibly, ethically and lawfully.</li>
                <li>Respect intellectual property, copyright and privacy rights.</li>
                <li>Obtain necessary permissions before processing third-party content or personal information.</li>
                <li>Refrain from using our products for illegal, fraudulent, deceptive, harmful or unauthorized activities.</li>
                <li>Maintain the security of their third-party accounts, credentials and subscriptions.</li>
              </ul>
              <p>Margam360 AI does not authorize, encourage or support the misuse of artificial intelligence services or the violation of third-party platform policies.</p>
              <p>Customers are responsible for reviewing and verifying AI-generated content before publishing, distributing or using it for commercial purposes.</p>
              <p>Further conditions governing product use are subject to our applicable Terms and Conditions.</p>
            </section>
            <section id="sec-9" className="privacy-section">
              <h2 className="privacy-section-title">9. Third-Party Misuse and Platform Limitations</h2>
              <p>To the extent permitted by applicable law, Margam360 AI shall not be held liable for losses, damages, account restrictions, suspensions, terminations or other consequences resulting from a customer's misuse of our products, unlawful activities or violations of third-party platform policies.</p>
              <p>Margam360 AI does not control third-party platforms and cannot guarantee their continued availability, functionality, pricing, usage limits, policies or compatibility.</p>
              <p>Customers are responsible for obtaining and maintaining any third-party accounts, subscriptions, software licenses and permissions required to use our products.</p>
              <p>Lifetime access and future updates apply exclusively to the purchased Margam360 AI product. They do not include lifetime access to Claude, Anthropic services or other third-party subscriptions.</p>
              <p>Third-party subscription fees, usage charges and other associated costs may apply separately.</p>
              <p>Nothing in this Privacy Policy excludes or limits liability that cannot lawfully be excluded or limited.</p>
            </section>
            <section id="sec-10" className="privacy-section">
              <h2 className="privacy-section-title">10. User Content and Intellectual Property</h2>
              <p>Purchasing or using our digital products does not, by itself, transfer ownership of your original scripts, images, videos, footage, audio or other creative materials to Margam360 AI.</p>
              <p>If you voluntarily provide content to us for customer support or troubleshooting, we may process that content as reasonably necessary to fulfill your request.</p>
              <p>Customers are responsible for ensuring that they have the necessary rights, licenses, permissions and consents to upload, process, edit, publish or distribute content using our products and connected third-party services.</p>
              <p>Customers should avoid submitting confidential, sensitive or personally identifiable information to third-party AI platforms unless appropriate permissions and safeguards are in place.</p>
            </section>
            <section id="sec-11" className="privacy-section">
              <h2 className="privacy-section-title">11. Payment Processing</h2>
              <p>Payments for our digital products are processed through third-party payment service providers.</p>
              <p>These providers may collect and process payment and billing information necessary to complete transactions in accordance with their own privacy policies and applicable security standards.</p>
              <p>We may receive limited transaction information, including payment confirmations, transaction identifiers and purchase details, for order fulfillment, customer support, accounting and fraud prevention purposes.</p>
            </section>
            <section id="sec-12" className="privacy-section">
              <h2 className="privacy-section-title">12. Information Sharing and Disclosure</h2>
              <p>We may share personal information with third-party service providers where necessary to operate our business and deliver our products and services.</p>
              <p>These may include:</p>
              <ul className="privacy-list">
                <li>Payment processing providers</li>
                <li>Website hosting providers</li>
                <li>Digital product delivery platforms</li>
                <li>Analytics and advertising platforms</li>
                <li>Email communication providers</li>
                <li>Customer support providers</li>
                <li>Professional and legal advisers</li>
              </ul>
              <p>We may also disclose information where required by law, to protect our legal rights, prevent fraud, maintain security or comply with lawful requests from regulatory authorities.</p>
              <p>In the event of a merger, acquisition, restructuring or business transfer, relevant personal information may be transferred subject to applicable privacy laws.</p>
              <p>We do not sell personal information for monetary compensation. However, certain advertising-related disclosures may constitute a sale or sharing of personal information under applicable privacy laws.</p>
              <p>Where applicable, users have the right to opt out of such disclosures.</p>
            </section>
            <section id="sec-13" className="privacy-section">
              <h2 className="privacy-section-title">13. Email Communications</h2>
              <p>We may use your email address to send:</p>
              <ul className="privacy-list">
                <li>Purchase confirmations</li>
                <li>Product access information</li>
                <li>Important product updates</li>
                <li>Customer support communications</li>
                <li>Educational resources</li>
                <li>Promotional offers and announcements</li>
              </ul>
              <p>You may unsubscribe from promotional communications at any time by using the unsubscribe link provided in our emails or contacting us directly.</p>
              <p>Essential transactional and service-related communications may continue where necessary to provide purchased products and services.</p>
            </section>
            <section id="sec-14" className="privacy-section">
              <h2 className="privacy-section-title">14. Data Retention</h2>
              <p>We retain personal information for as long as reasonably necessary to fulfill the purposes outlined in this Privacy Policy, provide our services, maintain business records, resolve disputes and comply with applicable legal obligations.</p>
              <p>Retention periods may vary depending on the nature of the information, ongoing customer relationships, legal requirements and legitimate business purposes.</p>
              <p>When personal information is no longer required, it will be deleted, anonymized or otherwise handled in accordance with applicable laws.</p>
            </section>
            <section id="sec-15" className="privacy-section">
              <h2 className="privacy-section-title">15. Data Security</h2>
              <p>We take reasonable administrative, technical and organizational measures designed to protect personal information against unauthorized access, disclosure, alteration, loss or misuse.</p>
              <p>However, no method of electronic storage or transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>
              <p>Users are responsible for maintaining the confidentiality and security of their account credentials and third-party service access.</p>
            </section>
            <section id="sec-16" className="privacy-section">
              <h2 className="privacy-section-title">16. Your Privacy Rights</h2>
              <p>Depending on your location and applicable privacy laws, including the General Data Protection Regulation (GDPR), UK GDPR, California Consumer Privacy Act (CCPA) and other applicable data protection laws, you may have the right to:</p>
              <ul className="privacy-list">
                <li>Request access to your personal information.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of your personal information.</li>
                <li>Request a portable copy of your personal information.</li>
                <li>Restrict or object to certain processing activities.</li>
                <li>Withdraw consent where applicable.</li>
                <li>Opt out of promotional communications.</li>
                <li>Opt out of targeted advertising and applicable sales or sharing of personal information.</li>
                <li>Appeal decisions concerning privacy requests, where applicable.</li>
                <li>Exercise your privacy rights without unlawful discrimination.</li>
              </ul>
              <p>Where legally required, we recognize applicable universal opt-out mechanisms, including Global Privacy Control (GPC).</p>
              <p>Where GDPR or UK GDPR applies, our legal bases for processing personal information may include contractual necessity, legitimate business interests, consent and compliance with legal obligations.</p>
              <p>You may also have the right to lodge a complaint with your local data protection authority.</p>
              <p>To exercise your privacy rights, please contact us using the information provided below. We may request reasonable identity verification before processing certain requests.</p>
            </section>
            <section id="sec-17" className="privacy-section">
              <h2 className="privacy-section-title">17. United States Privacy Rights</h2>
              <p>Residents of California and other United States jurisdictions with applicable privacy laws may have additional rights concerning their personal information.</p>
              <p>Depending on applicable law, these rights may include requesting information about:</p>
              <ul className="privacy-list">
                <li>Categories of personal information collected.</li>
                <li>Sources of personal information.</li>
                <li>Purposes for collecting and processing personal information.</li>
                <li>Categories of third parties receiving personal information.</li>
                <li>Information disclosed for business purposes.</li>
                <li>Information sold or shared for targeted advertising.</li>
              </ul>
              <p>Where applicable, users may exercise their rights to opt out of the sale or sharing of personal information and targeted advertising by contacting us or using available website privacy controls.</p>
              <p>Authorized agents may submit privacy requests on behalf of individuals where permitted by applicable law.</p>
            </section>
            <section id="sec-18" className="privacy-section">
              <h2 className="privacy-section-title">18. International Data Transfers</h2>
              <p>As a digital business serving customers internationally, we and our service providers may process personal information outside your country of residence.</p>
              <p>Privacy and data protection laws may differ between countries.</p>
              <p>Where required by applicable law, appropriate safeguards and lawful transfer mechanisms are used to protect personal information during international transfers.</p>
            </section>
            <section id="sec-19" className="privacy-section">
              <h2 className="privacy-section-title">19. Children's Privacy</h2>
              <p>Our website and products are not directed toward children under the age of 18.</p>
              <p>We do not knowingly collect personal information from children under the age of 13.</p>
              <p>If we become aware that personal information has been collected from a child unlawfully, we will take appropriate steps to remove such information.</p>
              <p>Parents or legal guardians who believe a child has provided personal information may contact us to request its removal.</p>
            </section>
            <section id="sec-20" className="privacy-section">
              <h2 className="privacy-section-title">20. Third-Party Websites and Services</h2>
              <p>Our website and digital products may contain links to third-party websites, applications, software and services.</p>
              <p>Margam360 AI is not responsible for the independent privacy practices, content, availability or security of third-party services.</p>
              <p>We encourage users to review their respective privacy policies and terms of service before providing personal information or using their services.</p>
            </section>
            <section id="sec-21" className="privacy-section">
              <h2 className="privacy-section-title">21. Changes to This Privacy Policy</h2>
              <p>We reserve the right to update this Privacy Policy periodically to reflect changes in our business practices, technologies, products, services or applicable legal requirements.</p>
              <p>Any updates will be published on this page with a revised "Last Updated" date.</p>
              <p>Where required by applicable law, additional notice or consent will be provided.</p>
            </section>
            <section id="sec-22" className="privacy-section">
              <h2 className="privacy-section-title">22. Contact Us</h2>
              <p>If you have any questions, concerns or requests regarding this Privacy Policy or the handling of your personal information, please contact us.</p>
              <p className="privacy-contact-line"><strong>Business Name:</strong> Margam360 AI</p>
              <p className="privacy-contact-line"><strong>Legal Entity:</strong> Margam360</p>
              <p className="privacy-contact-line"><strong>Website:</strong> <a href="https://ai.margam360.com" target="_blank" rel="noopener noreferrer">https://ai.margam360.com</a></p>
              <p className="privacy-contact-line"><strong>Email:</strong> <a href="mailto:hi@margam360.com">hi@margam360.com</a></p>
              <p className="privacy-contact-line"><strong>Business Address:</strong> Habsiguda, Hyderabad, Telangana 500007</p>
              <p className="privacy-copyright">© 2026 Margam360 AI. All rights reserved.</p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="privacy-footer">
        <div className="privacy-footer-inner">
          <p>© 2026 Margam360 AI. All rights reserved.</p>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
          >
            Back to Homepage
          </a>
        </div>
      </footer>
    </div>
  );
}
