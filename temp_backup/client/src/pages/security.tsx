import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Security() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Security & Legal Protection Policy
          </h1>
          <p className="text-gray-600 mb-2">EURAMED LTD</p>
          <p className="text-gray-600 mb-2">Company Number: 16621355</p>
          <p className="text-gray-600 mb-2">Incorporation Date: August 1st, 2025</p>
          <p className="text-gray-600 mb-2">Registered Address: 71–75, Shelton Street, Covent Garden, London, WC2H 9JQ</p>
          <p className="text-gray-600 mb-2">Website: <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
          <p className="text-gray-600 mb-8">Effective Date: August 1st, 2025</p>
          
          <div className="prose max-w-none space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Data Security Commitment</h2>
              
              <p className="text-gray-700 mb-4">
                EURAMED LTD is committed to maintaining the highest standards of data security and protection. 
                We implement comprehensive security measures to safeguard personal and sensitive information 
                in accordance with applicable laws and regulations.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-900 mb-3">Our Security Standards</h3>
                <ul className="text-blue-800 space-y-2">
                  <li>• <strong>UK Data Protection Act 2018:</strong> Full compliance with UK data protection regulations</li>
                  <li>• <strong>EU General Data Protection Regulation (GDPR):</strong> Adherence to European data protection standards</li>
                  <li>• <strong>ISO/IEC 27001 Information Security Standards:</strong> Implementation of internationally recognized security frameworks</li>
                  <li>• <strong>Industry Best Practices:</strong> Continuous adoption of evolving security technologies and methodologies</li>
                </ul>
              </div>
              <p className="text-gray-700">
                We regularly review and update our security policies to ensure continued effectiveness 
                and compliance with emerging threats and regulatory requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Security Practices</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Technical Security Measures</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• <strong>SSL/TLS Encryption:</strong> All data transmissions protected with advanced encryption protocols</li>
                    <li>• <strong>3D Secure Payment Processing:</strong> Enhanced authentication for all financial transactions</li>
                    <li>• <strong>Secure Data Storage:</strong> Encrypted databases with restricted access controls</li>
                    <li>• <strong>Network Security:</strong> Firewall protection and intrusion detection systems</li>
                    <li>• <strong>Regular Security Updates:</strong> Continuous system patching and vulnerability management</li>
                  </ul>
                </div>
                <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">Administrative Security Controls</h3>
                  <ul className="text-purple-800 space-y-2">
                    <li>• <strong>Role-Based Access Controls:</strong> Principle of least privilege for all system access</li>
                    <li>• <strong>Multi-Factor Authentication:</strong> Additional security layers for administrative access</li>
                    <li>• <strong>Employee Training:</strong> Regular security awareness and best practices education</li>
                    <li>• <strong>Background Checks:</strong> Thorough vetting of personnel with access to sensitive data</li>
                    <li>• <strong>Confidentiality Agreements:</strong> Legal obligations for all staff handling personal data</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Monitoring and Auditing</h3>
                <p className="text-gray-700 mb-3">
                  We maintain comprehensive logs of all system activities and conduct regular security audits 
                  to ensure the effectiveness of our security measures.
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li>• 24/7 security monitoring and threat detection</li>
                  <li>• Regular penetration testing and vulnerability assessments</li>
                  <li>• Annual third-party security audits</li>
                  <li>• Continuous compliance monitoring</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Fraud Detection and Prevention</h2>
              
              <p className="text-gray-700 mb-4">
                EURAMED LTD employs advanced fraud detection systems and procedures to protect our 
                users and maintain the integrity of our services.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Automated Monitoring Systems</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Real-time transaction monitoring for suspicious activity patterns</li>
                    <li>• Machine learning algorithms for fraud pattern recognition</li>
                    <li>• Automated alerts for high-risk transactions</li>
                    <li>• IP address and device fingerprinting for identity verification</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Manual Review Processes</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Trained fraud analysts review flagged transactions</li>
                    <li>• Customer verification procedures for suspicious activities</li>
                    <li>• Documentation and investigation of fraud attempts</li>
                    <li>• Coordination with payment processors and financial institutions</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Reporting and Response</h3>
                  <p className="text-gray-700 mb-2">
                    When fraud is detected or suspected, we take immediate action including:
                  </p>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Immediate transaction suspension or reversal</li>
                    <li>• Customer notification and account protection measures</li>
                    <li>• Reporting to relevant authorities as required by law</li>
                    <li>• Cooperation with law enforcement investigations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Legal Reporting Obligations</h2>
              
              <p className="text-gray-700 mb-4">
                EURAMED LTD maintains strict compliance with all applicable legal reporting requirements 
                and cooperates fully with regulatory authorities and law enforcement agencies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">UK Legal Framework</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• <strong>UK Fraud Act 2006:</strong> Compliance with fraud prevention and reporting requirements</li>
                    <li>• <strong>Proceeds of Crime Act 2002:</strong> Anti-money laundering obligations</li>
                    <li>• <strong>Data Protection Act 2018:</strong> Data breach notification requirements</li>
                    <li>• <strong>Consumer Rights Act 2015:</strong> Consumer protection compliance</li>
                  </ul>
                </div>
                <div className="border border-indigo-200 bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-900 mb-3">International Compliance</h3>
                  <ul className="text-indigo-800 space-y-2">
                    <li>• <strong>Turkish Penal Code:</strong> Compliance with Turkish fraud and cybercrime laws</li>
                    <li>• <strong>EU GDPR:</strong> Cross-border data protection compliance</li>
                    <li>• <strong>International Sanctions:</strong> Adherence to UK and EU sanctions regimes</li>
                    <li>• <strong>Cross-Border Cooperation:</strong> Support for international investigations</li>
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Reporting Procedures</h3>
                <p className="text-yellow-800 mb-3">
                  We maintain established procedures for reporting to relevant authorities:
                </p>
                <ul className="text-yellow-800 space-y-1">
                  <li>• Action Fraud (UK): Suspicious financial activities and fraud attempts</li>
                  <li>• Information Commissioner's Office (ICO): Data protection incidents</li>
                  <li>• National Crime Agency (NCA): Serious organized crime matters</li>
                  <li>• Turkish Authorities: Matters involving Turkish jurisdiction</li>
                  <li>• Financial Conduct Authority (FCA): Payment service related incidents</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Breach Protocol</h2>
              
              <p className="text-gray-700 mb-4">
                In the unlikely event of a data security incident, EURAMED LTD has established 
                comprehensive procedures to ensure rapid response, containment, and notification.
              </p>
              <div className="space-y-6">
                <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-3">Immediate Response (0-24 hours)</h3>
                  <ul className="text-red-800 space-y-2">
                    <li>• <strong>Incident Detection:</strong> Automated systems and staff training ensure rapid identification</li>
                    <li>• <strong>Containment:</strong> Immediate steps to prevent further unauthorized access</li>
                    <li>• <strong>Assessment:</strong> Evaluation of the scope and potential impact</li>
                    <li>• <strong>Documentation:</strong> Detailed logging of all incident details and response actions</li>
                  </ul>
                </div>
                <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3">Investigation and Remediation (24-72 hours)</h3>
                  <ul className="text-orange-800 space-y-2">
                    <li>• <strong>Forensic Analysis:</strong> Detailed investigation to determine cause and extent</li>
                    <li>• <strong>System Restoration:</strong> Secure restoration of affected systems and data</li>
                    <li>• <strong>Security Enhancement:</strong> Implementation of additional protective measures</li>
                    <li>• <strong>Evidence Preservation:</strong> Secure storage of digital evidence for potential legal proceedings</li>
                  </ul>
                </div>
                <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Notification and Communication</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• <strong>Regulatory Notification:</strong> ICO notification within 72 hours if required</li>
                    <li>• <strong>Customer Communication:</strong> Affected individuals notified without undue delay</li>
                    <li>• <strong>Transparency:</strong> Clear, accurate information about the incident and protective actions</li>
                    <li>• <strong>Support Services:</strong> Assistance and guidance for affected individuals</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Security Liability</h2>
              
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <p className="text-amber-900 mb-4">
                  <strong>Important Legal Notice:</strong> While EURAMED LTD implements comprehensive security 
                  measures and maintains the highest industry standards, no security system can provide 
                  absolute protection against all possible threats.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Security Commitment</h3>
                    <ul className="text-amber-800 space-y-1">
                      <li>• We employ industry-leading security practices and technologies</li>
                      <li>• Regular security audits and updates are performed</li>
                      <li>• Staff receive ongoing security training and certification</li>
                      <li>• We maintain appropriate cyber security insurance coverage</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">User Responsibilities</h3>
                    <ul className="text-amber-800 space-y-1">
                      <li>• Users must maintain the confidentiality of their account credentials</li>
                      <li>• Prompt reporting of suspected security incidents is required</li>
                      <li>• Users should follow recommended security practices</li>
                      <li>• Regular monitoring of account activity is advised</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Liability Limitations</h3>
                    <p className="text-amber-800">
                      Subject to applicable law, EURAMED LTD's liability for security incidents is limited 
                      to direct damages and excludes consequential, indirect, or punitive damages. 
                      Our maximum liability shall not exceed the amount paid by the affected user 
                      for services in the 12 months preceding the incident.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Security Incidents</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Email:</strong> security@euramedglobal.com</p>
                    <p><strong>Phone:</strong> +44 20 3807 0060</p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                    <p><strong>Severity Level:</strong> Immediate escalation for critical incidents</p>
                  </div>
                </div>
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">General Inquiries</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Email:</strong> info@euramedglobal.com</p>
                    <p><strong>Phone:</strong> +44 20 3807 0060</p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                    <p><strong>Office Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM GMT</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-blue-900 mb-3">Company Information</h3>
                <div className="text-blue-800 space-y-1">
                  <p><strong>Company Name:</strong> EURAMED LTD</p>
                  <p><strong>Company Number:</strong> 16621355</p>
                  <p><strong>Registered Address:</strong> 71-75 Shelton Street, London, WC2H 9JQ, United Kingdom</p>
                  <p><strong>Website:</strong> <a href="https://euramedglobal.com/" className="text-blue-600 hover:text-blue-800 underline">www.euramedglobal.com</a></p>
                  <p><strong>Data Protection Registration:</strong> ICO Registration Number [Available upon request]</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-green-900 mb-3">Emergency Contacts</h3>
                <div className="text-green-800 space-y-2">
                  <p><strong>Critical Security Incidents:</strong> security-emergency@euramedglobal.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@euramedglobal.com</p>
                  <p><strong>Legal Compliance:</strong> legal@euramedglobal.com</p>
                  <p><strong>24/7 Emergency Line:</strong> +44 20 3807 0060 (Press 1 for emergencies)</p>
                </div>
              </div>
            </section>
            <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg mt-8">
              <p className="text-sm text-gray-600 text-center">
                This Security & Legal Protection Policy is effective as of August 1st, 2025, and may be updated 
                periodically to reflect changes in our security practices, legal requirements, or business operations. 
                Users will be notified of material changes through appropriate channels.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}