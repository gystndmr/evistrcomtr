import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import PaymentForm from "@/components/payment-form";
import { apiRequest } from "@/lib/queryClient";

interface InsuranceProduct {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
}

export default function InsuranceSimple() {
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: ""
  });
  const [paymentFormData, setPaymentFormData] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch insurance products
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/insurance/products"],
  });

  const sortedProducts = products ? [...products].sort((a, b) => a.duration - b.duration) : [];

  // Create application mutation
  const createApplicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/insurance/applications", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response) => {
      if (response.paymentUrl) {
        // Redirect to payment
        window.location.href = response.paymentUrl;
      } else if (response.formData) {
        setPaymentFormData(response.formData);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast({
        title: "Please select an insurance plan",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...applicationData,
      productId: selectedProduct.id,
      countryOfOrigin: new URLSearchParams(window.location.search).get('country') || undefined,
    };

    createApplicationMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading insurance plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Payment Form Component */}
      {paymentFormData && (
        <PaymentForm 
          formData={paymentFormData}
          onSubmit={() => setPaymentFormData(null)}
        />
      )}
      
      {/* Simple Header */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Turkey Travel Insurance</h1>
            <p className="text-gray-600">Complete your application below</p>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">Given/First Name(s) *</Label>
                    <Input
                      id="firstName"
                      value={applicationData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Surname(s) *</Label>
                    <Input
                      id="lastName"
                      value={applicationData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email for receive your insurance certificate *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter Email"
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
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={applicationData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="passportNumber">Passport Number *</Label>
                    <Input
                      id="passportNumber"
                      value={applicationData.passportNumber}
                      onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Plan Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Period</h3>
                <div className="max-w-md">
                  <Label htmlFor="insurancePlan">Select Insurance Plan *</Label>
                  <Select onValueChange={(value) => {
                    const product = sortedProducts.find(p => p.id.toString() === value);
                    setSelectedProduct(product || null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose insurance duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedProducts.map((product: InsuranceProduct) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name.replace(" Coverage", "")} - ${product.price} USD
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Section */}
              {selectedProduct && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700">Selected Plan:</span>
                      <span className="font-semibold">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">${selectedProduct.price} USD</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Pay $${selectedProduct.price} - Complete Purchase`
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}