import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "requirements", title: "Requirements for Use" },
    { id: "prohibitions", title: "Prohibitions" },
    { id: "third-party", title: "Third-Party Links & Services" },
    { id: "ai-usage", title: "Use of Artificial Intelligence" },
    { id: "commercial", title: "Commercial Terms" },
    { id: "suspension", title: "Suspension or Termination" },
    { id: "disclaimers", title: "Disclaimers" },
    { id: "limitation", title: "Limitation of Liability" },
    { id: "indemnification", title: "Indemnification" },
    { id: "notices", title: "Notices" },
    { id: "entire-agreement", title: "Entire Agreement" },
    { id: "time-barred", title: "Claims Are Time-Barred" },
    { id: "referrals", title: "Referrals" },
    { id: "refunds", title: "Refunds" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Last updated: August 2025
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            These terms apply to your use of <a href="https://euramedglobal.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">https://euramedglobal.com</a> and all related services provided by EURAMED LTD.
          </p>
        </div>
        
        <div className="flex gap-8">
          {/* Left Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8">
              <nav className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          activeSection === section.id
                            ? 'bg-primary text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 prose prose-lg prose-gray dark:prose-invert max-w-none">
            <section id="requirements">
              <h2>Requirements for Use of the Service</h2>
              <p>The nature of our Service (available at <a href="https://euramedglobal.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">https://euramedglobal.com</a>) requires that we impose certain conditions upon your use, and that you acknowledge certain cautions in using the Service, as follows:</p>
              
              <h3>Your Content</h3>
              <p>Any content that is submitted to us or to the Service by users of our Service, or otherwise added, uploaded, distributed, or posted to the Service or any of our official social media channels or websites — whether publicly or privately transmitted — including, without limitation, product reviews, survey responses, comments, videos, or written materials (collectively, "User Content"), is the sole responsibility of the person who originated and/or published such User Content.</p>
              
              <p>User Content also includes content provided by individuals through third-party services such as their social media account (e.g., Facebook, YouTube, Instagram, Twitter, etc.) if such User Content mentions, tags, or otherwise interacts with EURAMED LTD, our content, the Service, or any of our products or services.</p>
              
              <p>If you elect to publish any User Content, you represent that such User Content is accurate, complete, up-to-date, and that in publishing such User Content you are acting in compliance with all applicable laws, rules, and regulations of England and Wales and any relevant jurisdiction.</p>
              
              <p>User Content that you submit must not:</p>
              <ul>
                <li>Contain any content that infringes intellectual property rights, data protection, publicity, or privacy rights of an individual.</li>
                <li>Be defamatory, threatening, or abusive.</li>
                <li>Impersonate any person or entity.</li>
                <li>Contain unauthorized advertising or promotional materials.</li>
                <li>Transmit or distribute any virus, malware, or other code that has contaminating or destructive elements.</li>
              </ul>
              
              <p>We make no representations, warranties, or guarantees with respect to any User Content that you access on or through the Service or any of our social media channels or sites.</p>
              
              <p>By submitting User Content through the Service or any of our social media channels or websites, you hereby grant EURAMED LTD a worldwide, perpetual, irrevocable, non-exclusive, sub-licensable (through multiple tiers), fully paid, royalty-free license and right to:</p>
              <ul>
                <li>Use, copy, transmit, distribute, publicly perform, and display (through all media now known or hereafter created).</li>
                <li>Edit, modify, and make derivative works from your User Content (including, without limitation, your name and likeness, photographs, and testimonials) for any purpose whatsoever, commercial or otherwise, without compensation to you.</li>
              </ul>
              
              <p>You also hereby grant each user of our websites, social media channels, and/or the Service a non-exclusive, perpetual license to:</p>
              <ul>
                <li>Access your User Content through such websites, social media channels, and/or the Service.</li>
                <li>Use, edit, modify, reproduce, distribute, prepare derivative works of, display, and perform such User Content — including after your termination of use of the Service.</li>
              </ul>
              
              <p>In addition, you waive any "moral rights" or rights of privacy or publicity in your User Content. For clarity, the foregoing license grants to us and our users do not affect your other ownership or license rights in your User Content, including the right to grant additional licenses to your User Content, unless otherwise agreed in writing.</p>
              
              <p>You represent and warrant that you have all rights to grant such licenses to us without infringement or violation of any third-party rights, including, without limitation, any privacy rights, publicity rights, copyrights, trademarks, contract rights, or any other intellectual property or proprietary rights.</p>
              
              <h3>Verify Travel Documents</h3>
              <p>When we send you your travel document (visa, photo, or passport), it is your sole responsibility to immediately verify that all the document information is correct and complete.</p>
              
              <p>We will make reasonable efforts to correct any deficiency in the documentation, provided that you notify us of the problem in a timely manner. If you fail to identify and report any deficiency before travel and you proceed with your journey, you shall bear full responsibility for any consequences arising from such deficiency.</p>
              
              <p>In addition:</p>
              <ul>
                <li>Your passport must be valid for at least six months after the start of your trip.</li>
                <li>You must ensure that your email service does not block our delivery of travel documents sent via email due to spam filters or other restrictions. You should add our domain to your "white list" and check your spam/junk folder if you suspect a delay.</li>
                <li>Some travel documents may also be accessible via your user account on our Service.</li>
              </ul>
            </section>

            <section id="prohibitions">
              <h2>Prohibitions</h2>
              <p>You are prohibited from using or attempting to use the Service for:</p>
              <ul>
                <li>Any unlawful, unauthorized, fraudulent, or malicious purpose under the laws of England and Wales or any applicable jurisdiction.</li>
                <li>In any manner that could damage, disable, overburden, or impair any server or the network(s) connected to any server.</li>
                <li>In any manner that could interfere with any other party's use and enjoyment of the Service.</li>
                <li>To gain unauthorized access to any other accounts, computer systems, or networks connected to any server or systems through hacking, password mining, or any other means.</li>
                <li>To access systems, data, or information not intended by EURAMED LTD to be made accessible to a User.</li>
                <li>To obtain any materials or information through any means not intentionally made available by EURAMED LTD.</li>
                <li>To reverse engineer, disassemble, or decompile any EURAMED LTD software or other technology on the Service.</li>
                <li>For any use other than the legitimate business purpose for which the Service was intended.</li>
              </ul>
              
              <p>In addition, in connection with your use of the Service, you agree you will not:</p>
              <ul>
                <li>Upload or transmit any message, data, text, software, images, or other content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, discriminatory, or otherwise inappropriate with respect to race, gender, sexuality, ethnicity, nationality, religion, or other intrinsic characteristics.</li>
                <li>Create a false identity or duplicative accounts for the purpose of misleading others, or impersonate any person or entity, including any EURAMED LTD representative, or falsely state or otherwise misrepresent your affiliation with any person or entity.</li>
                <li>Upload or transmit any material you do not have the right to reproduce, display, or transmit under law or contractual/fiduciary relationships (such as confidentiality or non-disclosure agreements).</li>
                <li>Upload files that contain viruses, trojan horses, worms, time bombs, cancel-bots, corrupted files, spyware, or any other malicious software or code that may damage the operation of another's computer or property.</li>
                <li>Delete or alter any author attributions, legal notices, or proprietary labels that you upload to any communication feature.</li>
                <li>Use the Service's communication features in a manner that adversely affects the availability of its resources to other users (e.g., excessive shouting in text, continuous posting of repetitive content).</li>
                <li>Upload or transmit any unsolicited advertising, promotional materials, "junk mail," "spam," "chain letters," "pyramid schemes," "phishing" messages, or any other form of commercial solicitation.</li>
                <li>Violate any applicable local, national, or international law or regulation.</li>
                <li>Upload or transmit any material that infringes any patent, trademark, service mark, trade secret, copyright, or other proprietary rights of any party.</li>
                <li>Delete or revise any material posted by any other person or entity.</li>
                <li>Manipulate or display the Service using framing, mirroring, or similar navigational technology.</li>
                <li>Probe, scan, or test the vulnerability of the Service or any related networks or systems, or breach authentication/security measures.</li>
                <li>Register, subscribe, attempt to register/subscribe, unsubscribe, or attempt to unsubscribe any party for any services, contests, or promotions without proper authorization.</li>
                <li>Harvest or collect information about others, including email addresses, without consent.</li>
                <li>Use any robot, spider, scraper, or other automated or manual means to access the Service, copy content, or retrieve data without prior written consent from EURAMED LTD.</li>
                <li>Assist or permit any person to engage in any of the activities listed above.</li>
              </ul>
              
              <p>EURAMED LTD reserves the right to take any lawful action it deems appropriate in response to violations, including suspension or termination of accounts and cooperation with law enforcement authorities.</p>
              
              <p>Except as may be provided in our Privacy Policy or prohibited by applicable law, EURAMED LTD reserves the right to disclose any information it deems necessary to comply with legal obligations, court orders, or governmental requests, and to edit, refuse to post, or remove any materials in whole or in part at its sole discretion.</p>
              
              <h3>Precautions</h3>
              <p>By using the Service, you acknowledge that use of the Service does not guarantee any particular result. Specifically:</p>
              <ul>
                <li>There is no guarantee that use of the Service and our products will ensure that you obtain the travel documentation required for your intended journey.</li>
                <li>You are solely responsible for determining the documentation required for your travel and ensuring the sufficiency of the documents you obtain from our Service.</li>
                <li>You should review the informational materials we provide on our website (<a href="https://euramedglobal.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">https://euramedglobal.com</a>), social media, and mobile applications for guidance.</li>
              </ul>
              
              <h3>Reliance on Information Posted</h3>
              <p>The information presented on or through the Service, our social media channels, or our websites is made available solely for general informational purposes. We do not warrant the accuracy, completeness, timeliness, or usefulness of this information, as government requirements and procedures may change at any time without notice — including but not limited to health and safety regulations, travel restrictions, sanctions, and embargoes.</p>
              
              <p>Any reliance you place on such information is strictly at your own risk. EURAMED LTD disclaims all liability for reliance placed on such content by you or any other party informed of its contents.</p>
            </section>

            <section id="third-party">
              <h2>Third-Party Links, Content, and Services</h2>
              <p>Our Services may contain links to third-party websites, applications, resources, content, or service providers ("Third-Party Services"). These are provided for your convenience and informational purposes only. The inclusion of any such link or reference does not imply endorsement by EURAMED LTD, nor does it indicate any association with the operators of such sites or services.</p>
              
              <p>While we make reasonable efforts to recommend reputable third-party resources, we do not control these Third-Party Services and we are not responsible for:</p>
              <ul>
                <li>The accuracy, legality, or content of any third-party websites or services.</li>
                <li>The performance, quality, or availability of third-party products or services.</li>
                <li>Any loss, damage, or harm caused by or in connection with your use of third-party content, services, or products.</li>
              </ul>
              
              <p>If you choose to engage with any Third-Party Service, you do so entirely at your own risk and subject to that third party's terms and conditions and privacy policy. We strongly encourage you to review those terms and policies before interacting with or providing any personal data to such third parties.</p>
              
              <p>Where applicable, EURAMED LTD may receive a referral fee or commission from certain third-party services we recommend or link to. Such compensation does not influence our recommendations, but you should be aware of the commercial relationship.</p>
              
              <h3>Photo Printing Services Example:</h3>
              <p>When using our printed photo pickup service, EURAMED LTD may engage third-party vendors for printing and processing. We are not responsible for any errors, delays, or quality issues caused by those third parties.</p>
              
              <h3>Artificial Intelligence (AI) Use in the Services:</h3>
              <p>EURAMED LTD may use AI-based tools within our Services to provide faster access to information and assist you in navigating travel requirements. AI-generated outputs are based on probability models and may not always be accurate. For important travel or visa-related decisions, you should always verify the AI-generated information with a EURAMED LTD human representative before acting.</p>
              
              <p>Please note:</p>
              <ul>
                <li>AI outputs do not necessarily reflect the official opinion or position of EURAMED LTD.</li>
                <li>If AI tools suggest a third-party product or service, this does not constitute an endorsement by EURAMED LTD.</li>
              </ul>
              
              <p>We welcome your feedback on any third-party products, services, or content linked through our Service. Your experiences help us assess whether to continue or terminate such partnerships.</p>
            </section>

            <section id="ai-usage">
              <h2>Use of Artificial Intelligence (AI) in Our Services</h2>
              <p>EURAMED LTD is committed to enhancing the efficiency, accuracy, and overall user experience of our Services. As part of this commitment, we may integrate artificial intelligence (AI) and machine learning technologies into various parts of our operations, including customer support tools, document processing, and information delivery.</p>
              
              <p>The AI systems we employ are designed to help you:</p>
              <ul>
                <li>Access travel and visa-related information more quickly.</li>
                <li>Receive automated guidance on application processes.</li>
                <li>Identify relevant documentation and requirements based on your travel plans.</li>
              </ul>
              
              <p>However, it is important to note:</p>
              <ul>
                <li><strong>AI is probabilistic, not infallible</strong> – The responses you receive from AI-based tools are generated using predictive algorithms and may not always be accurate or complete.</li>
                <li><strong>Human verification is essential</strong> – For matters that could affect your travel eligibility, visa approval, or legal standing, we strongly recommend verifying AI-provided information with a human representative of EURAMED LTD before taking any action.</li>
                <li><strong>No automatic endorsement</strong> – Any third-party product, service, or resource suggested by our AI tools should not be considered as endorsed by EURAMED LTD unless explicitly stated.</li>
                <li><strong>No legal or immigration advice</strong> – AI tools provided by EURAMED LTD do not constitute legal, immigration, or governmental advice. You remain solely responsible for ensuring compliance with the travel and visa regulations applicable to your situation.</li>
              </ul>
              
              <p>We actively welcome your feedback about AI-generated responses, as this helps us improve our technology and ensure that we provide accurate and valuable information. If you encounter any errors, misleading suggestions, or outdated guidance, please notify us immediately via <a href="mailto:info@euramedglobal.com" className="text-primary hover:text-primary/80 underline">info@euramedglobal.com</a> so that we can investigate and correct the issue.</p>
              
              <p>Please note:</p>
              <ul>
                <li>AI outputs do not necessarily reflect the official opinion or position of EURAMED LTD.</li>
                <li>If AI tools suggest a third-party product or service, this does not constitute an endorsement by EURAMED LTD.</li>
              </ul>
            </section>

            <section id="commercial">
              <h2>Commercial Terms</h2>
              <p>Our commercial transactions with you, including your purchase of any products or services from our platform, or the use of any promotional codes, are governed by these Commercial Terms, as in effect at the time of such transactions.</p>
              
              <h3>SMS Terms</h3>
              <p>These SMS Terms govern the provision, receipt, and delivery of text messages by or on behalf of EURAMED LTD. Depending on the consent you have provided, our text messages (the "EURAMED SMS"):</p>
              <ul>
                <li>Provide you with information you have requested from us;</li>
                <li>Provide updates regarding your purchases, such as the status of requested travel visas or related services;</li>
                <li>Respond to your customer support questions and other enquiries; and/or</li>
                <li>Provide you with marketing or promotional content that we believe may be of interest to you.</li>
              </ul>
              
              <h3>E-SIGN Disclosure and Agreement</h3>
              <p>By providing your consent to receive EURAMED SMS (as described below), you also consent to the use of an electronic record to document your agreement. You may withdraw your consent to the use of the electronic record by emailing us at <a href="mailto:info@euramedglobal.com" className="text-primary hover:text-primary/80 underline">info@euramedglobal.com</a> with "Revoke Electronic Consent" in the subject line.</p>
              
              <p>To view and retain a copy of this disclosure or any information regarding your enrolment in this programme, you will need:</p>
              <ul>
                <li>(i) a device (such as a computer or mobile phone) with a web browser and internet access; and</li>
                <li>(ii) either a printer or storage space on such device.</li>
              </ul>
              
              <p>For a free paper copy, or to update our records of your contact information, email us at info@euramedglobal.com with your contact details and the address for delivery.</p>
              
              <h3>Agreement and Consent to Receive EURAMED SMS</h3>
              <p>You can provide us with your consent to receive EURAMED SMS in multiple ways, such as by providing us with your mobile phone number during or after registration or purchase, through communications or transactions with us, or by opting in to receive marketing EURAMED SMS. By providing your consent, you agree to these SMS Terms.</p>
              
              <p>By providing consent, you authorise us to use automated or non-automated technology to send EURAMED SMS to the number associated with your consent. You may opt in to receive EURAMED SMS with marketing content, and consent to receiving marketing texts is not a condition of purchase.</p>
              
              <h3>Eligibility</h3>
              <p>By consenting to receive EURAMED SMS, you confirm that you are at least 18 years of age and understand the obligations and agree to these SMS Terms. You further confirm that you are the subscriber to the relevant phone number or that you are the customary user of that number under a family or business plan and that you are authorised to opt in to EURAMED SMS.</p>
              
              <h3>Costs of EURAMED SMS</h3>
              <p>EURAMED LTD does not charge you for EURAMED SMS. However, message and data rates may apply, depending on your mobile plan with your wireless or other applicable provider. You may be charged by your carrier or other applicable provider for these services.</p>
              
              <h3>App Stores</h3>
              <p>If you obtain our mobile applications from a third-party platform, such as the Apple App Store or Google Play Store (each, an "App Store"), you will be engaging with that App Store under their respective terms and conditions, to which you must agree before downloading the mobile applications, including Apple Inc.'s Device and Application Terms for the Apple App Store. You agree to comply with, and your licence to use the mobile applications is conditioned upon your compliance with, the terms and conditions applicable to such App Store.</p>
              
              <p>If such App Store terms are less restrictive than, or otherwise conflict with, the terms of this Agreement, the more restrictive or conflicting terms in this Agreement will apply.</p>
              
              <h3>Apple-Enabled Product Terms</h3>
              <p>If you use our mobile applications on a device sold by Apple Inc. ("Apple"), that application ("Apple-Enabled Software") is subject to the following additional terms and conditions:</p>
              <ul>
                <li>You acknowledge that this Agreement is between EURAMED LTD and you only, and not with Apple, and that as between EURAMED LTD and Apple, EURAMED LTD, not Apple, is solely responsible for the Apple-Enabled Software and its content.</li>
                <li>You may not use the Apple-Enabled Software in any manner that violates the Usage Rules set forth for such software in the Apple App Store Terms of Service.</li>
                <li>Your licence to use the Apple-Enabled Software is limited to a non-transferable licence to use the Apple-Enabled Software on an iOS device that you own or control, as permitted by the Usage Rules in the App Store Terms of Service.</li>
                <li>Apple has no obligation whatsoever to provide any maintenance or support services for the Apple-Enabled Software.</li>
                <li>Apple is not responsible for any product warranties, whether express or implied by law. If the Apple-Enabled Software fails to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price for the Apple-Enabled Software to you, if applicable; to the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever.</li>
                <li>You acknowledge that EURAMED LTD, not Apple, is responsible for addressing any claims by you or any third party relating to the Apple-Enabled Software or your possession or use of it.</li>
                <li>In the event of any third-party claim that the Apple-Enabled Software infringes such third party's intellectual property rights, EURAMED LTD, not Apple, will be responsible for handling such claims.</li>
                <li>You represent and warrant that you are not located in a country subject to UK or international government embargoes and are not listed on any UK or international prohibited or restricted party list.</li>
                <li>You acknowledge and agree that Apple, and Apple's subsidiaries, are third-party beneficiaries of this Agreement in relation to the Apple-Enabled Software.</li>
              </ul>
            </section>

            <section id="suspension">
              <h2>Suspension or Termination</h2>
              <p>You may elect to terminate any account you have created with EURAMED LTD at any time by following the instructions provided within your account settings or by contacting us via email at info@euramedglobal.com. Please note, however, that if you are then subject to the terms of any Service for which you have purchased a subscription, you will continue to be charged for that subscription in accordance with the then-applicable terms of this Agreement and any relevant UK consumer protection and contract laws applicable to such subscriptions.</p>
              
              <p>EURAMED LTD reserves the right to suspend, restrict, or terminate your access to the Service, or to any of its features or functionalities, at any time, with or without notice, and for any reason whatsoever, including (without limitation) if:</p>
              <ul>
                <li>You are found to be in breach of this Agreement;</li>
                <li>You engage in conduct that is unlawful, fraudulent, abusive, or otherwise harmful to EURAMED LTD, its affiliates, service providers, or other users;</li>
                <li>We reasonably believe such action is necessary to protect the integrity, security, or proper functioning of the Service; or</li>
                <li>We discontinue or materially modify the Service, in whole or in part, for operational, business, or legal reasons.</li>
              </ul>
              
              <p>Upon any termination of the Service or your account, you will no longer have access to the Service or to any data, content, or materials stored in connection with your account. The following provisions will survive any termination of this Agreement:</p>
              <ul>
                <li>Service security and data protection clauses;</li>
                <li>Restrictions on prohibited activities;</li>
                <li>Copyrights and trademarks;</li>
                <li>User submissions and content licences;</li>
                <li>Disclaimers and limitations of liability;</li>
                <li>Indemnity provisions; and</li>
                <li>Governing law and dispute resolution provisions.</li>
              </ul>
              
              <p>You agree that if your use of the Service is terminated under this Agreement, you will not attempt to register a new account or use the Service under any other name, whether real or fictitious, without our express written consent. If you violate this restriction after termination, you agree to indemnify and hold EURAMED LTD harmless from any and all liability, costs, losses, or damages we may incur as a result.</p>
              
              <p>Except as otherwise provided in our Privacy Policy or as required by applicable UK law (including, without limitation, the Data Protection Act 2018 and the UK GDPR obligations to provide access to Personal Information), EURAMED LTD has no obligation—before or after the termination of your use of the Service—to return, supply, or otherwise make available to you or any third party any information, content, or other materials that you have provided to us, or that we otherwise hold in connection with your use of the Service.</p>
            </section>

            <section id="disclaimers">
              <h2>Disclaimers</h2>
              <p>The EURAMED LTD Service is intended to assist you in managing and facilitating your travel-related needs and visa application processes. However, we cannot, and do not, accept any responsibility for consequences arising from changes in travel plans, alterations in government requirements, or any circumstances beyond our reasonable control. Such circumstances may include, without limitation:</p>
              <ul>
                <li>Actions or inaction of governmental authorities, embassies, or consulates;</li>
                <li>Legislative or regulatory changes, whether temporary or permanent;</li>
                <li>Operational delays or failures of postal, courier, or digital delivery systems;</li>
                <li>Force majeure events such as natural disasters, strikes, pandemics, or political unrest.</li>
              </ul>
              
              <p>When we provide processing time estimates for transactions and the delivery of documentation, these time frames are based on our past experience with various UK and foreign government agencies, third-party processors, and relevant authorities. Such time frames are indicative only and do not constitute guarantees. You acknowledge and agree that EURAMED LTD shall not be held responsible for processing delays, refusals, or failures caused by governments, consular offices, or other third parties.</p>
              
              <p>Any information, content, or guidance provided via the Service—whether through our website, mobile applications, printed materials, or email correspondence—is supplied as a matter of convenience and for general informational purposes only. While we endeavour to ensure accuracy and relevance, you acknowledge that such information may become outdated due to rapidly changing government rules, particularly in areas concerning visa issuance, immigration laws, and travel restrictions. You agree to verify all critical information with the relevant authorities before making travel or visa-related decisions.</p>
              
              <p>The Service is provided strictly on an "AS IS" and "AS AVAILABLE" basis. Any access to, or use of, the Service is entirely voluntary and at your sole risk. EURAMED LTD, together with its affiliates, officers, employees, agents, partners, licensors, and third-party service providers, to the maximum extent permitted under English law, expressly disclaim all warranties, representations, and conditions of any kind—whether express, implied, statutory, or otherwise—including, without limitation:</p>
              <ul>
                <li>The implied warranties of satisfactory quality, fitness for a particular purpose, and non-infringement of third-party rights;</li>
                <li>Warranties relating to accuracy, timeliness, completeness, reliability, or availability of the Service or its content;</li>
                <li>Any guarantees that the Service will operate without interruption, delay, cyber attack, unauthorised access, data loss, corruption, malware, or technical error.</li>
              </ul>
              
              <p>We do not warrant that your use of the Service will meet your specific requirements or achieve any desired outcome, including but not limited to, the successful issuance of a visa or other travel document. You accept that governments and other third parties retain full discretion in granting, refusing, or revoking such documents, and that EURAMED LTD has no authority to override or influence such decisions.</p>
              
              <p>Nothing in this disclaimer is intended to limit or exclude any liability that cannot be excluded or restricted under the laws of England and Wales, including your statutory rights as a consumer under the Consumer Rights Act 2015.</p>
            </section>

            <section id="limitation">
              <h2>Limitation of Liability</h2>
              <p>To the maximum extent permitted under the laws of England and Wales, in no event shall EURAMED LTD, its directors, officers, employees, contractors, agents, licensors, affiliates, or any third parties offering products or services through the Service be liable to you or any other person or entity for any:</p>
              <ul>
                <li>Indirect, incidental, special, or consequential damages;</li>
                <li>Loss of profits, business, revenue, goodwill, anticipated savings, or contracts;</li>
                <li>Loss of data, corruption of files, or security breaches;</li>
                <li>Personal injury, emotional distress, or wrongful death;</li>
                <li>Damages resulting from use of, or inability to use, the Service, including any content, products, or services obtained through the Service;</li>
                <li>Damages arising from third-party actions or omissions, including those of government agencies, consulates, couriers, or technology providers.</li>
              </ul>
              
              <p>This limitation applies whether such liability arises from contract, tort (including negligence), breach of statutory duty, or otherwise, and whether or not EURAMED LTD has been advised of the possibility of such damages.</p>
              
              <p>Where applicable law does not allow the exclusion or limitation of certain liabilities, our liability shall be limited to the fullest extent permitted by law. In any event, our total aggregate liability to you for any loss or damage arising out of or in connection with your use of the Service shall not exceed GBP £100 (or the equivalent amount in your local currency), whether such claim is based on contract, negligence, or otherwise.</p>
              
              <p>You acknowledge and agree that any claim or cause of action arising from or relating to the Service must be brought within twelve (12) months from the date the cause of action arose, otherwise such claim or cause of action shall be permanently barred.</p>
              
              <p>Nothing in this Limitation of Liability clause shall limit or exclude our liability for:</p>
              <ul>
                <li>Death or personal injury caused by our negligence;</li>
                <li>Fraud or fraudulent misrepresentation;</li>
                <li>Any other liability which cannot be excluded or restricted under the laws of England and Wales.</li>
              </ul>
              
              <p>You also expressly waive any right to participate in a class action, group litigation, or collective proceeding against EURAMED LTD arising from or relating to your use of the Service, unless such waiver is prohibited by applicable law.</p>
            </section>

            <section id="indemnification">
              <h2>Indemnification</h2>
              <p>You agree to defend, indemnify, and hold harmless EURAMED LTD, its directors, officers, employees, contractors, agents, licensors, affiliates, and any authorised third parties offering products or services through the Service, from and against any and all claims, demands, actions, proceedings, damages, losses, liabilities, settlements, judgments, costs, and expenses (including, without limitation, reasonable legal fees and expenses) arising out of or relating to:</p>
              <ul>
                <li>Your use or misuse of the Service;</li>
                <li>Any violation by you of this Agreement or any applicable law or regulation of England and Wales or any other relevant jurisdiction;</li>
                <li>Any breach of your representations, warranties, or obligations set forth in this Agreement;</li>
                <li>Any infringement or alleged infringement by you of any third-party rights, including without limitation intellectual property rights, privacy rights, and publicity rights;</li>
                <li>Any fraudulent, wilful, or negligent act or omission by you;</li>
                <li>Any dispute or claim between you and a third party relating to your use of the Service, including government authorities, consular offices, courier services, or payment processors.</li>
              </ul>
              
              <p>EURAMED LTD reserves the right, at its own cost and in its sole discretion, to assume the exclusive defence and control of any matter subject to indemnification by you. In such case, you agree to cooperate fully with us in asserting any available defences and in providing all necessary documents, statements, and access to information reasonably requested.</p>
              
              <p>You may not settle any claim or matter subject to indemnification without the prior written consent of EURAMED LTD, and any such unauthorised settlement shall be void and not binding upon us.</p>
              
              <p>This indemnification obligation shall survive the termination or expiry of this Agreement and your use of the Service.</p>
            </section>

            <section id="notices">
              <h2>Notices</h2>
              <p>Any notices to you from EURAMED LTD regarding the Service or this Agreement may be made by email, a posted notice on the Service, or regular mail, at the sole discretion of EURAMED LTD.</p>
              
              <h3>Electronic Communications</h3>
              <p>When you access or use the Service, send emails, chat messages, audio calls through our website or via our mobile application, or send SMS messages to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you via email, EURAMED SMS, or through the Service. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.</p>
              
              <h3>Copyright</h3>
              <p>We respond to clear and complete notices of alleged infringement of copyright, trademark, or other intellectual property laws that satisfy the requirements in this Agreement. We comply with the United Kingdom Copyright, Designs and Patents Act 1988, as well as the United States Digital Millennium Copyright Act (DMCA) where applicable. If you believe that your intellectual property rights have been violated, please notify our Compliance team at the address provided below.</p>
              
              <h3>Notification of Copyright Infringement</h3>
              <p>To submit a complete and qualified notice:</p>
              
              <p>If you are a copyright owner, or are authorised to act on behalf of one, or authorised to act under any exclusive right under copyright, please send the following information to our designated copyright agent:</p>
              <ul>
                <li>Identify the specific copyrighted work that you believe has been infringed upon.</li>
                <li>Identify the web page URL(s) containing the copyrighted work that you claim has been infringed, if any, and, if possible, the contact information for the person you believe responsible for the infringing act in connection with that work. Describe the copyrighted work on the page(s) you believe infringes upon the work identified in item (1) above, including whether the copyrighted work is an image (and describe it in detail) or written work (including the text of the copyrighted work).</li>
                <li>Include the statements:</li>
                <ul>
                  <li>"I have a good faith belief that use of the copyrighted work described above as allegedly infringing is not authorised by the owner of the intellectual property rights therein, its agent, or the law."</li>
                  <li>"The information in this notice is accurate."</li>
                  <li>"I state under penalty of perjury that I am the owner, or an agent authorised to act on behalf of the owner, of the copyright or of an exclusive right under the copyright that is allegedly infringed."</li>
                </ul>
                <li>Provide your mailing address, telephone number, and email address. If you are submitting a notice on behalf of an entity, provide the entity's name along with your job title, position, or role within the entity.</li>
                <li>Provide the full legal name and physical or electronic signature of the person authorised to act on behalf of the owner of the copyright that is allegedly infringed.</li>
              </ul>
              
              <p>Deliver the Notice, with all the items completed, to the Company's Designated Copyright Agent:</p>
              <p>Copyright Agent<br/>
              c/o EURAMED LTD<br/>
              71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM<br/>
              Email: info@euramedglobal.com<br/>
              Attention: Legal Notice (Copyright Agent)</p>
              
              <p>Please note that we may reproduce any legal notice we receive to send to a third party for publication and annotation, and we may post your notice in place of any removed material.</p>
              
              <p>Please be aware that if you knowingly materially misrepresent that material or activity is infringing your copyright, you may be held liable for damages (including costs and solicitors' fees) under Section 107 of the UK Copyright, Designs and Patents Act 1988, Section 512(f) of the U.S. DMCA, or similar laws in other jurisdictions.</p>
              
              <h3>Filing a Counter Notice</h3>
              <p>If you have received a notification that copyrighted work has been removed for a copyright complaint, it means a party claiming to be the copyright owner asked us to remove it. If you believe that the removal of the material is a result of a mistake or misidentification, you can file a counter-notice.</p>
              
              <p>Please send the following information to our designated copyright agent:</p>
              <ul>
                <li>Identification of the copyrighted work taken down.</li>
                <li>The web page URL of the copyrighted work before it was taken down.</li>
                <li>A statement under penalty of perjury that you have a good faith belief the copyrighted work was removed in error.</li>
                <li>A statement that you consent to the jurisdiction of the courts of England and Wales, or if you are located outside of the UK, for any judicial district in which EURAMED LTD's offices may be found, and that you will accept service of process from the person who provided the original complaint.</li>
                <li>Provide your mailing address, telephone number, and email address. If you are filing a counter notice on behalf of an entity, provide the entity's name along with your job title, position, or role within the entity.</li>
                <li>Provide your full legal name and physical or electronic signature.</li>
              </ul>
              
              <p>Note: There are legal and financial consequences for filing fraudulent or bad faith counter-notices. Before submitting a counter notice, ensure you have a good faith belief that we removed the copyrighted work in error, and that you understand the repercussions of submitting a false claim.</p>
              
              <p>We reserve the right to communicate with you via email or other means.</p>
            </section>

            <section id="entire-agreement">
              <h2>Entire Agreement</h2>
              <p>This Agreement and any other agreements EURAMED LTD may post on the Service or that you and EURAMED LTD may execute from time to time constitute the entire agreement between EURAMED LTD and you in connection with your use of the Service, and supersede any prior agreements between EURAMED LTD and you regarding use of the Service, including prior versions of this Agreement.</p>
              
              <h3>Binding Arbitration / Class Waiver</h3>
              <p><strong>YOU AND WE EXPRESSLY AGREE THAT ANY LEGAL CLAIM, DISPUTE, OR OTHER CONTROVERSY BETWEEN YOU AND US ARISING OUT OF OR OTHERWISE RELATING IN ANY WAY TO EURAMED LTD, THE SERVICE, CONTENT, OR ANY OTHER GOODS, SERVICES OR ADVERTISING BY EURAMED LTD, INCLUDING ANY PRODUCTS SOLD THROUGH THIRD-PARTY SELLERS OR PAYMENTS MADE TO THIRD-PARTY PAYMENT PROCESSORS, INCLUDING CONTROVERSIES RELATING TO THE APPLICABILITY, ENFORCEABILITY OR VALIDITY OF ANY PROVISION OF THIS AGREEMENT (COLLECTIVELY "DISPUTES"), SHALL BE RESOLVED IN CONFIDENTIAL BINDING ARBITRATION CONDUCTED BEFORE ONE COMMERCIAL ARBITRATOR, ADMINISTERED BY THE London Court of International Arbitration (LCIA) UNDER ITS RULES, OR, WHERE APPLICABLE FOR UNITED STATES–BASED USERS, UNDER THE American Arbitration Association (AAA) Commercial Arbitration Rules AND, IF THE ARBITRATOR DEEMS THEM APPLICABLE, THE SUPPLEMENTARY PROCEDURES FOR CONSUMER-RELATED DISPUTES (COLLECTIVELY "RULES AND PROCEDURES"), RATHER THAN IN A COURT, AS DESCRIBED HEREIN. YOU ACKNOWLEDGE THAT YOU ARE VOLUNTARILY AND KNOWINGLY FORFEITING YOUR RIGHT TO A TRIAL BY JURY AND TO OTHERWISE PROCEED IN A LAWSUIT IN STATE, FEDERAL, OR UK COURT, EXCEPT AS EXPRESSLY PROVIDED HEREIN.</strong></p>
              
              <p>Arbitration uses a neutral arbitrator instead of a judge or jury, and court review of an arbitration award is extremely limited. However, an arbitrator can award the same damages and relief on an individual basis that a court can award to an individual.</p>
              
              <p>Payment of arbitration costs will be governed by the applicable LCIA or AAA fee schedule, unless you are able to show that your portion will be prohibitive as compared to litigation costs, in which case EURAMED LTD will pay as much of your arbitration costs as the arbitrator deems necessary to prevent the arbitration from being cost-prohibitive compared to litigation costs. EURAMED LTD also reserves the right in its sole and exclusive discretion to assume responsibility for all arbitration costs imposed by the LCIA or AAA. You and we each agree to pay our own respective legal fees and expenses unless there is a governing statutory provision that requires the prevailing party to be paid legal fees and expenses. Notwithstanding the foregoing sentence, EURAMED LTD will not seek to recover legal fees or costs incurred in arbitration from you if you are a consumer.</p>
              
              <p>The arbitration shall be conducted in London, United Kingdom, except that, in the event London is not within 100 miles of your residence, the arbitration may be conducted within 100 miles of your residence, unless the parties agree otherwise in writing. The arbitrator's award shall be final and binding on all parties and may be entered as a judgment in any court of competent jurisdiction. For more information on the LCIA, its Rules and Procedures, and how to file an arbitration claim, you may visit <a href="https://www.lcia.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">www.lcia.org</a> (or, in the case of U.S. users, <a href="https://www.adr.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">www.adr.org</a> for AAA information).</p>
              
              <p>Notwithstanding anything to the contrary herein, to the extent the Dispute arises from:</p>
              <ol>
                <li>(a) a violation of either party's intellectual property rights in any manner; and/or</li>
                <li>(b) any claim related to, or arising from, allegations of theft, piracy, unauthorised use or a violation of applicable computer fraud laws (including the UK Computer Misuse Act 1990 or the U.S. Computer Fraud and Abuse Act),</li>
              </ol>
              <p>then you and EURAMED LTD agree that a party may seek injunctive remedies (or an equivalent type of urgent legal relief) in a court of competent jurisdiction in London, United Kingdom, or, for U.S. matters, in state or federal court in Delaware, USA, and both parties agree to submit to the personal jurisdiction of such courts in connection with such proceedings.</p>
              
              <p>In addition to the foregoing, either party may assert an individual action in small claims court for Disputes that are within the scope of such court's jurisdiction in lieu of arbitration, as long as such action remains in such court and advances only on an individual (non-class, non-representative) basis.</p>
              
              <p><strong>ALL DISPUTES SUBJECT TO ARBITRATION UNDER THIS AGREEMENT MUST BE ARBITRATED ON AN INDIVIDUAL BASIS AND NOT ON A CLASS, COLLECTIVE, OR REPRESENTATIVE BASIS. NO PARTY MAY BRING ANY CLAIM SUBJECT TO ARBITRATION PURSUANT TO THIS AGREEMENT AS A PRIVATE ATTORNEY GENERAL, IN A REPRESENTATIVE CAPACITY, OR AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS PROCEEDING. THE CLAIMS OF MORE THAN ONE CUSTOMER OR USER CANNOT BE JOINED OR CONSOLIDATED WITH THOSE OF ANY OTHER CUSTOMER OR USER. NO ARBITRATION SHALL BE CONSOLIDATED OR JOINED WITH ANY OTHER ARBITRATION. THE ARBITRATOR MAY AWARD RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND DECLARATORY RELIEF) ONLY IN FAVOUR OF THE INDIVIDUAL PARTY SEEKING RELIEF AND ONLY TO THE EXTENT NECESSARY TO PROVIDE RELIEF NECESSITATED BY THAT PARTY'S INDIVIDUAL CLAIM(S).</strong></p>
              
              <p>If a decision is issued stating that applicable law precludes enforcement of any of this paragraph's limitations as to a particular claim or request for relief, then such claim or request for relief (and only that claim or request for relief) shall be severed from the arbitration and may be brought exclusively in the courts located in London, United Kingdom (or, for U.S.-based matters, in Delaware), subject to the parties' respective rights to appeal the decision. All other claims or requests for relief shall be arbitrated. The parties agree that any claims or requests for relief that are severed from an arbitration may not proceed in litigation and shall be stayed until all claims between the parties remaining in arbitration are finally resolved. The parties agree to submit to the personal jurisdiction of the courts in England and Wales (or Delaware, USA, where applicable) for purposes of resolving any claims or requests for relief severed from arbitration pursuant to this paragraph.</p>
              
              <p>You can opt out of the provisions of this Agreement that require the arbitration of Disputes by providing us a written opt-out notice within 30 days of the "Effective Date" at the top of this Agreement. To opt out, you must send your name, residence address, and email address together with a clear statement that you want to opt out of the requirement to arbitrate disputes with the applicable party to:</p>
              
              <p>EURAMED LTD<br/>
              71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM<br/>
              Email: info@euramedglobal.com<br/>
              Subject: Arbitration Opt-Out</p>
              
              <p>Before you commence arbitration of a Dispute, you must provide us with a written Notice of Dispute that includes your name, residence address, username (if applicable) and email address associated with your User account (if applicable), a detailed description of the Dispute, and the relief you seek. Before we commence arbitration of a Dispute against you, we will provide a written Notice of Dispute to you with a detailed description of the Dispute and the relief we seek. Any Notice of Dispute you send to us should be sent via email with the subject line "Dispute Notice".</p>
              
              <p>If we are unable to resolve a Dispute within 30 days after the applicable Notice of Dispute is received, either party may commence arbitration. Notwithstanding anything to the contrary in this Agreement, if we make any future material modification to any provisions of this Agreement that govern the arbitration or resolution of Disputes, such changes will not apply to any Dispute between you and us for which either party had previously provided a written Notice of Dispute to the other in accordance with this paragraph. Further, if we make any future material changes to the provisions of this Agreement that govern the arbitration or resolution of Disputes, you may reject such changes by sending a written notice of your rejection decision to us via email or by post to:</p>
              
              <p><strong>EURAMED LTD<br/>
              71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM<br/>
              Email: info@euramedglobal.com<br/>
              Subject: Arbitration Opt-Out</strong></p>
              
              <p>within 30 days of the effective date of such modifications.</p>
            </section>

            <section id="time-barred">
              <h2>Claims Are Time-Barred</h2>
              <p>You agree that, regardless of any statute or law to the contrary or the applicable dispute resolution process, any claim or cause of action you may have arising out of or related to the Service, any products purchased, or any Content must be formally initiated within one (1) year after such claim or cause of action arose. You hereby agree to be forever barred from bringing such claim after the expiration of this period. The provisions of this section, entitled "Claims Are Time-Barred," shall be deemed to constitute a separate written legally binding agreement by and between you and us.</p>
              
              <h3>Governing Law; Venue; Severability of Provisions</h3>
              <p>The validity, interpretation, construction, and performance of this Agreement will be governed by and construed in accordance with the laws of England and Wales, without regard to any conflicts of law principles, except that, where applicable to United States users, the Federal Arbitration Act and the laws of the State of Delaware may also govern certain arbitration-related provisions.</p>
              
              <p>All parts of this Agreement apply to the maximum extent permitted by law. Our failure to enforce any provision of this Agreement will not constitute a waiver of such right. We both agree that if any provision in this Agreement as written is unenforceable, then such provision will be reformed or replaced with a provision that most closely matches the intent of the unenforceable part to the extent permitted by law. Except as otherwise provided in this Agreement, the invalidity of part of this Agreement will not affect the validity of any other part.</p>
              
              <h3>No Agency Relationship</h3>
              <p>Neither this Agreement, nor any Content, materials, or features of the Service, create any partnership, joint venture, employment, or other agency relationship between you and EURAMED LTD. You may not enter into any contract on our behalf or bind us in any way without our express written consent.</p>
              
              <h3>Assignment</h3>
              <p>You may not assign any of your rights under this Agreement, and any such attempt will be null and void. EURAMED LTD may, in its sole discretion, assign or transfer, without further consent or notification, this Agreement or any or all of the contractual rights and obligations pursuant to this Agreement, in whole or in part, to any affiliate of EURAMED LTD or to a third party in the event that some or all of EURAMED LTD's business is transferred to such other third party by way of merger, consolidation, or sale of assets or capital stock.</p>
              
              <h3>Third Party Beneficiaries</h3>
              <p>Any use of third-party software provided in connection with the Service, or any third-party product obtained through the Service, will be governed by, and you shall comply with, the applicable third party's commercial terms and, if there are no such commercial terms, by this Agreement.</p>
              
              <p>Except for the foregoing or as otherwise specifically set forth in this Agreement, including with respect to the indemnification obligations contained herein in favour of EURAMED LTD and the agreement to arbitration, we hereby expressly agree that there is no intent by either party to create or establish third-party beneficiary status rights or their equivalent in any other referenced individual, subcontractor, or third party. Except as specifically set forth in this Agreement, no other person or entity shall be a third-party beneficiary of this Agreement.</p>
              
              <h3>Changes to this Agreement</h3>
              <p>We are continually making modifications and enhancements to our Service, and so this Agreement may be amended without prior notice as new features, technology, or legal requirements arise. Please check back from time to time and review the Effective Date set forth above. If we make a significant change, we will notify Users with an account in our Service and, where required, seek your consent.</p>
              
              <p>If we update this Agreement, you are free to decide whether to accept the updated terms or to stop using our Service; your continued use of the Service after the effectiveness of that update will be deemed to represent your agreement with, and consent to be bound by, the modified Agreement. Except for changes made by us as described here, no other amendment or modification of this Agreement shall be effective unless set forth in a written agreement expressly amending this Agreement and signed by duly authorised representatives of the parties.</p>
              
              <h3>Special Notice for California Users</h3>
              <p>Under California Civil Code Section 1789.3, users of the Service from California are entitled to the following specific consumer rights notice: The Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs may be contacted in writing at 1625 North Market Blvd., Suite N 112, Sacramento, CA 95834, or by telephone at (916) 445-1254 or (800) 952-5210. California residents may also contact us via email at info@euramedglobal.com or by posting mail to:</p>
              
              <p>EURAMED LTD<br/>
              71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM<br/>
              Attention: Legal Notice</p>
              
              <h3>Contacting Us</h3>
              <p>You may contact us if you have any questions or concerns about this Agreement by email at info@euramedglobal.com or through our website's contact form. We will attempt to respond to your questions or concerns promptly after we receive them.</p>
              
              <h3>Commercial Terms</h3>
              <p>These "Commercial Terms" are incorporated within the EURAMED LTD Terms of Service, including your purchase of any of our products, as well as the acquisition or redemption of any promotional codes ("Codes").</p>
              
              <h4>SMS Terms</h4>
              <p>These SMS Terms govern the provision, receipt, and delivery of text messages by or on behalf of EURAMED LTD. Depending on the consent you have provided, our text messages (the "EURAMED SMS"):</p>
              <ul>
                <li>Provide you with information you have requested from us;</li>
                <li>Provide updates regarding your purchases, such as the status of requested travel visas or related services;</li>
                <li>Respond to your customer support questions and other enquiries; and/or</li>
                <li>Provide you with marketing or promotional content that we believe may be of interest to you.</li>
              </ul>
              
              <h4>E-SIGN Disclosure and Agreement</h4>
              <p>By providing your consent to receive EURAMED SMS (as described below), you also consent to the use of an electronic record to document your agreement. You may withdraw your consent to the use of the electronic record by emailing us at info@euramedglobal.com with "Revoke Electronic Consent" in the subject line.</p>
              
              <p>To view and retain a copy of this disclosure or any information regarding your enrolment in this programme, you will need:</p>
              <ul>
                <li>(i) a device (such as a computer or mobile phone) with a web browser and internet access; and</li>
                <li>(ii) either a printer or storage space on such device.</li>
              </ul>
              
              <p>For a free paper copy, or to update our records of your contact information, email us at info@euramedglobal.com with your contact details and the address for delivery.</p>
              
              <h4>Agreement and Consent to Receive EURAMED SMS</h4>
              <p>You can provide us with your consent to receive EURAMED SMS in multiple ways, such as by providing us with your mobile phone number during or after registration or purchase, through communications or transactions with us, or by opting in to receive marketing EURAMED SMS. By providing your consent, you agree to these SMS Terms.</p>
              
              <p>By providing consent, you authorise us to use automated or non-automated technology to send EURAMED SMS to the number associated with your consent. You may opt in to receive EURAMED SMS with marketing content, and consent to receiving marketing texts is not a condition of purchase.</p>
              
              <h4>Eligibility</h4>
              <p>By consenting to receive EURAMED SMS, you confirm that you are at least 18 years of age and understand the obligations and agree to these SMS Terms. You further confirm that you are the subscriber to the relevant phone number or that you are the customary user of that number under a family or business plan and that you are authorised to opt in to EURAMED SMS.</p>
              
              <h4>Costs of EURAMED SMS</h4>
              <p>EURAMED LTD does not charge you for EURAMED SMS. However, message and data rates may apply, depending on your mobile plan with your wireless or other applicable provider. You may be charged by your carrier or other applicable provider for these services.</p>
              
              <h4>App Stores</h4>
              <p>If you obtain our mobile applications from a third-party platform, such as the Apple App Store or Google Play Store (each, an "App Store"), you will be engaging with that App Store under their respective terms and conditions, to which you must agree before downloading the mobile applications, including Apple Inc.'s Device and Application Terms for the Apple App Store. You agree to comply with, and your licence to use the mobile applications is conditioned upon your compliance with, such App Store terms and conditions.</p>
              
              <p>If such App Store terms are less restrictive than, or otherwise conflict with, the terms of this Agreement, the more restrictive or conflicting terms in this Agreement will apply.</p>
              
              <h4>Apple-Enabled Product Terms</h4>
              <p>If you use our mobile applications on a device sold by Apple Inc. ("Apple"), that application ("Apple-Enabled Software") is subject to the following additional terms and conditions:</p>
              <ul>
                <li>You acknowledge that this Agreement is between EURAMED LTD and you only, and not with Apple, and that as between EURAMED LTD and Apple, EURAMED LTD, not Apple, is solely responsible for the Apple-Enabled Software and its content.</li>
                <li>You may not use the Apple-Enabled Software in any manner that violates the Usage Rules set forth for such software in the Apple App Store Terms of Service.</li>
                <li>Your licence to use the Apple-Enabled Software is limited to a non-transferable licence to use the Apple-Enabled Software on an iOS device that you own or control, as permitted by the Usage Rules in the App Store Terms of Service.</li>
                <li>Apple has no obligation whatsoever to provide any maintenance or support services for the Apple-Enabled Software.</li>
                <li>Apple is not responsible for any product warranties, whether express or implied by law. If the Apple-Enabled Software fails to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price for the Apple-Enabled Software to you, if applicable; to the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever.</li>
                <li>You acknowledge that EURAMED LTD, not Apple, is responsible for addressing any claims by you or any third party relating to the Apple-Enabled Software or your possession or use of it.</li>
                <li>In the event of any third-party claim that the Apple-Enabled Software infringes such third party's intellectual property rights, EURAMED LTD, not Apple, will be responsible for handling such claims.</li>
                <li>You represent and warrant that you are not located in a country subject to UK or international government embargoes and are not listed on any UK or international prohibited or restricted party list.</li>
                <li>You acknowledge and agree that Apple, and Apple's subsidiaries, are third-party beneficiaries of this Agreement in relation to the Apple-Enabled Software.</li>
              </ul>
              
              <h4>Single Purchase Transaction</h4>
              <p>You may purchase certain products on a one-time basis, which we refer to as our Standard Service. In such transactions, we will present the cost for the Service(s) you select along with any applicable government fee, tax, and shipping and handling charges, and you will be required to submit your payment via an accepted payment method ("Accepted Payment Method") at the time of purchase.</p>
              
              <h4>Subscriptions</h4>
              <p>You may elect to purchase a subscription enabling you to obtain one or more products throughout the term of such subscription (a "Subscription"). For example, a EURAMED LTD Plus subscription Individual Plan may enable an individual to pay one annual fee and receive unlimited Standard Speed processing on orders for their personal visa services, health documents, and other applicable services.</p>
              
              <p>The Subscription does not include the following costs and fees: government fees, Rush and Super Rush Processing Speed fees, other add-ons (including but not limited to Premium Concierge or special assistance fees), and other products or services not explicitly covered by the subscription.</p>
              
              <h4>Subscription Terms</h4>
              <p>Our Subscription products require an initial payment at the time the Subscription commences. By purchasing a Subscription, you agree to pay the applicable price and any other recurring charges upon each auto-renewal date, until you terminate your Subscription in accordance with these terms. Accordingly, you hereby authorise, agree, and assent to EURAMED LTD automatically charging your Accepted Payment Method submitted as part of the order process for such amounts that are due, and you will be responsible for such charges. This does not waive our right to seek payment directly from you. Your charges may be payable in advance, in arrears, per usage, or as otherwise described when you initially selected the Subscription.</p>
              
              <p>As part of this recurring Subscription, you will be charged the price listed on our website for each Subscription product in your order, at the time each order is placed, unless the terms of your Subscription specifically provide otherwise. The Subscription fee will be charged during the first month of each subsequent renewal period.</p>
              
              <p>Subscriptions may be cancelled, upgraded, or downgraded with respect to any renewal term after payment for such renewal term has been processed. Subscription cancellations and downgrades will be applied to the next billing cycle. Subscription upgrades will be applied immediately on a prorated basis. If you wish to cancel or modify a subscription, you may do so by emailing us at info@euramedglobal.com or through our website's account management tools, if available.</p>
              
              <p>Please note that if your Subscription includes a discounted price for a promotional period, once the promotional period expires, your Subscription will renew at the full price unless cancelled.</p>
            </section>

            <section id="referrals">
              <h2>Referrals</h2>
              <p>The referral program operated by EURAMED LTD is managed using Ambassador's referral technology.</p>
              
              <p>Terms and conditions for Ambassador are available at: <a href="https://www.getambassador.com/terms" className="text-primary hover:underline">https://www.getambassador.com/terms</a></p>
              
              <p>Ambassador's privacy policy is available at: <a href="https://www.getambassador.com/privacy" className="text-primary hover:underline">https://www.getambassador.com/privacy</a></p>
              
              <p>Gift Cards associated with the program are issued by Tango Card.</p>
              
              <p>The EURAMED LTD referral program is designed to incentivize our loyal customers to share the benefits of EURAMED LTD services with their friends and family. Through our referral program, users can generate a unique referral link that can be shared via email or social media.</p>
              
              <p>When a referred party clicks on this link, they will automatically receive 20% off on all EURAMED LTD visa-related products. Once the referred party completes their purchase of an eligible visa product, the referrer will receive a £20 GBP (or equivalent value) gift card.</p>
              
              <p>Only visa products are eligible for the discount and gift card; other services or products such as passport renewal or photo services are excluded from the referral program.</p>
              
              <p>The referred party must be a new customer of EURAMED LTD for the referral to qualify.</p>
              
              <p>If multiple referrers invite the same person, only the first referral recorded in our system will be considered valid for the gift card.</p>
              
              <p>There is no limit to the number of referrals a user may make. However, if EURAMED LTD determines that a referrer is acting maliciously or abusing the system, that referrer may be removed from the program without notice.</p>
              
              <h3>Referral Terms</h3>
              <h4>Availability and Pricing</h4>
              <p>All products and services offered for sale are subject to availability. EURAMED LTD reserves the right to suspend the availability of specific services or documents, or to reject all or part of an order without prior notice.</p>
              
              <p>Prices for products are subject to change at any time, but any such changes will not affect orders already placed. Purchases are also subject to any applicable promotional, price-matching, or sale item policies we may adopt for promotional events.</p>
              
              <h4>Payment</h4>
              <p>Only valid payment methods accepted by EURAMED LTD may be used to complete a purchase through our website. We accept multiple debit and credit cards as well as other electronic payment methods. In certain cases and at our discretion, we may accept payment by cheque when an invoice is issued to you.</p>
              
              <p>Payment methods may vary depending on your country or the specific product purchased, and may be updated periodically. You confirm that you are authorized to use your chosen payment method.</p>
              
              <p>By completing a purchase, you authorize EURAMED LTD to charge your selected payment method for the full amount of your order, including any applicable taxes, shipping, or handling fees.</p>
              
              <p>If you choose to store your payment method details in your account, you grant permission for EURAMED LTD to retain and share payment information with financial institutions or payment processors for the purpose of completing transactions and providing related notices.</p>
              
              <p>You also authorize us to verify your identity when necessary to process payments and determine your eligibility to complete a purchase.</p>
              
              <p>Invoices, if issued, must be paid in full within 30 days from the invoice date. Failure to pay may result in termination of services.</p>
              
              <h4>Paying Our Reseller or Payment Processor</h4>
              <p>EURAMED LTD may use third-party payment processors to collect payments. Your contractual relationship regarding payment is directly with the processor, not EURAMED LTD.</p>
              
              <p>While we carefully select these processors and require them to meet performance and confidentiality standards, we do not guarantee their performance.</p>
              
              <p>If you encounter issues with a payment processor, please contact us at info@euramedglobal.com promptly.</p>
              
              <h4>Shipping: Risk of Loss</h4>
              <p>You agree to pay any shipping and handling fees displayed during checkout. These fees may be changed by EURAMED LTD from time to time, with notice provided before purchase.</p>
              
              <p>Any delivery dates shown are estimates only. Risk of loss or damage to goods passes to you upon delivery to our designated carrier.</p>
            </section>

            <section id="refunds">
              <h2>Refunds</h2>
              <p>Please see our Refund Policy for full details on cancelling your application and requesting a refund. Eligibility for a refund varies depending on the service purchased.</p>
              
              <h3>Limited Warranty for EURAMED LTD Produced Products</h3>
              <p>EURAMED LTD warrants to the original purchaser that if a EURAMED LTD–produced product fails to include correct information provided by the purchaser in accordance with specifications, the purchaser may submit a warranty claim by emailing info@euramedglobal.com within 7 days of delivery.</p>
              
              <p>We may request supporting documentation to determine the validity of a warranty claim. If the claim is approved, we may, at our discretion, repair or replace the product.</p>
              
              <p>This warranty does not cover defects resulting from purchaser negligence, failure to follow specifications, or incorrect information provided by the purchaser.</p>
              
              <h3>Warranties / Remedies for Third-Party Products</h3>
              <p>EURAMED LTD may sell third-party products. Unless otherwise stated, these are sold "as is" and "with all faults" and are not covered by a EURAMED LTD warranty.</p>
              
              <p>If a manufacturer offers a warranty, it will typically be listed on their website or included in the product packaging. Any remedy for issues with third-party products must be sought directly from the manufacturer.</p>
              
              <h3>Changes to Your Order</h3>
              <p>Once submitted, your order cannot be changed or cancelled after processing begins. We process orders quickly, and modifications are not possible once fulfilment starts.</p>
              
              <p>Backorders not yet processed may be cancelled from your account order history.</p>
              
              <p>For questions, please email info@euramedglobal.com.</p>
              
              <h3>Purchases in Mobile Applications</h3>
              <p>Some EURAMED LTD products may be purchased through mobile applications ("In-App Purchases"), which are processed through third-party resellers such as Apple App Store or Google Play.</p>
              
              <p>Your purchase will be governed by the reseller's terms and conditions. EURAMED LTD is not a party to such transactions.</p>
              
              <h3>No Resale of Products</h3>
              <p>Purchases from EURAMED LTD are for personal use only. Resale or distribution of products for commercial purposes is prohibited. EURAMED LTD reserves the right to cancel orders suspected of violating this policy.</p>
              
              <h3>Taxes</h3>
              <p>You are responsible for any applicable VAT, sales tax, customs duties, or other governmental fees ("Taxes") associated with your purchase.</p>
              
              <p>If EURAMED LTD is required to collect Taxes, they will be calculated and displayed at checkout. Tax amounts may be adjusted due to changes in rates or payment processor calculations.</p>
              
              <p>If we do not collect certain Taxes, you may be required to report and remit them directly to your local tax authority.</p>
              
              <h3>Errors</h3>
              <p>While we aim for accuracy, product descriptions or other information may contain errors. EURAMED LTD reserves the right to correct such errors, adjust your order, or cancel it with a full refund.</p>
              
              <h3>Costs of Collection; Credit Card Chargebacks</h3>
              <p>You agree to cover any costs incurred by EURAMED LTD to collect overdue payments, including legal fees. Late payments will accrue interest at 1% per month or the maximum permitted by UK law, whichever is lower.</p>
              
              <h3>Promotional Cards and Promotional Codes</h3>
              <p>Promotional cards and codes are subject to the terms of the promotion, these Commercial Terms, and our Privacy Policy.</p>
              
              <p>Codes have no cash value, cannot be redeemed for cash, and may not be combined with other offers. Unless otherwise stated, they expire 30 days after issuance. Unauthorized reproduction or resale is prohibited.</p>
              
              <p>EURAMED LTD reserves the right to amend or limit promotional codes at its discretion.</p>
              
              <h3>User Satisfaction</h3>
              <p>EURAMED LTD may resolve customer issues on a case-by-case basis, at our sole discretion, depending on the facts and circumstances of each case.</p>
            </section>

            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>Website: <a href="https://euramedglobal.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline">https://euramedglobal.com</a></li>
                <li>Email: <a href="mailto:info@euramedglobal.com" className="text-primary hover:text-primary/80 underline">info@euramedglobal.com</a></li>
                <li>Address: EURAMED LTD, 71-75, Shelton Street, Covent Garden, London WC2H 9JQ, UK</li>
                <li>Company Number: 16621355</li>
              </ul>

              <h3>Acceptance of Terms</h3>
              <p>
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}