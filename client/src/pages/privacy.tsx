import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-2">EURAMED LTD</p>
          <p className="text-gray-600 mb-2">Company Number: 16621355</p>
          <p className="text-gray-600 mb-2">Incorporation Date: August 1st, 2025</p>
          <p className="text-gray-600 mb-2">Registered Address: 71–75, Shelton Street, Covent Garden, London, WC2H 9JQ</p>
          <p className="text-gray-600 mb-2">Website: <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
          <p className="text-gray-600 mb-8">Effective Date: August 1st, 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy outlines how www.euramedglobal.com ("we", "us", "our") collects, uses, stores, and shares your personal data when you use our e-Visa consultation services via our website.
              </p>
              <p className="text-gray-700 mb-4">
                We are committed to protecting your privacy in accordance with applicable data protection laws including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>The UK Data Protection Act 2018</li>
                <li>The General Data Protection Regulation (EU) 2016/679 (GDPR)</li>
                <li>The Privacy and Electronic Communications Regulations (PECR)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Data We Collect</h2>
              <p className="text-gray-700 mb-4">We may collect the following types of personal information when you use our services:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Full name</li>
                <li>Date of birth</li>
                <li>Nationality and country of residence</li>
                <li>Passport number, issue and expiry dates</li>
                <li>Travel dates and purpose of visit</li>
                <li>Contact information (email address, phone number)</li>
                <li>IP address, browser, device type and timestamp</li>
                <li>Payment confirmation details (only via secure 3D gateway; we do not store card numbers)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Purpose of Data Processing</h2>
              <p className="text-gray-700 mb-4">Your personal data is collected and used for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>To prepare and submit e-Visa applications on your behalf</li>
                <li>To communicate with you during the visa application process</li>
                <li>To process secure payments via 3D Secure channels</li>
                <li>To comply with legal and regulatory obligations</li>
                <li>To prevent fraud and ensure transaction security</li>
              </ul>
              <p className="text-gray-700 mb-4 mt-4">
                <strong>Legal Basis for Processing:</strong><br/>
                As per GDPR Article 6(1):
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>(a) Consent</li>
                <li>(b) Performance of a contract</li>
                <li>(c) Compliance with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
              <p className="text-gray-700 mb-4">Your data will be stored:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>For a period of up to 12 months after your application is completed</li>
                <li>Or longer if required by legal, regulatory, or tax obligations</li>
                <li>After this period, data is securely deleted or anonymized</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights Under GDPR</h2>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access – You can request a copy of your data</li>
                <li>Rectification – You can correct incorrect or incomplete data</li>
                <li>Erasure – You can request deletion under certain conditions</li>
                <li>Restriction – You can limit processing under certain conditions</li>
                <li>Objection – You can object to processing based on legitimate interests</li>
                <li>Portability – You can receive your data in a portable format</li>
                <li>Withdraw Consent – You may revoke consent at any time</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise any of these rights, contact us at: info@euramedglobal.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">We apply robust security measures to protect your data, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>256-bit SSL encryption</li>
                <li>ISO-certified cloud data storage</li>
                <li>Role-based access control</li>
                <li>Multi-factor authentication</li>
                <li>Regular security audits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Third-Party Disclosures</h2>
              <p className="text-gray-700 mb-4">
                We may share your data with third parties only when necessary and with appropriate safeguards:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Turkish government e-Visa application systems</li>
                <li>Payment processors for secure card transactions</li>
                <li>Cloud-based secure email communication platforms</li>
              </ul>
              <p className="text-gray-700 mt-4">We never sell or lease your data to any third party.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. International Transfers</h2>
              <p className="text-gray-700 mb-4">If your data is transferred outside the UK or EU, we ensure:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Standard Contractual Clauses (SCCs) are in place</li>
                <li>Third-party processors are GDPR-compliant</li>
                <li>Encryption and minimization measures are enforced</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">Our website may use cookies for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Session management</li>
                <li>Language preferences</li>
                <li>Analytics (anonymous)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Users can manage cookies via their browser settings. Full cookie policy is available on our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may occasionally update this Privacy Policy. The updated version will always be available at 
                <a href="https://euramedglobal.com/privacy" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com/privacy</a> and marked with the latest "Effective Date".
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns regarding your data or this policy, you may contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>📧 Email:</strong> info@euramedglobal.com</p>
                <p className="text-gray-700"><strong>🌐 Website:</strong> <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
                <p className="text-gray-700"><strong>📅 Effective Date:</strong> August 1st, 2025</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}