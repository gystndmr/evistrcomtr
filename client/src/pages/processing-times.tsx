import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Clock, Zap, Rocket, AlertTriangle } from "lucide-react";

export default function ProcessingTimes() {
  const { t } = useLanguage();

  const processingOptions = [
    {
      icon: Clock,
      title: "Standard Processing",
      time: "24-48 hours",
      price: "$25",
      description: "Most economical option for non-urgent travel",
      features: [
        "Business hours processing only",
        "Email notification upon completion",
        "Suitable for travel planned 3+ days ahead"
      ],
      color: "blue"
    },
    {
      icon: Zap,
      title: "Fast Processing",
      time: "6-12 hours",
      price: "$75",
      description: "Expedited processing for urgent travel",
      features: [
        "Priority queue processing",
        "Email and SMS notifications",
        "Suitable for travel planned 1-2 days ahead"
      ],
      color: "green"
    },
    {
      icon: Rocket,
      title: "Express Processing",
      time: "2-4 hours",
      price: "$175",
      description: "Super fast processing for last-minute travel",
      features: [
        "Highest priority processing",
        "Immediate email notifications",
        "Suitable for same-day travel"
      ],
      color: "orange"
    },
    {
      icon: AlertTriangle,
      title: "Urgent Processing",
      time: "1-2 hours",
      price: "$295",
      description: "Emergency processing for immediate travel",
      features: [
        "Emergency priority processing",
        "Real-time status updates",
        "Suitable for emergency travel"
      ],
      color: "red"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      green: "bg-green-50 border-green-200 text-green-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800",
      red: "bg-red-50 border-red-200 text-red-800"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      orange: "text-orange-600",
      red: "text-red-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Times & Fees</h1>
          <p className="text-gray-600 mb-8">Choose the processing speed that best fits your travel timeline</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {processingOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className={`border-2 rounded-lg p-6 ${getColorClasses(option.color)}`}>
                  <div className="flex items-center mb-4">
                    <Icon className={`w-8 h-8 ${getIconColor(option.color)} mr-3`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <p className="text-2xl font-bold text-gray-900">{option.time}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">{option.price}</span>
                    <span className="text-sm text-gray-600 ml-1">processing fee</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{option.description}</p>
                  <ul className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Time Notes</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• All processing times are calculated during business hours only</li>
                <li>• Business hours: Monday-Friday, 9:00 AM - 6:00 PM (UTC)</li>
                <li>• Applications submitted on weekends will be processed on the next business day</li>
                <li>• Public holidays may affect processing times</li>
                <li>• Complex applications may require additional verification time</li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Cost Breakdown</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>E-Visa Application Fee:</span>
                  <span className="font-semibold">$69</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-semibold">$25 - $295</span>
                </div>
                <div className="flex justify-between">
                  <span>Supporting Documents (if required):</span>
                  <span className="font-semibold">$50 - $645</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Cost Range:</span>
                  <span>$94 - $1,009</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Tracking */}
          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status Tracking</h2>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2">1</div>
                <h3 className="font-medium text-gray-900">Application Submitted</h3>
                <p className="text-sm text-gray-600">Immediate confirmation</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold mb-2">2</div>
                <h3 className="font-medium text-gray-900">Under Review</h3>
                <p className="text-sm text-gray-600">Document verification</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mb-2">3</div>
                <h3 className="font-medium text-gray-900">Processing</h3>
                <p className="text-sm text-gray-600">Final approval stage</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mb-2">4</div>
                <h3 className="font-medium text-gray-900">Approved</h3>
                <p className="text-sm text-gray-600">E-visa ready for download</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
              You will receive email notifications at each stage of the process. You can also check your application status anytime using your application reference number.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}