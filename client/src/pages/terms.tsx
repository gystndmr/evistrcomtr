import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Terms() {
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
    <>
      <Header />
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
                <p>By consenting to receive EURAMED SMS, you confirm that you are at least 18 years of age and understand the obligations and agree to these SMS Terms. You further confirm that you are the subscriber to the relevant phone number or that you are the customary user of that number on a regular basis and with the account holder's authorisation.</p>
                
                <h3>Message Frequency</h3>
                <p>Message frequency varies. We will send you EURAMED SMS as necessary to provide services you have requested, respond to your queries, and send updates about your transactions. If you have opted in to receive marketing content via EURAMED SMS, we may send you promotional messages periodically, but will not exceed reasonable limits.</p>
                
                <h3>Charges</h3>
                <p>You may be charged by your carrier for receiving EURAMED SMS, depending on your mobile plan. We recommend that you contact your carrier to understand potential charges. EURAMED LTD does not impose charges for the EURAMED SMS service itself.</p>
                
                <h3>Opt-Out</h3>
                <p>You can opt out of receiving EURAMED SMS by:</p>
                <ul>
                  <li>Replying "STOP" to any EURAMED SMS message</li>
                  <li>Contacting us at info@euramedglobal.com</li>
                  <li>Following opt-out instructions included in marketing messages</li>
                </ul>
                
                <p>If you opt out, you may still receive transactional or administrative messages related to services you have purchased or accounts you maintain with us.</p>
                
                <h3>Changes to SMS Terms</h3>
                <p>We may update these SMS Terms from time to time. If we make material changes, we will notify you via EURAMED SMS or other reasonable means. Your continued participation in the EURAMED SMS program after such notice will constitute your acceptance of the changes.</p>
              </section>

              <section id="suspension">
                <h2>Suspension or Termination</h2>
                <p>EURAMED LTD reserves the right to suspend or terminate your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, breach of these Terms.</p>
                
                <p>Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.</p>
                
                <p>The following provisions will survive termination:</p>
                <ul>
                  <li>Any outstanding financial obligations</li>
                  <li>Liability disclaimers and limitations</li>
                  <li>Indemnification obligations</li>
                  <li>Intellectual property licensing terms</li>
                  <li>Any other provisions which by their nature should survive termination</li>
                </ul>
              </section>

              <section id="disclaimers">
                <h2>Disclaimers</h2>
                <p>The information, software, products, and services included in or available through the Service may include inaccuracies or typographical errors. Changes are periodically added to the information herein. EURAMED LTD and/or its suppliers may make improvements and/or changes in the Service at any time.</p>
                
                <p>EURAMED LTD and/or its suppliers make no representations about the suitability, reliability, availability, timeliness, and accuracy of the information, software, products, services and related graphics contained on the Service for any purpose. To the maximum extent permitted by applicable law, all such information, software, products, services and related graphics are provided "as is" without warranty or condition of any kind.</p>
                
                <p>EURAMED LTD and/or its suppliers hereby disclaim all warranties and conditions with regard to this information, software, products, services and related graphics, including all implied warranties or conditions of merchantability, fitness for a particular purpose, title and non-infringement.</p>
                
                <p>EURAMED LTD does not warrant that:</p>
                <ul>
                  <li>The Service will meet your specific requirements</li>
                  <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                  <li>The results obtained from the use of the Service will be accurate or reliable</li>
                  <li>Any errors in the Service will be corrected</li>
                </ul>
                
                <p>Material downloaded or otherwise obtained through the use of the Service is done at your own discretion and risk. You will be solely responsible for any damage to your computer system or loss of data that results from such material.</p>
              </section>

              <section id="limitation">
                <h2>Limitation of Liability</h2>
                <p>To the maximum extent permitted by applicable law, in no event shall EURAMED LTD or its suppliers be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected with the use or performance of the Service.</p>
                
                <p>This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if EURAMED LTD has been advised of the possibility of such damage.</p>
                
                <p>Because some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, EURAMED LTD's liability shall be limited to the maximum extent permitted by law.</p>
                
                <p>In jurisdictions that do not allow the exclusion of certain warranties or the limitation of liability for consequential or incidental damages, EURAMED LTD's liability is limited to the amount you paid for the Service.</p>
              </section>

              <section id="indemnification">
                <h2>Indemnification</h2>
                <p>You agree to indemnify, defend and hold harmless EURAMED LTD, its officers, directors, employees, agents, licensors, suppliers and any third-party information providers from and against all losses, expenses, damages and costs, including reasonable attorney fees, resulting from any violation of these Terms or any activity related to your account (including negligent or wrongful conduct) by you or any other person accessing the Service using your account.</p>
              </section>

              <section id="notices">
                <h2>Notices</h2>
                <p>Notices to you may be made via either email or regular mail. The Service may also provide notices to you of changes to these Terms or other matters by displaying notices or links to notices generally on the Service.</p>
                
                <p>You may give notice to EURAMED LTD at the following address:</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 my-4">
                  <p><strong>EURAMED LTD</strong><br/>
                  71–75, Shelton Street<br/>
                  Covent Garden<br/>
                  London, WC2H 9JQ<br/>
                  United Kingdom<br/>
                  Email: info@euramedglobal.com</p>
                </div>
              </section>

              <section id="entire-agreement">
                <h2>Entire Agreement</h2>
                <p>These Terms constitute the entire agreement between you and EURAMED LTD with respect to your use of the Service, superseding any prior agreements between you and EURAMED LTD relating to your use of the Service.</p>
                
                <p>The failure of EURAMED LTD to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. If any provision of these Terms is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavour to give effect to the parties' intentions as reflected in the provision, and the other provisions of these Terms remain in full force and effect.</p>
              </section>

              <section id="time-barred">
                <h2>Claims Are Time-Barred</h2>
                <p>You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to use of the Service or these Terms must be filed within one (1) year after such claim or cause of action arose, or be forever barred.</p>
              </section>

              <section id="referrals">
                <h2>Referrals</h2>
                <p>EURAMED LTD may offer referral programs from time to time. If you participate in a referral program, you agree to comply with any additional terms and conditions specific to that program.</p>
                
                <p>Referral rewards, if any, are subject to verification and compliance with program terms. EURAMED LTD reserves the right to modify or cancel referral programs at any time without prior notice.</p>
              </section>

              <section id="refunds">
                <h2>Refunds</h2>
                <p>Due to the nature of our digital services and the immediate processing of visa applications, all sales are generally final once the application has been submitted to the relevant authorities.</p>
                
                <p>However, refunds may be considered in the following circumstances:</p>
                <ul>
                  <li>If we are unable to submit your application due to technical issues on our part</li>
                  <li>If you cancel your application before it has been submitted</li>
                  <li>If there was an error in the service fee charged</li>
                </ul>
                
                <p>Refund requests must be submitted within 24 hours of payment and before application submission. Refund requests are reviewed on a case-by-case basis and are at the sole discretion of EURAMED LTD.</p>
                
                <p>If a refund is approved, processing fees may be deducted from the refund amount. Refunds will be processed to the original payment method within 5-10 business days of approval.</p>
                
                <p>For detailed refund policy information, please visit our Refund Policy page or contact us at info@euramedglobal.com.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}