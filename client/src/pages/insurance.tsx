import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle, Calendar, MapPin, Star, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
    nationality: "",
    passportNumber: "",
    travelDate: "", // Empty to force user selection
    returnDate: "", // Empty to force user selection
    destination: "Turkey",
    dateOfBirth: "1990-01-01", // Default valid birth date
  });
  const [parentIdPhotos, setParentIdPhotos] = useState<File[]>([]);
  const [motherIdPhotos, setMotherIdPhotos] = useState<File[]>([]);
  const [fatherIdPhotos, setFatherIdPhotos] = useState<File[]>([]);
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string>("");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/insurance-products"],
    staleTime: 30 * 60 * 1000, // 30 minutes cache for better performance
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
    refetchOnWindowFocus: false, // Prevent unnecessary refetch
  }) as { data: InsuranceProduct[], isLoading: boolean };

  // Load countries for nationality dropdown
  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
    staleTime: 30 * 60 * 1000, // 30 minutes cache for better performance
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
    refetchOnWindowFocus: false, // Prevent unnecessary refetch
    refetchOnMount: false, // Use cache when available
  }) as { data: any[], isLoading: boolean };

  // Memoize sorted countries for performance
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

  // Memoize sorted products for performance
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
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
  }, [products]);

  const createApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) throw new Error("No product selected");
      
      // Calculate trip duration in days
      const travelDate = new Date(applicationData.travelDate);
      const returnDate = new Date(applicationData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - travelDate.getTime());
      const tripDurationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Prepare parent ID photos data for under 18 (combine mother and father photos)
      const allParentPhotos = [...motherIdPhotos, ...fatherIdPhotos, ...parentIdPhotos];
      const parentIdPhotosData = allParentPhotos.length > 0 ? 
        await Promise.all(allParentPhotos.map(async (file) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          return { 
            name: file.name, 
            data: base64,
            type: motherIdPhotos.includes(file) ? 'mother' : fatherIdPhotos.includes(file) ? 'father' : 'parent'
          };
        })) : null;

      // First create the insurance application with mapped field names
      console.log('Making insurance application request...');
      console.log('🔍 Frontend URL being used:', "/api/insurance-applications");
      const applicationPayload = {
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        travelDate: applicationData.travelDate,
        returnDate: applicationData.returnDate,
        destination: applicationData.destination,
        productId: selectedProduct.id,
        totalAmount: selectedProduct.price,
        tripDurationDays: tripDurationDays,
        dateOfBirth: applicationData.dateOfBirth,
        nationality: applicationData.nationality,
        passportNumber: applicationData.passportNumber,
        parentIdPhotos: parentIdPhotosData,
        countryOfOrigin: applicationData.nationality || countryFromUrl,
      };
      console.log('Application payload:', applicationPayload);
      
      const applicationResponse = await fetch("/api/insurance-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(applicationPayload),
      });
      
      console.log('Application response status:', applicationResponse.status);
      console.log('Application response headers:', Object.fromEntries(applicationResponse.headers));
      
      if (!applicationResponse.ok) {
        const errorText = await applicationResponse.text();
        console.error('Application response error:', errorText);
        console.error('Application response URL:', applicationResponse.url);
        console.error('Application response type:', applicationResponse.type);
        throw new Error(`Application failed: ${applicationResponse.status} - ${errorText}`);
      }
      
      // Check if response is actually JSON
      const contentType = applicationResponse.headers.get('content-type');
      console.log('Application response content-type:', contentType);
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await applicationResponse.text();
        console.error('Expected JSON but got:', responseText);
        throw new Error(`Server returned non-JSON response: ${contentType}`);
      }
      
      const applicationData2 = await applicationResponse.json();
      
      // Then create payment
      console.log('Making payment request...');
      const paymentPayload = {
        amount: selectedProduct.price,
        currency: "USD",
        description: `Turkey Travel Insurance - ${selectedProduct.name}`,
        customerEmail: applicationData.email,
        customerName: `${applicationData.firstName} ${applicationData.lastName}`
      };
      console.log('Payment payload:', paymentPayload);
      
      const paymentResponse = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });
      
      console.log('Payment response status:', paymentResponse.status);
      console.log('Payment response headers:', Object.fromEntries(paymentResponse.headers));
      
      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('Payment response error:', errorText);
        throw new Error(`Payment failed: ${paymentResponse.status} - ${errorText}`);
      }
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.success && paymentData.paymentUrl) {
        setCurrentOrderId(applicationData2.applicationNumber);
        setPaymentRedirectUrl(paymentData.paymentUrl);
        
        // Enhanced redirect approach for mobile compatibility
        const redirectToPayment = () => {
          try {
            console.log('[Insurance Payment Debug] Starting redirect process');
            console.log('[Insurance Payment Debug] Payment URL:', paymentData.paymentUrl);
            
            // Always show success toast first
            toast({
              title: "Application Submitted Successfully!",
              description: `Application ${applicationData2.applicationNumber} created. Redirecting to payment...`,
              duration: 5000,
            });
            
            // Enhanced redirect with multiple fallbacks for mobile
            setTimeout(() => {
              try {
                // For mobile devices - try window.open first, then fallback
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobile) {
                  console.log('[Insurance Payment Debug] Mobile device detected');
                  // Try window.open first for mobile
                  const newWindow = window.open(paymentData.paymentUrl, '_blank');
                  if (!newWindow) {
                    console.log('[Insurance Payment Debug] Pop-up blocked, using location.href');
                    window.location.href = paymentData.paymentUrl;
                  }
                } else {
                  console.log('[Insurance Payment Debug] Desktop device, using location.href');
                  window.location.href = paymentData.paymentUrl;
                }
              } catch (redirectError) {
                console.error('[Insurance Payment Debug] Redirect failed:', redirectError);
                // Ultimate fallback - just set the location
                window.location.replace(paymentData.paymentUrl);
              }
            }, 300); // Reduced timeout for better mobile experience
            
          } catch (error) {
            console.error('[Insurance Payment Debug] Payment redirect error:', error);
            setShowRetry(true);
          }
        };
        
        redirectToPayment();
        return applicationData2;
      } else {
        throw new Error("Failed to create payment link");
      }
    },
    onError: (error) => {
      console.error("Insurance application error:", error);
      toast({
        title: "Application Failed",
        description: error instanceof Error ? error.message : "Please try again",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION DEBUG V3 ===');
    console.log('Current applicationData:', applicationData);
    console.log('selectedProduct:', selectedProduct);
    console.log('Form validation starting...');
    
    // Form validation
    if (!selectedProduct) {
      toast({
        title: "Insurance Plan Required",
        description: "Please select an insurance plan",
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

    if (!applicationData.phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
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

    if (!applicationData.passportNumber.trim()) {
      toast({
        title: "Passport Number Required",
        description: "Please enter your passport number",
        variant: "destructive",
      });
      return;
    }
    
    // Validate date completeness - check for valid YYYY-MM-DD format
    const isValidDate = (dateStr: string) => {
      if (!dateStr) return false;
      const parts = dateStr.split('-');
      if (parts.length !== 3) return false;
      const [year, month, day] = parts;
      return year && year.length === 4 && month && month.length === 2 && day && day.length === 2;
    };

    if (!isValidDate(applicationData.travelDate)) {
      console.log('VALIDATION FAILED: Travel date invalid:', applicationData.travelDate);
      toast({
        title: "Travel Date Required",
        description: "Please select all travel date fields (day, month, year)",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidDate(applicationData.returnDate)) {
      console.log('VALIDATION FAILED: Return date invalid:', applicationData.returnDate);
      toast({
        title: "Return Date Required", 
        description: "Please select all return date fields (day, month, year)",
        variant: "destructive",
      });
      return;
    }
    
    // Date validation - return date must be after travel date
    const travelDate = new Date(applicationData.travelDate);
    const returnDate = new Date(applicationData.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison
    
    console.log('=== DATE VALIDATION DEBUG ===');
    console.log('Travel Date String:', applicationData.travelDate);
    console.log('Travel Date Object:', travelDate);
    console.log('Today:', today);
    console.log('travelDate < today:', travelDate < today);
    console.log('travelDate.getTime():', travelDate.getTime());
    console.log('today.getTime():', today.getTime());
    
    if (isNaN(travelDate.getTime()) || isNaN(returnDate.getTime())) {
      console.log('VALIDATION FAILED: Invalid date parsing');
      toast({
        title: "Invalid Date Format",
        description: "Please check your date selections",
        variant: "destructive",
      });
      return;
    }

    // CRITICAL: Check if travel date is in the past - MUST BE STRICTLY ENFORCED
    if (travelDate.getTime() < today.getTime()) {
      console.log('🚨 VALIDATION FAILED: Travel date is in the past');
      console.log('Travel date:', travelDate.toDateString(), '(' + travelDate.getTime() + ')');
      console.log('Today:', today.toDateString(), '(' + today.getTime() + ')');
      console.log('Difference in ms:', travelDate.getTime() - today.getTime());
      toast({
        title: "❌ Past Date Not Allowed",
        description: "Travel date cannot be in the past! Please select today or a future date.",
        variant: "destructive",
      });
      return;
    }
    
    if (returnDate <= travelDate) {
      console.log('VALIDATION FAILED: Date range invalid');
      console.log('Travel date:', applicationData.travelDate, 'Parsed:', travelDate);
      console.log('Return date:', applicationData.returnDate, 'Parsed:', returnDate);
      toast({
        title: "Invalid Return Date",
        description: "Return date must be after travel date",
        variant: "destructive",
      });
      return;
    }

    if (!isValidDate(applicationData.dateOfBirth)) {
      console.log('VALIDATION FAILED: Date of birth invalid:', applicationData.dateOfBirth);
      toast({
        title: "Date of Birth Required",
        description: "Please select all birth date fields (day, month, year)",
        variant: "destructive",
      });
      return;
    }

    // Check if user is under 18 and parent ID photos are required
    const birthDate = new Date(applicationData.dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      actualAge--;
    }
    
    if (actualAge < 18 && motherIdPhotos.length === 0 && fatherIdPhotos.length === 0 && parentIdPhotos.length === 0) {
      toast({
        title: "Parent ID Photos Required",
        description: "Applicants under 18 must upload at least one parent's ID photos",
        variant: "destructive",
      });
      return;
    }

    console.log('ALL VALIDATIONS PASSED - SUBMITTING FORM');
    createApplicationMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50" key={`insurance-page-${Date.now()}`}>
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
            <form onSubmit={handleSubmit} className="space-y-8" noValidate key="insurance-form-v2">
              
              {/* Insurance Plan Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Insurance Plan *</h3>
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
                        <div className="text-lg font-bold text-blue-600">${product.price} USD</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={applicationData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"  
                    type="text"
                    value={applicationData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
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
                    <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                      {sortedCountries.map((country) => (
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
                  <Label htmlFor="passportNumber">Passport Number *</Label>
                  <Input
                    id="passportNumber"
                    type="text"
                    value={applicationData.passportNumber}
                    onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                    placeholder="Enter your passport number"
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Travel Date * (Cannot be in the past)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select
                      value={applicationData.travelDate ? applicationData.travelDate.split('-')[2] : ''}
                      onValueChange={(day) => {
                        const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                        const year = parts[0] || new Date().getFullYear().toString();
                        const month = parts[1] || '01';
                        const newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        
                        // Immediate validation for past dates
                        const selectedDate = new Date(newDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        if (selectedDate.getTime() < today.getTime()) {
                          toast({
                            title: "❌ Past Date Not Allowed",
                            description: "Travel date must be today or in the future!",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        handleInputChange("travelDate", newDate);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                        {(() => {
                          // Smart day filtering based on current month/year selection
                          const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [];
                          const selectedYear = parseInt(parts[0] || new Date().getFullYear().toString());
                          const selectedMonth = parseInt(parts[1] || '01');
                          const today = new Date();
                          const currentYear = today.getFullYear();
                          const currentMonth = today.getMonth() + 1;
                          const currentDay = today.getDate();
                          
                          let availableDays = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
                          
                          // If it's current year and current month, filter out past days
                          if (selectedYear === currentYear && selectedMonth === currentMonth) {
                            availableDays = availableDays.filter(d => parseInt(d) >= currentDay);
                          }
                          
                          return availableDays.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>

                    <Select
                      value={applicationData.travelDate ? applicationData.travelDate.split('-')[1] : ''}
                      onValueChange={(month) => {
                        const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                        const year = parts[0] || new Date().getFullYear().toString();
                        const day = parts[2] || '01';
                        const newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        
                        // Immediate validation for past dates
                        const selectedDate = new Date(newDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        if (selectedDate.getTime() < today.getTime()) {
                          toast({
                            title: "❌ Past Date Not Allowed",
                            description: "Travel date must be today or in the future!",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        handleInputChange("travelDate", newDate);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                        {(() => {
                          const months = [
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
                          ];
                          
                          // Smart month filtering for current year
                          const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [];
                          const selectedYear = parseInt(parts[0] || new Date().getFullYear().toString());
                          const today = new Date();
                          const currentYear = today.getFullYear();
                          const currentMonth = today.getMonth() + 1;
                          
                          let availableMonths = months;
                          
                          // If current year, filter out past months
                          // If past year, show no months
                          if (selectedYear < currentYear) {
                            availableMonths = [];
                          } else if (selectedYear === currentYear) {
                            availableMonths = months.filter(m => parseInt(m.value) >= currentMonth);
                          }
                          
                          return availableMonths.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>

                    <Select
                      value={applicationData.travelDate ? applicationData.travelDate.split('-')[0] : ''}
                      onValueChange={(year) => {
                        const parts = applicationData.travelDate ? applicationData.travelDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                        const month = parts[1] || '01';
                        const day = parts[2] || '01';
                        const newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        
                        // Immediate validation for past dates
                        const selectedDate = new Date(newDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        if (selectedDate.getTime() < today.getTime()) {
                          toast({
                            title: "❌ Past Date Not Allowed",
                            description: "Travel date must be today or in the future!",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        handleInputChange("travelDate", newDate);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                        {/* Only show current year and future years */}
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
                        const year = parts[0] || new Date().getFullYear().toString();
                        const month = parts[1] || '01';
                        handleInputChange("returnDate", `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                        {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={applicationData.returnDate ? applicationData.returnDate.split('-')[1] : ''}
                      onValueChange={(month) => {
                        const parts = applicationData.returnDate ? applicationData.returnDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                        const year = parts[0] || new Date().getFullYear().toString();
                        const day = parts[2] || '01';
                        handleInputChange("returnDate", `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
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
                        const month = parts[1] || '01';
                        const day = parts[2] || '01';
                        handleInputChange("returnDate", `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                        {Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <Label>Date of Birth *</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-')[2] : ''}
                    onValueChange={(day) => {
                      const parts = applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-') : ['1990', '01', '01'];
                      const year = parts[0] || '1990';
                      const month = parts[1] || '01';
                      handleInputChange("dateOfBirth", `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                      {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-')[1] : ''}
                    onValueChange={(month) => {
                      const parts = applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-') : ['1990', '01', '01'];
                      const year = parts[0] || '1990';
                      const day = parts[2] || '01';
                      handleInputChange("dateOfBirth", `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
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
                      const parts = applicationData.dateOfBirth ? applicationData.dateOfBirth.split('-') : ['1990', '01', '01'];
                      const month = parts[1] || '01';
                      const day = parts[2] || '01';
                      handleInputChange("dateOfBirth", `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={4} align="start" avoidCollisions={false}>
                      {Array.from({ length: 80 }, (_, i) => (new Date().getFullYear() - i).toString()).map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Parent ID Photos for under 18 */}
              {(() => {
                if (!applicationData.dateOfBirth) return null;
                
                const birthDate = new Date(applicationData.dateOfBirth);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                let actualAge = age;
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  actualAge--;
                }
                
                if (actualAge < 18) {
                  return (
                    <div className="border border-orange-200 bg-orange-50 rounded-lg p-6">
                      <Label className="text-orange-800 font-semibold text-lg mb-4 block">
                        🔒 Parent ID Photos Required (Under 18) *
                      </Label>
                      <p className="text-sm text-orange-700 mb-6">
                        Since you are under 18, please upload photos of your parents' ID documents. You can upload for mother, father, or both.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Mother's ID Photos */}
                        <div className="border border-pink-200 bg-pink-50 rounded-lg p-4">
                          <Label className="text-pink-800 font-semibold">👩 Mother's ID Photos</Label>
                          <p className="text-xs text-pink-700 mb-3">
                            Upload front and back sides of mother's ID
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 2) {
                                toast({
                                  title: "Too Many Files",
                                  description: "Please upload maximum 2 photos for mother's ID (front and back)",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setMotherIdPhotos(files);
                            }}
                            className="border-pink-300 bg-white text-sm"
                          />
                          {motherIdPhotos.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-green-600">
                                ✓ {motherIdPhotos.length} file(s) selected
                              </p>
                              <div className="text-xs text-gray-500 mt-1">
                                {motherIdPhotos.map((file, idx) => (
                                  <div key={idx}>• {file.name}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Father's ID Photos */}
                        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                          <Label className="text-blue-800 font-semibold">👨 Father's ID Photos</Label>
                          <p className="text-xs text-blue-700 mb-3">
                            Upload front and back sides of father's ID
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 2) {
                                toast({
                                  title: "Too Many Files",
                                  description: "Please upload maximum 2 photos for father's ID (front and back)",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setFatherIdPhotos(files);
                            }}
                            className="border-blue-300 bg-white text-sm"
                          />
                          {fatherIdPhotos.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-green-600">
                                ✓ {fatherIdPhotos.length} file(s) selected
                              </p>
                              <div className="text-xs text-gray-500 mt-1">
                                {fatherIdPhotos.map((file, idx) => (
                                  <div key={idx}>• {file.name}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Overall Status */}
                      {(motherIdPhotos.length > 0 || fatherIdPhotos.length > 0) && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-semibold">
                            ✓ Parent ID Documentation Status:
                          </p>
                          <div className="text-xs text-green-700 mt-1">
                            {motherIdPhotos.length > 0 && <div>• Mother's ID: {motherIdPhotos.length} photo(s) uploaded</div>}
                            {fatherIdPhotos.length > 0 && <div>• Father's ID: {fatherIdPhotos.length} photo(s) uploaded</div>}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 text-xs text-orange-600 bg-orange-100 p-2 rounded">
                        <strong>Note:</strong> You must upload at least one parent's ID documents to proceed. Both front and back sides are recommended for faster processing.
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Payment Summary */}
              {selectedProduct && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Selected Plan:</span>
                      <span className="font-semibold">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-blue-600">
                      <span>Total Amount:</span>
                      <span>${selectedProduct.price} USD</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p>• Medical coverage up to $100,000</p>
                    <p>• 24/7 emergency assistance</p>
                    <p>• Trip cancellation protection</p>
                    <p>• Lost baggage coverage</p>
                  </div>
                </div>
              )}
              
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
                  `Pay $${selectedProduct?.price || '0'}.00 - Complete Purchase`
                )}
              </Button>
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
            createApplicationMutation.mutate();
          }}
        />
      )}
    </div>
  );
}