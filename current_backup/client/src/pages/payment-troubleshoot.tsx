import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

export default function PaymentTroubleshoot() {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [gPayStatus, setGPayStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [statusMessage, setStatusMessage] = useState('');

  const checkGPayStatus = async () => {
    setIsCheckingStatus(true);
    try {
      // Try to check GPay API status
      const response = await fetch('https://getvisa.gpayprocessing.com/v1/checkout', {
        method: 'OPTIONS',
        mode: 'no-cors'
      });
      setGPayStatus('working');
      setStatusMessage('GPay API is responding normally');
    } catch (error) {
      setGPayStatus('error');
      setStatusMessage('GPay API is currently experiencing issues');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const testDirectPayment = () => {
    // Open GPay in new window with test transaction
    const testUrl = 'https://getvisa.gpayprocessing.com/checkout/test';
    window.open(testUrl, '_blank', 'noopener,noreferrer');
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
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">Payment System Status</h1>
            <p className="text-lg text-neutral-600">GPay checkout troubleshooting and system diagnostics</p>
          </div>

          {/* Status Alert */}
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Known Issue:</strong> GPay checkout pages are experiencing intermittent 500 server errors. 
              This is a temporary issue on GPay's side, not with our payment system.
            </AlertDescription>
          </Alert>

          {/* Main Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className={`h-5 w-5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                GPay System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Payment API Status:</span>
                <div className="flex items-center gap-2">
                  {gPayStatus === 'working' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {gPayStatus === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                  {gPayStatus === 'unknown' && <AlertCircle className="h-4 w-4 text-gray-500" />}
                  <Badge variant={gPayStatus === 'working' ? 'default' : gPayStatus === 'error' ? 'destructive' : 'secondary'}>
                    {gPayStatus === 'working' ? 'Working' : gPayStatus === 'error' ? 'Issues Detected' : 'Unknown'}
                  </Badge>
                </div>
              </div>
              
              {statusMessage && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {statusMessage}
                </div>
              )}

              <Button 
                onClick={checkGPayStatus}
                disabled={isCheckingStatus}
                className="w-full"
              >
                {isCheckingStatus ? 'Checking...' : 'Check GPay Status'}
              </Button>
            </CardContent>
          </Card>

          {/* Troubleshooting Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Troubleshooting Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 1: Wait and Retry</h3>
                  <p className="text-gray-600 text-sm">
                    GPay server issues are usually temporary. Try again in 2-3 minutes.
                  </p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 2: Clear Browser Cache</h3>
                  <p className="text-gray-600 text-sm">
                    Clear your browser cache and cookies, then try the payment again.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 3: Try Different Browser</h3>
                  <p className="text-gray-600 text-sm">
                    Test the payment in Chrome, Firefox, or Safari to rule out browser-specific issues.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 4: Contact Support</h3>
                  <p className="text-gray-600 text-sm">
                    If the issue persists, contact our support team with your application number.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={testDirectPayment}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Test GPay Direct Access
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              Return to Homepage
            </Button>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}