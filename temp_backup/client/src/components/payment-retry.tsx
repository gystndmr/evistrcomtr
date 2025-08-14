import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, ExternalLink, AlertCircle } from "lucide-react";

interface PaymentRetryProps {
  paymentUrl: string;
  orderId: string;
  onRetry: () => void;
}

export function PaymentRetry({ paymentUrl, orderId, onRetry }: PaymentRetryProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 3;

  const handleRetry = async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Wait 2 seconds before retry
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Try to open in new window first
      const newWindow = window.open(paymentUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        setIsRetrying(false);
      } else {
        // Fallback to same window
        window.location.href = paymentUrl;
      }
    } catch (error) {
      setIsRetrying(false);
      onRetry();
    }
  };

  const handleDirectAccess = () => {
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Payment Page Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The payment page is experiencing temporary issues. This is a known intermittent problem with the payment provider.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Retry Attempts:</strong> {retryCount}/{maxRetries}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleRetry}
                disabled={isRetrying || retryCount >= maxRetries}
                className="w-full"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Payment ({retryCount}/{maxRetries})
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDirectAccess}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Payment Page in New Tab
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>If the issue persists, please contact support with your order ID.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}