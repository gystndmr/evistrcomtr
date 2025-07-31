import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountrySelector } from "./country-selector";
import { SupportingDocs } from "./supporting-docs";
import { SupportingDocumentCheck } from "./supporting-document-check";
import { InsuranceModal } from "./insurance-modal";
// PaymentForm removed - now using direct redirects
import { PaymentRetry } from "./payment-retry";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import type { Country } from "@shared/schema";
import { useLanguage } from "@/contexts/LanguageContext";

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  passportIssueDate: z.string().min(1, "Passport issue date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  passportExpiryDate: z.string().min(1, "Passport expiry date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  dateOfBirth: z.string().min(1, "Date of birth is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  placeOfBirth: z.string().min(2, "Place of birth is required (minimum 2 characters)"),
  motherName: z.string().min(2, "Mother's name is required (minimum 2 characters)"),
  fatherName: z.string().min(2, "Father's name is required (minimum 2 characters)"),
  address: z.string().min(10, "Complete address is required (minimum 10 characters)"),
  arrivalDate: z.string().min(1, "Arrival date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  processingType: z.string().min(1, "Processing type is required"),
  documentType: z.string().min(1, "Document type is required"),
  supportingDocumentNumber: z.string().optional(),
  supportingDocumentStartDate: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), "Invalid date format"),
  supportingDocumentEndDate: z.string().optional().refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), "Invalid date format"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const processingTypes = [
  { value: "standard", label: "Ready in 5-7 days", price: 25 },
  { value: "fast", label: "Ready in 1-3 days", price: 75 },
  { value: "express", label: "Ready in 24 hours", price: 175 },
  { value: "urgent", label: "Ready in 4 hours", price: 295 },
];

