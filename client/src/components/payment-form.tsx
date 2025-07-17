import { useEffect, useRef } from "react";

interface PaymentFormProps {
  paymentUrl: string;
  formData?: Record<string, string>;
  onSubmit?: () => void;
}

export function PaymentForm({ paymentUrl, formData, onSubmit }: PaymentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Use GET redirect instead of POST form submission
    onSubmit?.();
    
    // GPay checkout page only accepts GET method
    // Using POST causes 500 server error
    window.location.href = paymentUrl;
  }, [paymentUrl, onSubmit]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting to Payment</h2>
        <p className="text-gray-600 mb-4">Please wait while we redirect you to the secure payment page...</p>
        <p className="text-sm text-gray-500">If you are not redirected automatically, click the button below.</p>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => window.location.href = paymentUrl}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}