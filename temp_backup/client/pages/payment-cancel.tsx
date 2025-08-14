import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, Home } from 'lucide-react';

export default function PaymentCancel() {
  const [, setLocation] = useLocation();

  const handleRetry = () => {
    // Go back to the previous page or payment form
    window.history.back();
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">
            Ödeme İptal Edildi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Ödeme işleminiz iptal edildi veya tamamlanamadı.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Ne Yapabilirsiniz:
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ödemeyi tekrar deneyebilirsiniz</li>
              <li>• Farklı bir ödeme yöntemi kullanabilirsiniz</li>
              <li>• Sorun devam ederse destek ekibimizle iletişime geçin</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full"
              variant="default"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Ödemeyi Tekrar Dene
            </Button>
            
            <Button
              onClick={handleGoHome}
              className="w-full"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Herhangi bir ücret tahsil edilmemiştir.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}