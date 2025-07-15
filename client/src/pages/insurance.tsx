import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock, CheckCircle, Calendar, MapPin, Star, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ["/api/insurance/products"],
  });

  const createApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) throw new Error("No product selected");
      
      await apiRequest("POST", "/api/insurance/applications", {
        ...applicationData,
        productId: selectedProduct.id,
        totalAmount: selectedProduct.price,
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your insurance application has been submitted successfully.",
      });
      // Reset form
      setApplicationData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        travelDate: "",
        returnDate: "",
        destination: "Turkey",
      });
      setSelectedProduct(null);
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
      
      {/* Hero Section with Turkey background */}
      <section className="relative bg-gradient-secondary text-white py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-lg p-3">
              <img 
                src={turkeyFlag} 
                alt="Turkey Flag" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Travel Insurance for Turkey</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Comprehensive protection for your Turkish adventure</p>
          </div>
        </div>
      </section>

      {/* Insurance Products List */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Choose Your Coverage Duration</h2>
            <p className="text-lg text-neutral-600">Select the insurance plan that matches your travel duration</p>
          </div>
          
          {/* Insurance Products as List */}
          <div className="space-y-4 mb-12">
            {products.map((product: InsuranceProduct, index) => (
              <div 
                key={product.id} 
                className={`border rounded-lg p-6 transition-all cursor-pointer ${
                  selectedProduct?.id === product.id 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                } ${product.isPopular ? "ring-2 ring-primary/20" : ""}`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        {product.isPopular && (
                          <Badge className="bg-primary text-white text-xs">Most Popular</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${product.price}</div>
                    <div className="text-sm text-gray-500">Total Coverage</div>
                  </div>
                </div>
                
                {selectedProduct?.id === product.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {product.coverage && Object.entries(product.coverage as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">
                            <strong>{key}:</strong> {typeof value === 'string' ? value : key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Application Form */}
          {selectedProduct && (
            <Card className="max-w-2xl mx-auto mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Insurance Application</span>
                </CardTitle>
                <p className="text-neutral-600">Complete your application for {selectedProduct.name}</p>
              </CardHeader>
              <CardContent>
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
                  
                  <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-6 border border-primary/20">
                    <h4 className="font-semibold mb-4 text-primary">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">{selectedProduct.name}</span>
                        <span className="font-semibold text-primary">${selectedProduct.price}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 border-gray-200">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-900">Total Amount</span>
                          <span className="text-primary text-lg">${selectedProduct.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? "Processing..." : "Submit Application & Get Coverage"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