export function VisaForm() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [hasSupportingDocument, setHasSupportingDocument] = useState<boolean | null>(null);
  const [supportingDocumentDetails, setSupportingDocumentDetails] = useState<any>(null);
  const [selectedSupportingDocType, setSelectedSupportingDocType] = useState("");
  const [documentProcessingType, setDocumentProcessingType] = useState("");
  const [isSupportingDocumentValid, setIsSupportingDocumentValid] = useState(false);
  // Removed paymentData state - now using direct redirects
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string>("");
  const [prerequisites, setPrerequisites] = useState({
    ordinaryPassport: false,
    validPassport: false,
    enterWithin3Months: false,
    stayWithin30Days: false,
  });
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      passportNumber: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      dateOfBirth: "",
      placeOfBirth: "",
      motherName: "",
      fatherName: "",
      address: "",
      arrivalDate: "",
      processingType: "standard",
      documentType: "",
      supportingDocumentNumber: "",
      supportingDocumentStartDate: "",
      supportingDocumentEndDate: "",
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      // First create the application
      const applicationResponse = await apiRequest("POST", "/api/applications", {
        ...data,
        countryId: selectedCountry?.id,
        countryOfOrigin: selectedCountry?.name,
        totalAmount: calculateTotal().toString(),
        supportingDocumentType: selectedSupportingDocType || null,
        supportingDocumentCountry: supportingDocumentDetails?.visaCountry || supportingDocumentDetails?.residenceCountry || null,
        supportingDocumentNumber: data.supportingDocumentNumber || null,
        supportingDocumentStartDate: data.supportingDocumentStartDate || null,
        supportingDocumentEndDate: data.supportingDocumentEndDate || null,
      });
      const applicationData = await applicationResponse.json();
      
      // Then create payment - let server generate unique orderRef
      const paymentResponse = await apiRequest("POST", "/api/payment/create", {
        amount: calculateTotal(),
        currency: "USD",
        description: `Turkey E-Visa Application - ${applicationData.applicationNumber}`,
        customerEmail: data.email,
        customerName: `${data.firstName} ${data.lastName}`
        // Removed orderId - server will generate unique orderRef automatically
      });
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.success && paymentData.paymentUrl) {
        setCurrentOrderId(applicationData.applicationNumber);
        setPaymentRedirectUrl(paymentData.paymentUrl);
        
        // Enhanced redirect approach for mobile compatibility with debugging
        const redirectToPayment = () => {
          try {
            console.log('[Payment Debug] Starting redirect process');
            console.log('[Payment Debug] Payment URL:', paymentData.paymentUrl);
            console.log('[Payment Debug] User Agent:', navigator.userAgent);
            
            // Always show success toast first
            toast({
              title: "Payment Created",
              description: `Redirecting to payment... Order: ${applicationData.applicationNumber}`,
              duration: 5000,
            });
            
            // For all devices: Direct location.href redirect
            console.log('[Payment Debug] Using location.href redirect');
            setTimeout(() => {
              window.location.href = paymentData.paymentUrl;
            }, 500); // Small delay to show toast
            
          } catch (error) {
            console.error('[Payment Debug] Redirect error:', error);
            
            // Ultimate fallback: show manual link
            toast({
              title: "Payment Link Ready",
              description: "Click the button to continue to payment",
              action: (
                <button 
                  onClick={() => {
                    try {
                      window.open(paymentData.paymentUrl, '_blank');
                    } catch (e) {
                      console.error('[Payment Debug] Manual link error:', e);
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
      
      return applicationData;
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted",
        description: `Your application number is ${data.applicationNumber}. Redirecting to payment page...`,
        duration: 5000,
      });
      
      // Show manual continue option after a short delay for mobile users
      setTimeout(() => {
        toast({
          title: "Payment Ready",
          description: "If payment page didn't open automatically, click Continue below",
          action: paymentRedirectUrl ? (
            <button 
              onClick={() => window.open(paymentRedirectUrl, '_blank')}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Continue
            </button>
          ) : undefined,
          duration: 8000,
        });
      }, 2000);
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
      console.error('[Mobile Payment] Application/Payment error:', error);
      
      // Check if it's a payment-specific error
      const isPaymentError = error.message?.includes('payment') || error.message?.includes('GPay');
      
      toast({
        title: isPaymentError ? "Payment Error" : "Application Error",
        description: isPaymentError ? 
          "There was an issue initializing payment. Please try again or contact support." :
          error.message,
        variant: "destructive",
        action: isPaymentError ? (
          <button 
            onClick={() => {
              console.log('[Mobile Payment] Retrying application...');
              createApplicationMutation.mutate(form.getValues());
            }}
            className="bg-white text-red-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
          >
            Retry
          </button>
        ) : undefined,
        duration: 8000,
      });
    },
  });

  const calculateTotal = () => {
    if (hasSupportingDocument === true && documentProcessingType) {
      // Processing fee + Document PDF fee
      const processingFee = 
        documentProcessingType === "slow" ? 50 :
        documentProcessingType === "standard" ? 115 :
        documentProcessingType === "fast" ? 165 :
        documentProcessingType === "urgent_24" ? 280 :
        documentProcessingType === "urgent_12" ? 330 :
        documentProcessingType === "urgent_4" ? 410 :
        documentProcessingType === "urgent_1" ? 645 : 0;
      
      const documentPdfFee = 69; // Document PDF fee
      return processingFee + documentPdfFee;
    } else if (hasSupportingDocument === false) {
      // Standard e-visa processing fees (when no supporting document)
      const selectedProcessingType = form.watch("processingType") || "standard";
      return processingTypes.find(p => p.value === selectedProcessingType)?.price || 25;
    }
    
    return 0;
  };

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);
    // Reset supporting document state when country changes
    setHasSupportingDocument(null);
    setSupportingDocumentDetails(null);
    setDocumentProcessingType("");
    setIsSupportingDocumentValid(false);
  };

  const handleNextStep = () => {
    // Step 1: Country and Document Type Selection
    if (currentStep === 1) {
      if (!selectedCountry || !selectedDocumentType) {
        toast({
          title: "Required Fields",
          description: "Please select country and document type",
          variant: "destructive",
        });
        return;
      }
      if (!selectedCountry.isEligible) {
        // Redirect to insurance for non-eligible countries with country information
        window.location.href = `/insurance?country=${encodeURIComponent(selectedCountry.name)}`;
        return;
      }
    }
    
    // Step 2: Supporting Document Check
    if (currentStep === 2) {
      if (hasSupportingDocument === null) {
        toast({
          title: "Required Selection",
          description: "Please indicate if you have supporting documents",
          variant: "destructive",
        });
        return;
      }
      if (hasSupportingDocument === false) {
        // Add country parameter if available for insurance tracking
        const countryParam = selectedCountry ? `?country=${encodeURIComponent(selectedCountry.name)}` : '';
        
        // Immediate redirect for better UX
        toast({
          title: "No Supporting Documents Required",
          description: "Redirecting to travel insurance options...",
          duration: 500,
        });
        // Immediate redirect - no delay
        window.location.href = `/insurance${countryParam}`;
        return;
      }
      if (hasSupportingDocument === true) {
        // Check if supporting document details are valid
        if (!isSupportingDocumentValid) {
          toast({
            title: "Missing Information",
            description: "Please complete all required supporting document fields",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    // Step 3: Arrival Information
    if (currentStep === 3) {
      const arrivalDate = form.getValues("arrivalDate");
      
      if (!arrivalDate) {
        toast({
          title: "Arrival Date Required",
          description: "Please enter your arrival date to Turkey",
          variant: "destructive",
        });
        return;
      }
      
      // Check processing type based on supporting document status
      if (hasSupportingDocument === true) {
        if (!documentProcessingType) {
          toast({
            title: "Processing Type Required",
            description: "Please select a processing type",
            variant: "destructive",
          });
          return;
        }
      } else if (hasSupportingDocument === false) {
        const processingType = form.getValues("processingType");
        if (!processingType) {
          toast({
            title: "Processing Type Required",
            description: "Please select a processing type",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    // Step 4: Prerequisites (only if supporting document exists)
    if (currentStep === 4 && selectedCountry?.isEligible && hasSupportingDocument === true) {
      const allPrerequisitesMet = prerequisites.ordinaryPassport && 
                                  prerequisites.validPassport && 
                                  prerequisites.enterWithin3Months && 
                                  prerequisites.stayWithin30Days;
                                  
      if (!allPrerequisitesMet) {
        toast({
          title: t('form.error.prerequisites'),
          description: t('form.error.prerequisites.desc'),
          variant: "destructive",
        });
        return;
      }
    }
    
    // Step 5: Personal Information (with supporting document) OR Step 4 (without)
    const personalInfoStep = (selectedCountry?.isEligible && hasSupportingDocument === true) ? 5 : 4;
    if (currentStep === personalInfoStep) {
      const formData = form.getValues();
      
      if (!formData.firstName.trim()) {
        toast({
          title: t('form.error.first.name'),
          description: t('form.error.first.name.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.lastName.trim()) {
        toast({
          title: t('form.error.last.name'), 
          description: t('form.error.last.name.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.email.trim()) {
        toast({
          title: t('form.error.email'),
          description: t('form.error.email.desc'),
          variant: "destructive",
        });
        return;
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: t('form.error.email.invalid'),
          description: t('form.error.email.invalid.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.phone.trim()) {
        toast({
          title: t('form.error.phone'),
          description: t('form.error.phone.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.passportNumber.trim()) {
        toast({
          title: t('form.error.passport'),
          description: t('form.error.passport.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.dateOfBirth) {
        toast({
          title: t('form.error.birth.date'),
          description: t('form.error.birth.date.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.passportIssueDate) {
        toast({
          title: "Passport Issue Date Required",
          description: "Please enter your passport issue date",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.passportExpiryDate) {
        toast({
          title: "Passport Expiry Date Required",
          description: "Please enter your passport expiry date",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.placeOfBirth?.trim() || formData.placeOfBirth.length < 2) {
        toast({
          title: t('form.error.place.birth'),
          description: t('form.error.place.birth.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.motherName?.trim() || formData.motherName.length < 2) {
        toast({
          title: t('form.error.mother.name'), 
          description: t('form.error.mother.name.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.fatherName?.trim() || formData.fatherName.length < 2) {
        toast({
          title: t('form.error.father.name'),
          description: t('form.error.father.name.desc'),
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.address?.trim() || formData.address.length < 10) {
        toast({
          title: t('form.error.address'),
          description: t('form.error.address.desc'),
          variant: "destructive",
        });
        return;
      }
      
      // Date validations
      const passportIssueDate = new Date(formData.passportIssueDate);
      const passportExpiryDate = new Date(formData.passportExpiryDate);
      const today = new Date();
      
      if (passportExpiryDate <= today) {
        toast({
          title: "Passport Expired",
          description: "Your passport expiry date must be in the future",
          variant: "destructive",
        });
        return;
      }
      
      if (passportIssueDate >= passportExpiryDate) {
        toast({
          title: "Invalid Passport Dates",
          description: "Passport issue date must be before expiry date",
          variant: "destructive",
        });
        return;
      }
      
      // Supporting document validation (only for users with supporting documents)
      if (hasSupportingDocument === true) {
        if (!formData.supportingDocumentNumber?.trim()) {
          toast({
            title: "Supporting Document Number Required",
            description: "Please enter your supporting document number",
            variant: "destructive",
          });
          return;
        }
        
        if (!formData.supportingDocumentStartDate) {
          toast({
            title: "Supporting Document Start Date Required",
            description: "Please enter your supporting document start date",
            variant: "destructive",
          });
          return;
        }
        
        if (!formData.supportingDocumentEndDate) {
          toast({
            title: "Supporting Document End Date Required",
            description: "Please enter your supporting document end date",
            variant: "destructive",
          });
          return;
        }
        
        // Validate supporting document date logic
        const supportingStartDate = new Date(formData.supportingDocumentStartDate);
        const supportingEndDate = new Date(formData.supportingDocumentEndDate);
        
        if (supportingStartDate >= supportingEndDate) {
          toast({
            title: t('form.validation.error.title'),
            description: t('form.validation.error.description'),
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    setCurrentStep(currentStep + 1);
    
    // Scroll to top of page for better user experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    
    // Scroll to top of page for better user experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInsuranceRedirect = () => {
    window.location.href = "/insurance";
  };

  const onSubmit = (data: ApplicationFormData) => {
    createApplicationMutation.mutate(data);
  };

  const getDynamicSteps = () => {
    const baseSteps = [
      { number: 1, title: t("app.step1") },
      { number: 2, title: t("app.step2") },
      { number: 3, title: t("app.step3") },
    ];
    
    if (selectedCountry?.isEligible && hasSupportingDocument === true) {
      return [
        ...baseSteps,
        { number: 4, title: t("app.step4.prerequisites") },
        { number: 5, title: t("app.step4") },
        { number: 6, title: t("app.step5") },
      ];
    } else {
      return [
        ...baseSteps,
        { number: 4, title: t("app.step4") },
        { number: 5, title: t("app.step5") },
      ];
    }
  };
  
  const steps = getDynamicSteps();
  const totalSteps = steps.length;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("app.form.title")}</CardTitle>
          
          {/* Progress Steps */}
          <div className="mt-6">
            {/* Mobile: Vertical layout */}
            <div className="flex flex-col space-y-3 sm:hidden">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.number
                        ? "bg-primary text-white"
                        : "bg-neutral-300 text-neutral-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className={`ml-3 font-medium text-sm ${
                    currentStep >= step.number ? "text-primary" : "text-neutral-400"
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Desktop: Horizontal layout */}
            <div className="hidden sm:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.number
                        ? "bg-primary text-white"
                        : "bg-neutral-300 text-neutral-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className={`ml-2 font-medium text-sm lg:text-base ${
                    currentStep >= step.number ? "text-primary" : "text-neutral-400"
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="flex-1 border-t border-neutral-300 mx-2 lg:mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Country Selection */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("app.step1.title")}</h3>
                  <CountrySelector
                    onCountrySelect={handleCountrySelect}
                    onDocumentTypeSelect={setSelectedDocumentType}
                    selectedCountry={selectedCountry}
                    selectedDocumentType={selectedDocumentType}
                  />
                </div>
              )}

              {/* Step 2: Supporting Document Check */}
              {currentStep === 2 && selectedCountry?.isEligible && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("app.step2.title")}</h3>
                  <SupportingDocumentCheck
                    onHasSupportingDocument={setHasSupportingDocument}
                    onDocumentDetailsChange={setSupportingDocumentDetails}
                    onValidationChange={setIsSupportingDocumentValid}
                    onSupportingDocTypeChange={setSelectedSupportingDocType}
                    onProcessingTypeChange={setDocumentProcessingType}
                  />
                </div>
              )}

              {/* Step 3: Travel Information */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("app.step3.title")}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="arrivalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arrival Date in Turkey *</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <Select
                                  value={field.value ? field.value.split('-')[2] : ''}
                                  onValueChange={(day) => {
                                    const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                    const year = parts[0];
                                    const month = parts[1];
                                    field.onChange(`${year}-${month}-${day.padStart(2, '0')}`);
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
                                  value={field.value ? field.value.split('-')[1] : ''}
                                  onValueChange={(month) => {
                                    const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                    const year = parts[0];
                                    const day = parts[2];
                                    field.onChange(`${year}-${month.padStart(2, '0')}-${day}`);
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
                                  value={field.value ? field.value.split('-')[0] : ''}
                                  onValueChange={(year) => {
                                    const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                    const month = parts[1];
                                    const day = parts[2];
                                    field.onChange(`${year}-${month}-${day}`);
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Processing Type for supporting document applications */}
                    {hasSupportingDocument === true && (
                      <div className="space-y-4">
                        <Label htmlFor="processingType">Processing Type *</Label>
                        <Select onValueChange={setDocumentProcessingType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select processing type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="slow">Ready in 7 days - $50</SelectItem>
                            <SelectItem value="standard">Ready in 4 days - $115</SelectItem>
                            <SelectItem value="fast">Ready in 2 days - $165</SelectItem>
                            <SelectItem value="urgent_24">Ready in 24 hours - $280</SelectItem>
                            <SelectItem value="urgent_12">Ready in 12 hours - $330</SelectItem>
                            <SelectItem value="urgent_4">Ready in 4 hours - $410</SelectItem>
                            <SelectItem value="urgent_1">Ready in 1 hour - $645</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {documentProcessingType && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Processing Fee Summary:</h4>
                            <div className="text-sm text-blue-800">
                              <p>• Selected: {documentProcessingType}</p>
                              <p>• Processing Fee: ${
                                documentProcessingType === "slow" ? 50 :
                                documentProcessingType === "standard" ? 115 :
                                documentProcessingType === "fast" ? 165 :
                                documentProcessingType === "urgent_24" ? 280 :
                                documentProcessingType === "urgent_12" ? 330 :
                                documentProcessingType === "urgent_4" ? 410 :
                                documentProcessingType === "urgent_1" ? 645 : 0
                              }</p>
                              <p>• Document PDF Fee: $69</p>
                              <p className="font-bold text-lg">• Total Amount: ${calculateTotal()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Standard processing type for non-supporting document applications */}
                    {hasSupportingDocument === false && (
                      <FormField
                        control={form.control}
                        name="processingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Processing Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select processing type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {processingTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label} - ${type.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Prerequisites (for eligible countries with supporting docs) */}
              {currentStep === 4 && selectedCountry?.isEligible && hasSupportingDocument === true && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("app.step4.prerequisites.title")}</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Please confirm you meet the following criteria:</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2" 
                            checked={prerequisites.ordinaryPassport}
                            onChange={(e) => setPrerequisites({...prerequisites, ordinaryPassport: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">You have an ordinary passport (not diplomatic or service passport)</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2" 
                            checked={prerequisites.validPassport}
                            onChange={(e) => setPrerequisites({...prerequisites, validPassport: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">Your passport is valid for at least 6 months</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2" 
                            checked={prerequisites.enterWithin3Months}
                            onChange={(e) => setPrerequisites({...prerequisites, enterWithin3Months: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">You will enter Turkey within 3 months of visa issuance</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2" 
                            checked={prerequisites.stayWithin30Days}
                            onChange={(e) => setPrerequisites({...prerequisites, stayWithin30Days: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">Your stay will not exceed 30 days in a 180-day period</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-medium text-amber-900 mb-2">Visa Information:</h4>
                      <div className="text-sm text-amber-800">
                        <p>• Your e-visa will be valid for 180 days from your arrival date</p>
                        <p>• Maximum stay: 30 days per entry</p>
                        <p>• Single entry visa</p>
                        <p>• Total cost: ${calculateTotal()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Personal Details (for eligible countries with supporting docs) or Step 4 (for others) */}
              {(currentStep === 5 || (currentStep === 4 && (!selectedCountry?.isEligible || hasSupportingDocument === false))) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{hasSupportingDocument === true ? t("app.step5.title") : t("app.step4.title")}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 gap-2">
                              <Select
                                value={field.value ? field.value.split('-')[2] : ''}
                                onValueChange={(day) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const year = parts[0];
                                  const month = parts[1];
                                  field.onChange(`${year}-${month}-${day.padStart(2, '0')}`);
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
                                value={field.value ? field.value.split('-')[1] : ''}
                                onValueChange={(month) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const year = parts[0];
                                  const day = parts[2];
                                  field.onChange(`${year}-${month.padStart(2, '0')}-${day}`);
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
                                value={field.value ? field.value.split('-')[0] : ''}
                                onValueChange={(year) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const month = parts[1];
                                  const day = parts[2];
                                  field.onChange(`${year}-${month}-${day}`);
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passportNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter passport number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passportIssueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Issue Date</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 gap-2">
                              <Select
                                value={field.value ? field.value.split('-')[2] : ''}
                                onValueChange={(day) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const year = parts[0]; const month = parts[1];
                                  field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                value={field.value ? field.value.split('-')[1] : ''}
                                onValueChange={(month) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const year = parts[0]; const day = parts[2];
                                  field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                value={field.value ? field.value.split('-')[0] : ''}
                                onValueChange={(year) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const month = parts[1]; const day = parts[2];
                                  field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString()).map((y) => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passportExpiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Expiry Date</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 gap-2">
                              <Select
                                value={field.value ? field.value.split('-')[2] : ''}
                                onValueChange={(day) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const year = parts[0]; const month = parts[1];
                                  field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                value={field.value ? field.value.split('-')[1] : ''}
                                onValueChange={(month) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const year = parts[0]; const day = parts[2];
                                  field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                value={field.value ? field.value.split('-')[0] : ''}
                                onValueChange={(year) => {
                                  const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                  const month = parts[1]; const day = parts[2];
                                  field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="placeOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of Birth</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your place of birth" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your mother's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your father's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Supporting Document Details */}
                    {hasSupportingDocument === true && (
                      <>
                        <div className="md:col-span-2">
                          <h4 className="text-md font-semibold mb-3 text-blue-900">Supporting Document Details</h4>
                        </div>
                        <FormField
                          control={form.control}
                          name="supportingDocumentNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Document Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter document number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="supportingDocumentStartDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Document Start Date</FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-3 gap-2">
                                  <Select
                                    value={field.value ? field.value.split('-')[2] : ''}
                                    onValueChange={(day) => {
                                      const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                      const year = parts[0]; const month = parts[1];
                                      field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                    value={field.value ? field.value.split('-')[1] : ''}
                                    onValueChange={(month) => {
                                      const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                      const year = parts[0]; const day = parts[2];
                                      field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                    value={field.value ? field.value.split('-')[0] : ''}
                                    onValueChange={(year) => {
                                      const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                      const month = parts[1]; const day = parts[2];
                                      field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i + 10).toString()).map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="supportingDocumentEndDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Document End Date</FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-3 gap-2">
                                  <Select
                                    value={field.value ? field.value.split('-')[2] : ''}
                                    onValueChange={(day) => {
                                      const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                      const year = parts[0]; const month = parts[1];
                                      field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                    value={field.value ? field.value.split('-')[1] : ''}
                                    onValueChange={(month) => {
                                      const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                      const year = parts[0]; const day = parts[2];
                                      field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
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
                                    value={field.value ? field.value.split('-')[0] : ''}
                                    onValueChange={(year) => {
                                      const parts = field.value ? field.value.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                                      const month = parts[1]; const day = parts[2];
                                      field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i + 20).toString()).map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: Payment (for eligible countries with supporting docs) or Step 5 (for others) */}
              {(currentStep === 6 || (currentStep === 5 && (!selectedCountry?.isEligible || hasSupportingDocument === false))) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{hasSupportingDocument === true ? t("app.step6.title") : t("app.step5.title")}</h3>
                  
                  <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">{t('form.section.order.summary')}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('form.payment.evisa.fee')}</span>
                        <span>$69.00</span>
                      </div>
                      {hasSupportingDocument === true && documentProcessingType && (
                        <div className="flex justify-between">
                          <span>{t('form.payment.processing.document.fee')}</span>
                          <span>${(() => {
                            const documentProcessingTypes = [
                              { value: "slow", price: 119 },
                              { value: "standard", price: 184 },
                              { value: "fast", price: 234 },
                              { value: "urgent_24", price: 349 },
                              { value: "urgent_12", price: 399 },
                              { value: "urgent_4", price: 479 },
                              { value: "urgent_1", price: 714 }
                            ];
                            return documentProcessingTypes.find(p => p.value === documentProcessingType)?.price || 119;
                          })()}</span>
                        </div>
                      )}
                      {hasSupportingDocument === false && (
                        <div className="flex justify-between">
                          <span>{t('form.payment.processing.fee')}</span>
                          <span>${(() => {
                            const processingType = form.watch("processingType") || "standard";
                            const selectedProcessing = processingTypes.find(p => p.value === processingType);
                            return selectedProcessing?.price || 25;
                          })()}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>{t('form.payment.total.amount')}</span>
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <h4 className="text-sm font-medium text-blue-900">{t('form.payment.secure.title')}</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      {t('form.payment.secure.description')}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              {currentStep === totalSteps && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">{t('form.payment.summary.title')}</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span>{t('form.payment.evisa.fee')}:</span>
                      <span>$69.00</span>
                    </div>
                    {hasSupportingDocument === true && documentProcessingType && (
                      <div className="flex justify-between">
                        <span>{t('form.payment.processing.document.fee')}:</span>
                        <span>${(() => {
                          const documentProcessingTypes = [
                            { value: "slow", price: 119 },
                            { value: "standard", price: 184 },
                            { value: "fast", price: 234 },
                            { value: "urgent_24", price: 349 },
                            { value: "urgent_12", price: 399 },
                            { value: "urgent_4", price: 479 },
                            { value: "urgent_1", price: 714 }
                          ];
                          return documentProcessingTypes.find(p => p.value === documentProcessingType)?.price || 119;
                        })()}</span>
                      </div>
                    )}
                    {hasSupportingDocument === false && (
                      <div className="flex justify-between">
                        <span>{t('form.payment.processing.fee')}:</span>
                        <span>${(() => {
                          const processingType = form.watch("processingType") || "standard";
                          const selectedProcessing = processingTypes.find(p => p.value === processingType);
                          return selectedProcessing?.price || 25;
                        })()}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>{t('form.payment.total.amount')}:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevStep} className="order-2 sm:order-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('form.navigation.previous')}
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNextStep} className="order-1 sm:order-2 sm:ml-auto bg-primary hover:bg-primary/90 text-white">
                    {t('form.navigation.next.step')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    className="order-1 sm:order-2 sm:ml-auto bg-secondary hover:bg-secondary/90 text-sm sm:text-base px-4 py-2 text-white"
                    disabled={createApplicationMutation.isPending}
                    onClick={(e) => {
                      e.preventDefault();
                      
                      // Form validation kontrolü
                      const formData = form.getValues();
                      const errors = form.formState.errors;
                      
                      if (Object.keys(errors).length > 0) {
                        toast({
                          title: t('form.validation.error.title'),
                          description: t('form.validation.error.description'),
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      // Direct payment mutation call
                      createApplicationMutation.mutate(formData);
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">
                      {createApplicationMutation.isPending ? t('form.button.processing') : t('form.button.submit.pay.desktop')}
                    </span>
                    <span className="sm:hidden">
                      {createApplicationMutation.isPending ? t('form.button.processing') : t('form.button.pay.mobile')}
                    </span>
                    {!createApplicationMutation.isPending && calculateTotal().toFixed(2)}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <InsuranceModal
        isOpen={showInsuranceModal}
        onClose={() => setShowInsuranceModal(false)}
        onGetInsurance={handleInsuranceRedirect}
      />
      
      {/* Payment Retry Component */}
      {showRetry && currentOrderId && (
        <PaymentRetry
          paymentUrl={`https://getvisa.gpayprocessing.com/checkout/${currentOrderId}`}
          orderId={currentOrderId}
          onRetry={() => {
            setShowRetry(false);
            // Retry the payment creation
            createApplicationMutation.mutate(form.getValues());
          }}
        />
      )}
    </div>
  );
}
