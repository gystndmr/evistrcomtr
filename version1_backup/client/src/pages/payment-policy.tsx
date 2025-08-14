import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PaymentPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Payment, Chargeback & 3D Secure Policy
          </h1>
          <p className="text-gray-600 mb-2">EURAMED LTD</p>
          <p className="text-gray-600 mb-2">Company Number: 16621355</p>
          <p className="text-gray-600 mb-2">Incorporation Date: August 1st, 2025</p>
          <p className="text-gray-600 mb-2">Registered Address: 71–75, Shelton Street, Covent Garden, London, WC2H 9JQ</p>
          <p className="text-gray-600 mb-2">Website: <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
          <p className="text-gray-600 mb-8">Effective Date: August 1st, 2025</p>
          
          <div className="prose max-w-none space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Payment Methods</h2>
              
              <p className="text-gray-700 mb-4">
                All payments made on <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a> are processed through secure payment gateways 
                that support 3D Secure authentication.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Accepted Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <h4 className="font-semibold text-blue-800 mb-1">Major Credit Cards</h4>
                    <p className="text-blue-700 text-sm">Visa, MasterCard, etc.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛡️</div>
                    <h4 className="font-semibold text-blue-800 mb-1">3D Secure Debit Cards</h4>
                    <p className="text-blue-700 text-sm">Debit cards with 3D Secure enabled</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏦</div>
                    <h4 className="font-semibold text-blue-800 mb-1">Bank Platforms</h4>
                    <p className="text-blue-700 text-sm">Bank-based secure transaction platforms (where applicable)</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 3D Secure Protocol</h2>
              
              <p className="text-gray-700 mb-4">To enhance security and reduce fraud:</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Authentication Requirement</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• All card payments must be authenticated using 3D Secure</li>
                    <li>• Verified by Visa / MasterCard SecureCode implementation</li>
                    <li>• This step ensures the cardholder personally authorizes the transaction</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">⚖️ Legal Binding</h3>
                  <p className="text-green-800">
                    Once this verification is successful, the payment is <strong>legally binding</strong> and 
                    cannot be disputed as unauthorized.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. No Storage of Card Details</h2>
              
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-4">🔒 Security Compliance & PCI-DSS Standards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Data Protection</h4>
                    <ul className="text-purple-700 space-y-1">
                      <li>• EURAMED LTD does not store your full card details</li>
                      <li>• No processing or access to sensitive card information</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Secure Processing</h4>
                    <ul className="text-purple-700 space-y-1">
                      <li>• All transactions are encrypted</li>
                      <li>• Securely processed by certified third-party gateways</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Chargebacks and Unauthorized Disputes</h2>
              
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-4">⚠️ We Take Chargeback Abuse Seriously</h3>
                
                <div className="bg-red-100 border border-red-300 p-4 rounded-lg mb-4">
                  <p className="text-red-800 mb-3">
                    <strong>Important:</strong> If a user initiates a chargeback after a 3D-secure verified transaction 
                    without contacting our support first, it will be considered <strong>fraudulent behavior</strong>.
                  </p>
                </div>
                <h4 className="font-semibold text-red-900 mb-3">In Such Cases, We Reserve the Right To:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-red-300 bg-red-100 p-3 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">🚫 Service Ban</h5>
                    <p className="text-red-700 text-sm">
                      Ban the customer from all future services
                    </p>
                  </div>
                  
                  <div className="border border-red-300 bg-red-100 p-3 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">📋 Evidence Submission</h5>
                    <p className="text-red-700 text-sm">
                      Submit all transaction evidence to payment processor
                    </p>
                  </div>
                  
                  <div className="border border-red-300 bg-red-100 p-3 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">⚖️ Legal Challenge</h5>
                    <p className="text-red-700 text-sm">
                      Legally challenge the chargeback if deemed baseless
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Evidence We Submit Includes:</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• IP address and location data</li>
                    <li>• Complete form data and user inputs</li>
                    <li>• 3D Secure authentication logs</li>
                    <li>• Detailed timestamps of all interactions</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-blue-900 mb-3">⚖️ Legal References</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-blue-800 space-y-2">
                    <li>• <strong>UK Financial Services and Markets Act 2000</strong></li>
                    <li>• <strong>PSD2 Directive (EU)</strong></li>
                  </ul>
                  <ul className="text-blue-800 space-y-2">
                    <li>• <strong>Mastercard & Visa Chargeback Guidelines</strong></li>
                    <li>• <strong>Turkish Law No. 5464 on Bank Cards and Credit Cards</strong></li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Payment Confirmation and Invoicing</h2>
              
              <p className="text-gray-700 mb-4">After a successful payment:</p>
              
              <div className="space-y-4">
                <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">📧 Automated Confirmation</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• You will receive an automated payment confirmation email</li>
                    <li>• Transaction details and digital invoice will be sent to your checkout email</li>
                    <li>• All completed payments will be recorded and archived</li>
                  </ul>
                </div>
                <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">📄 Documentation</h3>
                  <p className="text-gray-700">
                    Your digital invoice serves as official proof of payment and includes all necessary 
                    transaction details for your records and any potential correspondence with authorities.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Payment Failure and Retry Policy</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">If Your Payment Fails:</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• You may retry the transaction after checking card details and 3D Secure step</li>
                    <li>• If the issue persists, contact your card issuer</li>
                    <li>• Alternatively, reach out to info@euramedglobal.com for assistance</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Warning</h3>
                  <p className="text-yellow-800">
                    <strong>Do not attempt excessive retries</strong>, as this may temporarily block your card 
                    due to anti-fraud measures implemented by your bank or card issuer.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Troubleshooting Tips</h3>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Ensure your card has sufficient funds or available credit</li>
                    <li>• Verify that international transactions are enabled</li>
                    <li>• Check that your 3D Secure authentication is active</li>
                    <li>• Try using a different browser or device if issues persist</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Refund Reference</h2>
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-3">📄 Related Policies</h3>
                <p className="text-amber-800 mb-2">
                  For refund eligibility and procedure, please refer to our:
                </p>
                <div className="bg-amber-100 border border-amber-300 p-3 rounded">
                  <p className="text-amber-900 font-semibold">
                    📄 Refund & Cancellation Policy
                  </p>
                  <p className="text-amber-800 text-sm mt-1">
                    Available on our website and provides comprehensive information about refund conditions, 
                    timelines, and procedures.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              
              <p className="text-gray-700 mb-4">
                If you have questions or concerns regarding your payment or transaction security, contact us at:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">📧 Email Support</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Email:</strong> info@euramedglobal.com</p>
                    <p><strong>Subject:</strong> "Payment Inquiry - [Transaction ID]"</p>
                    <p><strong>Response Time:</strong> 24-48 hours</p>
                  </div>
                </div>
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">🌐 Company Information</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Website:</strong> www.euramedglobal.com</p>
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}