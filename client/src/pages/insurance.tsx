import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle, Calendar, MapPin, Star, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// PaymentForm removed - now using direct redirects
import { PaymentRetry } from "@/components/payment-retry";
import type { InsuranceProduct } from "@shared/schema";

export default function Insurance() {
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  
  // Get country from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const countryFromUrl = urlParams.get('country') || '';
  
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelDate: "",
    returnDate: "",
    destination: "Turkey",
    dateOfBirth: "",
  });
  const [parentIdPhotos, setParentIdPhotos] = useState<File[]>([]);
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string>("");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/insurance/products"],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  }) as { data: InsuranceProduct[], isLoading: boolean };

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
      
      // Calculate trip duration in days
      const travelDate = new Date(applicationData.travelDate);
      const returnDate = new Date(applicationData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - travelDate.getTime());
      const tripDurationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Prepare parent ID photos data for under 18
      const parentIdPhotosData = parentIdPhotos.length > 0 ? 
        await Promise.all(parentIdPhotos.map(async (file) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          return { name: file.name, data: base64 };
        })) : null;

      // First create the insurance application
      const applicationResponse = await apiRequest("POST", "/api/insurance/applications", {
        ...applicationData,
        productId: selectedProduct.id,
        totalAmount: selectedProduct.price,
        tripDurationDays: tripDurationDays,
        dateOfBirth: applicationData.dateOfBirth,
        parentIdPhotos: parentIdPhotosData,
        countryOfOrigin: countryFromUrl,
      });
      const applicationData2 = await applicationResponse.json();
      
      // Then create payment - let server generate unique orderRef
      const paymentResponse = await apiRequest("POST", "/api/payment/create", {
        amount: selectedProduct.price,
        currency: "USD",
        description: `Turkey Travel Insurance - ${selectedProduct.name}`,
        customerEmail: applicationData.email,
        customerName: `${applicationData.firstName} ${applicationData.lastName}`
        // Removed orderId - server will generate unique orderRef automatically
      });
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.success && paymentData.paymentUrl) {
        setCurrentOrderId(applicationData2.applicationNumber);
        setPaymentRedirectUrl(paymentData.paymentUrl);
        
        // Enhanced redirect approach for mobile compatibility with debugging
        const redirectToPayment = () => {
          try {
            console.log('[Insurance Payment Debug] Starting redirect process');
            console.log('[Insurance Payment Debug] Payment URL:', paymentData.paymentUrl);
            console.log('[Insurance Payment Debug] User Agent:', navigator.userAgent);
            
            // Always show success toast first
            toast({
              title: "Insurance Payment Created",
              description: "Redirecting to secure payment page...",
              duration: 3000,
            });

            // Small delay to ensure toast is shown, then redirect
            setTimeout(() => {
              console.log('[Insurance Payment Debug] Executing redirect');
              window.location.href = paymentData.paymentUrl;
            }, 1500);

          } catch (error) {
            console.error('[Insurance Payment Debug] Error during redirect:', error);
            
            // Fallback: Show manual button
            toast({
              title: "Payment Ready", 
              description: "If redirect doesn't work, click the button below",
              action: (
                <Button 
                  size="sm" 
                  onClick={() => window.location.href = paymentData.paymentUrl}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete Payment
                </Button>
              ),
              duration: 30000,
            });
          }
        };

        // Execute redirect
        redirectToPayment();
        
      } else {
        throw new Error(paymentData.message || "Payment creation failed");
      }
    },
    onError: (error) => {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      setShowRetry(true);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParentIdPhotoUpload = (files: File[]) => {
    setParentIdPhotos(files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast({
        title: "Selection Required",
        description: "Please select an insurance plan",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email || !applicationData.phone || !applicationData.travelDate || !applicationData.returnDate || !applicationData.dateOfBirth) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Age validation for under 18 - require parent ID photos
    const birthDate = new Date(applicationData.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18 && parentIdPhotos.length === 0) {
      toast({
        title: "Ebeveyn Kimlik Belgesi Gerekli",
        description: "18 yaşından küçük başvuranlar için ebeveyn kimlik belgesi yüklenmesi zorunludur.",
        variant: "destructive",
      });
      return;
    }

    createApplicationMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading insurance options...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
              
              {/* Insurance Plan Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Period</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sortedProducts.map((product: InsuranceProduct) => (
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
                        className={`block p-4 border rounded-lg cursor-pointer text-center transition-all ${
                          selectedProduct?.id === product.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{product.name.replace(" Coverage", "")}</div>
                        <div className="text-lg font-bold text-blue-600">${product.price}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              {selectedProduct && (
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
                        type="tel"
                        value={applicationData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    {/* Date of Birth - using three separate selects */}
                    <div>
                      <Label>Date of Birth *</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <Select onValueChange={(value) => {
                          const [year, month, day] = (applicationData.dateOfBirth || "--").split("-");
                          handleInputChange("dateOfBirth", `${year || new Date().getFullYear()}-${month || "01"}-${value.padStart(2, "0")}`);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => {
                          const [year, , day] = (applicationData.dateOfBirth || "--").split("-");
                          handleInputChange("dateOfBirth", `${year || new Date().getFullYear()}-${value.padStart(2, "0")}-${day || "01"}`);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                            ].map((month, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => {
                          const [, month, day] = (applicationData.dateOfBirth || "--").split("-");
                          handleInputChange("dateOfBirth", `${value}-${month || "01"}-${day || "01"}`);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 100 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Travel Dates */}
                    <div>
                      <Label>Travel Dates *</Label>
                      <div className="space-y-2 mt-1">
                        <div>
                          <Label htmlFor="travelDate" className="text-sm text-gray-600">Departure Date</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Select onValueChange={(value) => {
                              const [year, month, day] = (applicationData.travelDate || "--").split("-");
                              handleInputChange("travelDate", `${year || new Date().getFullYear()}-${month || "01"}-${value.padStart(2, "0")}`);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Day" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => {
                              const [year, , day] = (applicationData.travelDate || "--").split("-");
                              handleInputChange("travelDate", `${year || new Date().getFullYear()}-${value.padStart(2, "0")}-${day || "01"}`);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "January", "February", "March", "April", "May", "June",
                                  "July", "August", "September", "October", "November", "December"
                                ].map((month, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => {
                              const [, month, day] = (applicationData.travelDate || "--").split("-");
                              handleInputChange("travelDate", `${value}-${month || "01"}-${day || "01"}`);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 5 }, (_, i) => {
                                  const year = new Date().getFullYear() + i;
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="returnDate" className="text-sm text-gray-600">Return Date</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Select onValueChange={(value) => {
                              const [year, month, day] = (applicationData.returnDate || "--").split("-");
                              handleInputChange("returnDate", `${year || new Date().getFullYear()}-${month || "01"}-${value.padStart(2, "0")}`);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Day" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => {
                              const [year, , day] = (applicationData.returnDate || "--").split("-");
                              handleInputChange("returnDate", `${year || new Date().getFullYear()}-${value.padStart(2, "0")}-${day || "01"}`);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "January", "February", "March", "April", "May", "June",
                                  "July", "August", "September", "October", "November", "December"
                                ].map((month, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => {
                              const [, month, day] = (applicationData.returnDate || "--").split("-");
                              handleInputChange("returnDate", `${value}-${month || "01"}-${day || "01"}`);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 5 }, (_, i) => {
                                  const year = new Date().getFullYear() + i;
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Under 18 - Parent ID Upload */}
                  {(() => {
                    if (!applicationData.dateOfBirth) return null;
                    
                    const birthDate = new Date(applicationData.dateOfBirth);
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    
                    if (age >= 18) return null;
                    
                    return (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          <Shield className="inline-block w-4 h-4 mr-2 text-yellow-600" />
                          Ebeveyn Kimlik Belgesi Gerekli
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">
                          18 yaşından küçük olduğunuz için ebeveyn kimlik belgenizi yüklemeniz gerekmektedir.
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={(e) => handleParentIdPhotoUpload(Array.from(e.target.files || []))}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {parentIdPhotos.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600">
                              ✓ {parentIdPhotos.length} dosya yüklendi
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Summary Section */}
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Insurance Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{selectedProduct.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage Period:</span>
                        <span className="font-medium">{selectedProduct.name.replace(" Coverage", "")}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span className="text-gray-900">Total Premium</span>
                        <span className="text-red-600 text-lg">${selectedProduct.price}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <p>• Medical coverage up to $100,000</p>
                        <p>• 24/7 emergency assistance</p>
                        <p>• Trip cancellation protection</p>
                        <p>• Lost baggage coverage</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Complete Insurance Purchase"
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

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