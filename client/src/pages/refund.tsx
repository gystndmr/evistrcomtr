import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Refund() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2024</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Refund Overview</h2>
              <p className="text-gray-700 mb-4">
                evisatr.xyz is committed to providing transparent refund policies. This policy outlines the circumstances 
                under which refunds may be issued and the process for requesting refunds.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Non-Refundable Fees</h2>
              <p className="text-gray-700 mb-4">The following fees are non-refundable under all circumstances:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>E-Visa Application Fee ($69):</strong> This fee is paid to Turkish authorities and cannot be refunded</li>
                <li><strong>Processing Fees:</strong> Service fees for application processing once work has begun</li>
                <li><strong>Supporting Document Fees:</strong> Fees for document review and verification services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Refundable Circumstances</h2>
              <p className="text-gray-700 mb-4">Refunds may be issued in the following limited circumstances:</p>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-900 mb-2">Full Refund Eligible</h3>
                <ul className="list-disc pl-6 text-green-800 space-y-2">
                  <li>Duplicate payment made in error</li>
                  <li>Technical error resulting in overcharge</li>
                  <li>Application not submitted due to our system failure</li>
                  <li>Service unavailable for your nationality (determined before processing)</li>
                </ul>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Partial Refund Eligible</h3>
                <ul className="list-disc pl-6 text-yellow-800 space-y-2">
                  <li>Cancellation within 1 hour of payment (processing fee refundable)</li>
                  <li>Our failure to meet guaranteed processing times</li>
                  <li>Significant service error on our part</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Non-Refundable Circumstances</h2>
              <p className="text-gray-700 mb-4">Refunds will NOT be issued for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Visa application rejection by Turkish authorities</li>
                <li>Incomplete or incorrect information provided by applicant</li>
                <li>Failure to provide required supporting documents</li>
                <li>Change of travel plans after application submission</li>
                <li>Delays caused by government processing or policy changes</li>
                <li>Customer dissatisfaction with processing time (within stated ranges)</li>
                <li>Applications submitted after our processing has begun</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Refund Process</h2>
              <p className="text-gray-700 mb-4">To request a refund:</p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Email us at <strong>info@evisatr.xyz</strong> with "Refund Request" in the subject line</li>
                <li>Include your application reference number and payment details</li>
                <li>Provide a detailed explanation of why you believe a refund is warranted</li>
                <li>Our team will review your request within 2-3 business days</li>
                <li>If approved, refunds will be processed within 5-10 business days</li>
                <li>Refunds will be issued to the original payment method</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Processing Times</h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 mb-2"><strong>Review Time:</strong> 2-3 business days</p>
                <p className="text-blue-900 mb-2"><strong>Processing Time:</strong> 5-10 business days (if approved)</p>
                <p className="text-blue-900"><strong>Bank Processing:</strong> Additional 3-5 business days (varies by bank)</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you disagree with our refund decision, you may:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Request a review by our customer service manager</li>
                <li>Provide additional documentation to support your claim</li>
                <li>Contact your credit card company for dispute resolution</li>
                <li>Seek mediation through consumer protection agencies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Important Notes</h2>
              <div className="bg-yellow-50 rounded-lg p-4">
                <ul className="list-disc pl-6 text-yellow-800 space-y-2">
                  <li>Refund requests must be made within 30 days of payment</li>
                  <li>All refunds are subject to our terms and conditions</li>
                  <li>Processing fees may apply for refund transactions</li>
                  <li>Refunds do not include bank charges or currency conversion fees</li>
                  <li>This policy may be updated without prior notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">For refund requests or questions about this policy:</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> info@evisatr.xyz</p>
                <p className="text-gray-700"><strong>Subject:</strong> Refund Request - [Your Application Number]</p>
                <p className="text-gray-700"><strong>Website:</strong> evisatr.xyz</p>
                <p className="text-gray-700"><strong>Response Time:</strong> 2-3 business days</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}