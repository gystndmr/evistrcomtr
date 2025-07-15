import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Star, Crown, Calendar, MapPin } from "lucide-react";
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
      
      {/* Hero Section */}
      <section className="bg-gradient-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Travel Insurance</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Protect your trip to Turkey with comprehensive coverage</p>
          </div>
        </div>
      </section>

      {/* Insurance Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Choose Your Coverage</h2>
            <p className="text-lg text-neutral-600">Select the insurance plan that best fits your travel needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {products.map((product: InsuranceProduct) => {
              const Icon = getIcon(product.name);
              const isPopular = product.isPopular;
              
              return (
                <Card key={product.id} className={`relative ${isPopular ? "border-2 border-primary" : ""}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="text-center">
                      <Icon className="w-12 h-12 text-primary mx-auto mb-3" />
                      <CardTitle>{product.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 mb-6">{product.description}</p>
                    
                    {product.coverage && (
                      <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                        {Object.entries(product.coverage as Record<string, any>).map(([key, value]) => (
                          <li key={key} className="flex items-center">
                            <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                            {typeof value === 'string' ? value : key}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">${product.price}</div>
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedProduct(product)}
                        variant={selectedProduct?.id === product.id ? "default" : "outline"}
                      >
                        {selectedProduct?.id === product.id ? "Selected" : "Select Plan"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Application Form */}
          {selectedProduct && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Insurance Application</CardTitle>
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
                  
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{selectedProduct.name}</span>
                        <span>${selectedProduct.price}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount</span>
                          <span>${selectedProduct.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary hover:bg-secondary/90"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? "Processing..." : "Submit Application"}
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
