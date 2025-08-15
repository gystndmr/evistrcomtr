import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AlertTriangle, Home, RefreshCw, CreditCard, HelpCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PaymentCancel() {
  const [, setLocation] = useLocation();
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const status = urlParams.get('status');
  const orderRef = urlParams.get('orderRef');
  const amount = urlParams.get('amount');

  // Determine error type and provide specific guidance
  const getErrorDetails = () => {
    if (!status) return { type: 'general', icon: AlertTriangle, color: 'red' };
    
    switch (status) {
      case 'declined':
        return { 
          type: 'declined', 
          icon: CreditCard, 
          color: 'orange',
          title: 'Payment Declined',
          suggestions: [
            'Check your card balance',
            'Verify card details are correct',
            'Try a different payment method',
            'Contact your bank if the issue persists'
          ]
        };
      case 'failed':
        return { 
          type: 'failed', 
          icon: AlertTriangle, 
          color: 'red',
          title: 'Payment Failed',
          suggestions: [
            'Check if your card supports international transactions',
            'Ensure your card is not expired',
            'Try using a different card',
            'Contact your bank for assistance'
          ]
        };
      case 'error':
        return { 
          type: 'error', 
          icon: AlertTriangle, 
          color: 'red',
          title: 'Payment System Error',
          suggestions: [
            'This is a temporary technical issue',
            'Please try again in a few minutes',
            'Use a different browser if the problem continues',
            'Contact our support if you need immediate assistance'
          ]
        };
      case 'cancelled':
        return { 
          type: 'cancelled', 
          icon: HelpCircle, 
          color: 'blue',
          title: 'Payment Cancelled',
          suggestions: [
            'You cancelled the payment process',
            'Your application data has been saved',
            'You can continue the payment anytime',
            'No charges were made to your account'
          ]
        };
      default:
        return { 
          type: 'unknown', 
          icon: AlertTriangle, 
          color: 'gray',
          title: 'Payment Issue',
          suggestions: [
            'An unexpected issue occurred',
            'Please try the payment again',
            'Contact support if the problem continues'
          ]
        };
    }
  };

  const errorDetails = getErrorDetails();
  const IconComponent = errorDetails.icon;

  // Determine service type based on amount
  const isInsurance = amount && parseFloat(amount) > 100;
  const serviceType = isInsurance ? 'Travel Insurance' : 'E-Visa Application';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-xl border-0">
        <CardHeader className="pb-4">
          <div className={`mx-auto w-20 h-20 bg-gradient-to-br from-${errorDetails.color}-400 to-${errorDetails.color}-600 rounded-full flex items-center justify-center mb-6 shadow-lg`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          <CardTitle className={`text-3xl font-bold text-${errorDetails.color}-800 mb-2`}>
            {errorDetails.title || 'Payment Issue'}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            There was an issue with your {serviceType.toLowerCase()} payment
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Transaction Details */}
          {(orderRef || amount) && (
            <div className={`bg-gradient-to-r from-${errorDetails.color}-50 to-${errorDetails.color}-100 p-6 rounded-xl border border-${errorDetails.color}-200`}>
              <div className="grid grid-cols-1 gap-4 text-left">
                {orderRef && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Order Reference:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {orderRef.slice(-8).toUpperCase()}
                    </Badge>
                  </div>
                )}
                
                {amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Amount:</span>
                    <span className="font-bold text-gray-700">${amount} USD</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Service:</span>
                  <span className="font-semibold text-blue-700">{serviceType}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge variant="destructive">{status || 'Failed'}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          <Alert className="text-left">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-base">
              {error || 'Your payment could not be processed. Please try again.'}
            </AlertDescription>
          </Alert>

          {/* Suggestions */}
          {errorDetails.suggestions && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-left">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                What you can do:
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                {errorDetails.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Payment Status Notice */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 text-green-700 mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Important Notice</span>
            </div>
            <p className="text-sm text-green-600">
              No charges were made to your account. Your application data is safely saved and you can retry payment anytime.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => {
                if (isInsurance) {
                  setLocation("/insurance");
                } else {
                  setLocation("/application");
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Payment Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation("/")} 
              className="w-full border-2 border-gray-200 hover:bg-gray-50 py-3"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation("/faq")} 
              className="w-full border-2 border-green-200 hover:bg-green-50 py-3"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>

          {/* Support Information */}
          <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-2">Need Help?</p>
            <p>Our payment system is secure and your data is protected. If you continue to experience issues, please contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}