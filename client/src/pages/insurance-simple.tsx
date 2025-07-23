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
import diverseTravelersBg from "@assets/ChatGPT Image 23 Tem 2025 15_14_53_1753272924608.png";

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
    passportNumber: "",
    nationality: countryFromUrl, // Auto-fill if coming from visa flow
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
    staleTime: 10 * 60 * 1000, // 10 minutes cache for faster loading
    refetchOnWindowFocus: false, // Don't refetch on focus
    refetchOnMount: false, // Don't refetch if data exists
  }) as { data: InsuranceProduct[], isLoading: boolean };

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
    staleTime: 10 * 60 * 1000, // 10 minutes cache for faster loading
    refetchOnWindowFocus: false, // Don't refetch on focus
    refetchOnMount: false, // Don't refetch if data exists
  }) as { data: any[], isLoading: boolean };



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
        countryOfOrigin: applicationData.nationality || countryFromUrl,
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
    
    if (!applicationData.passportNumber.trim()) {
      toast({
        title: "Passport Number Required",
        description: "Please enter your passport number",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.nationality.trim()) {
      toast({
        title: "Nationality Required",
        description: "Please select your nationality",
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

  // Show fast skeleton loading state for insurance products
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Skeleton Header */}
        <section className="relative py-8 sm:py-12 lg:py-16 border-b border-gray-200 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse max-w-md"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto animate-pulse max-w-lg"></div>
          </div>
        </section>

        {/* Skeleton Products */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="border rounded-lg p-4 bg-white animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Professional Header with Clear Background */}
      <section className="relative py-8 sm:py-12 lg:py-16 border-b border-gray-200 overflow-hidden">
        <div 
          className="absolute inset-0 bg-no-repeat opacity-95"
          style={{
            backgroundImage: `url('${diverseTravelersBg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-red-600/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl mb-3">
              Insurance for E-Visa Turkey
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/95 drop-shadow-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Comprehensive Travel Protection for Your Turkish Adventure
            </p>
            <p className="text-sm sm:text-base text-white/90 drop-shadow-md mt-2 max-w-xl mx-auto">
              Secure, affordable coverage that meets all Turkish visa requirements
            </p>
          </div>
        </div>
      </section>

      {/* Legal Requirement Notice - Yasal Zorunluluk */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-red-600 mt-1" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800 mb-3">
                🇹🇷 Yasal Zorunluluk - Legal Requirement
              </h3>
              <div className="space-y-3">
                <p className="text-red-700 font-medium leading-relaxed">
                  <strong>6458 sayılı Yabancılar Yasası'na göre</strong> Türkiye'de bulunacağınız süre boyunca 
                  <span className="bg-red-100 px-2 py-1 rounded font-bold text-red-800 mx-1">geçerli sağlık sigortasına sahip olmanız zorunludur.</span>
                </p>
                <p className="text-red-700 leading-relaxed">
                  <strong>According to Law No. 6458 on Foreigners,</strong> you are required to have 
                  valid health insurance for the entire duration of your stay in Turkey.
                </p>
                <div className="bg-red-100 border border-red-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ Önemli Uyarı - Important Warning:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Sağlık sigortası olmadan Türkiye'ye giriş yapmanız engellenebilir</li>
                    <li>• Entry to Turkey may be denied without valid health insurance</li>
                    <li>• Sigorta belgesi pasaport kontrolünde talep edilecektir</li>
                    <li>• Insurance certificate will be requested during passport control</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Benefits - Compelling Benefits */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                ✅ Bu Sigorta ile Korunduğunuz Alanlar - Your Coverage Includes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-green-700 font-medium">🏥 Acil Tıbbi Tedavi - Emergency Medical Treatment</p>
                  <p className="text-green-700 font-medium">🚑 Ambulans Hizmetleri - Ambulance Services</p>
                  <p className="text-green-700 font-medium">💊 İlaç Masrafları - Medication Costs</p>
                  <p className="text-green-700 font-medium">🦷 Acil Diş Tedavisi - Emergency Dental Care</p>
                </div>
                <div className="space-y-2">
                  <p className="text-green-700 font-medium">✈️ Tıbbi Tahliye - Medical Evacuation</p>
                  <p className="text-green-700 font-medium">⚰️ Cenaze Masrafları - Repatriation of Remains</p>
                  <p className="text-green-700 font-medium">🎒 Bagaj Kaybı - Baggage Loss</p>
                  <p className="text-green-700 font-medium">📞 24/7 Destek Hattı - Support Hotline</p>
                </div>
              </div>
              <div className="bg-green-100 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800 font-semibold text-center">
                  💰 Sağlık sigortası olmadan Türkiye'de tedavi maliyetleri çok yüksektir!<br />
                  <span className="text-sm">Medical treatment costs in Turkey are very high without insurance!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-800 font-semibold">
                ⏰ Seyahat tarihinden önce sigorta yaptırmanız zorunludur - Insurance must be purchased before travel
              </p>
            </div>
            <Badge variant="destructive" className="bg-red-600 text-white px-3 py-1">
              ZORUNLU - MANDATORY
            </Badge>
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
                      <Label htmlFor="passportNumber">Passport Number *</Label>
                      <Input
                        id="passportNumber"
                        value={applicationData.passportNumber || ''}
                        onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                        placeholder="A12345678"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="nationality">Nationality *</Label>
                      <Select
                        value={applicationData.nationality}
                        onValueChange={(value) => handleInputChange("nationality", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.name}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{country.flag}</span>
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  
                </div>

                {/* Insurance Plan Selection */}
                <div>
                  {/* Compelling insurance selection notice */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">⚠️ Dikkat: Sigorta Olmadan Seyahat Etmeyin!</h4>
                        <div className="text-sm text-red-700 space-y-1">
                          <p>• <strong>Acil durumda</strong> bir hastane ziyareti <strong>€500-2000</strong> arasında ücret alabilir</p>
                          <p>• <strong>Ambulans hizmetleri</strong> için <strong>€200-400</strong> ödeyebilirsiniz</p>
                          <p>• <strong>Tıbbi tahliye</strong> durumunda <strong>€10,000+</strong> maliyet olabilir</p>
                          <p className="font-semibold bg-red-100 p-2 rounded">💡 Sadece $114'dan başlayan sigorta ile tüm bu risklerden korunabilirsiniz!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
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
                    {/* Final purchase motivation */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-amber-600 mr-2" />
                        <div>
                          <h4 className="font-semibold text-amber-800">🚨 Son Adım: Sigorta Poliçenizi Tamamlayın</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            <strong>Türkiye seyahatinize sadece dakikalar kaldı!</strong> 
                            Sigorta olmadan sınır kapısında geri çevrilebilirsiniz. 
                            <span className="bg-amber-200 px-2 py-1 rounded font-semibold ml-1">Şimdi satın alın ve güvende olun!</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
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
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-base md:text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
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
