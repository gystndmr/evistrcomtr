import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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

export default function Privacy() {
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
                        <li>To detect, investigate, and prevent potentially fraudulent, unauthorised, or illegal activities</li>
                        <li>To protect the rights, property, or safety of EURAMED LTD, our users, or the public</li>
                        <li>To comply with legal obligations – including responding to lawful requests from public authorities</li>
                        <li>To enforce our Terms of Service and other agreements</li>
                      </ul>

                      <h3 id="visa-services" className="text-xl font-semibold text-gray-900 mb-3">Visa Consultation Services</h3>
                      <p className="text-gray-700 mb-4">
                        When you use our e-visa consultation services, we use your personal information to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Complete and submit visa applications on your behalf to the relevant government authorities</li>
                        <li>Provide updates on the status of your application</li>
                        <li>Communicate with immigration authorities as necessary</li>
                        <li>Ensure compliance with immigration laws and regulations</li>
                        <li>Provide customer support throughout the application process</li>
                      </ul>

                      <h3 id="communication" className="text-xl font-semibold text-gray-900 mb-3">Communication</h3>
                      <p className="text-gray-700 mb-4">
                        We may use your contact information to communicate with you about:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Your application status and any required actions</li>
                        <li>Updates to our Services or this Privacy Policy</li>
                        <li>Customer service and technical support</li>
                        <li>Marketing communications (with your consent where required)</li>
                        <li>Legal notices and important announcements</li>
                      </ul>

                      <h3 id="legal-compliance" className="text-xl font-semibold text-gray-900 mb-3">Legal Compliance</h3>
                      <p className="text-gray-700 mb-6">
                        We may use and disclose your information as necessary to comply with applicable laws, regulations, legal processes, or enforceable governmental requests, including but not limited to immigration laws and anti-money laundering requirements.
                      </p>
                    </section>

                    <section id="information-sharing">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
                      <p className="text-gray-700 mb-4">
                        We may share your personal information in the following circumstances:
                      </p>

                      <h3 id="third-parties" className="text-xl font-semibold text-gray-900 mb-3">Third-Party Service Providers</h3>
                      <p className="text-gray-700 mb-4">
                        We may share your information with carefully selected third-party service providers who assist us in providing our Services, including:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Payment processors and financial service providers</li>
                        <li>Cloud storage and hosting providers</li>
                        <li>Email and communication service providers</li>
                        <li>Analytics and performance monitoring services</li>
                        <li>Customer support platforms</li>
                        <li>Security and fraud prevention services</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        These third parties are contractually bound to protect your information and may only use it for the specific purposes we have authorised.
                      </p>

                      <h3 id="government-agencies" className="text-xl font-semibold text-gray-900 mb-3">Government Agencies and Immigration Authorities</h3>
                      <p className="text-gray-700 mb-4">
                        As part of our visa consultation services, we will share your personal information with relevant government agencies and immigration authorities, including:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>The immigration authorities of the destination country</li>
                        <li>Visa application centres and consulates</li>
                        <li>Other government agencies as required by law</li>
                      </ul>

                      <h3 id="legal-requirements" className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                      <p className="text-gray-700 mb-4">
                        We may disclose your information if required by law or in good faith belief that such action is necessary to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Comply with legal obligations or court orders</li>
                        <li>Respond to lawful requests from law enforcement or government agencies</li>
                        <li>Protect and defend our rights or property</li>
                        <li>Investigate potential violations of our Terms of Service</li>
                        <li>Protect the safety of our users or the public</li>
                        <li>Prevent or investigate fraud, security breaches, or illegal activities</li>
                      </ul>
                      <p className="text-gray-700 mb-6">
                        We do not sell, rent, or lease your personal information to third parties for their marketing purposes.
                      </p>
                    </section>

                    <section id="data-security">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                      <p className="text-gray-700 mb-4">
                        We implement appropriate technical and organisational security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These measures include:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Industry-standard encryption for data in transit and at rest</li>
                        <li>Secure servers with access controls and monitoring</li>
                        <li>Regular security assessments and updates</li>
                        <li>Employee training on data protection and security practices</li>
                        <li>Incident response procedures for security breaches</li>
                        <li>Regular backups and disaster recovery plans</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        However, please note that no method of transmission over the internet or electronic storage is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security.
                      </p>
                      <p className="text-gray-700 mb-6">
                        If you become aware of any security breach or unauthorised use of your account, please contact us immediately at info@euramedglobal.com.
                      </p>
                    </section>

                    <section id="data-retention">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                      <p className="text-gray-700 mb-4">
                        We retain your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Application data is typically retained for 12 months after completion of your visa application</li>
                        <li>Payment and transaction records may be retained for up to 7 years for tax and accounting purposes</li>
                        <li>Communication records may be retained for up to 3 years for customer service purposes</li>
                        <li>Website analytics data is typically retained for 26 months</li>
                        <li>Legal compliance may require longer retention periods in certain circumstances</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        When we no longer need to retain your personal information, we will securely delete or anonymise it in accordance with our data retention policies and applicable legal requirements.
                      </p>
                      <p className="text-gray-700 mb-6">
                        You may contact us to request information about our retention practices for specific types of data.
                      </p>
                    </section>

                    <section id="your-rights">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choices and Rights</h2>
                      <p className="text-gray-700 mb-4">
                        Under applicable data protection laws, including the UK GDPR and the Data Protection Act 2018, you have certain rights regarding your personal information:
                      </p>

                      <h3 id="access-rights" className="text-xl font-semibold text-gray-900 mb-3">Account Information and Access Rights</h3>
                      <p className="text-gray-700 mb-4">You have the right to:</p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                        <li><strong>Rectification:</strong> Ask us to correct inaccurate or incomplete information</li>
                        <li><strong>Erasure:</strong> Request deletion of your personal information in certain circumstances</li>
                        <li><strong>Restriction:</strong> Ask us to limit the processing of your information in certain situations</li>
                        <li><strong>Objection:</strong> Object to the processing of your information based on legitimate interests</li>
                        <li><strong>Portability:</strong> Receive your personal information in a structured, machine-readable format</li>
                      </ul>

                      <h3 id="deletion-rights" className="text-xl font-semibold text-gray-900 mb-3">Marketing Communications</h3>
                      <p className="text-gray-700 mb-4">
                        You can opt out of receiving marketing communications from us at any time by:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Clicking the "unsubscribe" link in our marketing emails</li>
                        <li>Contacting us directly at info@euramedglobal.com</li>
                        <li>Updating your communication preferences in your account settings</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        Please note that even if you opt out of marketing communications, we may still send you important service-related communications.
                      </p>

                      <h3 id="portability" className="text-xl font-semibold text-gray-900 mb-3">Cookies and Analytics</h3>
                      <p className="text-gray-700 mb-4">
                        You can control cookies through your browser settings. Most browsers allow you to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>View and delete cookies</li>
                        <li>Block third-party cookies</li>
                        <li>Block cookies from particular websites</li>
                        <li>Block all cookies</li>
                        <li>Delete all cookies when you close your browser</li>
                      </ul>
                      <p className="text-gray-700 mb-6">
                        To exercise any of your rights, please contact us at info@euramedglobal.com. We will respond to your request within one month, unless the request is complex or we receive multiple requests, in which case we may extend this period by up to two months.
                      </p>
                    </section>

                    <section id="region-specific">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Region-Specific Rights</h2>
                      <p className="text-gray-700 mb-4">
                        Depending on your location, you may have additional rights under local privacy laws:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                        <li><strong>UK and EU residents:</strong> You have the rights described above under the UK GDPR and EU GDPR, including the right to lodge a complaint with your local data protection authority.</li>
                        <li><strong>California residents:</strong> You may have additional rights under the California Consumer Privacy Act (CCPA), including the right to know about personal information collected and the right to non-discrimination.</li>
                        <li><strong>Other jurisdictions:</strong> You may have additional rights under local privacy laws. Please contact us for information specific to your region.</li>
                      </ul>
                      <p className="text-gray-700 mb-6">
                        If you are a UK resident and wish to make a complaint about how we handle your personal information, you can contact the Information Commissioner's Office (ICO) at ico.org.uk.
                      </p>
                    </section>

                    <section id="third-party-links">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links and Services</h2>
                      <p className="text-gray-700 mb-4">
                        Our Services may contain links to third-party websites, applications, or services that are not owned or controlled by EURAMED LTD. This Privacy Policy does not apply to these third-party services.
                      </p>
                      <p className="text-gray-700 mb-4">
                        We encourage you to review the privacy policies of any third-party services you access through our platform. We are not responsible for the privacy practices or content of these third-party services.
                      </p>
                      <p className="text-gray-700 mb-6">
                        When you interact with social media features integrated into our Services (such as Facebook "Like" buttons), these features may collect information about your IP address and which page you are visiting on our site, and may set a cookie to enable the feature to function properly.
                      </p>
                    </section>

                    <section id="children-privacy">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                      <p className="text-gray-700 mb-4">
                        Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
                      </p>
                      <p className="text-gray-700 mb-4">
                        If we become aware that we have collected personal information from a child under 16 without verification of parental consent, we will take steps to remove that information from our servers.
                      </p>
                      <p className="text-gray-700 mb-6">
                        For visa applications involving minors, we require appropriate parental or guardian consent and documentation as required by immigration authorities.
                      </p>
                    </section>

                    <section id="international-transfers">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
                      <p className="text-gray-700 mb-4">
                        Your personal information may be transferred to and processed in countries other than your country of residence, including countries that may not have data protection laws equivalent to those in your jurisdiction.
                      </p>
                      <p className="text-gray-700 mb-4">
                        When we transfer your personal information outside the UK or EEA, we ensure appropriate safeguards are in place, including:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Standard Contractual Clauses approved by the European Commission</li>
                        <li>Adequacy decisions by the European Commission or UK authorities</li>
                        <li>Certification schemes or codes of conduct</li>
                        <li>Other appropriate safeguards as recognised by applicable data protection laws</li>
                      </ul>
                      <p className="text-gray-700 mb-6">
                        By using our Services, you consent to the transfer of your information to countries outside your jurisdiction as described in this Privacy Policy.
                      </p>
                    </section>

                    <section id="policy-updates">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                      <p className="text-gray-700 mb-4">
                        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make significant changes, we will:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                        <li>Post the updated Privacy Policy on our website</li>
                        <li>Update the "Last updated" date at the top of this Policy</li>
                        <li>Notify you by email or through our Services if the changes are material</li>
                        <li>Provide additional notice as required by applicable law</li>
                      </ul>
                      <p className="text-gray-700 mb-4">
                        We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                      </p>
                      <p className="text-gray-700 mb-6">
                        Your continued use of our Services after the effective date of any changes constitutes your acceptance of the updated Privacy Policy.
                      </p>
                    </section>

                    <section id="contact-us">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                      <p className="text-gray-700 mb-4">
                        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                      </p>
                      <div className="bg-gray-50 rounded-lg p-6 mb-4">
                        <p className="text-gray-700 mb-2"><strong>EURAMED LTD</strong></p>
                        <p className="text-gray-700 mb-2"><strong>Company Number:</strong> 16621355</p>
                        <p className="text-gray-700 mb-2"><strong>Registered Address:</strong> 71–75, Shelton Street, Covent Garden, London, WC2H 9JQ</p>
                        <p className="text-gray-700 mb-2"><strong>Email:</strong> info@euramedglobal.com</p>
                        <p className="text-gray-700 mb-2"><strong>Website:</strong> <a href="https://euramedglobal.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">https://euramedglobal.com</a></p>
                      </div>
                      <p className="text-gray-700 mb-4">
                        We will respond to your inquiry as soon as reasonably possible, and in any event within the timeframes required by applicable law.
                      </p>
                      <p className="text-gray-700">
                        For urgent matters related to data security or privacy breaches, please include "URGENT - DATA PRIVACY" in your email subject line.
                      </p>
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