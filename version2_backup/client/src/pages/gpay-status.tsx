import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

interface GPayStatusCheck {
  domain: string;
  status: 'checking' | 'success' | 'error' | 'unknown';
  message: string;
  responseTime?: number;
}

export default function GPayStatus() {
  const [statusChecks, setStatusChecks] = useState<GPayStatusCheck[]>([
    { domain: 'getvisa.tr', status: 'unknown', message: 'Not checked' },
    { domain: 'evisatr.com.tr', status: 'unknown', message: 'Not checked' },
    { domain: 'localhost:5000', status: 'unknown', message: 'Not checked' }
  ]);
  
  const [isChecking, setIsChecking] = useState(false);

  const checkDomainStatus = async (domain: string): Promise<GPayStatusCheck> => {
    const startTime = Date.now();
    
    try {
      // Test payment creation with this domain
      const testPayment = {
        orderRef: `TEST_${Date.now()}`,
        amount: 1.00,
        currency: "USD",
        orderDescription: "Domain Test Payment",
        customerEmail: "test@example.com",
        customerName: "Test User",
        testDomain: domain
      };

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayment)
      });

      const result = await response.json();
      const responseTime = Date.now() - startTime;

      if (result.success && result.paymentUrl) {
        // Try to access the payment URL
        try {
          const paymentResponse = await fetch(result.paymentUrl, { 
            method: 'HEAD', 
            mode: 'no-cors'
          });
          
          return {
            domain,
            status: 'success',
            message: 'Payment URL created successfully',
            responseTime
          };
        } catch (urlError) {
          return {
            domain,
            status: 'error',
            message: 'Payment URL not accessible',
            responseTime
          };
        }
      } else {
        return {
          domain,
          status: 'error',
          message: result.error || 'Payment creation failed',
          responseTime
        };
      }
    } catch (error) {
      return {
        domain,
        status: 'error',
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime: Date.now() - startTime
      };
    }
  };

  const runStatusCheck = async () => {
    setIsChecking(true);
    
    // Set all to checking status
    setStatusChecks(prev => prev.map(check => ({ 
      ...check, 
      status: 'checking', 
      message: 'Testing...' 
    })));

    // Check each domain
    for (let i = 0; i < statusChecks.length; i++) {
      const check = statusChecks[i];
      const result = await checkDomainStatus(check.domain);
      
      setStatusChecks(prev => prev.map((item, index) => 
        index === i ? result : item
      ));
      
      // Small delay between checks
      if (i < statusChecks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsChecking(false);
  };

  const getStatusIcon = (status: GPayStatusCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Clock className="w-4 h-4 animate-pulse text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: GPayStatusCheck['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">GPay Domain Status Check</h1>
            <p className="text-lg text-neutral-600">Testing domain registration with GPay payment gateway</p>
          </div>

          {/* Current Issue Alert */}
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Issue:</strong> GPay checkout pages returning 500 server errors. 
              This diagnostic tool helps identify if the domain registration is the cause.
            </AlertDescription>
          </Alert>

          {/* Status Check Button */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle>Domain Registration Test</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={runStatusCheck}
                disabled={isChecking}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Domains...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Domain Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Status Results */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusChecks.map((check, index) => (
                  <div key={check.domain} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h3 className="font-medium">{check.domain}</h3>
                        <p className="text-sm text-gray-600">{check.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {check.responseTime && (
                        <span className="text-xs text-gray-500">
                          {check.responseTime}ms
                        </span>
                      )}
                      <Badge className={getStatusColor(check.status)}>
                        {check.status === 'checking' ? 'Testing' : check.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="font-medium text-yellow-800">Domain Registration Required</h4>
                  <p className="text-sm text-yellow-700">
                    All callback domains must be registered with GPay merchant account. 
                    Contact GPay support to register: getvisa.tr
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-medium text-blue-800">SSL Certificate Check</h4>
                  <p className="text-sm text-blue-700">
                    Ensure all domains have valid SSL certificates and are accessible via HTTPS.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <h4 className="font-medium text-green-800">Contact GPay Support</h4>
                  <p className="text-sm text-green-700">
                    If domains show as working but 500 errors persist, contact GPay technical support 
                    with merchant ID: 1100002537
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}