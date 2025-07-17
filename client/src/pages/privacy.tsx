import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2024</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                evisatr.xyz collects personal information necessary to process your Turkey e-visa application. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Personal details (name, date of birth, nationality)</li>
                <li>Contact information (email, phone number)</li>
                <li>Passport information and photographs</li>
                <li>Travel plans and accommodation details</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Supporting documents as required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your personal information to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Process your Turkey e-visa application</li>
                <li>Communicate with you about your application status</li>
                <li>Provide customer support services</li>
                <li>Send important updates and notifications</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>With Turkish immigration authorities for visa processing</li>
                <li>With trusted service providers who assist in our operations</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure data storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
                <li>Compliance with international data protection standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Application data: 7 years (for legal compliance)</li>
                <li>Communication records: 3 years</li>
                <li>Payment information: As required by financial regulations</li>
                <li>Marketing preferences: Until you opt out</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access your personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Withdraw consent for marketing communications</li>
                <li>File a complaint with data protection authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies to enhance your browsing experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Essential cookies for website functionality</li>
                <li>Analytics cookies to improve our services</li>
                <li>Preference cookies to remember your settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We use trusted third-party services for payment processing and email communications. These providers 
                have their own privacy policies and security measures.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any significant changes 
                via email or website notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this privacy policy or how we handle your data, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> info@evisatr.xyz</p>
                <p className="text-gray-700"><strong>Website:</strong> evisatr.xyz</p>
                <p className="text-gray-700"><strong>Subject:</strong> Privacy Policy Inquiry</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}