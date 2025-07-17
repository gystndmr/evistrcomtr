import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, Calendar, MapPin, Star, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// PaymentForm removed - now using direct redirects
import { PaymentRetry } from "@/components/payment-retry";
import type { InsuranceProduct } from "@shared/schema";
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";

export default function Insurance() {
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelDate: "",
    returnDate: "",
    destination: "Turkey",
  });
  // Removed paymentData state - now using direct redirects
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ["/api/insurance/products"],
  });

  // Sort products in the order: 7, 14, 30, 60, 90, 180, 1 year
  const sortedProducts = [...products].sort((a, b) => {
    const getDuration = (name: string) => {
      if (name.includes('7 Days')) return 1;
      if (name.includes('14 Days')) return 2;
      if (name.includes('30 Days')) return 3;
      if (name.includes('60 Days')) return 4;
      if (name.includes('90 Days')) return 5;
      if (name.includes('180 Days')) return 6;
      if (name.includes('1 Year')) return 7;
      return 0;
    };
    return getDuration(a.name) - getDuration(b.name);
  });

  const createApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) throw new Error("No product selected");
      
      // First create the insurance application
      const applicationResponse = await apiRequest("POST", "/api/insurance/applications", {
        ...applicationData,
        productId: selectedProduct.id,
        totalAmount: selectedProduct.price,
      });
      const applicationData2 = await applicationResponse.json();
      
      // Then create payment
      const paymentResponse = await apiRequest("POST", "/api/payment/create", {
        amount: selectedProduct.price,
        currency: "USD",
        orderId: applicationData2.applicationNumber,
        description: `Turkey Travel Insurance - ${selectedProduct.name}`,
        customerEmail: applicationData.email,
        customerName: `${applicationData.firstName} ${applicationData.lastName}`
      });
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.success && paymentData.paymentUrl) {
        // GPay checkout page only accepts GET method
        // Direct URL redirect using GET
        setCurrentOrderId(applicationData2.applicationNumber);
        
        // Try direct redirect first
        try {
          window.location.href = paymentData.paymentUrl;
        } catch (error) {
          // If direct redirect fails, show retry component
          setShowRetry(true);
        }
      } else {
        throw new Error(paymentData.error || "Payment initialization failed");
      }
      
      return applicationData2;
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted",
        description: `Your insurance application number is ${data.applicationNumber}. Redirecting to payment...`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createApplicationMutation.mutate();
  };

  const getIcon = (productName: string) => {
    if (productName.toLowerCase().includes("basic")) return Shield;
    if (productName.toLowerCase().includes("premium")) return Star;
    if (productName.toLowerCase().includes("comprehensive")) return Crown;
    return Shield;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Professional Header Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg p-3">
              <img 
                src={turkeyFlag} 
                alt="Republic of Turkey Flag" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Republic of Turkey</h1>
            <h2 className="text-xl md:text-2xl mb-2 opacity-90">Travel Insurance Services</h2>
            <p className="text-lg opacity-80">Official Travel Insurance for Turkish Visit</p>
          </div>
        </div>
      </section>

      {/* Insurance Products List - Professional Design */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Official Travel Insurance Plans</h2>
            <p className="text-lg text-gray-700">Select your coverage duration for travel to Turkey</p>
            <div className="mt-4 flex justify-center">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Government Approved Insurance</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Professional Insurance Table */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Available Insurance Plans</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {sortedProducts.map((product: InsuranceProduct, index) => (
                <div 
                  key={product.id} 
                  className={`px-6 py-4 cursor-pointer transition-all ${
                    selectedProduct?.id === product.id 
                      ? "bg-red-50 border-l-4 border-red-600" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="insurance-product"
                          checked={selectedProduct?.id === product.id}
                          onChange={() => setSelectedProduct(product)}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">${product.price}</div>
                      <div className="text-sm text-gray-500">Total Premium</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Application Form */}
          {selectedProduct && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 mt-8">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Insurance Application Form</h3>
                    <p className="text-sm text-gray-600">Selected Plan: {selectedProduct.name}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={applicationData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={applicationData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={applicationData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={applicationData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="travelDate">Travel Date *</Label>
                      <Input
                        id="travelDate"
                        type="date"
                        value={applicationData.travelDate}
                        onChange={(e) => handleInputChange("travelDate", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="returnDate">Return Date *</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        value={applicationData.returnDate}
                        onChange={(e) => handleInputChange("returnDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="font-semibold mb-4 text-gray-900 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      <span>Insurance Summary</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700 font-medium">{selectedProduct.name}</span>
                        <span className="font-semibold text-red-600">${selectedProduct.price}</span>
                      </div>
                      <div className="border-t pt-3 mt-3 border-gray-300">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-900">Total Premium</span>
                          <span className="text-red-600 text-xl">${selectedProduct.price}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        <p>• Medical coverage up to $100,000</p>
                        <p>• 24/7 emergency assistance</p>
                        <p>• Trip cancellation protection</p>
                        <p>• Lost baggage coverage</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? "Processing Application..." : "Submit Insurance Application"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      
      {/* Payment Retry Component */}
      {showRetry && currentOrderId && (
        <PaymentRetry
          paymentUrl={`https://getvisa.gpayprocessing.com/checkout/${currentOrderId}`}
          orderId={currentOrderId}
          onRetry={() => {
            setShowRetry(false);
            // Retry the payment creation
            createApplicationMutation.mutate();
          }}
        />
      )}
    </div>
  );
}
