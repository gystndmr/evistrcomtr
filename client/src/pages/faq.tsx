import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What is a Turkey e-visa?",
      answer: "A Turkey e-visa is an electronic travel authorization that allows eligible foreign nationals to enter Turkey for tourism or business purposes. It is obtained online and is valid for multiple entries within its validity period."
    },
    {
      question: "How long does it take to process my e-visa application?",
      answer: "Processing times vary by service level: Standard (24-48 hours), Fast (6-12 hours), Express (2-4 hours), and Urgent (1-2 hours). All processing times are business hours only."
    },
    {
      question: "What documents do I need for my e-visa application?",
      answer: "You need a valid passport with at least 6 months remaining validity, a recent passport-style photograph, and supporting documents if required for your nationality (such as hotel reservations, flight tickets, or bank statements)."
    },
    {
      question: "How much does the Turkey e-visa cost?",
      answer: "The e-visa application fee is $69 plus processing fees that range from $25 (Standard) to $295 (Urgent). Additional supporting document fees may apply based on your nationality."
    },
    {
      question: "Can I extend my e-visa once I'm in Turkey?",
      answer: "No, e-visas cannot be extended. If you need to stay longer than your e-visa allows, you must exit Turkey and apply for a new e-visa or appropriate visa type."
    },
    {
      question: "Is travel insurance required for Turkey e-visa?",
      answer: "Travel insurance is not mandatory for e-visa applications, but it is highly recommended. We offer comprehensive travel insurance plans starting from $114 for 7 days coverage."
    },
    {
      question: "What should I do if my e-visa application is rejected?",
      answer: "If your application is rejected, you will receive a detailed explanation. You may reapply with corrected information or contact our support team at info@evisatr.xyz for assistance."
    },
    {
      question: "Can I use my e-visa for multiple entries to Turkey?",
      answer: "Yes, Turkey e-visas are valid for multiple entries within their validity period. You can enter and exit Turkey multiple times as long as your e-visa remains valid."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-8">Find answers to common questions about Turkey e-visa applications</p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Still have questions?</h3>
            <p className="text-blue-800 mb-4">
              If you can't find the answer you're looking for, please contact our support team.
            </p>
            <a 
              href="mailto:info@getvisa.tr" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}