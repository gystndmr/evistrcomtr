import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrlParams(params);
    
    const paymentStatus = params.get('payment');
    const transactionId = params.get('transaction');
    const orderId = params.get('order');
    const isTest = params.get('test');
    
    // If order ID exists, verify payment status from database
    if (orderId) {
      const verifyPayment = async () => {
        try {
          const response = await fetch(`/api/applications/${orderId}`);
          if (response.ok) {
            const data = await response.json();
            setApplicationData(data);
            if (data.paymentStatus === 'succeeded' || data.paymentStatus === 'completed') {
              setPaymentVerified(true);
            } else {
              setPaymentVerified(false);
            }
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setPaymentVerified(false);
        }
      };
      verifyPayment();
    }
    
    if (paymentStatus === 'success' && transactionId && orderId) {
      toast({
        title: isTest ? t('payment.success.test.title') : t('payment.success.title'),
        description: `${t('payment.success.message')} ${t('payment.success.transaction.id')}: ${transactionId}`,
      });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: t('payment.cancel.title'),
        description: t('payment.cancel.message'),
        variant: "destructive",
      });
    }
  }, [toast]);

  const transactionId = urlParams?.get('transaction');
  const orderId = urlParams?.get('order');
  const paymentStatus = urlParams?.get('payment');
  const isTest = urlParams?.get('test');

  if (paymentStatus === 'cancelled') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <CardTitle className="text-red-600">{t('payment.cancel.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {t('payment.cancel.message')}
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/application")} className="w-full">
                {t('payment.return.application')}
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                {t('payment.go.home')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">
            {isTest ? t('payment.success.test.title') : t('payment.success.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert>
            <AlertDescription>
              {paymentVerified === true ? (
                "✅ Your payment has been successfully processed and confirmed in our system."
              ) : paymentVerified === false ? (
                "⏳ Your payment is being processed. You will receive email confirmation once approved."
              ) : (
                "🔍 Verifying your payment status..."
              )}
            </AlertDescription>
          </Alert>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{t('payment.success.details.title')}</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>{t('payment.success.application.number')}:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                {transactionId && (
                  <div className="flex justify-between">
                    <span>{t('payment.success.transaction.id')}:</span>
                    <span className="font-mono text-xs">{transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Button onClick={() => navigate(`/status?ref=${orderId}`)} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              {t('payment.success.track.application')}
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('payment.success.back.home')}
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>
              {t('payment.success.email.confirmation')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}