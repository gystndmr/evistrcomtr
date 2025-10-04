import { useEffect, useRef } from "react";

interface PaymentFormProps {
  paymentUrl: string;
  formData?: Record<string, string>;
  onSubmit?: () => void;
}

function PaymentForm({ paymentUrl, formData, onSubmit }: PaymentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    onSubmit?.();
    
    // Use GET method redirect instead of POST form submission (as documented working)
    const timer = setTimeout(() => {
      window.location.href = paymentUrl;
    }, 2000);

    return () => clearTimeout(timer);
  }, [onSubmit, paymentUrl]);

  const handleManualSubmit = () => {
    window.location.href = paymentUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting to Payment</h2>
        <p className="text-gray-600 mb-4">Please wait while we redirect you to the secure payment page...</p>
        <p className="text-sm text-gray-500">If you are not redirected automatically, click the button below.</p>
        
        <div className="mt-4">
          <button 
            onClick={handleManualSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Continue to Payment
          </button>
        </div>
      </div>
      
      {/* Hidden form for POST submission */}
      <form 
        ref={formRef} 
        method="POST" 
        action={paymentUrl}
        style={{ display: 'none' }}
      >
        {formData && Object.entries(formData).map(([key, value]) => (
          <input 
            key={key} 
            type="hidden" 
            name={key} 
            value={value} 
          />
        ))}
      </form>
    </div>
  );
}

export default PaymentForm;