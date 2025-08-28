import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const sections = [
  { id: "introduction", title: "Introduction", level: 1 },
  { id: "information-we-collect", title: "Information We Collect", level: 1 },
  { id: "personal-information", title: "Information You Provide Directly", level: 2 },
  { id: "automatically-collected", title: "Information Passively Collected", level: 2 },
  { id: "third-party-information", title: "Information from Third Parties", level: 2 },
  { id: "how-we-use", title: "How We Use Your Information", level: 1 },
  { id: "visa-services", title: "Visa Consultation Services", level: 2 },
  { id: "communication", title: "Communication", level: 2 },
  { id: "legal-compliance", title: "Legal Compliance", level: 2 },
  { id: "information-sharing", title: "Information Sharing and Disclosure", level: 1 },
  { id: "third-parties", title: "Third-Party Service Providers", level: 2 },
  { id: "government-agencies", title: "Government Agencies", level: 2 },
  { id: "legal-requirements", title: "Legal Requirements", level: 2 },
  { id: "data-security", title: "Data Security", level: 1 },
  { id: "data-retention", title: "Data Retention", level: 1 },
  { id: "cookies", title: "Cookies and Electronic Technologies", level: 1 },
  { id: "analytics-advertising", title: "Online Analytics and Advertising", level: 1 },
  { id: "your-rights", title: "Your Choices", level: 1 },
  { id: "access-rights", title: "Account Information", level: 2 },
  { id: "deletion-rights", title: "Marketing Emails", level: 2 },
  { id: "portability", title: "Cookies & Analytics", level: 2 },
  { id: "region-specific", title: "Region-Specific Rights", level: 1 },
  { id: "third-party-links", title: "Third-Party Links", level: 1 },
  { id: "children-privacy", title: "Children's Privacy", level: 1 },
  { id: "international-transfers", title: "International Data Transfers", level: 1 },
  { id: "policy-updates", title: "Changes to This Privacy Policy", level: 1 },
  { id: "contact-us", title: "Contact Us", level: 1 },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      const currentSection = sectionElements.find(({ element }) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom > 120;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contents</h2>
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <nav className="space-y-1">
                      {sections.map((section) => (
                        <Button
                          key={section.id}
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-left h-auto py-2 px-3 ${
                            section.level === 2 ? "pl-6 text-sm" : "text-sm font-medium"
                          } ${
                            activeSection === section.id
                              ? "bg-primary/10 text-primary"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                          onClick={() => scrollToSection(section.id)}
                        >
                          {section.level === 2 && (
                            <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
                          )}
                          <span className="truncate">{section.title}</span>
                        </Button>
                      ))}
                    </nav>
                  </ScrollArea>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                  <p className="text-gray-600 mb-8">
                    Last updated: 9 August 2025
                  </p>

                  <div className="prose prose-lg max-w-none space-y-8">
                    <section id="introduction">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                      <p className="text-gray-700 mb-4">
                        Welcome to the website of EURAMED LTD ("EURAMED," "we," "us," or "our"). This Privacy Policy (the "Policy") describes how we collect, use, and disclose information from our website at <a href="https://euramedglobal.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">https://euramedglobal.com</a>, our e-visa application consultancy services, and any other online services we provide (collectively, the "Services"), as well as information we may collect offline.
                      </p>
                      <p className="text-gray-700 mb-4">
                        Before using the Services or otherwise providing us with information, please carefully review this Policy. By accessing or using any part of the Services, or otherwise providing us with information, you acknowledge and agree to the terms of this Policy, which is governed by the laws of England and Wales.
                      </p>
                    </section>

                    <section id="information-we-collect">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                      <p className="text-gray-700 mb-6">
                        We may collect information in different ways, including when you provide information directly to us, when we automatically collect information from your browser or device, or when we receive information from third parties (such as payment processors or government portals relevant to your application).
                      </p>
                      
                      <h3 id="personal-information" className="text-xl font-semibold text-gray-900 mb-3">Information You Provide Directly to Us</h3>
                      <p className="text-gray-700 mb-4">We collect information from you when you provide it directly to us, for example:</p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>When you contact us with inquiries</li>
                        <li>When you respond to one of our surveys</li>
                        <li>When you register for or purchase our Services, such as applying for an e-visa</li>
                        <li>When you communicate with us through our customer support channels (email or online chat)</li>
                        <li>When you request certain features (e.g., newsletters, updates)</li>
                        <li>When you otherwise provide us with information in connection with your application</li>
                      </ul>

                      <p className="text-gray-700 mb-4">
                        The type of information we request will depend on the Services you use and the requirements of the relevant destination country's immigration authority. For example, the information required may vary depending on the type of e-visa you request and the applicable local regulations.
                      </p>
                      <p className="text-gray-700 mb-4">
                        Information you may provide directly to us can include, but is not limited to, the following details about you or others (such as dependents included in your application):
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Residential address</li>
                        <li>Date of birth</li>
                        <li>City and country of birth</li>
                        <li>Nationality/citizenship</li>
                        <li>Gender</li>
                        <li>Passport information (passport number, issue and expiry date, place of issue, photo)</li>
                        <li>Travel details (arrival date, port of entry, purpose of travel)</li>
                        <li>Family information (names of family members)</li>
                        <li>Professional details (occupation, employer name)</li>
                        <li>Financial details such as payment card information provided to us and/or our secure payment processors</li>
                        <li>Other information required by the relevant government authority to process your e-visa application</li>
                      </ul>
                      <p className="text-gray-700 mb-6">
                        We will only request information that is necessary for the performance of our Services and, where required by law, we will obtain your consent before collecting sensitive personal data (e.g., religion) in accordance with the UK GDPR and the Data Protection Act 2018.
                      </p>

                      <h3 id="automatically-collected" className="text-xl font-semibold text-gray-900 mb-3">Information That Is Passively or Automatically Collected</h3>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Device and Usage Information</h4>
                      <p className="text-gray-700 mb-4">
                        We may automatically collect certain information about the computer or mobile devices (including smartphones and tablets) you use to access our Services. This information helps us to improve performance, enhance security, and better understand how our Services are used.
                      </p>
                      <p className="text-gray-700 mb-4">
                        As permitted by law, we may collect and analyse data such as:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li><strong>Device identifiers:</strong> IP address, general location information inferred from your IP address, unique device identifiers, IMEI, TCP/IP address</li>
                        <li><strong>Device and browser details:</strong> browser type and version, browser language, operating system, mobile network provider, the country or region from which you access the Services</li>
                        <li><strong>Usage information:</strong> referring and exit pages/URLs, platform type, number of clicks, domain names, landing pages, pages and content viewed (and the order viewed), time spent on specific pages, access dates and times, frequency of use, error logs, and similar diagnostic data</li>
                        <li><strong>Interaction patterns:</strong> mouse movements and scrolling behaviour on our website (we do not record or capture keystroke data)</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        We may use third-party analytics providers and technologies, including cookies, tracking pixels, and similar tools, to help us gather and process this information in compliance with the UK GDPR and the Privacy and Electronic Communications Regulations (PECR).
                      </p>
                      <p className="text-gray-700 mb-6">
                        Where required by law, we will request your consent before placing non-essential cookies or similar technologies on your device.
                      </p>

                      <h3 id="third-party-information" className="text-xl font-semibold text-gray-900 mb-3">Information Collected from Unaffiliated Parties</h3>
                      <p className="text-gray-700 mb-4">
                        We may obtain information about you from various unaffiliated third parties, such as social media platforms or other external websites.
                      </p>
                      <p className="text-gray-700 mb-4">For example:</p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>You may be able to access our Services or create an account using a third-party login, such as Google or Facebook</li>
                        <li>You may also interact with our official social media pages (e.g., by "liking" or posting content)</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        If you choose to connect with us through a third-party account or follow us on social media, you may be permitting us to access certain information from your social media profile, which may include:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Your name</li>
                        <li>Profile picture</li>
                        <li>Gender</li>
                        <li>Networks</li>
                        <li>User IDs</li>
                        <li>Friends list</li>
                        <li>Location</li>
                        <li>Date of birth</li>
                        <li>Email address</li>
                        <li>Photos or videos</li>
                        <li>People you follow or who follow you</li>
                        <li>Posts or "likes"</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        These third-party platforms have their own privacy policies governing how they use and disclose your personal information. For details on their practices, including the handling of information you make public, please consult their respective privacy policies. EURAMED LTD has no control over how any unaffiliated third party uses or discloses your personal data.
                      </p>
                      <p className="text-gray-700 mb-6">
                        We may also combine information collected directly from you (including information collected automatically through your device or browser) with information obtained from our affiliates or non-affiliated third parties, and use this combined data in accordance with this Privacy Policy and UK GDPR requirements.
                      </p>
                    </section>

                    <section id="cookies">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Other Electronic Technologies</h2>
                      <p className="text-gray-700 mb-4">
                        We may collect information about your use of the Services through technologies such as internet server logs, cookies, and tracking pixels.
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                        <li><strong>Web server logs</strong> are files where website activity is recorded.</li>
                        <li><strong>Cookies</strong> are small text files placed on your computer or device when you visit our website. These enable us to:
                          <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                            <li>Recognise your device on future visits</li>
                            <li>Store your preferences and settings</li>
                            <li>Understand which pages of the Services you have visited</li>
                            <li>Enhance your user experience by delivering content tailored to your interests</li>
                            <li>Conduct analytics and measure website performance</li>
                            <li>Assist with security and administrative functions</li>
                          </ul>
                        </li>
                        <li><strong>Tracking pixels</strong> (also called "web beacons" or "clear GIFs") are small electronic tags embedded in websites, emails, or online ads. They help us measure usage, determine the popularity of certain pages or content, and access user cookies.</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Cookie Choices</h3>
                      <p className="text-gray-700 mb-4">
                        Under the Privacy and Electronic Communications Regulations (PECR), you have the right to control the use of non-essential cookies. You can adjust your browser settings to be notified when cookies are set or updated, or block cookies entirely if you wish (note that essential cookies required for the site to function cannot be disabled without affecting core features).
                      </p>
                      <p className="text-gray-700 mb-4">
                        Instructions for managing cookies can be found in your browser's "Help" section (e.g., Microsoft Edge, Google Chrome, Mozilla Firefox, Apple Safari).
                      </p>
                      <p className="text-gray-700 mb-6">
                        Please note that blocking some or all cookies may result in certain features or services being unavailable or functioning less effectively.
                      </p>
                    </section>

                    <section id="analytics-advertising">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Online Analytics and Tailored Advertising</h2>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Online Analytics</h3>
                      <p className="text-gray-700 mb-4">
                        We may use third-party web analytics services, such as Google Analytics, to help us analyse how users interact with our Services. These providers use technologies described in the "Cookies and Other Electronic Technologies" section to collect data, including the referring website, navigation paths, and interactions with our content. This data (including your IP address) may be collected in real-time and shared with these providers for the purposes of evaluating and improving our Services.
                      </p>
                      <p className="text-gray-700 mb-4">
                        To prevent Google Analytics from collecting your data, you can install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">Google Analytics Opt-out Browser Add-on here</a>.
                      </p>
                      <p className="text-gray-700 mb-4">
                        If you receive an email from us, we may use technologies such as tracking pixels (clear GIFs) to determine when you open our email, click on links, or view banners. This helps us assess the effectiveness of our communications.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Tailored Advertising</h3>
                      <p className="text-gray-700 mb-4">
                        Our Services may integrate third-party advertising technologies to deliver relevant content and marketing to you on our site and across other websites and apps you use. These technologies may involve placing cookies or similar tools on your device to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Deliver advertising content based on your previous visits to our website and other sites</li>
                        <li>Measure the effectiveness of marketing campaigns and user interactions</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        We may work with ad networks (e.g., Google Ads, Meta) to show you tailored marketing content. These third parties may use cookies or tracking technologies over which EURAMED LTD has no control. This Policy does not govern the use of those cookies or technologies by unaffiliated third parties.
                      </p>
                      <p className="text-gray-700 mb-4">
                        If you prefer not to receive tailored advertising:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>You can visit the <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">Network Advertising Initiative (NAI) Consumer Opt-Out page here</a> and/or the <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">Digital Advertising Alliance (DAA) Consumer Opt-Out page here</a> to opt out of participating companies' targeted ads</li>
                        <li>You can adjust your Google ad preferences by visiting the <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">Google Ads Settings page</a></li>
                      </ul>
                      <p className="text-gray-700 mb-4">Please note:</p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Even if you opt out, you may still see advertisements — they will simply not be tailored to your interests</li>
                        <li>Your opt-out preferences may not persist if you clear your cookies, change devices, or switch browsers</li>
                        <li>We are not responsible for the operation, accuracy, or continued availability of any third-party opt-out tools</li>
                      </ul>
                    </section>

                    <section id="how-we-use">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Use of Your Personal Data and Other Information We Collect</h2>
                      <p className="text-gray-700 mb-4">
                        We may use the information we collect from and about you for the following purposes, in accordance with the UK GDPR and the Data Protection Act 2018:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                        <li>To provide the Services – including processing your e-visa application and related consultancy services</li>
                        <li>To respond to your questions and inquiries – such as customer service requests via email</li>
                        <li>To monitor your use of the Services – to ensure proper functionality, security, and compliance</li>
                        <li>To request your feedback – to improve our Services and user experience</li>
                        <li>To communicate with you about transactions – including payment confirmations, application status updates, and service notifications</li>
                        <li>To improve the Services or develop new features – based on user behaviour and feedback</li>
                        <li>To send you relevant information – including updates, surveys, or promotional content (where permitted by law and with your consent where required)</li>
                        <li>To personalise your experience – such as tailoring website content or recommendations</li>
                        <li>To enforce our Terms and Conditions – and protect the integrity of our platform</li>
                        <li>To protect EURAMED LTD, our staff, and third parties – including fraud prevention and security monitoring</li>
                        <li>To administer and troubleshoot the Services – including diagnosing technical issues</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Aggregated and De-Identified Data</h3>
                      <p className="text-gray-700 mb-4">
                        We may aggregate and/or anonymise personal data collected through the Services so that it no longer identifies you. Such anonymised or aggregated data may be used for any lawful purpose, including research, analytics, and marketing. We may also share such data with third parties such as advertisers, promotional partners, sponsors, and research institutions.
                      </p>
                    </section>

                    <section id="information-sharing">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
                      <p className="text-gray-700 mb-4">
                        We may disclose information about you in the following circumstances:
                      </p>
                      
                      <h3 id="third-parties" className="text-xl font-semibold text-gray-900 mb-3">Third-Party Service Providers</h3>
                      <p className="text-gray-700 mb-4">
                        We may share information with trusted service providers who perform certain functions on our behalf, such as:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Processing payments and financial transactions</li>
                        <li>Hosting and maintaining our website and systems</li>
                        <li>Sending emails and communications</li>
                        <li>Conducting analytics and research</li>
                        <li>Providing customer support</li>
                        <li>Assisting with visa application processing</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        These service providers are contractually obligated to protect your information and use it only for the specific services they provide to us.
                      </p>

                      <h3 id="government-agencies" className="text-xl font-semibold text-gray-900 mb-3">Government and Visa Processing</h3>
                      <p className="text-gray-700 mb-4">
                        To process your e-visa application, we may share your personal information with government agencies, immigration authorities, embassies, and consulates. This sharing is essential for the completion of visa applications and is carried out in accordance with the requirements of the destination country's immigration laws.
                      </p>

                      <h3 id="protection-of-rights" className="text-xl font-semibold text-gray-900 mb-3">Protection of EURAMED LTD and Others</h3>
                      <p className="text-gray-700 mb-4">
                        We reserve the right to access, read, preserve, and disclose any information that we believe is necessary to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Satisfy any applicable law, regulation, legal process, or governmental request</li>
                        <li>Enforce our Terms of Service or other contracts with you, including investigation of potential violations thereof</li>
                        <li>Detect, prevent, or otherwise address fraud, security, or technical issues</li>
                        <li>Respond to user support requests</li>
                        <li>Protect our rights, property, or safety, or that of our users or the general public</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        This includes exchanging information with other companies and organisations for fraud protection and spam/malware prevention.
                      </p>

                      <h3 id="aggregated-data" className="text-xl font-semibold text-gray-900 mb-3">Aggregated Information</h3>
                      <p className="text-gray-700 mb-6">
                        We may share aggregated, non-personally identifiable information publicly and with our partners. This aggregated information does not identify individual users and is used for general demographic analysis, trend reporting, and service improvement purposes.
                      </p>
                    </section>

                    <section id="data-retention">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Retention of the Information We Collect</h2>
                      <p className="text-gray-700 mb-4">
                        We will retain your personal information only for as long as is reasonably necessary to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Provide the Services you have requested</li>
                        <li>Fulfil the purposes outlined in this Privacy Policy</li>
                        <li>Comply with our legal and regulatory obligations</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        You may request deletion or modification of your personal data at any time (subject to applicable legal requirements).
                      </p>
                      <p className="text-gray-700 mb-6">
                        We also reserve the right to retain and use certain information where necessary to comply with statutory retention periods under UK law, resolve disputes, enforce our contractual agreements, and maintain records required for auditing, tax, or compliance purposes. Once personal data is no longer needed for these purposes, it will be securely deleted or anonymised in accordance with our data retention policy.
                      </p>
                    </section>

                    <section id="data-security">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Security</h2>
                      <p className="text-gray-700 mb-4">
                        We implement a combination of administrative, technical, and physical safeguards to protect your personal data from loss, misuse, unauthorised access, alteration, or disclosure. Our security measures may include:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Secure servers and encrypted data transmission (SSL/TLS)</li>
                        <li>Restricted access to personal data on a need-to-know basis</li>
                        <li>Regular system monitoring, vulnerability assessments, and updates</li>
                        <li>Secure payment processing through trusted third-party providers</li>
                        <li>Staff training on data protection and information security</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        We conduct regular security audits and assessments to identify vulnerabilities and ensure our security measures remain effective against evolving threats.
                      </p>
                      <p className="text-gray-700 mb-4">
                        However, no method of data transmission over the Internet or electronic storage is completely secure. While we implement all reasonable and appropriate security measures in compliance with the UK GDPR and industry best practices, we cannot guarantee absolute security against all unauthorised attempts to access, use, or disclose your information.
                      </p>
                      <p className="text-gray-700 mb-6">
                        If you have any questions about our security practices or notice any potential security issues, please contact us immediately using the details provided in the "Contact Us" section below.
                      </p>
                    </section>

                    <section id="international-transfers">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Consent to Transfer Information</h2>
                      <p className="text-gray-700 mb-4">
                        EURAMED LTD operates internationally and may transfer your personal information to countries outside the United Kingdom and the European Economic Area (EEA), including countries that may not have data protection laws equivalent to those in your home country.
                      </p>
                      <p className="text-gray-700 mb-4">
                        We currently maintain computer systems and use service providers located in the United Kingdom, the European Union, and other countries outside your country of residence. Your personal data may be stored and processed in any of these locations.
                      </p>
                      <p className="text-gray-700 mb-4">
                        When we transfer personal data outside the UK or EEA, we ensure adequate protection through:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Transfers to countries with adequacy decisions from the UK or EU</li>
                        <li>Standard contractual clauses approved by the relevant authorities</li>
                        <li>Binding corporate rules or certification schemes</li>
                        <li>Other appropriate safeguards recognised under applicable data protection law</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        By using our Services, you acknowledge and consent to the transfer of your personal information to these international locations for the purposes described in this Privacy Policy.
                      </p>
                      <p className="text-gray-700 mb-4">
                        In accordance with the UK GDPR, where we transfer your personal data to a country that is not subject to an adequacy decision by the UK Government, we will ensure that appropriate safeguards are in place — such as Standard Contractual Clauses (SCCs) or equivalent legal mechanisms — to protect your information.
                      </p>
                      <p className="text-gray-700 mb-6">
                        By using our Services, you acknowledge that your personal data may be transferred to, stored, and processed in countries outside your country of residence, and consent to such transfers and processing as described in this Privacy Policy. These transfers may also make your data subject to access by foreign law enforcement or national security authorities where applicable.
                      </p>
                    </section>

                    <section id="your-rights">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choices</h2>
                      <p className="text-gray-700 mb-4">
                        Subject to applicable laws, you have certain rights and choices regarding your personal data.
                      </p>
                      
                      <h3 id="access-rights" className="text-xl font-semibold text-gray-900 mb-3">Account Information</h3>
                      <p className="text-gray-700 mb-4">
                        If you create an account with us (where applicable), you may access, update, or delete certain information by logging into your account profile.
                      </p>

                      <h3 id="deletion-rights" className="text-xl font-semibold text-gray-900 mb-3">Marketing Emails</h3>
                      <p className="text-gray-700 mb-4">
                        Where permitted by law, we may send you marketing emails related to our Services. You may opt out at any time by clicking the "unsubscribe" link provided in such emails. Please note: Even if you opt out of marketing emails, we may still send you transactional or service-related communications.
                      </p>

                      <h3 id="portability" className="text-xl font-semibold text-gray-900 mb-3">Cookies & Analytics</h3>
                      <p className="text-gray-700 mb-6">
                        You may opt out of certain cookie-based tracking and analytics processing by following the steps described in the Cookies and Other Electronic Technologies section of this Policy.
                      </p>
                    </section>

                    <section id="region-specific">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Region-Specific Notices and Choices</h2>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Residents of the European Economic Area or the United Kingdom</h3>
                      <p className="text-gray-700 mb-4">
                        Under applicable law, EURAMED LTD is considered the "data controller" of the personal data we handle under this Policy. In other words, we are responsible for deciding how to collect, use, and disclose this data, subject to applicable law. Our contact information appears in the "Contact Us" section below.
                      </p>
                      <p className="text-gray-700 mb-4">
                        The laws of some jurisdictions such as the laws of the European Union and the United Kingdom require data controllers to tell you about the legal grounds that they rely on for using, sharing, or disclosing your information. To the extent those laws apply, our legal grounds are as follows:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li><strong>Contractual Commitments:</strong> We may use, share, or disclose information to honor our contractual commitments to you, such as to comply with our Terms of Service or other contracts between us</li>
                        <li><strong>With Your Consent:</strong> Where required by law, and in some other cases, we process your data with your consent. You may withdraw consent at any time by contacting us</li>
                        <li><strong>Legitimate Interests:</strong> We may process data for our legitimate business interests in ways that are not overridden by your rights, such as customer service, fraud prevention, marketing, analytics, and service improvement</li>
                        <li><strong>Legal Compliance:</strong> We may use or share data to comply with our legal obligations, including disclosures to law enforcement or regulatory bodies</li>
                      </ul>
                      
                      <p className="text-gray-700 mb-4">Under EEA and UK law, you may have the right to:</p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Access or obtain a copy of certain information we hold about you</li>
                        <li>Prevent the processing of your information for direct marketing purposes</li>
                        <li>Correct out-of-date or inaccurate information</li>
                        <li>Request deletion of certain information</li>
                        <li>Restrict the way we process or disclose your information</li>
                        <li>Transfer your data to another service provider</li>
                        <li>Withdraw consent to processing</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        We may request proof of identity before responding to such requests. Please submit requests via the contact details in the "Contact Us" section, with the subject line "Your EU Data Subject Rights" and preferably from the email address linked to your account.
                      </p>
                      <p className="text-gray-700 mb-4">
                        You also have the right to lodge a complaint with your local data protection authority, but we encourage contacting us first.
                      </p>
                      
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 mb-2"><strong>Our EU Representative:</strong></p>
                        <p className="text-gray-700">
                          Sergio Merino<br />
                          Calle Antonia Merce 8, 28009, Madrid, Spain
                        </p>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">California Residents</h3>
                      <p className="text-gray-700 mb-4">
                        The California Consumer Privacy Act (CCPA) gives California residents certain rights regarding their personal information.
                      </p>
                      <p className="text-gray-700 mb-4">
                        In the twelve months prior to this Policy's effective date, we have collected categories of personal information including:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Identifiers (e.g., name, address, email)</li>
                        <li>Commercial information (e.g., transactions)</li>
                        <li>Financial data (e.g., payment info)</li>
                        <li>Internet activity (e.g., IP address)</li>
                        <li>Professional information (e.g., occupation)</li>
                        <li>Inference data</li>
                        <li>Physical characteristics (e.g., photos)</li>
                        <li>Audio/visual information</li>
                        <li>Protected classifications (e.g., ethnicity, religion)</li>
                        <li>Sensitive identifiers (e.g., passport)</li>
                        <li>Account credentials</li>
                        <li>Other identifying information</li>
                      </ul>
                      
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-gray-300">
                          <thead>
                            <tr>
                              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Category of Personal Information</th>
                              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Recipients</th>
                              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Purposes</th>
                              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Third Parties for Advertising/Analytics</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">Identifiers (name, address, email)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Marketing; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">Advertising partners</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">Commercial information (transactions)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Marketing; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">Advertising partners</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">Financial data (payment info)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; payment processors; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">Internet activity (IP address)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Marketing; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">Advertising partners</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">Professional information (occupation)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">Inference data</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Marketing; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">Advertising partners</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">Physical characteristics (photos)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">Audio/visual information</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Marketing; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">Protected classifications (ethnicity, religion)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">Sensitive identifiers (passport)</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-3 py-2">Account credentials</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">Other identifying information</td>
                              <td className="border border-gray-300 px-3 py-2">Vendors; affiliates; entities for legal purposes; as directed by you</td>
                              <td className="border border-gray-300 px-3 py-2">Services; Analytics; Marketing; Legal</td>
                              <td className="border border-gray-300 px-3 py-2">We do not sell/share</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <p className="text-gray-700 mb-4">California Rights include:</p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Request disclosure of the categories of personal information collected</li>
                        <li>Access a copy of your data</li>
                        <li>Request deletion of your data</li>
                        <li>Correct inaccurate information</li>
                        <li>Opt out of the "sale" or "sharing" of your data (as defined under CCPA)</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        We do not knowingly "sell" or "share" the personal information of individuals under 16.
                      </p>
                      <p className="text-gray-700 mb-6">
                        To exercise your rights, please use the Contact Us section below and include any required verification information.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Residents of Other U.S. States with State Privacy Laws</h3>
                      <p className="text-gray-700 mb-4">
                        If you are a resident of states such as Maryland, Nebraska, New Jersey, or Virginia, applicable privacy laws may grant you rights to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Confirm whether we process your data</li>
                        <li>Access your personal information</li>
                        <li>Correct inaccuracies</li>
                        <li>Request deletion</li>
                        <li>Obtain a portable copy of your data</li>
                        <li>Opt out of targeted advertising or sale of your data</li>
                      </ul>
                      <p className="text-gray-700 mb-6">
                        Requests will be verified before fulfillment. If denied, you may appeal by contacting us with "Data Request Appeal" in the subject line.
                      </p>
                    </section>

                    <section id="children-privacy">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                      <p className="text-gray-700 mb-4">
                        Our Services are not intended for individuals under the age of 18. If you are under 18 years old, you must not submit any personal data to us or use our Services.
                      </p>
                      <p className="text-gray-700 mb-4">
                        We do not knowingly collect personal data from individuals under the age of 18. If we become aware that we have inadvertently collected such information, we will take steps to delete it from our systems in accordance with UK data protection laws.
                      </p>
                      <p className="text-gray-700 mb-6">
                        If you believe that a child under 18 has provided personal data to EURAMED LTD, please contact us immediately at <a href="mailto:info@euramedglobal.com" className="text-primary hover:text-primary/80 underline">info@euramedglobal.com</a>, and we will take appropriate action to remove the data.
                      </p>
                    </section>

                    <section id="third-party-links">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Links to Other Websites and Services</h2>
                      <p className="text-gray-700 mb-4">
                        This Privacy Policy applies only to our Services. Our website and Services may contain links to other websites or online services that are not operated or controlled by EURAMED LTD ("Third-Party Sites").
                      </p>
                      <p className="text-gray-700 mb-4">Please note:</p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>This Policy does not govern the privacy practices of any Third-Party Site</li>
                        <li>The inclusion of such links does not constitute our endorsement, approval, or review of those sites or their content</li>
                      </ul>
                      <p className="text-gray-700 mb-6">
                        We encourage all users to exercise caution when leaving our website and to review the privacy policies of any external site they visit, especially if it collects personal information.
                      </p>
                    </section>

                    <section id="policy-updates">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                      <p className="text-gray-700 mb-4">
                        We may update or amend this Privacy Policy from time to time to reflect:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Changes in applicable laws or regulatory requirements</li>
                        <li>Updates to our data collection and processing practices</li>
                        <li>New features or services we introduce</li>
                        <li>Advances in technology</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        Any changes will be posted on this page with the "Last Updated" date revised accordingly. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                      </p>
                      <p className="text-gray-700 mb-6">
                        Your continued use of our Services after any changes are posted will signify your acceptance of those changes, unless otherwise required by applicable law (in which case we will seek your explicit consent where necessary).
                      </p>
                    </section>

                    <section id="contact-us">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                      <p className="text-gray-700 mb-4">
                        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, you can contact us via:
                      </p>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">EURAMED LTD</h3>
                        <div className="space-y-2 text-gray-700">
                          <p><strong>Company Number:</strong> 16621355</p>
                          <p><strong>Email:</strong> <a href="mailto:info@euramedglobal.com" className="text-primary hover:text-primary/80 underline">info@euramedglobal.com</a></p>
                          <p><strong>Website Contact Form:</strong> Available on our Contact Us page</p>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Please note:</strong> We do not provide telephone or WhatsApp support. All customer service inquiries should be submitted via email or our website contact form.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}