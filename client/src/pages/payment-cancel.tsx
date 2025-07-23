import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentCancel() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const isDevelopment = window.location.hostname.includes('localhost') || 
                         window.location.hostname.includes('replit');
    
    if (error) {
      if (error.includes('fetch failed') && isDevelopment) {
        toast({
          title: t('payment.dev.mode'),
          description: t('payment.dev.description'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('payment.error.title'),
          description: error,
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const isDevelopment = window.location.hostname.includes('localhost') || 
                       window.location.hostname.includes('replit');
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">
            {isDevelopment && error?.includes('fetch failed') ? 
              t('payment.dev.mode') : t('payment.error.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {isDevelopment && error?.includes('fetch failed') ? (
            <Alert>
              <AlertDescription>
                <strong>{t('payment.dev.ready')}</strong><br/>
                {t('payment.dev.dns.limitation')}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertDescription>
                {error || t('payment.error.generic')}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            <h3 className="font-medium text-gray-900 mb-2">{t('payment.system.status')}</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>{t('payment.gateway')}:</span>
                <span className="text-green-600">✓ GPay Production</span>
              </div>
              <div className="flex justify-between">
                <span>{t('payment.merchant.id')}:</span>
                <span className="text-green-600">✓ 1100002537</span>
              </div>
              <div className="flex justify-between">
                <span>{t('payment.environment')}:</span>
                <span className="text-blue-600">
                  {isDevelopment ? t('payment.env.development') : t('payment.env.production')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button onClick={() => navigate("/application")} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('payment.try.again')}
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              {t('payment.go.home')}
            </Button>
          </div>
          
          {isDevelopment && (
            <div className="text-xs text-gray-500 mt-4 p-3 bg-yellow-50 rounded">
              <strong>{t('payment.production.note.title')}:</strong> {t('payment.production.note.description')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}