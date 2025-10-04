import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

export default function PaymentError() {
  const retryPayment = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-8 sm:py-16 bg-gradient-to-br from-blue-50 to-red-50 min-h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4 shadow-lg p-2">
              <img 
                src={turkeyFlag} 
                alt="Turkey Flag" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">Payment Processing Error</h1>
            <p className="text-lg text-neutral-600">We encountered an issue processing your payment</p>
          </div>

          {/* Main Error Card */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-700">500 Server Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Payment Processing Issue:</strong> The payment system encountered a problem processing your transaction. 
                  This could be a temporary technical issue. Please verify your payment details and try again.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2">What happened?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your payment could not be processed at this time</li>
                  <li>• This could be due to insufficient funds, incorrect card details, or a temporary system issue</li>
                  <li>• No charges have been made to your payment method</li>
                  <li>• Your visa application has been saved and is pending payment</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2">What can you do?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Verify your card details are correct (card number, expiry date, CVV)</li>
                  <li>• Ensure you have sufficient funds available</li>
                  <li>• Try using a different card or payment method</li>
                  <li>• Contact our support team if the problem persists</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button 
                  onClick={retryPayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Payment Again
                </Button>
                
                <Link to="/">
                  <Button variant="outline" className="px-6 py-2">
                    <Home className="w-4 h-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="px-6 py-2"
                  onClick={() => window.open('mailto:support@evisatr.com.tr', '_blank')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> No charges have been made to your payment method. 
                  Your visa application is saved and waiting for successful payment completion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details (Optional) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500 font-mono bg-gray-100 p-3 rounded">
                <p>Error: Payment processing failed</p>
                <p>Status: Transaction not completed</p>
                <p>Time: {new Date().toLocaleString()}</p>
                <p>Note: Your application is saved - you can retry payment at any time</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}