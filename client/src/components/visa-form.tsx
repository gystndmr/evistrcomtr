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
// PaymentForm removed - now using direct redirects
import { PaymentRetry } from "./payment-retry";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, CreditCard, CheckCircle } from "lucide-react";
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


// Supporting document processing types with minDays
// Types for prerequisites
interface PrerequisiteItem {
  key: keyof typeof defaultPrerequisites;
  textKey: string;
}

const defaultPrerequisites = {
  tourismBusiness: false,
  financialProof: false,
  financialProofDaily: false,
  financialProofBorder: false,
  supportingDocuments: false,
  passportValidity: false,
  passportSixMonths: false,
  passportThreeMonthsAfterEvisa: false,
  thyPegasusTicket: false,
  ageRequirement: false,
  egyptAirlines: false,
  egyptAgeOrDocs: false,
  airTravelOnly: false,
  allRequirements: false,
};

// Country-specific prerequisites definitions
const countryPrerequisites: Record<string, PrerequisiteItem[]> = {
  'LBY': [ // Libya
    { key: 'passportValidity', textKey: 'prerequisites.passport.validity' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'LY': [ // Libya (alternative code)
    { key: 'passportValidity', textKey: 'prerequisites.passport.validity' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'SEN': [ // Senegal
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'thyPegasusTicket', textKey: 'prerequisites.thy.pegasus.ticket' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'SLB': [ // Solomon Islands
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'passportValidity', textKey: 'prerequisites.passport.validity' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'VUT': [ // Vanuatu
    { key: 'passportValidity', textKey: 'prerequisites.passport.validity' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'DZA': [ // Algeria
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'ageRequirement', textKey: 'prerequisites.age.requirement' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'PSE': [ // Palestine
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'thyPegasusTicket', textKey: 'prerequisites.thy.pegasus.ticket' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'financialProofDaily', textKey: 'prerequisites.financial.proof.daily' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'BTN': [ // Bhutan
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'passportValidity', textKey: 'prerequisites.passport.validity' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'EGY': [ // Egypt
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'egyptAirlines', textKey: 'prerequisites.egypt.airlines' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'egyptAgeOrDocs', textKey: 'prerequisites.egypt.age.or.docs' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'YEM': [ // Yemen
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'thyPegasusTicket', textKey: 'prerequisites.thy.pegasus.ticket' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'IRQ': [ // Iraq
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'financialProofBorder', textKey: 'prerequisites.financial.proof.border' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'passportThreeMonthsAfterEvisa', textKey: 'prerequisites.passport.three.months.after.evisa' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'GNQ': [ // Equatorial Guinea
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'thyPegasusTicket', textKey: 'prerequisites.thy.pegasus.ticket' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'TWN': [ // Taiwan
    { key: 'passportValidity', textKey: 'prerequisites.passport.validity' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'LKA': [ // Sri Lanka
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'CPV': [ // Cape Verde
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'thyPegasusTicket', textKey: 'prerequisites.thy.pegasus.ticket' },
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'KHM': [ // Cambodia
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'FJI': [ // Fiji
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'NPL': [ // Nepal
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'passportSixMonths', textKey: 'prerequisites.passport.six.months' },
    { key: 'airTravelOnly', textKey: 'prerequisites.air.travel.only' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ],
  'default': [ // Default for all other countries
    { key: 'tourismBusiness', textKey: 'prerequisites.tourism.business' },
    { key: 'financialProof', textKey: 'prerequisites.financial.proof' },
    { key: 'supportingDocuments', textKey: 'prerequisites.supporting.documents' },
    { key: 'passportValidity', textKey: 'prerequisites.passport.validity' },
    { key: 'allRequirements', textKey: 'prerequisites.all.requirements' }
  ]
};

// Helper function to get prerequisites for a country
const getCountryPrerequisites = (countryCode: string): PrerequisiteItem[] => {
  return countryPrerequisites[countryCode] || countryPrerequisites['default'];
};

// Processing types for all applications
const supportingDocProcessingTypes = [
  { value: "slow", label: "Ready in 7 days", price: 90, minDays: 7 },
  { value: "standard", label: "Ready in 4 days", price: 155, minDays: 4 },
  { value: "fast", label: "Ready in 2 days", price: 205, minDays: 2 },
  { value: "urgent_24", label: "Ready in 24 hours", price: 320, minDays: 1 },
  { value: "urgent_12", label: "Ready in 12 hours", price: 370, minDays: 1 },
  { value: "urgent_4", label: "Ready in 4 hours", price: 450, minDays: 1 },
  { value: "urgent_1", label: "Ready in 1 hour", price: 685, minDays: 1 },
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
  const types = supportingDocProcessingTypes;
  
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
  const [selectedDocumentType, setSelectedDocumentType] = useState(""); // No default - force user selection
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [hasSupportingDocument, setHasSupportingDocument] = useState<boolean | null>(null);
  const [supportingDocumentDetails, setSupportingDocumentDetails] = useState<any>(null);
  const [selectedSupportingDocType, setSelectedSupportingDocType] = useState("");
  const [documentProcessingType, setDocumentProcessingType] = useState("");
  const [isSupportingDocumentValid, setIsSupportingDocumentValid] = useState(false);
  const [availableSupportingDocTypes, setAvailableSupportingDocTypes] = useState(supportingDocProcessingTypes);
  // Removed paymentData state - now using direct redirects
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string>("");
  const [prerequisites, setPrerequisites] = useState(defaultPrerequisites);
  
  // Egypt DOB local state to prevent dropdown closing
  const [egyptLocalDay, setEgyptLocalDay] = useState('');
  const [egyptLocalMonth, setEgyptLocalMonth] = useState('');
  const [egyptLocalYear, setEgyptLocalYear] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
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
      supportingDocumentNumber: "", // Populated from dynamic forms in travel info step
      supportingDocumentStartDate: "", // Populated from dynamic forms in travel info step
      supportingDocumentEndDate: "", // Populated from dynamic forms in travel info step
    },
  });

  // Watch arrival date changes and update available processing types
  const watchedArrivalDate = form.watch("arrivalDate");
  
  useEffect(() => {
    if (watchedArrivalDate) {
      // Update available processing types based on arrival date
      const standardTypes = getAvailableProcessingTypes(watchedArrivalDate, false);
      const supportingTypes = getAvailableProcessingTypes(watchedArrivalDate, true);
      
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
        const newValue = supportingTypes.length > 0 ? supportingTypes[0].value : "";
        setDocumentProcessingType(newValue);
        // FIXED: Also update form field for validation
        form.setValue("processingType", newValue);
        toast({
          title: "İşlem Türü Güncellendi", 
          description: "Varış tarihinize göre işlem türü otomatik olarak ayarlandı.",
          duration: 3000,
        });
      }
    } else {
      // If no arrival date, show all options
      setAvailableSupportingDocTypes(supportingDocProcessingTypes);
    }
  }, [watchedArrivalDate, form, documentProcessingType, toast]);

  // Sync documentProcessingType to form field for validation
  useEffect(() => {
    if (documentProcessingType) {
      form.setValue("processingType", documentProcessingType);
    }
  }, [documentProcessingType, form]);

  // Sync supporting document details to form fields when they change
  useEffect(() => {
    if (supportingDocumentDetails) {
      // Map dynamic form data to main form fields for backend submission
      form.setValue("supportingDocumentNumber", supportingDocumentDetails.documentNumber || "");
      form.setValue("supportingDocumentStartDate", supportingDocumentDetails.startDate || "");
      form.setValue("supportingDocumentEndDate", 
        supportingDocumentDetails.endDate === "unlimited" ? "" : supportingDocumentDetails.endDate || ""
      );
    }
  }, [supportingDocumentDetails, form]);

  const createApplicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      console.log('🚨 [CRITICAL] Starting application creation with data:', data);
      console.log('🚨 [CRITICAL] Selected country:', selectedCountry);
      console.log('🚨 [CRITICAL] Has supporting document:', hasSupportingDocument);
      console.log('🚨 [CRITICAL] Document processing type:', documentProcessingType);
      
      // Ensure we have the correct processing type based on supporting document status
      const finalProcessingType = hasSupportingDocument === true ? documentProcessingType : data.processingType;
      
      // First create the application - USE CORRECT PROCESSING TYPE
      const applicationResponse = await apiRequest("POST", "/api/applications", {
        ...data,
        processingType: finalProcessingType, // ✅ FIXED: Use correct processing type
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
      console.log('✅ [SUCCESS] Application created successfully:', data);
      console.log('✅ [SUCCESS] Application number:', data.applicationNumber);
      
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
      console.error('🚨 [CRITICAL ERROR] Application/Payment failed:', error);
      console.error('🚨 [CRITICAL ERROR] Error details:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      
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
              form.handleSubmit((validatedData) => {
                createApplicationMutation.mutate(validatedData);
              })();
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
    const eVisaFee = 69; // Base e-visa application fee
    
    // Priority 1: Use documentProcessingType if available (supporting documents)
    if (documentProcessingType) {
      const processingFee = supportingDocProcessingTypes.find(type => type.value === documentProcessingType)?.price || 0;
      return processingFee + eVisaFee;
    }
    
    // Priority 2: Use processingType from form (standard applications)
    const processingType = form.getValues("processingType");
    if (processingType) {
      const processingFee = supportingDocProcessingTypes.find(type => type.value === processingType)?.price || 0;
      return processingFee + eVisaFee;
    }
    
    // Fallback: just e-visa fee
    return eVisaFee;
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Get effective scenario for a country (handles special cases like Egypt age-based rules)
  const getEffectiveScenario = (country: Country | null, dateOfBirth?: string): number => {
    if (!country) return 3; // Default scenario
    
    // Egypt special case: age-based scenario determination
    if (country.code === 'EGY' && dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      // Age 15-45: Scenario 2 (supporting docs required)
      // Under 15 or over 45: Scenario 1 (no supporting docs)
      return (age >= 15 && age <= 45) ? 2 : 1;
    }
    
    return country.scenario || 3;
  };

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);
    // Reset supporting document state when country changes
    setHasSupportingDocument(null);
    setSupportingDocumentDetails(null);
    setDocumentProcessingType("");
    setIsSupportingDocumentValid(false);
    
    // For Scenario 1 countries (no supporting docs needed), immediately set valid state
    if (country) {
      const effectiveScenario = getEffectiveScenario(country);
      if (effectiveScenario === 1) {
        setHasSupportingDocument(false);
        setSupportingDocumentDetails(null);
        setDocumentProcessingType("");
        setIsSupportingDocumentValid(true);
      }
    }
  };

  // Update form documentType whenever selectedDocumentType changes
  useEffect(() => {
    form.setValue("documentType", selectedDocumentType);
  }, [selectedDocumentType, form]);

  // Egypt special case: Re-evaluate scenario when date of birth changes
  useEffect(() => {
    if (selectedCountry?.code === 'EGY') {
      const dob = form.getValues('dateOfBirth');
      
      // Only process COMPLETE and VALID dates (YYYY-MM-DD format)
      // Use stricter validation to prevent premature triggers
      if (dob && 
          dob.length === 10 && 
          dob.match(/^\d{4}-\d{2}-\d{2}$/) && 
          new Date(dob).toString() !== 'Invalid Date' &&
          !dob.includes('01-01')) { // Avoid default incomplete dates
        
        const effectiveScenario = getEffectiveScenario(selectedCountry, dob);
        
        if (effectiveScenario === 1) {
          // Age <15 or >45: No supporting document required
          setHasSupportingDocument(false);
          setSupportingDocumentDetails(null);
          setDocumentProcessingType("");
          setIsSupportingDocumentValid(true);
          
        } else if (effectiveScenario === 2) {
          // Age 15-45: Supporting document required
          setHasSupportingDocument(null); // Reset to force user selection
          setSupportingDocumentDetails(null);
          setDocumentProcessingType("");
          setIsSupportingDocumentValid(false);
        }
      }
    }
  }, [selectedCountry]); // Removed form.watch dependency to prevent early triggers

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
      // Handle different scenarios using effective scenario (includes Egypt age-based logic)
      const effectiveScenario = getEffectiveScenario(selectedCountry, form.getValues("dateOfBirth"));
      
      if (effectiveScenario === 4) {
        // Scenario 4: Not eligible for e-visa
        toast({
          title: "E-Vize Uygun Değil",
          description: "Seçtiğiniz ülke uyruklarına e‑Vize düzenlenememektedir. Vize başvurusunda bulunmak üzere en yakın temsilciliğe gidebilirsiniz.",
          duration: 8000,
          variant: "destructive",
        });
        return;
      }
      
      if (effectiveScenario === 3) {
        // Scenario 3: E-visa exempt + travel insurance mandatory
        toast({
          title: t("form.warning.visa.exempt.insurance.title"),
          description: t("form.warning.visa.exempt.insurance.description"),
          variant: "default", // Blue/green variant instead of destructive (red)
          className: "border-blue-500 bg-blue-50 text-blue-900",
        });
        return;
      }

      // Egypt special case: If Egypt is selected but no dateOfBirth yet, go to Step 2
      const dob = form.getValues('dateOfBirth');
      if (selectedCountry?.code === 'EGY' && !dob) {
        setCurrentStep(2);
        return;
      }

      if (effectiveScenario === 1) {
        // Scenario 1: E-visa eligible + NO supporting document required
        // Go to Step 2 to show "No supporting documents required" message
        setCurrentStep(2);
        return;
      }
    }
    
    // Step 2: Supporting Document Check
    if (currentStep === 2) {
      // Egypt special case: If Egypt is selected but no dateOfBirth yet, require DOB first
      const dob = form.getValues('dateOfBirth');
      if (selectedCountry?.code === 'EGY' && !dob) {
        toast({
          title: "Date of Birth Required",
          description: "Please enter your date of birth to determine document requirements",
          variant: "destructive",
        });
        return;
      }

      // Handle supporting document logic based on effective scenario (includes Egypt age-based logic)
      const effectiveScenario = getEffectiveScenario(selectedCountry, dob);
      
      if (effectiveScenario === 1) {
        // Scenario 1: E-visa eligible + NO supporting document required
        // Continue to next step (arrival information) normally - don't skip steps
        setCurrentStep(currentStep + 1);
        return;
      }
      
      if (effectiveScenario === 2) {
        // Scenario 2: E-visa eligible + supporting document required
        if (hasSupportingDocument === null) {
          toast({
            title: "Required Selection",
            description: "Please indicate if you have supporting documents",
            variant: "destructive",
          });
          return;
        }
        if (hasSupportingDocument === false) {
          // Show consulate warning and stop processing when no supporting document
          toast({
            title: t("form.warning.supporting.document.required.title"),
            description: t("form.warning.supporting.document.required.description"),
            duration: 8000,
            variant: "destructive",
          });
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
    }
    
    // Step 3: Arrival Information
    if (currentStep === 3) {
      const arrivalDate = form.getValues("arrivalDate");
      
      // Check if arrival date exists and is properly formatted
      if (!arrivalDate || !arrivalDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        toast({
          title: "Arrival Date Required",
          description: "Please select a complete arrival date (day, month, year)",
          variant: "destructive",
        });
        return;
      }
      
      // Check if all parts of the date are valid (no 0000 placeholders)
      const dateParts = arrivalDate.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);
      
      // Check for incomplete date selection (placeholder values)
      if (year === 0 || month === 0 || day === 0 || 
          arrivalDate === "0000-00-01" || 
          arrivalDate === "0000-01-01" ||
          year < 2025 || month < 1 || month > 12 || day < 1 || day > 31) {
        toast({
          title: "Complete Date Selection Required",
          description: "Please select day, month AND year for your arrival date",
          variant: "destructive",
        });
        return;
      }
      
      // Check if arrival date is in the future
      const today = new Date();
      const selectedDate = new Date(year, month - 1, day);
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast({
          title: "Invalid Arrival Date",
          description: "Arrival date must be today or in the future",
          variant: "destructive",
        });
        return;
      }
      
      // Check if processing fee is selected (REQUIRED for all cases when complete date is selected)
      const currentProcessingType = form.getValues("processingType");
      if (!currentProcessingType) {
        toast({
          title: "Processing Fee Required",
          description: "Please select a processing fee option after completing date selection",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Step 4: Prerequisites (only if supporting document exists)
    if (currentStep === 4 && selectedCountry?.isEligible && hasSupportingDocument === true) {
      const countryCode = selectedCountry?.code || '';
      const requiredPrerequisites = getCountryPrerequisites(countryCode);
      
      const allPrerequisitesMet = requiredPrerequisites.every(req => 
        prerequisites[req.key] === true
      );
                                  
      if (!allPrerequisitesMet) {
        toast({
          title: "Prerequisites Required",
          description: "Please confirm all prerequisites are met to continue",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Step 5: Personal Information (with supporting document) OR Step 4 (without)
    const personalInfoStep = (selectedCountry?.isEligible && hasSupportingDocument === true) ? 5 : 4;
    if (currentStep === personalInfoStep) {
      const formData = form.getValues();
      console.log("🔍 Personal Info Step Validation - Form Data:", formData);
      console.log("🔍 Current Step:", currentStep, "Personal Info Step:", personalInfoStep);
      
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
      
      // Date of birth validation - Egypt special case handled
      if (!formData.dateOfBirth) {
        // For Egypt, date of birth might be entered in Step 2 for age-based scenario determination
        if (selectedCountry?.code === 'EGY') {
          toast({
            title: "Date of Birth Required",
            description: "Please enter your date of birth to determine document requirements",
            variant: "destructive",
          });
        } else {
          toast({
            title: t('form.error.birth.date'),
            description: t('form.error.birth.date.desc'),
            variant: "destructive",
          });
        }
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
      
      // Supporting document validation removed - now handled in travel information step via dynamic forms
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


  const onSubmit = (data: ApplicationFormData) => {
    createApplicationMutation.mutate(data);
  };

  const getDynamicSteps = () => {
    // Use effective scenario (includes Egypt age-based logic)
    const effectiveScenario = getEffectiveScenario(selectedCountry, form.getValues("dateOfBirth"));
    
    // For Scenario 1 (E-visa eligible, no supporting docs), skip Step 2 entirely
    if (effectiveScenario === 1) {
      return [
        { number: 1, title: t("app.step1") },
        { number: 2, title: t("app.step3") }, // Travel Information (renumbered)
        { number: 3, title: t("app.step4") }, // Personal Information (renumbered)
        { number: 4, title: t("app.step5") }, // Review & Payment (renumbered)
      ];
    }
    
    // For Scenario 2 (E-visa eligible, supporting docs required)
    if (effectiveScenario === 2) {
      const baseSteps = [
        { number: 1, title: t("app.step1") },
        { number: 2, title: t("app.step2") },
        { number: 3, title: t("app.step3") },
      ];
      
      if (hasSupportingDocument === true) {
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
    }
    
    // Default steps (fallback for scenarios 3, 4 or no country selected)
    return [
      { number: 1, title: t("app.step1") },
      { number: 2, title: t("app.step2") },
      { number: 3, title: t("app.step3") },
      { number: 4, title: t("app.step4") },
      { number: 5, title: t("app.step5") },
    ];
  };

  // Helper function to determine what content should be shown for current step
  const getCurrentStepContent = () => {
    const dob = form.getValues('dateOfBirth');
    
    // Egypt special case: Handle DOB collection and age-based routing
    if (selectedCountry?.code === 'EGY') {
      // If no DOB yet, show supporting step for DOB collection
      if (!dob && currentStep === 2) {
        return 'supporting';
      }
      
      // If DOB exists, determine scenario and route accordingly
      if (dob) {
        const egyptScenario = getEffectiveScenario(selectedCountry, dob);
        
        if (egyptScenario === 1) {
          // Age <15 or >45: No supporting docs needed, show normal scenario 1 flow
          // But allow DOB modification in step 2
          if (currentStep === 2) {
            return 'supporting'; // Still show DOB field for editing
          }
          // For step 3+, follow normal scenario 1 logic below
        } else if (egyptScenario === 2) {
          // Age 15-45: Supporting docs needed, show supporting in step 2
          if (currentStep === 2) {
            return 'supporting';
          }
          // For step 3+, follow normal scenario 2 logic below
        }
      }
    }
    
    const effectiveScenario = getEffectiveScenario(selectedCountry, dob);
    
    if (effectiveScenario === 1) {
      // Scenario 1: [Country, Travel, Personal, Payment]
      switch (currentStep) {
        case 1: return 'country';
        case 2: return 'travel';
        case 3: return 'personal';
        case 4: return 'payment';
        default: return 'country';
      }
    } else if (effectiveScenario === 2) {
      // Scenario 2: [Country, Supporting, Travel, Prerequisites?, Personal, Payment]
      if (hasSupportingDocument === true) {
        switch (currentStep) {
          case 1: return 'country';
          case 2: return 'supporting';
          case 3: return 'travel';
          case 4: return 'prerequisites';
          case 5: return 'personal';
          case 6: return 'payment';
          default: return 'country';
        }
      } else {
        switch (currentStep) {
          case 1: return 'country';
          case 2: return 'supporting';
          case 3: return 'travel';
          case 4: return 'personal';
          case 5: return 'payment';
          default: return 'country';
        }
      }
    } else {
      // Default scenario: [Country, Supporting, Travel, Personal, Payment]
      switch (currentStep) {
        case 1: return 'country';
        case 2: return 'supporting';
        case 3: return 'travel';
        case 4: return 'personal';
        case 5: return 'payment';
        default: return 'country';
      }
    }
  };
  
  const steps = getDynamicSteps();
  const totalSteps = steps.length;

  // Scroll to top whenever step changes (especially important for payment step)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Extra scroll for payment step after a short delay to ensure content is loaded
    if (currentStep === totalSteps) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentStep, totalSteps]);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <Card className="mb-0">
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

        <CardContent className="pb-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Step 1: Country Selection */}
              {getCurrentStepContent() === 'country' && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t("app.step1.title")}</h3>
                  <CountrySelector
                    onCountrySelect={handleCountrySelect}
                    onDocumentTypeSelect={setSelectedDocumentType}
                    selectedCountry={selectedCountry}
                    selectedDocumentType={selectedDocumentType}
                  />
                </div>
              )}

              {/* Step 2: Supporting Document Check */}
              {getCurrentStepContent() === 'supporting' && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t("app.step2.title")}</h3>
                  
                  {/* Egypt Special Case: Date of Birth field in Step 2 - Always visible for Egypt */}
                  {selectedCountry?.code === 'EGY' && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">Required for Egypt Applications</h4>
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => {
                          // Update form only when all three parts are selected
                          const updateFormDate = (day: string, month: string, year: string) => {
                            if (day && month && year) {
                              const fullDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                              form.setValue('dateOfBirth', fullDate);
                              
                              // Trigger Egypt age determination once complete date is entered
                              if (selectedCountry?.code === 'EGY') {
                                const effectiveScenario = getEffectiveScenario(selectedCountry, fullDate);
                                
                                if (effectiveScenario === 1) {
                                  // Age <15 or >45: No supporting document required
                                  setHasSupportingDocument(false);
                                  setSupportingDocumentDetails(null);
                                  setDocumentProcessingType("");
                                  setIsSupportingDocumentValid(true);
                                  
                                } else if (effectiveScenario === 2) {
                                  // Age 15-45: Supporting document required
                                  setHasSupportingDocument(null); // Reset to force user selection
                                  setSupportingDocumentDetails(null);
                                  setDocumentProcessingType("");
                                  setIsSupportingDocumentValid(false);
                                }
                              }
                            }
                          };

                          return (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-3 gap-2">
                                  <Select
                                    value={egyptLocalDay}
                                    onValueChange={(day) => {
                                      setEgyptLocalDay(day);
                                      updateFormDate(day, egyptLocalMonth, egyptLocalYear);
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-dob-day">
                                      <SelectValue placeholder="Day" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start">
                                      {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    value={egyptLocalMonth}
                                    onValueChange={(month) => {
                                      setEgyptLocalMonth(month);
                                      updateFormDate(egyptLocalDay, month, egyptLocalYear);
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-dob-month">
                                      <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start">
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
                                    value={egyptLocalYear}
                                    onValueChange={(year) => {
                                      setEgyptLocalYear(year);
                                      updateFormDate(egyptLocalDay, egyptLocalMonth, year);
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-dob-year">
                                      <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start">
                                      {Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString()).map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Egypt Scenario 1: Show Arrival Date after DOB */}
                  {selectedCountry?.code === 'EGY' && 
                   form.getValues('dateOfBirth') && 
                   getEffectiveScenario(selectedCountry, form.getValues('dateOfBirth')) === 1 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">Continue with Travel Details</h4>
                      <FormField
                        control={form.control}
                        name="arrivalDate"
                        render={({ field }) => {
                          const today = new Date();
                          const currentYear = today.getFullYear();
                          const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
                          const currentDay = today.getDate();
                          
                          // Get currently selected values (empty if not set)
                          const selectedParts = field.value ? field.value.split('-') : [];
                          const selectedYear = selectedParts[0] ? parseInt(selectedParts[0]) : '';
                          const selectedMonth = selectedParts[1] ? parseInt(selectedParts[1]) : '';
                          const selectedDay = selectedParts[2] ? parseInt(selectedParts[2]) : '';
                          
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
                            
                            if (selectedYear === currentYear) {
                              return months.filter(month => parseInt(month.value) >= currentMonth);
                            }
                            return months;
                          };
                          
                          const getAvailableDays = () => {
                            const year = selectedYear || currentYear;
                            const month = selectedMonth || currentMonth;
                            const daysInMonth = new Date(year, month, 0).getDate();
                            const startDay = (year === currentYear && month === currentMonth) ? currentDay : 1;
                            return Array.from({ length: daysInMonth - startDay + 1 }, (_, i) => (startDay + i).toString().padStart(2, '0'));
                          };

                          return (
                            <FormItem>
                              <FormLabel>Planned Arrival Date *</FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-3 gap-2">
                                  <Select
                                    value={selectedDay ? selectedDay.toString().padStart(2, '0') : ''}
                                    onValueChange={(day) => {
                                      const year = selectedYear || currentYear;
                                      const month = selectedMonth || currentMonth;
                                      const newDate = `${year}-${month.toString().padStart(2, '0')}-${day}`;
                                      field.onChange(newDate);
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-arrival-day">
                                      <SelectValue placeholder="Day" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start">
                                      {getAvailableDays().map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    value={selectedMonth ? selectedMonth.toString().padStart(2, '0') : ''}
                                    onValueChange={(month) => {
                                      const year = selectedYear || currentYear;
                                      const day = selectedDay || currentDay;
                                      const newDate = `${year}-${month}-${day.toString().padStart(2, '0')}`;
                                      field.onChange(newDate);
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-arrival-month">
                                      <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start">
                                      {getAvailableMonths().map((m) => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Select
                                    value={selectedYear ? selectedYear.toString() : ''}
                                    onValueChange={(year) => {
                                      const month = selectedMonth || currentMonth;
                                      const day = selectedDay || currentDay;
                                      const newDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                      field.onChange(newDate);
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-arrival-year">
                                      <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start">
                                      {getAvailableYears().map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Egypt Scenario 1: Show Processing Type after Arrival Date */}
                  {selectedCountry?.code === 'EGY' && 
                   form.getValues('dateOfBirth') && 
                   form.getValues('arrivalDate') &&
                   getEffectiveScenario(selectedCountry, form.getValues('dateOfBirth')) === 1 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">Select Processing Type</h4>
                      <FormField
                        control={form.control}
                        name="processingType"
                        render={({ field }) => {
                          const availableTypes = getAvailableProcessingTypes(form.getValues('arrivalDate'), false);
                          
                          return (
                            <FormItem>
                              <FormLabel>Processing Type *</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger data-testid="select-processing-type">
                                    <SelectValue placeholder="Select processing type" />
                                  </SelectTrigger>
                                  <SelectContent position="popper" side="bottom" align="start">
                                    {availableTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label} - ${type.price}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                              
                              {availableTypes.length === 0 && (
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mt-2">
                                  <p className="text-orange-800 text-sm">
                                    <strong>Notice:</strong> No processing options available for selected arrival date. Please choose a later date.
                                  </p>
                                </div>
                              )}
                              
                              {field.value && (
                                <div className="bg-green-50 p-3 rounded-lg mt-2">
                                  <h5 className="font-medium text-green-900 mb-1">Processing Summary:</h5>
                                  <div className="text-sm text-green-800">
                                    {(() => {
                                      const selectedType = availableTypes.find(type => type.value === field.value);
                                      return (
                                        <>
                                          <p>• Selected: {selectedType?.label || field.value}</p>
                                          <p>• Processing Fee: ${selectedType?.price || 0}</p>
                                          <p>• E-Visa Fee: $69</p>
                                          <p className="font-medium">• Total: ${(selectedType?.price || 0) + 69}</p>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Conditional Supporting Document Check */}
                  {(() => {
                    const dob = form.getValues('dateOfBirth');
                    const effectiveScenario = getEffectiveScenario(selectedCountry, dob);
                    
                    // Egypt Scenario 1 (age <15 or >45): Show green message, no supporting docs needed
                    if (selectedCountry?.code === 'EGY' && effectiveScenario === 1) {
                      return (
                        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="text-sm font-semibold text-green-800">No Supporting Documents Required</h4>
                              <p className="text-sm text-green-700 mt-1">Based on your age, no supporting documents are needed for your application.</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    // Egypt Scenario 2 (age 15-45) or other countries: Show supporting document check
                    return (
                      <SupportingDocumentCheck
                        onHasSupportingDocument={setHasSupportingDocument}
                        onDocumentDetailsChange={setSupportingDocumentDetails}
                        onValidationChange={setIsSupportingDocumentValid}
                        onSupportingDocTypeChange={setSelectedSupportingDocType}
                        onProcessingTypeChange={setDocumentProcessingType}
                      />
                    );
                  })()}
                </div>
              )}

              {/* Step 3: Travel Information */}
              {getCurrentStepContent() === 'travel' && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t("app.step3.title")}</h3>
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
                        const selectedDay = selectedParts[2] ? parseInt(selectedParts[2]) : null;
                        const selectedMonth = selectedParts[1] ? parseInt(selectedParts[1]) : null;
                        const selectedYear = selectedParts[0] ? parseInt(selectedParts[0]) : null;
                        
                        // Get available days (1-31)
                        const getAvailableDays = () => {
                          return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
                        };
                        
                        // Get available months based on selected day
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
                          
                          if (!selectedDay) return months; // Show all months if no day selected
                          
                          return months.filter(m => {
                            const monthNum = parseInt(m.value);
                            const year = selectedYear || currentYear; // Use selected year or current as fallback
                            
                            // Check if the selected day exists in this month
                            const daysInMonth = new Date(year, monthNum, 0).getDate();
                            if (selectedDay > daysInMonth) {
                              return false; // Day doesn't exist in this month
                            }
                            
                            // If current year, check date restrictions
                            if (year === currentYear) {
                              if (monthNum < currentMonth) {
                                return false; // Past months not allowed
                              }
                              if (monthNum === currentMonth && selectedDay < currentDay) {
                                return false; // Past dates in current month not allowed
                              }
                            }
                            
                            return true;
                          });
                        };
                        
                        // Get available years
                        const getAvailableYears = () => {
                          return Array.from({ length: 11 }, (_, i) => (currentYear + i).toString());
                        };
                        
                        return (
                          <FormItem>
                            <FormLabel>Arrival Date in Turkey *</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                  {/* DAY - First selection */}
                                  <Select
                                    value={selectedDay ? selectedDay.toString().padStart(2, '0') : ''}
                                    onValueChange={(day) => {
                                      // Reset month and year when day changes
                                      field.onChange(`0000-00-${day.padStart(2, '0')}`);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableDays().map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  {/* MONTH - Second selection, enabled only after day */}
                                  <Select
                                    value={selectedMonth ? selectedMonth.toString().padStart(2, '0') : ''}
                                    onValueChange={(month) => {
                                      if (selectedDay) {
                                        // Reset year when month changes
                                        field.onChange(`0000-${month.padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`);
                                      }
                                    }}
                                    disabled={!selectedDay}
                                  >
                                    <SelectTrigger className={!selectedDay ? "opacity-50" : ""}>
                                      <SelectValue placeholder="Month">
                                        {selectedMonth ? 
                                          getAvailableMonths().find(m => m.value === selectedMonth.toString().padStart(2, '0'))?.label || "Month"
                                          : "Month"
                                        }
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableMonths().map((m) => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  {/* YEAR - Third selection, enabled only after day and month */}
                                  <Select
                                    value={selectedYear ? selectedYear.toString() : ''}
                                    onValueChange={(year) => {
                                      if (selectedDay && selectedMonth) {
                                        // Now we have complete date
                                        field.onChange(`${year}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`);
                                      }
                                    }}
                                    disabled={!selectedDay || !selectedMonth}
                                  >
                                    <SelectTrigger className={(!selectedDay || !selectedMonth) ? "opacity-50" : ""}>
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
                                  📅 Select day, then month, then year
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    
                    {/* Processing Type - Only show when complete date is selected */}
                    {(() => {
                      const arrivalDateValue = form.watch("arrivalDate");
                      const isCompleteDateSelected = arrivalDateValue && 
                        arrivalDateValue !== "0000-00-01" && 
                        arrivalDateValue !== "0000-01-01" && 
                        arrivalDateValue.split('-').every((part, index) => 
                          index === 0 ? parseInt(part) > 0 : parseInt(part) > 0
                        );
                      
                      if (!isCompleteDateSelected) {
                        return (
                          <div className="space-y-4 opacity-50">
                            <Label htmlFor="processingType">Processing Fee *</Label>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <p className="text-gray-600 text-sm">
                                📅 Complete date selection first (Day + Month + Year) to view processing fee options.
                              </p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          <Label htmlFor="processingType">Processing Fee *</Label>
                          <Select value={documentProcessingType} onValueChange={(value) => {
                            setDocumentProcessingType(value);
                            // Update form field for validation
                            form.setValue("processingType", value);
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select processing fee" />
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
                                      <p>• E-Visa Fee: $69</p>
                                      <p className="font-bold text-lg">• Total Amount: ${calculateTotal()}</p>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    
                  </div>
                </div>
              )}

              {/* Step 4: Prerequisites (for eligible countries with supporting docs) */}
              {getCurrentStepContent() === 'prerequisites' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("app.step4.prerequisites.title")}</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">{t("prerequisites.confirm.title")}</h4>
                      <div className="space-y-3">
                        {(() => {
                          const countryCode = selectedCountry?.code || '';
                          const requiredPrerequisites = getCountryPrerequisites(countryCode);
                          
                          return requiredPrerequisites.map((req) => (
                            <label key={req.key} className="flex items-start">
                              <input 
                                type="checkbox" 
                                className="mr-3 mt-1" 
                                checked={prerequisites[req.key] || false}
                                onChange={(e) => setPrerequisites({...prerequisites, [req.key]: e.target.checked})}
                              />
                              <span className={`text-sm text-blue-800 ${req.key === 'allRequirements' ? 'font-medium' : ''}`}>
                                {t(req.textKey)}
                              </span>
                            </label>
                          ));
                        })()}
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

              {/* Personal Details */}
              {getCurrentStepContent() === 'personal' && (
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
                  </div>
                </div>
              )}

              {/* Payment */}
              {getCurrentStepContent() === 'payment' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{hasSupportingDocument === true ? t("app.step6.title") : t("app.step5.title")}</h3>
                  

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
                    <div className="flex justify-between">
                      <span>{hasSupportingDocument === true ? t('form.payment.processing.document.fee') : t('form.payment.processing.fee')}:</span>
                      <span>${(() => {
                        // Use SAME logic as calculateTotal() function for consistency
                        // Priority 1: Use documentProcessingType if available (supporting documents)
                        if (documentProcessingType) {
                          const processingFee = supportingDocProcessingTypes.find(type => type.value === documentProcessingType)?.price || 0;
                          return processingFee.toFixed(2);
                        }
                        
                        // Priority 2: Use processingType from form (standard applications)
                        const processingType = form.getValues("processingType");
                        if (processingType) {
                          const processingFee = supportingDocProcessingTypes.find(type => type.value === processingType)?.price || 0;
                          return processingFee.toFixed(2);
                        }
                        
                        // Fallback
                        return "0.00";
                      })()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>{t('form.payment.total.amount')}:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions Checkbox - Only show on final payment step */}
              {currentStep === totalSteps && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      data-testid="terms-checkbox"
                    />
                    <span className="text-sm text-gray-700">
                      I have read and agree the{' '}
                      <a 
                        href="/privacy-policy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Privacy Policy
                      </a>
                      {' '}and{' '}
                      <a 
                        href="/terms-and-conditions" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Terms & Conditions
                      </a>
                    </span>
                  </label>
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
                  selectedCountry && getEffectiveScenario(selectedCountry) === 4 ? (
                    // Scenario 4: Not eligible for e-visa - no next step button
                    null
                  ) : selectedCountry && getEffectiveScenario(selectedCountry) === 3 ? (
                    <Button 
                      type="button" 
                      onClick={() => window.location.href = '/insurance'} 
                      className="order-1 sm:order-2 sm:ml-auto bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t('button.get.insurance')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleNextStep} className="order-1 sm:order-2 sm:ml-auto bg-primary hover:bg-primary/90 text-white">
                      {t('form.navigation.next.step')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )
                ) : (
                  <Button 
                    type="button"
                    className={`order-1 sm:order-2 sm:ml-auto text-sm sm:text-base px-4 py-2 text-white ${
                      !termsAccepted || createApplicationMutation.isPending 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    disabled={createApplicationMutation.isPending || !termsAccepted}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      console.log("🚨 PAYMENT BUTTON CLICKED!");
                      
                      // Check terms acceptance first
                      if (!termsAccepted) {
                        toast({
                          title: "Terms & Conditions Required",
                          description: "Please read and accept the Privacy Policy and Terms & Conditions before proceeding with payment.",
                          variant: "destructive",
                          duration: 5000,
                        });
                        return;
                      }
                      
                      // Manually trigger form validation
                      form.handleSubmit((validatedData) => {
                        console.log("🔍 Validated Form Data:", validatedData);
                        console.log("🔍 Current Step:", currentStep);
                        console.log("✅ Form validation passed - proceeding with payment");
                        createApplicationMutation.mutate(validatedData);
                      }, (errors) => {
                        const currentFormData = form.getValues();
                        console.log("❌ Form validation failed:", errors);
                        console.log("🔍 Current form data:", currentFormData);
                        toast({
                          title: "Form Validation Error",
                          description: "Please check all required fields are filled correctly",
                          variant: "destructive",
                        });
                      })();
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

      
      {/* Payment Retry Component */}
      {showRetry && currentOrderId && (
        <PaymentRetry
          paymentUrl={`https://getvisa.gpayprocessing.com/checkout/${currentOrderId}`}
          orderId={currentOrderId}
          onRetry={() => {
            setShowRetry(false);
            // Retry the payment creation with validated data
            form.handleSubmit((validatedData) => {
              createApplicationMutation.mutate(validatedData);
            })();
          }}
        />
      )}
    </div>
  );
}
