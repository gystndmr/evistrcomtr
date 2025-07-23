import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Calendar, MapPin, Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsuranceProduct } from "@shared/schema";

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
    dateOfBirth: "",
    passportNumber: "",
    nationality: "",
  });
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/insurance/products"],
    staleTime: 5 * 60 * 1000,
  }) as { data: InsuranceProduct[], isLoading: boolean };

  const createApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) throw new Error("No product selected");
      
      const travelDate = new Date(applicationData.travelDate);
      const returnDate = new Date(applicationData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - travelDate.getTime());
      const tripDurationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const countryFromUrl = new URLSearchParams(window.location.search).get('country') || '';
      
      const applicationData2 = {
        ...applicationData,
        insuranceProductId: selectedProduct.id,
        tripDurationDays,
        countryOfOrigin: countryFromUrl || "Direct Application"
      };

      const response = await apiRequest("/api/insurance/apply", {
        method: "POST",
        body: JSON.stringify(applicationData2),
      });

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      }

      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted",
        description: `Your insurance application number is ${data.applicationNumber}`,
        duration: 5000,
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
    
    if (!selectedProduct) {
      toast({
        title: "Product Selection Required",
        description: "Please select an insurance product",
        variant: "destructive",
      });
      return;
    }

    if (!applicationData.firstName.trim() || !applicationData.lastName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your first and last name",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!applicationData.travelDate || !applicationData.returnDate) {
      toast({
        title: "Travel Dates Required",
        description: "Please enter your travel and return dates",
        variant: "destructive",
      });
      return;
    }

    const travelDate = new Date(applicationData.travelDate);
    const returnDate = new Date(applicationData.returnDate);
    
    if (returnDate <= travelDate) {
      toast({
        title: "Invalid Date Range",
        description: "Return date must be after travel date",
        variant: "destructive",
      });
      return;
    }
    
    createApplicationMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading insurance options...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Clean Hero */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Turkey Travel <span className="text-blue-600">Insurance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive travel protection for your Turkey adventure
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="clean-card rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Insurance Plans */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sortedProducts.map((product) => (
                    <div key={product.id} className="relative">
                      <input
                        type="radio"
                        name="insurance-product"
                        id={`product-${product.id}`}
                        checked={selectedProduct?.id === product.id}
                        onChange={() => setSelectedProduct(product)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className={`block p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                          selectedProduct?.id === product.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-bold text-gray-900 mb-1">
                          {product.name.replace(" Coverage", "")}
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          ${product.price}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={applicationData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={applicationData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={applicationData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportNumber">Passport Number *</Label>
                    <Input
                      id="passportNumber"
                      value={applicationData.passportNumber}
                      onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                      className="mt-1"
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
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Travel Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Travel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="travelDate">Travel Date *</Label>
                    <Input
                      id="travelDate"
                      type="date"
                      value={applicationData.travelDate}
                      onChange={(e) => handleInputChange("travelDate", e.target.value)}
                      className="mt-1"
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
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  className="btn-primary text-lg px-12 py-4"
                  disabled={createApplicationMutation.isPending}
                >
                  {createApplicationMutation.isPending ? "Processing..." : "Apply for Insurance"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}