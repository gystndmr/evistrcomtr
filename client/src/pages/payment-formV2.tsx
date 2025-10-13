import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Lock, ArrowLeft, Calendar, Mail, Phone, Receipt, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PaymentFormV2() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get payment data from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const orderRef = urlParams.get('orderRef') || urlParams.get('applicationNumber') || '';
  const amount = parseFloat(urlParams.get('amount') || '0');
  const paymentType = urlParams.get('type') || 'insurance'; // visa or insurance
  const customerName = urlParams.get('customerName') || '';
  const customerEmail = urlParams.get('customerEmail') || '';
  const customerPhone = urlParams.get('customerPhone') || '';

  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!orderRef || !amount || amount <= 0) {
      console.error('[Payment FormV2] Invalid params:', { orderRef, amount, paymentType });
      toast({
        title: "Invalid Payment Link",
        description: "Missing payment information. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => setLocation(paymentType === 'visa' ? "/" : "/insurance"), 3000);
    } else {
      console.log('[Payment FormV2] Valid params loaded:', { orderRef, amount, paymentType, customerName });
      setCardHolderName(customerName);
    }
  }, [orderRef, amount, paymentType, customerName, setLocation, toast]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted.slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    if (!cardHolderName.trim()) {
      toast({
        title: "Card Holder Required",
        description: "Please enter card holder name",
        variant: "destructive",
      });
      return;
    }

    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid card number",
        variant: "destructive",
      });
      return;
    }

    if (!expiryMonth || !expiryYear) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please select expiry month and year",
        variant: "destructive",
      });
      return;
    }

    if (cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV code",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const amountMinor = Math.round(amount * 100);

      const response = await fetch("/api/paytriot/sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountMinor,
          cardNumber: cleanCardNumber,
          cardExpiryMonth: expiryMonth,
          cardExpiryYear: expiryYear,
          cardCVV: cvv,
          orderRef: orderRef || `TMP-${Date.now()}`,
          transactionUnique: orderRef
            ? `${orderRef}-${Date.now()}`
            : `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerName: cardHolderName || customerName || "",
          customerEmail: customerEmail || "",
          customerPhone: customerPhone || "",
          customerIPAddress: "",
        }),
      });


      console.log('[Payment-FormV2] Response status:', response.status);
      console.log('[Payment-FormV2] Response content-type:', response.headers.get('content-type'));
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Payment-FormV2] Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('[Payment-FormV2] Payment response:', data);
      if (data.status === "success") {
        toast({
          title: "Payment Successful!",
          description: `Transaction completed. Reference: ${data.xref}`,
        });
       
	// Redirect to payment success page with data
        const successParams = new URLSearchParams({
          orderRef: orderRef,
          amount: amount.toString(),
          xref: data.xref || '',
          type: paymentType
        });
        
        setTimeout(() => setLocation(`/payment-success?${successParams.toString()}`), 1500);
      } else if (data.status === "3ds_required") {
	console.log('[Payment-FormV2] 3DS required - redirecting to auth page');
  const threeDSParams = new URLSearchParams({
    acsUrl: data.acsUrl || '',
    md: data.md || '',
    paReq: data.paReq || '',
    termUrl: data.termUrl || ''
  });
  setLocation(`/3ds-auth?${threeDSParams.toString()}`);        

      } else {
        toast({
          title: "Payment Failed",
          description: data.message || "Payment could not be processed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(paymentType === 'visa' ? "/" : "/insurance")}
          className="mb-6 hover:bg-white/50"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {paymentType === 'visa' ? 'Application' : 'Insurance'}
        </Button>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6 space-y-6">
                {/* Order Reference */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Receipt className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-amber-700 font-medium mb-1">
                      {paymentType === 'visa' ? 'Application Number:' : 'Order Reference:'}
                    </p>
                    <p className="text-sm font-bold text-amber-900" data-testid="text-order-ref">
                      {orderRef || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 font-medium mb-1">Date:</p>
                    <p className="text-sm font-semibold text-slate-800">{currentDate}</p>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Wallet className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-green-700 font-medium mb-1">Total:</p>
                    <p className="text-2xl font-bold text-green-900" data-testid="text-amount">
                      ${amount.toFixed(2)} USD
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                {/* 3D Credit Card Visual with Flip Animation */}
                <div className="mb-8 relative h-56" style={{ perspective: '1000px' }}>
                  <div 
                    className="relative w-full h-full transition-transform duration-700"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {/* Front of Card */}
                    <div 
                      className="absolute w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-6 shadow-2xl"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md shadow-lg"></div>
                        <svg className="w-10 h-8 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                      </div>
                      <div className="mb-6">
                        <p className="text-white/90 text-xl tracking-widest font-mono" data-testid="display-card-number">
                          {cardNumber || "1234 1234 1234 1234"}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-white/70 text-xs mb-1">CARD HOLDER</p>
                          <p className="text-white font-semibold uppercase tracking-wide" data-testid="display-card-holder">
                            {cardHolderName || "NAME SURNAME"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/70 text-xs mb-1">VALID THRU</p>
                          <p className="text-white font-semibold" data-testid="display-expiry">
                            {expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear.slice(-2)}` : "MM/YY"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div 
                      className="absolute w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl shadow-2xl"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="w-full h-12 bg-black mt-6"></div>
                      <div className="px-6 mt-6">
                        <div className="bg-white/90 rounded p-2 flex justify-end items-center h-10">
                          <span className="text-gray-800 font-mono text-lg tracking-wider px-3">
                            {cvv || "•••"}
                          </span>
                        </div>
                        <p className="text-white/70 text-xs mt-2 text-right">CVV</p>
                      </div>
                      <div className="absolute bottom-6 right-6">
                        <svg className="w-12 h-10 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Holder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="cardHolder" className="text-sm font-semibold text-gray-700">
                      CARD HOLDER
                    </Label>
                    <Input
                      id="cardHolder"
                      type="text"
                      placeholder="NAME SURNAME"
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      data-testid="input-card-holder"
                      required
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-red-500" />
                      <Label className="text-xs text-gray-500">Card Number</Label>
                    </div>
                    <Input
                      type="text"
                      placeholder="1241 2412 1241 2412"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="h-12 text-lg tracking-wider border-2 border-dashed border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                      data-testid="input-card-number"
                      required
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">MM / YY</Label>
                      <div className="flex gap-2">
                        <Select value={expiryMonth} onValueChange={setExpiryMonth} required>
                          <SelectTrigger className="h-12 border-gray-300" data-testid="select-expiry-month">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = (i + 1).toString().padStart(2, '0');
                              return (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <Select value={expiryYear} onValueChange={setExpiryYear} required>
                          <SelectTrigger className="h-12 border-gray-300" data-testid="select-expiry-year">
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-xs text-gray-500">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="•••"
                          value={cvv}
                          onChange={handleCvvChange}
                          onFocus={() => setIsCardFlipped(true)}
                          onBlur={() => setIsCardFlipped(false)}
                          className="h-12 text-xl tracking-wider border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          maxLength={3}
                          data-testid="input-cvv"
                          required
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    data-testid="button-make-payment"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5" />
                        MAKE PAYMENT
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
