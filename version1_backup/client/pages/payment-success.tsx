import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home } from 'lucide-react';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    // Extract transaction ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const txId = urlParams.get('transactionId') || urlParams.get('orderRef');
    if (txId) {
      setTransactionId(txId);
    }
  }, []);

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Ödeme Başarılı!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Ödemeniz başarıyla tamamlandı.
            </p>
            {transactionId && (
              <p className="text-sm text-gray-500">
                İşlem No: <strong>{transactionId}</strong>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                Sonraki Adımlar:
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Email adresinize onay mesajı gönderildi</li>
                <li>• İşleminiz incelenip en kısa sürede tamamlanacak</li>
                <li>• Sorularınız için destek ekibimizle iletişime geçebilirsiniz</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleGoHome}
              className="w-full"
              variant="default"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Bu işlem GPay güvenli ödeme sistemi ile gerçekleştirilmiştir.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}