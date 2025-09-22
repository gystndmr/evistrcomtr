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
import { useLanguage } from "@/contexts/LanguageContext";

// Country flag mapping function
const getCountryFlag = (countryCode: string): string => {
  const flags: { [key: string]: string } = {
    // Original countries
    'AFG': '🇦🇫', 'DZA': '🇩🇿', 'ATG': '🇦🇬', 'ARM': '🇦🇲', 'AUS': '🇦🇺', 
    'BHS': '🇧🇸', 'BGD': '🇧🇩', 'BRB': '🇧🇧', 'BMU': '🇧🇲', 'BTN': '🇧🇹',
    'KHM': '🇰🇭', 'CPV': '🇨🇻', 'CHN': '🇨🇳', 'HRV': '🇭🇷', 'DMA': '🇩🇲',
    'DOM': '🇩🇴', 'TLS': '🇹🇱', 'EGY': '🇪🇬', 'GNQ': '🇬🇶', 'EST': '🇪🇪',
    'FJI': '🇫🇯', 'GRD': '🇬🇩', 'HTI': '🇭🇹', 'HKG': '🇭🇰', 'IND': '🇮🇳',
    'IRQ': '🇮🇶', 'JAM': '🇯🇲', 'LVA': '🇱🇻', 'LBY': '🇱🇾', 'LTU': '🇱🇹',
    'MDV': '🇲🇻', 'MUS': '🇲🇺', 'MEX': '🇲🇽', 'NAM': '🇳🇦', 'NPL': '🇳🇵',
    'PAK': '🇵🇰', 'PSE': '🇵🇸', 'PHL': '🇵🇭', 'LCA': '🇱🇨', 'VCT': '🇻🇨',
    'SEN': '🇸🇳', 'SLB': '🇸🇧', 'ZAF': '🇿🇦', 'LKA': '🇱🇰', 'SUR': '🇸🇷',
    'TWN': '🇹🇼', 'VUT': '🇻🇺', 'VNM': '🇻🇳', 'YEM': '🇾🇪', 'RUS': '🇷🇺',
    
    // Major countries
    'USA': '🇺🇸', 'GBR': '🇬🇧', 'DEU': '🇩🇪', 'FRA': '🇫🇷', 'JPN': '🇯🇵',
    'CAN': '🇨🇦', 'ITA': '🇮🇹', 'ESP': '🇪🇸', 'NLD': '🇳🇱', 'BRA': '🇧🇷',
    'NGA': '🇳🇬', 'IRN': '🇮🇷', 'SYR': '🇸🇾', 
    
    // New countries added
    'TUR': '🇹🇷', 'ARG': '🇦🇷', 'CHE': '🇨🇭', 'AUT': '🇦🇹', 'BEL': '🇧🇪',
    'DNK': '🇩🇰', 'FIN': '🇫🇮', 'NOR': '🇳🇴', 'SWE': '🇸🇪', 'PRT': '🇵🇹',
    'GRC': '🇬🇷', 'POL': '🇵🇱', 'CZE': '🇨🇿', 'HUN': '🇭🇺', 'SVK': '🇸🇰',
    'SVN': '🇸🇮', 'ROU': '🇷🇴', 'BGR': '🇧🇬', 'LUX': '🇱🇺', 'IRL': '🇮🇪',
    'ISL': '🇮🇸', 'MLT': '🇲🇹', 'CYP': '🇨🇾', 'KOR': '🇰🇷', 'PRK': '🇰🇵',
    'MNG': '🇲🇳', 'KAZ': '🇰🇿', 'KGZ': '🇰🇬', 'TJK': '🇹🇯', 'TKM': '🇹🇲',
    'UZB': '🇺🇿', 'AZE': '🇦🇿', 'GEO': '🇬🇪', 'THA': '🇹🇭', 'MYS': '🇲🇾',
    'SGP': '🇸🇬', 'IDN': '🇮🇩', 'LAO': '🇱🇦', 'MMR': '🇲🇲', 'BRN': '🇧🇳',
    'SAU': '🇸🇦', 'ARE': '🇦🇪', 'QAT': '🇶🇦', 'BHR': '🇧🇭', 'KWT': '🇰🇼',
    'OMN': '🇴🇲', 'JOR': '🇯🇴', 'LBN': '🇱🇧', 'ISR': '🇮🇱', 'MAR': '🇲🇦',
    'TUN': '🇹🇳', 'ETH': '🇪🇹', 'KEN': '🇰🇪', 'UGA': '🇺🇬', 'TZA': '🇹🇿',
    'ZWE': '🇿🇼', 'ZMB': '🇿🇲', 'BWA': '🇧🇼', 'GHA': '🇬🇭', 'CIV': '🇨🇮',
    'CMR': '🇨🇲', 'AGO': '🇦🇴', 'MOZ': '🇲🇿', 'MDG': '🇲🇬', 'GTM': '🇬🇹',
    'BLZ': '🇧🇿', 'HND': '🇭🇳', 'SLV': '🇸🇻', 'NIC': '🇳🇮', 'CRI': '🇨🇷',
    'PAN': '🇵🇦', 'COL': '🇨🇴', 'VEN': '🇻🇪', 'GUY': '🇬🇾', 'ECU': '🇪🇨',
    'PER': '🇵🇪', 'BOL': '🇧🇴', 'PRY': '🇵🇾', 'URY': '🇺🇾', 'CHL': '🇨🇱',
    'NZL': '🇳🇿', 'PNG': '🇵🇬', 'WSM': '🇼🇸', 'TON': '🇹🇴', 'KIR': '🇰🇮',
    'TUV': '🇹🇻', 'NRU': '🇳🇷', 'PLW': '🇵🇼', 'MHL': '🇲🇭', 'FSM': '🇫🇲',
    
    // Balkan and other new countries  
    'ALB': '🇦🇱', 'MKD': '🇲🇰', 'SRB': '🇷🇸', 'BIH': '🇧🇦', 'MNE': '🇲🇪',
    'XKX': '🇽🇰', 'CUB': '🇨🇺', 'TTO': '🇹🇹', 'GGY': '🇬🇬', 'JEY': '🇯🇪',
    'IMN': '🇮🇲', 'DJI': '🇩🇯', 'ERI': '🇪🇷', 'GMB': '🇬🇲', 'GIN': '🇬🇳',
    'GNB': '🇬🇼', 'LSO': '🇱🇸', 'LBR': '🇱🇷', 'MLI': '🇲🇱', 'MRT': '🇲🇷',
    'NER': '🇳🇪', 'RWA': '🇷🇼', 'STP': '🇸🇹', 'SLE': '🇸🇱', 'SOM': '🇸🇴',
    'SSD': '🇸🇸', 'SDN': '🇸🇩', 'SWZ': '🇸🇿', 'TGO': '🇹🇬', 'TCD': '🇹🇩',
    'CAR': '🇨🇫', 'COD': '🇨🇩', 'COG': '🇨🇬', 'GAB': '🇬🇦', 'BFA': '🇧🇫',
    'BDI': '🇧🇮', 'COM': '🇰🇲', 'SYC': '🇸🇨', 'MWI': '🇲🇼'
  };
  
  return flags[countryCode] || '🌍';
};

