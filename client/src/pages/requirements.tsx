import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Check, AlertCircle, FileText, Camera, CreditCard } from "lucide-react";

export default function Requirements() {
  const { t } = useLanguage();

  const generalRequirements = [
    "Valid passport with at least 6 months remaining validity",
    "Recent passport-style photograph (taken within last 6 months)",
    "Valid email address for receiving e-visa",
    "Credit/debit card for payment processing"
  ];

  const supportingDocuments = [
    {
      title: "Hotel Reservation",
      description: "Confirmed hotel booking or accommodation details for your stay in Turkey"
    },
    {
      title: "Flight Tickets",
      description: "Round-trip flight itinerary showing entry and exit dates"
    },
    {
      title: "Bank Statement",
      description: "Recent bank statement (last 3 months) showing sufficient funds"
    },
    {
      title: "Travel Insurance",
      description: "Valid travel insurance policy covering your Turkey visit (recommended)"
    }
  ];

  const eligibleCountries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", 
    "Italy", "Spain", "Netherlands", "Belgium", "Austria", "Sweden", "Norway", 
    "Denmark", "Finland", "Ireland", "Portugal", "Poland", "Czech Republic", 
    "Hungary", "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania", "Malta", 
    "Cyprus", "Luxembourg", "Iceland", "Liechtenstein", "Monaco", "San Marino", 
    "Vatican City", "Andorra", "Switzerland", "Croatia", "Bulgaria", "Romania"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('requirements.title')}</h1>
          <p className="text-gray-600 mb-8">{t('requirements.subtitle')}</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* General Requirements */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                {t('requirements.general')}
              </h2>
              <ul className="space-y-3">
                {generalRequirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supporting Documents */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                {t('requirements.supporting.docs')}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Required for certain nationalities (will be indicated during application)
              </p>
              <div className="space-y-4">
                {supportingDocuments.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{doc.title}</h3>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Requirements */}
          <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="w-5 h-5 text-yellow-600 mr-2" />
              Photo Requirements
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Photo Specifications</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Recent photo (taken within last 6 months)</li>
                  <li>• Color photograph on white background</li>
                  <li>• 50x60mm size (passport photo size)</li>
                  <li>• Face must be clearly visible</li>
                  <li>• No sunglasses or headwear (except religious)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Digital Requirements</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• JPEG format only</li>
                  <li>• Maximum file size: 1MB</li>
                  <li>• Minimum resolution: 300 DPI</li>
                  <li>• No filters or editing</li>
                  <li>• Clear and sharp image quality</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Eligible Countries */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
              Eligible Countries
            </h2>
            <p className="text-gray-600 mb-4">
              Citizens of the following countries are eligible for Turkey e-visa:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {eligibleCountries.map((country, index) => (
                <div key={index} className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-700">
                  {country}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * This list may not be complete. Please check your eligibility during the application process.
            </p>
          </div>

          {/* Important Notes */}
          <div className="mt-8 p-6 bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              Important Notes
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Your passport must be valid for at least 6 months from your planned entry date</li>
              <li>• E-visa is only valid for tourism and business purposes</li>
              <li>• Maximum stay is 90 days within a 180-day period</li>
              <li>• E-visa cannot be extended once you're in Turkey</li>
              <li>• You must have a return or onward travel ticket</li>
              <li>• Entry may be denied at the border if you don't meet all requirements</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}