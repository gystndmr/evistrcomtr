import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Shield, Loader2 } from "lucide-react";

export default function ThreeDSAuth() {
  const [, setLocation] = useLocation();
  const formRef = useRef<HTMLFormElement>(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const acsUrl = urlParams.get('acsUrl');
  const md = urlParams.get('md');
  const paReq = urlParams.get('paReq');
  const termUrl = urlParams.get('termUrl');

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Validate required params
    if (!acsUrl || !md || !paReq || !termUrl) {
      console.error('[3DS Auth] Missing required parameters:', { acsUrl, md, paReq, termUrl });
      setTimeout(() => setLocation('/'), 3000);
      return;
    }

    // Auto-submit form after 1 second
    const timer = setTimeout(() => {
      if (formRef.current) {
        console.log('[3DS Auth] Submitting form to ACS:', acsUrl);
        formRef.current.submit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [acsUrl, md, paReq, termUrl, setLocation]);

  if (!acsUrl || !md || !paReq || !termUrl) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 font-semibold">Missing 3D Secure parameters</p>
              <p className="text-sm text-gray-600 mt-2">Redirecting to home...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-xl border-0">
          <CardContent className="p-8">
            {/* 3DS Security Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="w-20 h-20 text-blue-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">3D</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
              3D Secure Authentication
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Redirecting you to your bank for secure verification...
            </p>

            {/* Loading Animation */}
            <div className="flex justify-center mb-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                What is 3D Secure?
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Additional security layer for online card payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>You'll be asked to verify your identity with your bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>This may include SMS code, fingerprint, or password</span>
                </li>
              </ul>
            </div>

            {/* Hidden Form - Auto-submits to ACS */}
            <form 
              ref={formRef}
              method="POST" 
              action={acsUrl}
              className="hidden"
              data-testid="form-3ds-submit"
            >
              <input type="hidden" name="MD" value={md} />
              <input type="hidden" name="PaReq" value={paReq} />
              <input type="hidden" name="TermUrl" value={termUrl} />
            </form>

            {/* Manual Submit Button (fallback) */}
            <div className="text-center">
              <button
                onClick={() => formRef.current?.submit()}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
                data-testid="button-manual-submit"
              >
                Not redirected? Click here
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