export default function Insurance() {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [dateErrors, setDateErrors] = useState({
    travelDate: "",
    returnDate: ""
  });
  
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
  const [motherIdPhotos, setMotherIdPhotos] = useState<File[]>([]);
  const [fatherIdPhotos, setFatherIdPhotos] = useState<File[]>([]);
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string>("");
  const { toast } = useToast();

  // Date validation function
  const validateDates = (travelDate: string, returnDate: string) => {
    const newErrors = { travelDate: "", returnDate: "" };
    
    if (travelDate) {
      const travel = new Date(travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (travel.getTime() < today.getTime()) {
        newErrors.travelDate = "Travel date cannot be in the past";
      }
    }
    
    if (travelDate && returnDate) {
      const travel = new Date(travelDate);
      const returnD = new Date(returnDate);
      
      if (returnD.getTime() <= travel.getTime()) {
        newErrors.returnDate = "Return date must be after travel date";
      }
    }
    
    setDateErrors(newErrors);
  };

  // Handle input changes
  const handleInputChange = (key: string, value: string) => {
    const newData = { ...applicationData, [key]: value };
    setApplicationData(newData);
    
    // Validate dates whenever travel or return date changes
    if (key === 'travelDate' || key === 'returnDate') {
      validateDates(
        key === 'travelDate' ? value : newData.travelDate,
        key === 'returnDate' ? value : newData.returnDate
      );
    }
  };

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
      const allParentPhotos = [...motherIdPhotos, ...fatherIdPhotos];
      const parentIdPhotosData = allParentPhotos.length > 0 ? 
        await Promise.all(allParentPhotos.map(async (file, index) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          const isMotherPhoto = index < motherIdPhotos.length;
          return { 
            name: file.name, 
            data: base64,
            type: isMotherPhoto ? 'mother' : 'father'
          };
        })) : null;

      // First create the insurance application
      const applicationResponse = await apiRequest("POST", "/api/insurance/applications", {
        ...applicationData,
        productId: selectedProduct.id,
        totalAmount: selectedProduct.price.toString(), // Ensure it's a string as expected by schema
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
              title: "Payment Link Created",
              description: `Redirecting to payment... Order: ${applicationData2.applicationNumber}`,
              duration: 3000,
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
              title: t('insurance.payment.ready'),
              description: t('insurance.payment.manual'),
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
                  {t('insurance.payment.continue')}
                </button>
              ),
              duration: 15000,
            });
          }
        };
        
        // Start redirect process immediately
        redirectToPayment();
      } else {
        throw new Error(paymentData.error || t('insurance.payment.failed'));
      }
      
      return applicationData2;
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted",
        description: `Application number: ${data.applicationNumber}. Redirecting to payment...`,
        duration: 5000,
      });
      
      // Show manual continue option after a short delay for mobile users
      setTimeout(() => {
        if (paymentRedirectUrl) {
          toast({
            title: "Continue to Payment",
            description: "Click here if redirect doesn't work.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!selectedProduct) {
      toast({
        title: "Product Required",
        description: "Please select an insurance product",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Enter your first name",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.lastName.trim()) {
      toast({
        title: "Last Name Required", 
        description: "Enter your last name",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      toast({
        title: "Invalid Email",
        description: "Enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Enter your phone number",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.passportNumber.trim()) {
      toast({
        title: "Passport Required",
        description: "Enter your passport number",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.nationality.trim()) {
      toast({
        title: "Nationality Required",
        description: "Select your nationality",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.travelDate) {
      toast({
        title: "Travel Date Required",
        description: "Enter your travel date",
        variant: "destructive",
      });
      return;
    }
    
    if (!applicationData.returnDate) {
      toast({
        title: "Return Date Required",
        description: "Enter your return date",
        variant: "destructive",
      });
      return;
    }
    
    // Date validation - return date must be after travel date
    const travelDate = new Date(applicationData.travelDate);
    const returnDate = new Date(applicationData.returnDate);
    
    if (returnDate <= travelDate) {
      toast({
        title: "Invalid Dates",
        description: "Return date must be after travel date",
        variant: "destructive",
      });
      return;
    }

    if (!applicationData.dateOfBirth.trim()) {
      toast({
        title: "Birth Date Required",
        description: "Enter your date of birth",
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

    if (actualAge < 18 && motherIdPhotos.length === 0 && fatherIdPhotos.length === 0) {
      toast({
        title: "Parent ID Photos Required",
        description: "At least one parent's ID photos are required for applicants under 18",
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
      
      {/* Simple Header */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('insurance.header.new')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              {t('insurance.header.covid19')}
            </p>
          </div>
        </div>
      </section>

      {/* Legal Requirement Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-red-600 mt-1" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800 mb-3">
                🇹🇷 Legal Requirement
              </h3>
              <p className="text-red-700 font-medium leading-relaxed">
                <strong>According to Law No. 6458 on Foreigners,</strong> you are required to have 
                valid health insurance for the entire duration of your stay in Turkey.
              </p>
            </div>
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
                          {countries.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((country: any) => (
                            <SelectItem key={country.code || country.id} value={country.name}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getCountryFlag(country.code)}</span>
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Travel Date * (Cannot be in the past)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={applicationData.travelDate ? applicationData.travelDate.split('-')[2] : ''}
                          onValueChange={(day) => {
                            const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const month = parts[1];
                            const newDate = `${year}-${month}-${day.padStart(2, '0')}`;
                            setApplicationData(prev => ({ ...prev, travelDate: newDate }));
                            
                            // Validate dates
                            const hasRealParts = year && year !== 'undefined' && month && month !== 'undefined' && day && day !== 'undefined';
                            if (hasRealParts) {
                              validateDates(newDate, applicationData.returnDate);
                            }
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
                            const newDate = `${year}-${month.padStart(2, '0')}-${day}`;
                            setApplicationData(prev => ({ ...prev, travelDate: newDate }));
                            
                            // Validate dates
                            const hasRealParts = year && year !== 'undefined' && month && month !== 'undefined' && day && day !== 'undefined';
                            if (hasRealParts) {
                              validateDates(newDate, applicationData.returnDate);
                            }
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
                            const newDate = `${year}-${month}-${day}`;
                            setApplicationData(prev => ({ ...prev, travelDate: newDate }));
                            
                            // Validate dates
                            const hasRealParts = year && year !== 'undefined' && month && month !== 'undefined' && day && day !== 'undefined';
                            if (hasRealParts) {
                              validateDates(newDate, applicationData.returnDate);
                            }
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
                      {dateErrors.travelDate && (
                        <p className="text-red-500 text-sm mt-1">{dateErrors.travelDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Return Date *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={applicationData.returnDate ? applicationData.returnDate.split('-')[2] : ''}
                          onValueChange={(day) => {
                            const parts = applicationData.returnDate ? applicationData.returnDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0]; const month = parts[1];
                            const newDate = `${year}-${month}-${day.padStart(2, '0')}`;
                            setApplicationData(prev => ({ ...prev, returnDate: newDate }));
                            
                            // Validate dates
                            const hasRealParts = year && year !== 'undefined' && month && month !== 'undefined' && day && day !== 'undefined';
                            if (hasRealParts) {
                              validateDates(applicationData.travelDate, newDate);
                            }
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
                            const newDate = `${year}-${month.padStart(2, '0')}-${day}`;
                            setApplicationData(prev => ({ ...prev, returnDate: newDate }));
                            
                            // Validate dates
                            const hasRealParts = year && year !== 'undefined' && month && month !== 'undefined' && day && day !== 'undefined';
                            if (hasRealParts) {
                              validateDates(applicationData.travelDate, newDate);
                            }
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
                            const newDate = `${year}-${month}-${day}`;
                            setApplicationData(prev => ({ ...prev, returnDate: newDate }));
                            
                            // Validate dates
                            const hasRealParts = year && year !== 'undefined' && month && month !== 'undefined' && day && day !== 'undefined';
                            if (hasRealParts) {
                              validateDates(applicationData.travelDate, newDate);
                            }
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
                      {dateErrors.returnDate && (
                        <p className="text-red-500 text-sm mt-1">{dateErrors.returnDate}</p>
                      )}
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
                          <span className="text-sm sm:text-base">Under 18 - Parent ID Photos Required</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                          Upload parent ID card photos for applicants under 18 years old.
                        </p>
                        <div>
                          <Label htmlFor="parentIds" className="text-sm sm:text-base">Parent ID Photos *</Label>
                          <div className="space-y-4">
                            {/* Mother's ID */}
                            <div className="border border-pink-200 bg-pink-50 rounded p-3">
                              <Label className="text-pink-800 font-semibold text-sm">👩 Mother's ID Photos</Label>
                              <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 2) {
                                    toast({
                                      title: "Too Many Files",
                                      description: "Maximum 2 photos for mother's ID (front and back)",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  setMotherIdPhotos(files);
                                }}
                                className="mt-2 text-sm"
                              />
                              {motherIdPhotos.length > 0 && (
                                <p className="text-xs text-green-600 mt-1">✓ {motherIdPhotos.length} file(s) selected</p>
                              )}
                            </div>

                            {/* Father's ID */}
                            <div className="border border-blue-200 bg-blue-50 rounded p-3">
                              <Label className="text-blue-800 font-semibold text-sm">👨 Father's ID Photos</Label>
                              <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 2) {
                                    toast({
                                      title: "Too Many Files", 
                                      description: "Maximum 2 photos for father's ID (front and back)",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  setFatherIdPhotos(files);
                                }}
                                className="mt-2 text-sm"
                              />
                              {fatherIdPhotos.length > 0 && (
                                <p className="text-xs text-green-600 mt-1">✓ {fatherIdPhotos.length} file(s) selected</p>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Upload front and back sides of parent ID cards (JPG, PNG format)
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                  
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
