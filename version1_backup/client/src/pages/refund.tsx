import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Refund() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Refund & Cancellation Policy
          </h1>
          <p className="text-gray-600 mb-2">EURAMED LTD</p>
          <p className="text-gray-600 mb-2">Company Number: 16621355</p>
          <p className="text-gray-600 mb-2">Incorporation Date: August 1st, 2025</p>
          <p className="text-gray-600 mb-2">Registered Address: 71–75, Shelton Street, Covent Garden, London, WC2H 9JQ</p>
          <p className="text-gray-600 mb-2">Website: <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
          <p className="text-gray-600 mb-8">Effective Date: August 1st, 2025</p>
          
          <div className="prose max-w-none space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Legal Framework and Service Type</h2>
              
              <p className="text-gray-700 mb-4">
                EURAMED LTD provides e-Visa consultancy as a custom digital service. This means that once 
                your application has been processed and submitted, the service becomes non-refundable under 
                applicable consumer rights legislation.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-900 mb-3">Legal Classification</h3>
                <p className="text-blue-800 mb-3">
                  This type of service falls under the classification of non-refundable digital content, as outlined in:
                </p>
                <ul className="text-blue-800 space-y-2">
                  <li>• <strong>UK Consumer Contracts Regulation 2013, Article 28(b)</strong></li>
                  <li>• <strong>EU Consumer Rights Directive (Directive 2011/83/EU)</strong></li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Refund Eligibility</h2>
              
              <p className="text-gray-700 mb-4">
                Refunds may be considered under the following limited conditions:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        Condition
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                        Refund Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        Application not submitted yet
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          ✅ Possible (with up to 20% service fee deducted)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        Application submitted but not yet reviewed by authorities
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          ❌ Not refundable
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        Government rejection or denial
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          ❌ Not refundable
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        Duplicate payment or technical error
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          ✅ Full refund upon verification
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
                <p className="text-amber-800 text-sm">
                  <strong>Note:</strong> Refund requests will be evaluated on a case-by-case basis.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How to Request a Refund</h2>
              
              <p className="text-gray-700 mb-4">To request a refund, you must:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Required Steps</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• <strong>Contact us within 7 calendar days of payment</strong></li>
                    <li>• <strong>Provide your full name, email, transaction ID, and reason</strong></li>
                    <li>• <strong>Email your request to:</strong> info@euramedglobal.com</li>
                  </ul>
                </div>
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Processing Timeline</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• <strong>Review Period:</strong> 5-7 business days</li>
                    <li>• <strong>Response Time:</strong> Typically reviewed and responded to within this period</li>
                    <li>• <strong>Refund Processing:</strong> If approved, processed within 14 business days</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Non-Refundable Circumstances</h2>
              
              <p className="text-gray-700 mb-4">No refund will be issued under the following conditions:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">User-Related Issues</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• User provides incorrect or false information</li>
                    <li>• User fails to upload necessary documents on time</li>
                    <li>• User changes mind after application is submitted</li>
                    <li>• User fails to respond to follow-up emails for required actions</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">External Factors</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Government denies or delays the visa without fault of EURAMED LTD</li>
                    <li>• Changes in government policies or procedures</li>
                    <li>• Processing delays due to external factors beyond our control</li>
                    <li>• Force majeure events affecting service delivery</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Chargebacks and Disputes</h2>
              
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-4">⚠️ Important Warning</h3>
                <p className="text-red-800 mb-4">
                  Users who initiate unauthorized chargebacks or payment disputes without first contacting us will be:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-red-800 space-y-2">
                    <li>• <strong>Blocked from future use of our services</strong></li>
                    <li>• <strong>Reported to payment processors and flagged in global fraud monitoring databases</strong></li>
                  </ul>
                  <ul className="text-red-800 space-y-2">
                    <li>• <strong>Legally pursued if the chargeback is deemed fraudulent</strong></li>
                    <li>• <strong>Subject to recovery of legal costs and damages</strong></li>
                  </ul>
                </div>
                
                <div className="bg-red-100 border border-red-300 p-3 rounded mt-4">
                  <p className="text-red-900 text-sm">
                    <strong>Reference:</strong> Our full Payment & 3D Secure Policy is available at: 
                    <br />
                    📄 <a href="https://euramedglobal.com/payment-policy" className="font-mono text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com/payment-policy</a>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Currency and Payment Method of Refunds</h2>
              
              <p className="text-gray-700 mb-4">Approved refunds will:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-green-200 bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">💳</div>
                  <h3 className="font-semibold text-green-900 mb-2">Original Payment Method</h3>
                  <p className="text-green-800 text-sm">
                    Be returned using the original payment method
                  </p>
                </div>
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">💱</div>
                  <h3 className="font-semibold text-blue-900 mb-2">Same Currency</h3>
                  <p className="text-blue-800 text-sm">
                    Be processed in the same currency used during payment
                  </p>
                </div>
                <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">⏱️</div>
                  <h3 className="font-semibold text-purple-900 mb-2">Processing Time</h3>
                  <p className="text-purple-800 text-sm">
                    Be issued within 14 business days of approval
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Additional Charges</h3>
                <p className="text-yellow-800 text-sm">
                  Bank transfer charges or currency conversion fees (if any) will be deducted from the refunded amount.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h2>
              
              <p className="text-gray-700 mb-4">For refund-related queries, please reach out to:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">📧 Email Contact</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Email:</strong> info@euramedglobal.com</p>
                    <p><strong>Subject Line:</strong> "Refund Request - [Transaction ID]"</p>
                    <p><strong>Response Time:</strong> 5-7 business days</p>
                  </div>
                </div>
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">🌐 Company Information</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Website:</strong> <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
                    <p><strong>Company:</strong> EURAMED LTD</p>
                    <p><strong>Registration:</strong> 16621355</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-blue-900 mb-3">🏢 Registered Address</h3>
                <div className="text-blue-800 space-y-1">
                  <p><strong>EURAMED LTD</strong></p>
                  <p>71–75, Shelton Street, Covent Garden</p>
                  <p>London, WC2H 9JQ</p>
                  <p>United Kingdom</p>
                </div>
              </div>
            </section>
            <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 text-center">
                This Refund & Cancellation Policy is effective as of August 1st, 2025, and may be updated 
                periodically to reflect changes in our business operations, legal requirements, or service offerings. 
                Customers will be notified of material changes through appropriate channels.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}