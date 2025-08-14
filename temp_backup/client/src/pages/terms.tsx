import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
          <p className="text-gray-600 mb-2">EURAMED LTD</p>
          <p className="text-gray-600 mb-2">Company Number: 16621355</p>
          <p className="text-gray-600 mb-2">Incorporation Date: August 1st, 2025</p>
          <p className="text-gray-600 mb-2">Registered Address: 71–75, Shelton Street, Covent Garden, London, WC2H 9JQ</p>
          <p className="text-gray-600 mb-2">Website: <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
          <p className="text-gray-600 mb-8">Effective Date: August 1st, 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. About Our Service</h2>
              <p className="text-gray-700 mb-4">
                www.euramedglobal.com offers e-Visa consultancy services through our website. We operate as a private, independent consultancy and are not affiliated with the Turkish government or any official immigration authority.
              </p>
              <p className="text-gray-700">
                By using our services, you understand and agree that we are not responsible for the final decision of your visa application, which is solely at the discretion of the official government systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Scope of Service</h2>
              <p className="text-gray-700 mb-4">Our service includes:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Collecting your application data via an online form</li>
                <li>Reviewing the information for completeness</li>
                <li>Submitting the e-Visa application on your behalf to the official platform</li>
                <li>Providing updates and approved visa documents via email</li>
              </ul>
              <p className="text-gray-700 mt-4">
                The service is considered complete once the application is submitted, regardless of the final approval or rejection by the official authorities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">By submitting your information and payment through our platform, you confirm that:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All the information provided is accurate, truthful, and complete</li>
                <li>You are authorized to use the credit or debit card provided</li>
                <li>You are aware of the non-refundable nature of the digital service once submitted</li>
                <li>You will not hold www.euramedglobal.com liable for any visa refusal, delay, or error originating from official systems or incorrect information provided by you</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Payment and Refund Policy</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All payments are processed via secure, 3D Secure-enabled payment gateways.</li>
                <li>The service is classified as a custom digital product, and once the application is submitted, it becomes non-refundable (UK Consumer Contracts Regulation 2013, Article 28(b)).</li>
                <li>If a refund is approved (prior to application submission), a processing fee of up to 20% may be retained.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                For full refund terms, refer to our Refund & Cancellation Policy at: <strong><a href="https://euramedglobal.com/refund" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com/refund</a></strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All website content including text, logos, and form structures are the intellectual property of www.euramedglobal.com and are protected by copyright laws.
              </p>
              <p className="text-gray-700">
                Unauthorized copying, use, or distribution is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">www.euramedglobal.com shall not be held liable for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Delays or failures caused by third-party systems or Turkish e-Visa platforms</li>
                <li>Incorrect or false information submitted by the user</li>
                <li>Refusal or cancellation of visa applications by official authorities</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Our maximum liability is limited to the amount paid for the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700 mb-4">
                This agreement shall be governed by the laws of England and Wales.
              </p>
              <p className="text-gray-700">
                Any disputes shall be resolved exclusively in the courts of London, United Kingdom.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-700 mb-4">
                For any inquiries related to these terms or your service, you may contact us at:
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