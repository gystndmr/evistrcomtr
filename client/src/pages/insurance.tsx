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
import turkeyFlag from "@/assets/turkey-flag_1752583610847.png";
import turkeyLogo from "@/assets/turkey-logo.png";
import newTurkeyLogo from "@assets/ChatGPT Image 18 Tem 2025 01_37_34_1752880645933.png";

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
  });
  const [parentIdPhotos, setParentIdPhotos] = useState<File[]>([]);
  // Removed paymentData state - now using direct redirects
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ["/api/insurance/products"],
  }) as { data: InsuranceProduct[] };

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
        dateOfBirth: applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth) : null,
        parentIdPhotos: parentIdPhotosData,
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
        // Use POST form submission with form data
        setCurrentOrderId(applicationData2.applicationNumber);
        
        // Create enhanced payment form with retry mechanism and fallback
        try {
          // Try direct form submission first
          const paymentFormContainer = document.createElement('div');
          paymentFormContainer.innerHTML = `
            <form method="POST" action="${paymentData.paymentUrl}" id="gpayInsuranceForm" target="_blank">
              ${paymentData.formData ? Object.entries(paymentData.formData).map(([key, value]) => 
                `<input type="hidden" name="${key}" value="${value}" />`
              ).join('') : ''}
            </form>
          `;
          document.body.appendChild(paymentFormContainer);
          
          // Auto-submit form after 2 seconds with error handling
          setTimeout(() => {
            const form = document.getElementById('gpayInsuranceForm') as HTMLFormElement;
            if (form) {
              try {
                form.submit();
                // Clean up form after submission
                setTimeout(() => {
                  document.body.removeChild(paymentFormContainer);
                }, 5000);
              } catch (formError) {
                console.error('Form submission error:', formError);
                setShowRetry(true);
                document.body.removeChild(paymentFormContainer);
              }
            }
          }, 2000);
        } catch (error) {
          console.error('Payment form creation error:', error);
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
    
    // Validate all required fields
    if (!selectedProduct) {
      toast({
        title: "Product Selection Required",
        description: "Please select an insurance product before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Please enter your first name",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.lastName.trim()) {
      toast({
        title: "Last Name Required", 
        description: "Please enter your last name",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      toast({
        title: "Invalid Email Format",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.phone.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.travelDate) {
      toast({
        title: "Travel Date Required",
        description: "Please enter your travel date",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.returnDate) {
      toast({
        title: "Return Date Required",
        description: "Please enter your return date",
        variant: "destructive",
      });
      return;
    }
    
    // Date validation - return date must be after travel date
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

    if (!applicationData.dateOfBirth.trim()) {
      toast({
        title: "Date of Birth Required",
        description: "Please enter your date of birth",
        variant: "destructive",
      });
      return;
    }

    // Check if under 18 and require parent ID photos
    const birthDate = new Date(applicationData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    const actualAge = age - (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? 1 : 0);

    if (actualAge < 18 && parentIdPhotos.length === 0) {
      toast({
        title: "Parent ID Photos Required",
        description: "18 yaş altı başvurular için anne ve baba kimlik fotoğrafları gereklidir",
        variant: "destructive",
      });
      return;
    }
    
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
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="w-20 h-20 shadow-lg rounded-full overflow-hidden">
                <img src={newTurkeyLogo} alt="Turkey Flag" className="w-full h-full object-cover" />
              </div>
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
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Insurance Application Form</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Selected Plan: {selectedProduct.name}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                      <Label>Travel Date *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={applicationData.travelDate ? new Date(applicationData.travelDate).getDate().toString().padStart(2, '0') : ''}
                          onValueChange={(day) => {
                            const currentDate = applicationData.travelDate ? new Date(applicationData.travelDate) : new Date();
                            currentDate.setDate(parseInt(day));
                            handleInputChange("travelDate", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Gün" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.travelDate ? (new Date(applicationData.travelDate).getMonth() + 1).toString().padStart(2, '0') : ''}
                          onValueChange={(month) => {
                            const currentDate = applicationData.travelDate ? new Date(applicationData.travelDate) : new Date();
                            currentDate.setMonth(parseInt(month) - 1);
                            handleInputChange("travelDate", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Ay" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: '01', label: 'Ocak' },
                              { value: '02', label: 'Şubat' },
                              { value: '03', label: 'Mart' },
                              { value: '04', label: 'Nisan' },
                              { value: '05', label: 'Mayıs' },
                              { value: '06', label: 'Haziran' },
                              { value: '07', label: 'Temmuz' },
                              { value: '08', label: 'Ağustos' },
                              { value: '09', label: 'Eylül' },
                              { value: '10', label: 'Ekim' },
                              { value: '11', label: 'Kasım' },
                              { value: '12', label: 'Aralık' }
                            ].map((m) => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.travelDate ? new Date(applicationData.travelDate).getFullYear().toString() : ''}
                          onValueChange={(year) => {
                            const currentDate = applicationData.travelDate ? new Date(applicationData.travelDate) : new Date();
                            currentDate.setFullYear(parseInt(year));
                            handleInputChange("travelDate", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Yıl" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Return Date *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={applicationData.returnDate ? new Date(applicationData.returnDate).getDate().toString().padStart(2, '0') : ''}
                          onValueChange={(day) => {
                            const currentDate = applicationData.returnDate ? new Date(applicationData.returnDate) : new Date();
                            currentDate.setDate(parseInt(day));
                            handleInputChange("returnDate", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Gün" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.returnDate ? (new Date(applicationData.returnDate).getMonth() + 1).toString().padStart(2, '0') : ''}
                          onValueChange={(month) => {
                            const currentDate = applicationData.returnDate ? new Date(applicationData.returnDate) : new Date();
                            currentDate.setMonth(parseInt(month) - 1);
                            handleInputChange("returnDate", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Ay" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: '01', label: 'Ocak' },
                              { value: '02', label: 'Şubat' },
                              { value: '03', label: 'Mart' },
                              { value: '04', label: 'Nisan' },
                              { value: '05', label: 'Mayıs' },
                              { value: '06', label: 'Haziran' },
                              { value: '07', label: 'Temmuz' },
                              { value: '08', label: 'Ağustos' },
                              { value: '09', label: 'Eylül' },
                              { value: '10', label: 'Ekim' },
                              { value: '11', label: 'Kasım' },
                              { value: '12', label: 'Aralık' }
                            ].map((m) => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.returnDate ? new Date(applicationData.returnDate).getFullYear().toString() : ''}
                          onValueChange={(year) => {
                            const currentDate = applicationData.returnDate ? new Date(applicationData.returnDate) : new Date();
                            currentDate.setFullYear(parseInt(year));
                            handleInputChange("returnDate", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Yıl" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Date of Birth *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth).getDate().toString().padStart(2, '0') : ''}
                          onValueChange={(day) => {
                            const currentDate = applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth) : new Date();
                            currentDate.setDate(parseInt(day));
                            handleInputChange("dateOfBirth", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Gün" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.dateOfBirth ? (new Date(applicationData.dateOfBirth).getMonth() + 1).toString().padStart(2, '0') : ''}
                          onValueChange={(month) => {
                            const currentDate = applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth) : new Date();
                            currentDate.setMonth(parseInt(month) - 1);
                            handleInputChange("dateOfBirth", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Ay" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: '01', label: 'Ocak' },
                              { value: '02', label: 'Şubat' },
                              { value: '03', label: 'Mart' },
                              { value: '04', label: 'Nisan' },
                              { value: '05', label: 'Mayıs' },
                              { value: '06', label: 'Haziran' },
                              { value: '07', label: 'Temmuz' },
                              { value: '08', label: 'Ağustos' },
                              { value: '09', label: 'Eylül' },
                              { value: '10', label: 'Ekim' },
                              { value: '11', label: 'Kasım' },
                              { value: '12', label: 'Aralık' }
                            ].map((m) => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth).getFullYear().toString() : ''}
                          onValueChange={(year) => {
                            const currentDate = applicationData.dateOfBirth ? new Date(applicationData.dateOfBirth) : new Date();
                            currentDate.setFullYear(parseInt(year));
                            handleInputChange("dateOfBirth", currentDate.toISOString().split('T')[0]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Yıl" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 80 }, (_, i) => (new Date().getFullYear() - i).toString()).map((y) => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Parent ID Photos for Under 18 */}
                  {(() => {
                    if (!applicationData.dateOfBirth) return null;
                    
                    const birthDate = new Date(applicationData.dateOfBirth);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    const actualAge = age - (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? 1 : 0);
                    
                    if (actualAge >= 18) return null;
                    
                    return (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 col-span-1 sm:col-span-2">
                        <h4 className="font-semibold mb-3 sm:mb-4 text-orange-800 flex items-start space-x-2">
                          <span className="text-lg">🔒</span>
                          <span className="text-sm sm:text-base">18 Yaş Altı - Ebeveyn Kimlik Fotoğrafları Gerekli</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                          18 yaş altı başvurular için anne ve babanın kimlik kartı fotoğraflarını yükleyiniz.
                        </p>
                        <div>
                          <Label htmlFor="parentIds" className="text-sm sm:text-base">Anne ve Baba Kimlik Fotoğrafları *</Label>
                          <Input
                            id="parentIds"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              setParentIdPhotos(files);
                            }}
                            className="mt-2 text-sm"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Anne ve babanın kimlik kartlarının ön yüzlerini yükleyiniz (JPG, PNG formatında)
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 col-span-1 sm:col-span-2">
                    <h4 className="font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center space-x-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      <span className="text-sm sm:text-base">Insurance Summary</span>
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700 font-medium text-sm sm:text-base">{selectedProduct.name}</span>
                        <span className="font-semibold text-red-600 text-sm sm:text-base">${selectedProduct.price}</span>
                      </div>
                      <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3 border-gray-300">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-900 text-sm sm:text-base">Total Premium</span>
                          <span className="text-red-600 text-lg sm:text-xl">${selectedProduct.price}</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-3 text-xs text-gray-500 space-y-1">
                        <p>• Medical coverage up to $100,000</p>
                        <p>• 24/7 emergency assistance</p>
                        <p>• Trip cancellation protection</p>
                        <p>• Lost baggage coverage</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-base md:text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Submit Insurance Application"
                    )}
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
