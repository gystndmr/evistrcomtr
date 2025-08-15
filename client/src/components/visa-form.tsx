import { useState, useEffect } from "react";
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
  { value: "standard", label: "Ready in 5-7 days", price: 25, minDays: 7 },
  { value: "fast", label: "Ready in 1-3 days", price: 75, minDays: 3 },
  { value: "express", label: "Ready in 24 hours", price: 175, minDays: 1 },
  { value: "urgent", label: "Ready in 4 hours", price: 295, minDays: 1 },
];

// Supporting document processing types with minDays
const supportingDocProcessingTypes = [
  { value: "slow", label: "Ready in 7 days", price: 50, minDays: 7 },
  { value: "standard", label: "Ready in 4 days", price: 115, minDays: 4 },
  { value: "fast", label: "Ready in 2 days", price: 165, minDays: 2 },
  { value: "urgent_24", label: "Ready in 24 hours", price: 280, minDays: 1 },
  { value: "urgent_12", label: "Ready in 12 hours", price: 330, minDays: 1 },
  { value: "urgent_4", label: "Ready in 4 hours", price: 410, minDays: 1 },
  { value: "urgent_1", label: "Ready in 1 hour", price: 645, minDays: 1 },
];

// Helper function to calculate days between two dates
const calculateDaysDifference = (arrivalDate: string): number => {
  if (!arrivalDate) return Infinity;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const arrival = new Date(arrivalDate);
  arrival.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const diffTime = arrival.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Helper function to filter processing types based on arrival date
const getAvailableProcessingTypes = (arrivalDate: string, isSupporting: boolean = false) => {
  const daysUntilArrival = calculateDaysDifference(arrivalDate);
  const types = isSupporting ? supportingDocProcessingTypes : processingTypes;
  
  // If arrival date is in the past, show only fastest options (1 day processing)
  if (daysUntilArrival <= 0) {
    return types.filter(type => type.minDays === 1);
  }
  
  return types.filter(type => type.minDays <= daysUntilArrival);
};

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
  const [availableProcessingTypes, setAvailableProcessingTypes] = useState(processingTypes);
  const [availableSupportingDocTypes, setAvailableSupportingDocTypes] = useState(supportingDocProcessingTypes);
  // Removed paymentData state - now using direct redirects
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string>("");
  const [prerequisites, setPrerequisites] = useState({
    tourismBusiness: false,
    financialProof: false,
    supportingDocuments: false,
    passportValidity: false,
    allRequirements: false,
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

  // Watch arrival date changes and update available processing types
  const watchedArrivalDate = form.watch("arrivalDate");
  
  useEffect(() => {
    if (watchedArrivalDate) {
      // Update available processing types based on arrival date
      const standardTypes = getAvailableProcessingTypes(watchedArrivalDate, false);
      const supportingTypes = getAvailableProcessingTypes(watchedArrivalDate, true);
      
      setAvailableProcessingTypes(standardTypes);
      setAvailableSupportingDocTypes(supportingTypes);
      
      // Reset processing type if current selection is no longer available
      const currentProcessingType = form.getValues("processingType");
      if (currentProcessingType && !standardTypes.some(type => type.value === currentProcessingType)) {
        form.setValue("processingType", standardTypes.length > 0 ? standardTypes[0].value : "");
        toast({
          title: "İşlem Türü Güncellendi",
          description: "Varış tarihinize göre işlem türü otomatik olarak ayarlandı.",
          duration: 3000,
        });
      }
      
      // Reset supporting document processing type if no longer available
      if (documentProcessingType && !supportingTypes.some(type => type.value === documentProcessingType)) {
        setDocumentProcessingType(supportingTypes.length > 0 ? supportingTypes[0].value : "");
        toast({
          title: "İşlem Türü Güncellendi", 
          description: "Varış tarihinize göre işlem türü otomatik olarak ayarlandı.",
          duration: 3000,
        });
      }
    } else {
      // If no arrival date, show all options
      setAvailableProcessingTypes(processingTypes);
      setAvailableSupportingDocTypes(supportingDocProcessingTypes);
    }
  }, [watchedArrivalDate, form, documentProcessingType, toast]);

  const createApplicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      // Ensure we have the correct processing type based on supporting document status
      const finalProcessingType = hasSupportingDocument === true ? documentProcessingType : data.processingType;
      
      // First create the application - ALL DATA IS PRESERVED
      const applicationResponse = await apiRequest("POST", "/api/applications", {
        ...data,
        countryId: selectedCountry?.id,
        countryOfOrigin: selectedCountry?.name,
        processingType: finalProcessingType, // Use the correct processing type
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
      // Find processing fee from dynamic list
      const processingFee = supportingDocProcessingTypes.find(type => type.value === documentProcessingType)?.price || 0;
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
        // Show message and redirect to insurance
        toast({
          title: "E-Visa Not Available", 
          description: "This country is not eligible for Turkey e-visa. You may check our travel insurance options instead.",
          duration: 4000,
        });
        // Redirect to insurance page after showing the message
        setTimeout(() => {
          window.location.href = `/insurance?country=${encodeURIComponent(selectedCountry?.name || '')}`;
        }, 2000);
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
        // Redirect to insurance page immediately when no supporting document
        const country = selectedCountry?.name || '';
        window.location.href = `/insurance?country=${encodeURIComponent(country)}`;
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
      const allPrerequisitesMet = prerequisites.tourismBusiness && 
                                  prerequisites.financialProof && 
                                  prerequisites.supportingDocuments && 
                                  prerequisites.passportValidity && 
                                  prerequisites.allRequirements;
                                  
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
        
        // CRITICAL SECURITY: Validate arrival date is within supporting document period
        const arrivalDate = new Date(formData.arrivalDate);
        if (arrivalDate < supportingStartDate || arrivalDate > supportingEndDate) {
          toast({
            title: "Invalid Arrival Date",
            description: "Your arrival date must be within the supporting document validity period. Please check your document dates and arrival date.",
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
                      render={({ field }) => {
                        const today = new Date();
                        const currentYear = today.getFullYear();
                        const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
                        const currentDay = today.getDate();
                        
                        // Get currently selected values
                        const selectedParts = field.value ? field.value.split('-') : [];
                        const selectedYear = selectedParts[0] ? parseInt(selectedParts[0]) : currentYear;
                        const selectedMonth = selectedParts[1] ? parseInt(selectedParts[1]) : currentMonth;
                        const selectedDay = selectedParts[2] ? parseInt(selectedParts[2]) : currentDay;
                        
                        // Determine available options based on current date
                        const getAvailableYears = () => {
                          return Array.from({ length: 11 }, (_, i) => (currentYear + i).toString());
                        };
                        
                        const getAvailableMonths = () => {
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
                          
                          // If current year selected, filter months based on date logic
                          if (selectedYear === currentYear) {
                            return months.filter(m => {
                              const monthNum = parseInt(m.value);
                              // Future months are always available
                              if (monthNum > currentMonth) {
                                return true;
                              }
                              // For current month, check if user can select a valid day
                              if (monthNum === currentMonth) {
                                // If day is selected and it's valid for current month, show current month
                                if (selectedParts[2] && selectedDay >= currentDay) {
                                  return true;
                                }
                                // If no day selected yet, show current month
                                if (!selectedParts[2]) {
                                  return true;
                                }
                                // Day is selected but invalid for current month
                                return false;
                              }
                              // Past months are never available
                              return false;
                            });
                          }
                          return months;
                        };
                        
                        const getAvailableDays = () => {
                          // Always show days 1-31, but let month filtering handle the logic
                          const daysInMonth = selectedParts[1] ? new Date(selectedYear, selectedMonth, 0).getDate() : 31;
                          return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
                        };
                        
                        return (
                          <FormItem>
                            <FormLabel>Arrival Date in Turkey *</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <Select
                                    value={field.value ? field.value.split('-')[2] : ''}
                                    onValueChange={(day) => {
                                      const parts = field.value ? field.value.split('-') : [currentYear.toString(), currentMonth.toString().padStart(2, '0'), '01'];
                                      const year = parts[0];
                                      const month = parts[1];
                                      field.onChange(`${year}-${month}-${day.padStart(2, '0')}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Day" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" sideOffset={4} align="start">
                                      {getAvailableDays().map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    value={field.value ? field.value.split('-')[1] : ''}
                                    onValueChange={(month) => {
                                      const parts = field.value ? field.value.split('-') : [currentYear.toString(), '01', '01'];
                                      const year = parts[0];
                                      const day = parts[2];
                                      
                                      // Update the form value
                                      field.onChange(`${year}-${month.padStart(2, '0')}-${day}`);
                                      
                                      // If selected day is not available in new month, reset to first available day
                                      const daysInNewMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
                                      const dayInt = parseInt(day);
                                      if (dayInt > daysInNewMonth) {
                                        const firstAvailableDay = (parseInt(year) === currentYear && parseInt(month) === currentMonth) ? currentDay : 1;
                                        field.onChange(`${year}-${month.padStart(2, '0')}-${firstAvailableDay.toString().padStart(2, '0')}`);
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" sideOffset={4} align="start">
                                      {getAvailableMonths().map((m) => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    value={field.value ? field.value.split('-')[0] : ''}
                                    onValueChange={(year) => {
                                      const parts = field.value ? field.value.split('-') : [currentYear.toString(), currentMonth.toString().padStart(2, '0'), '01'];
                                      const month = parts[1];
                                      const day = parts[2];
                                      
                                      // If switching to current year and month is not available, reset to current month
                                      if (parseInt(year) === currentYear && parseInt(month) < currentMonth) {
                                        field.onChange(`${year}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`);
                                      } else {
                                        field.onChange(`${year}-${month}-${day}`);
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableYears().map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  📅 Bugünden önce tarih seçilemez
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    
                    {/* Processing Type for supporting document applications */}
                    {hasSupportingDocument === true && (
                      <div className="space-y-4">
                        <Label htmlFor="processingType">Processing Type *</Label>
                        <Select value={documentProcessingType} onValueChange={setDocumentProcessingType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select processing type" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSupportingDocTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label} - ${type.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {availableSupportingDocTypes.length === 0 && (
                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <p className="text-orange-800 text-sm">
                              <strong>Dikkat:</strong> Seçilen varış tarihi için işlem seçeneği mevcut değil. Lütfen daha ileri bir tarih seçiniz.
                            </p>
                          </div>
                        )}
                        
                        {documentProcessingType && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Processing Fee Summary:</h4>
                            <div className="text-sm text-blue-800">
                              {(() => {
                                const selectedType = supportingDocProcessingTypes.find(type => type.value === documentProcessingType);
                                return (
                                  <>
                                    <p>• Selected: {selectedType?.label || documentProcessingType}</p>
                                    <p>• Processing Fee: ${selectedType?.price || 0}</p>
                                    <p>• Document PDF Fee: $69</p>
                                    <p className="font-bold text-lg">• Total Amount: ${calculateTotal()}</p>
                                  </>
                                );
                              })()}
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select processing type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableProcessingTypes?.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label} - ${type.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                            
                            {availableProcessingTypes.length === 0 && (
                              <div className="bg-orange-50 p-4 rounded-lg mt-2 border border-orange-200">
                                <p className="text-orange-800 text-sm">
                                  <strong>Dikkat:</strong> Seçilen varış tarihi için işlem seçeneği mevcut değil. Lütfen daha ileri bir tarih seçiniz.
                                </p>
                              </div>
                            )}
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
                      <h4 className="font-medium text-blue-900 mb-2">{t("prerequisites.confirm.title")}</h4>
                      <div className="space-y-3">
                        <label className="flex items-start">
                          <input 
                            type="checkbox" 
                            className="mr-3 mt-1" 
                            checked={prerequisites.tourismBusiness}
                            onChange={(e) => setPrerequisites({...prerequisites, tourismBusiness: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">{t("prerequisites.tourism.business")}</span>
                        </label>
                        <label className="flex items-start">
                          <input 
                            type="checkbox" 
                            className="mr-3 mt-1" 
                            checked={prerequisites.financialProof}
                            onChange={(e) => setPrerequisites({...prerequisites, financialProof: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">{t("prerequisites.financial.proof")}</span>
                        </label>
                        <label className="flex items-start">
                          <input 
                            type="checkbox" 
                            className="mr-3 mt-1" 
                            checked={prerequisites.supportingDocuments}
                            onChange={(e) => setPrerequisites({...prerequisites, supportingDocuments: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">{t("prerequisites.supporting.documents")}</span>
                        </label>
                        <label className="flex items-start">
                          <input 
                            type="checkbox" 
                            className="mr-3 mt-1" 
                            checked={prerequisites.passportValidity}
                            onChange={(e) => setPrerequisites({...prerequisites, passportValidity: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800">{t("prerequisites.passport.validity")}</span>
                        </label>
                        <label className="flex items-start">
                          <input 
                            type="checkbox" 
                            className="mr-3 mt-1" 
                            checked={prerequisites.allRequirements}
                            onChange={(e) => setPrerequisites({...prerequisites, allRequirements: e.target.checked})}
                          />
                          <span className="text-sm text-blue-800 font-medium">{t("prerequisites.all.requirements")}</span>
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
