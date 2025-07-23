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
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
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
              description: `Redirecting to payment... Order: ${applicationData2.applicationNumber}`,
              duration: 5000,
            });
            
            // For all devices: Direct location.href redirect
            console.log('[Insurance Payment Debug] Using location.href redirect');
            setTimeout(() => {
              window.location.href = paymentData.paymentUrl;
            }, 500); // Small delay to show toast
            
          } catch (error) {
            console.error('[Insurance Payment Debug] Redirect error:', error);
            
            // Ultimate fallback: show manual link
            toast({
              title: "Payment Link Ready",
              description: "Click the button to continue to insurance payment",
              action: (
                <button 
                  onClick={() => {
                    try {
                      window.open(paymentData.paymentUrl, '_blank');
                    } catch (e) {
                      console.error('[Insurance Payment Debug] Manual link error:', e);
                      // Copy to clipboard as last resort
                      navigator.clipboard?.writeText(paymentData.paymentUrl);
                    }
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Continue to Payment
                </button>
              ),
              duration: 15000,
            });
          }
        };
        
        // Start redirect process immediately
        redirectToPayment();
      } else {
        throw new Error(paymentData.error || "Payment initialization failed");
      }
      
      return applicationData2;
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted",
        description: `Your insurance application number is ${data.applicationNumber}. Redirecting to payment page...`,
        duration: 5000,
      });
      
      // Show manual continue option after a short delay for mobile users
      setTimeout(() => {
        if (paymentRedirectUrl) {
          toast({
            title: "Continue to Payment",
            description: "If the page doesn't redirect automatically, click here to continue.",
            action: (
              <Button 
                onClick={() => window.open(paymentRedirectUrl, '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              >
                Continue
              </Button>
            ),
            duration: 10000,
          });
        }
      }, 2500);
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

  // Show loading state for insurance products
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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Critical Alert Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12 border-b-4 border-red-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl">
              <div className="w-20 h-20 shadow-lg rounded-full overflow-hidden">
                <img src={newTurkeyLogo} alt="Turkey Flag" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="bg-yellow-400 text-red-900 font-bold py-3 px-6 rounded-lg inline-block mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">ZORUNLU SEYAHAT SİGORTASI</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              TÜRKİYE SEYAHAT SİGORTASI<br />
              <span className="text-yellow-300">ZORUNLU ŞART</span>
            </h1>
            
            <div className="bg-red-900/50 border border-red-400 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl font-semibold mb-4 text-yellow-100">
                ⚠️ TÜM YABANCI TURISTLER İÇİN ZORUNLU
              </p>
              <p className="text-lg text-red-100 leading-relaxed">
                Türkiye Cumhuriyeti sınırlarına giriş yapacak tüm yabanci turistlerin <strong className="text-yellow-200">geçerli seyahat sağlık sigortası</strong> bulundurması yasal zorunluluktur. Sigorta olmadan ülkeye giriş yapılamaz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">SİGORTA ZORUNLULUĞU NEDENLERİ</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">YASAL ZORUNLULUK</h3>
                <p className="text-gray-600">Türkiye Sağlık Bakanlığı ve Dışişleri Bakanlığı tarafından belirlenen resmi gereklilik</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-orange-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">SINIR KONTROLÜ</h3>
                <p className="text-gray-600">Havalimanı, limanlar ve kara sınırlarında sigorta belgesi kontrol edilir</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">SAĞLIK GÜVENCESİ</h3>
                <p className="text-gray-600">Acil durumlar için 24/7 sağlık hizmetleri ve hastane masrafları kapsamı</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">!</span>
            </div>
            <h3 className="text-xl font-bold text-red-900">HEMEN SİGORTA SATIN ALIN</h3>
          </div>
          <p className="text-red-800 leading-relaxed">
            Türkiye'ye seyahatiniz öncesinde mutlaka geçerli bir seyahat sağlık sigortası satın almanız gerekmektedir. 
            Aşağıdaki resmi sigorta planlarından birisini seçerek hemen başvurunuzu tamamlayın.
          </p>
        </div>

        {/* Insurance Products List - Mandatory Design */}
        <section className="py-12">
          <div className="text-center mb-12">
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="w-8 h-8 text-yellow-700" />
                <h2 className="text-2xl md:text-3xl font-bold text-yellow-900">RESMİ SİGORTA PLANLARI</h2>
              </div>
              <p className="text-lg text-yellow-800 font-semibold">
                Türkiye Cumhuriyeti tarafından onaylanmış zorunlu seyahat sigortası seçenekleri
              </p>
            </div>
          </div>
          
          {/* Mandatory Insurance Selection Table */}
          <div className="bg-white rounded-xl shadow-2xl border-2 border-red-300 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-yellow-300" />
                <div>
                  <h3 className="text-xl font-bold">ZORUNLU SİGORTA SEÇİMİ</h3>
                  <p className="text-red-100 text-sm">Seyahat sürenize uygun planı seçiniz</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {sortedProducts.map((product: InsuranceProduct, index) => (
                <div 
                  key={product.id} 
                  className={`px-6 py-6 cursor-pointer transition-all border-l-4 ${
                    selectedProduct?.id === product.id 
                      ? "bg-red-50 border-l-red-600 shadow-inner" 
                      : "border-l-transparent hover:bg-gray-50 hover:border-l-red-300"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="insurance-product"
                          checked={selectedProduct?.id === product.id}
                          onChange={() => setSelectedProduct(product)}
                          className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                        <div className="flex items-center space-x-4">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                            ✓ RESMİ ONAY
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            24/7 DESTEK
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-red-600">${product.price}</div>
                      <div className="text-sm text-gray-500 font-semibold">Toplam Prim</div>
                      <div className="text-xs text-green-600 font-semibold mt-1">✓ Hemen Satın Al</div>
                    </div>
                  </div>
                  
                  {selectedProduct?.id === product.id && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Bu plan seçildi</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Bu sigorta planı Türkiye sınır kontrol gereksinimleri için onaylanmıştır. 
                        Aşağıdaki formu doldurup hemen satın alabilirsiniz.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {!selectedProduct && (
              <div className="bg-red-50 border-t-2 border-red-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800 font-semibold">
                    Lütfen yukarıdaki planlardan birini seçin. Sigorta seçimi zorunludur.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Critical Application Form */}
          {selectedProduct && (
            <div className="bg-white rounded-xl shadow-2xl border-2 border-yellow-400 mt-8">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 sm:px-6 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-900 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-yellow-100" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">HEMEN BAŞVURU FORMU</h3>
                    <p className="text-yellow-800 font-semibold">Seçili Plan: {selectedProduct.name} - ${selectedProduct.price}</p>
                    <p className="text-sm text-yellow-800">Formunuzu doldurun ve ödeme sayfasına geçin</p>
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
                          value={applicationData.travelDate ? applicationData.travelDate.split('-')[2] : ''}
                          onValueChange={(day) => {
                            const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const month = parts[1];
                            handleInputChange("travelDate", `${year}-${month}-${day.padStart(2, '0')}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.travelDate ? applicationData.travelDate.split('-')[1] : ''}
                          onValueChange={(month) => {
                            const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const day = parts[2];
                            handleInputChange("travelDate", `${year}-${month.padStart(2, '0')}-${day}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: '01', label: 'January' },
                              { value: '02', label: 'February' },
                              { value: '03', label: 'March' },
                              { value: '04', label: 'April' },
                              { value: '05', label: 'May' },
                              { value: '06', label: 'June' },
                              { value: '07', label: 'July' },
                              { value: '08', label: 'August' },
                              { value: '09', label: 'September' },
                              { value: '10', label: 'October' },
                              { value: '11', label: 'November' },
                              { value: '12', label: 'December' }
                            ].map((m) => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.travelDate ? applicationData.travelDate.split('-')[0] : ''}
                          onValueChange={(year) => {
                            const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const month = parts[1]; const day = parts[2];
                            handleInputChange("travelDate", `${year}-${month}-${day}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
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
                          value={applicationData.returnDate ? applicationData.returnDate.split('-')[2] : ''}
                          onValueChange={(day) => {
                            const parts = applicationData.returnDate ? applicationData.returnDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const month = parts[1];
                            handleInputChange("returnDate", `${year}-${month}-${day.padStart(2, '0')}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.returnDate ? applicationData.returnDate.split('-')[1] : ''}
                          onValueChange={(month) => {
                            const parts = applicationData.returnDate ? applicationData.returnDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const day = parts[2];
                            handleInputChange("returnDate", `${year}-${month.padStart(2, '0')}-${day}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: '01', label: 'January' },
                              { value: '02', label: 'February' },
                              { value: '03', label: 'March' },
                              { value: '04', label: 'April' },
                              { value: '05', label: 'May' },
                              { value: '06', label: 'June' },
                              { value: '07', label: 'July' },
                              { value: '08', label: 'August' },
                              { value: '09', label: 'September' },
                              { value: '10', label: 'October' },
                              { value: '11', label: 'November' },
                              { value: '12', label: 'December' }
                            ].map((m) => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.returnDate ? applicationData.returnDate.split('-')[0] : ''}
                          onValueChange={(year) => {
                            const parts = applicationData.returnDate ? applicationData.returnDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const month = parts[1]; const day = parts[2];
                            handleInputChange("returnDate", `${year}-${month}-${day}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
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
                          value={applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-')[2] : ''}
                          onValueChange={(day) => {
                            const parts = applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const month = parts[1];
                            handleInputChange("dateOfBirth", `${year}-${month}-${day.padStart(2, '0')}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-')[1] : ''}
                          onValueChange={(month) => {
                            const parts = applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const day = parts[2];
                            handleInputChange("dateOfBirth", `${year}-${month.padStart(2, '0')}-${day}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: '01', label: 'January' },
                              { value: '02', label: 'February' },
                              { value: '03', label: 'March' },
                              { value: '04', label: 'April' },
                              { value: '05', label: 'May' },
                              { value: '06', label: 'June' },
                              { value: '07', label: 'July' },
                              { value: '08', label: 'August' },
                              { value: '09', label: 'September' },
                              { value: '10', label: 'October' },
                              { value: '11', label: 'November' },
                              { value: '12', label: 'December' }
                            ].map((m) => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-')[0] : ''}
                          onValueChange={(year) => {
                            const parts = applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const month = parts[1]; const day = parts[2];
                            handleInputChange("dateOfBirth", `${year}-${month}-${day}`);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
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
        </section>
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
