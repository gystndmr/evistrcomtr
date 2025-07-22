import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">Son güncelleme: Temmuz 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Service Description</h2>
              <p className="text-gray-700 mb-4">
                evisatr.xyz is a professional visa application service that assists travelers in obtaining Turkey e-visas. 
                We are an independent service provider and not affiliated with the Turkish government or any official visa processing entity.
              </p>
              <p className="text-gray-700">
                Our service includes application processing, document review, and customer support throughout the visa application process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By using our services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, 
                you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Service Fees</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>E-Visa Application Fee: $69 (non-refundable)</li>
                <li>Processing Fees: $25 - $295 (based on processing speed)</li>
                <li>Supporting Document Fees: $50 - $645 (if required)</li>
                <li>All fees are clearly displayed before payment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Application Process</h2>
              <p className="text-gray-700 mb-4">
                We will process your application with the utmost care and professionalism. However, visa approval is ultimately 
                determined by Turkish immigration authorities. We cannot guarantee visa approval.
              </p>
              <p className="text-gray-700">
                Processing times are estimates and may vary based on application complexity and government processing times.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Customer Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Submit all required documents in the correct format</li>
                <li>Ensure passport validity meets requirements</li>
                <li>Review all information before submission</li>
                <li>Comply with Turkish immigration laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                evisatr.xyz shall not be liable for any indirect, incidental, special, or consequential damages arising from 
                the use of our services. Our liability is limited to the amount of fees paid for our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                We are committed to protecting your personal information. Please refer to our Privacy Policy for details on 
                how we collect, use, and protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
                on our website. Continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> info@evisatr.xyz</p>
                <p className="text-gray-700"><strong>Website:</strong> evisatr.xyz</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}