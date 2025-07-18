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

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  passportIssueDate: z.string().min(1, "Passport issue date is required"),
  passportExpiryDate: z.string().min(1, "Passport expiry date is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  address: z.string().min(1, "Address is required"),
  arrivalDate: z.string().min(1, "Arrival date is required"),
  processingType: z.string().min(1, "Processing type is required"),
  documentType: z.string().min(1, "Document type is required"),
  supportingDocumentNumber: z.string().optional(),
  supportingDocumentStartDate: z.string().optional(),
  supportingDocumentEndDate: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const processingTypes = [
  { value: "standard", label: "Standard Processing (5-7 days)", price: 25 },
  { value: "fast", label: "Fast Processing (1-3 days)", price: 75 },
  { value: "express", label: "Express Processing (24 hours)", price: 175 },
  { value: "urgent", label: "Urgent Processing (4 hours)", price: 295 },
];

export function VisaForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [hasSupportingDocument, setHasSupportingDocument] = useState<boolean | null>(null);
  const [supportingDocumentDetails, setSupportingDocumentDetails] = useState<any>(null);
  const [documentProcessingType, setDocumentProcessingType] = useState("");
  const [isSupportingDocumentValid, setIsSupportingDocumentValid] = useState(false);
  // Removed paymentData state - now using direct redirects
  const [showRetry, setShowRetry] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
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
        supportingDocumentNumber: data.supportingDocumentNumber || null,
        supportingDocumentStartDate: data.supportingDocumentStartDate || null,
        supportingDocumentEndDate: data.supportingDocumentEndDate || null,
      });
      const applicationData = await applicationResponse.json();
      
      // Then create payment
      const paymentResponse = await apiRequest("POST", "/api/payment/create", {
        amount: calculateTotal(),
        currency: "USD",
        orderId: applicationData.applicationNumber,
        description: `Turkey E-Visa Application - ${applicationData.applicationNumber}`,
        customerEmail: data.email,
        customerName: `${data.firstName} ${data.lastName}`
      });
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.success && paymentData.paymentUrl) {
        // GPay checkout page only accepts GET method
        // Direct URL redirect using GET
        setCurrentOrderId(applicationData.applicationNumber);
        
        // Try direct redirect first
        try {
          window.location.href = paymentData.paymentUrl;
        } catch (error) {
          // If direct redirect fails, show retry component
          setShowRetry(true);
        }
      } else {
        throw new Error(paymentData.error || "Payment initialization failed");
      }
      
      return applicationData;
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted",
        description: `Your application number is ${data.applicationNumber}. Redirecting to payment...`,
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

  const calculateTotal = () => {
    const baseFee = 69; // E-Visa Application Fee is always $69
    let processingFee = 0;
    let documentFee = 0;
    
    if (hasSupportingDocument === true && documentProcessingType) {
      // Document PDF fees (supporting document processing)
      const documentProcessingTypes = [
        { value: "slow", price: 50 },
        { value: "standard", price: 115 },
        { value: "fast", price: 165 },
        { value: "urgent_24", price: 280 },
        { value: "urgent_12", price: 330 },
        { value: "urgent_4", price: 410 },
        { value: "urgent_1", price: 645 }
      ];
      
      const selectedProcessing = documentProcessingTypes.find(p => p.value === documentProcessingType);
      documentFee = selectedProcessing?.price || 0;
    } else {
      // Standard e-visa processing fees (when no supporting document)
      const selectedProcessingType = form.watch("processingType") || "standard";
      processingFee = processingTypes.find(p => p.value === selectedProcessingType)?.price || 25;
    }
    
    return baseFee + documentFee + processingFee;
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
        // Redirect to insurance for non-eligible countries
        window.location.href = "/insurance";
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
        // Redirect to insurance for users without supporting documents
        window.location.href = "/insurance";
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
          title: "Prerequisites Required",
          description: "Please confirm all prerequisites before proceeding",
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
          title: "First Name Required",
          description: "Please enter your first name",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.lastName.trim()) {
        toast({
          title: "Last Name Required", 
          description: "Please enter your last name",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.email.trim()) {
        toast({
          title: "Email Required",
          description: "Please enter your email address",
          variant: "destructive",
        });
        return;
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email Format",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.phone.trim()) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.passportNumber.trim()) {
        toast({
          title: "Passport Number Required",
          description: "Please enter your passport number",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.dateOfBirth) {
        toast({
          title: "Date of Birth Required",
          description: "Please enter your date of birth",
          variant: "destructive",
        });
        return;
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
      { number: 1, title: "Choice of Nationality" },
      { number: 2, title: "Supporting Document Check" },
      { number: 3, title: "Arrival Information" },
    ];
    
    if (selectedCountry?.isEligible && hasSupportingDocument === true) {
      return [
        ...baseSteps,
        { number: 4, title: "Prerequisites" },
        { number: 5, title: "Personal Information" },
        { number: 6, title: "Payment" },
      ];
    } else {
      return [
        ...baseSteps,
        { number: 4, title: "Personal Information" },
        { number: 5, title: "Payment" },
      ];
    }
  };
  
  const steps = getDynamicSteps();
  const totalSteps = steps.length;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New E-Visa Application</CardTitle>
          
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
                  <h3 className="text-lg font-semibold mb-4">Step 1: Country/Region Selection</h3>
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
                  <h3 className="text-lg font-semibold mb-4">Step 2: Supporting Document Check</h3>
                  <SupportingDocumentCheck
                    onHasSupportingDocument={setHasSupportingDocument}
                    onDocumentDetailsChange={setSupportingDocumentDetails}
                    onValidationChange={setIsSupportingDocumentValid}
                  />
                </div>
              )}

              {/* Step 3: Travel Information */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Step 3: Travel Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="arrivalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arrival Date in Turkey *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                            <SelectItem value="slow">Slow Processing (7 days) - $50</SelectItem>
                            <SelectItem value="standard">Standard Processing (4 days) - $115</SelectItem>
                            <SelectItem value="fast">Fast Processing (2 days) - $165</SelectItem>
                            <SelectItem value="urgent_24">Urgent Processing (24 hours) - $280</SelectItem>
                            <SelectItem value="urgent_12">Urgent Processing (12 hours) - $330</SelectItem>
                            <SelectItem value="urgent_4">Urgent Processing (4 hours) - $410</SelectItem>
                            <SelectItem value="urgent_1">Urgent Processing (1 hour) - $645</SelectItem>
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
                              <p className="font-bold">• Total Additional Cost: ${(
                                documentProcessingType === "slow" ? 50 :
                                documentProcessingType === "standard" ? 115 :
                                documentProcessingType === "fast" ? 165 :
                                documentProcessingType === "urgent_24" ? 280 :
                                documentProcessingType === "urgent_12" ? 330 :
                                documentProcessingType === "urgent_4" ? 410 :
                                documentProcessingType === "urgent_1" ? 645 : 0
                              ) + 69}</p>
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
                  <h3 className="text-lg font-semibold mb-4">Step 4: Prerequisites</h3>
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
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
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
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
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
                          <FormLabel>Date of Birth *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>Passport Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="A1234567" {...field} />
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
                          <FormLabel>Passport Issue Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>Passport Expiry Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 555-123-4567" {...field} />
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
                          <FormLabel>Place of Birth *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., New York, USA" {...field} />
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
                          <FormLabel>Mother's Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Mother's full name" {...field} />
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
                          <FormLabel>Father's Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Father's full name" {...field} />
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
                            <FormLabel>Full Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="Complete address with street, city, country" {...field} />
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
                              <FormLabel>Supporting Document Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Document number" {...field} />
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
                                <Input type="date" {...field} />
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
                                <Input type="date" {...field} />
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
                  <h3 className="text-lg font-semibold mb-4">Payment</h3>
                  
                  <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>E-Visa Application Fee</span>
                        <span>$69.00</span>
                      </div>
                      {hasSupportingDocument === true && supportingDocumentDetails?.processingType && (
                        <div className="flex justify-between">
                          <span>PDF Document Fee</span>
                          <span>${(() => {
                            const documentProcessingTypes = [
                              { value: "slow", price: 50 },
                              { value: "standard", price: 115 },
                              { value: "fast", price: 165 },
                              { value: "urgent_24", price: 280 },
                              { value: "urgent_12", price: 330 },
                              { value: "urgent_4", price: 410 },
                              { value: "urgent_1", price: 645 }
                            ];
                            return documentProcessingTypes.find(p => p.value === supportingDocumentDetails.processingType)?.price || 0;
                          })()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span>${(() => {
                          if (hasSupportingDocument === true) {
                            return 0; // No separate processing fee for supporting documents
                          } else {
                            const processingType = form.watch("processingType") || "standard";
                            const selectedProcessing = processingTypes.find(p => p.value === processingType);
                            return selectedProcessing?.price || 25;
                          }
                        })()}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount</span>
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
                      <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      You will be redirected to our secure payment partner (GPay) to complete your payment. 
                      You will only need to enter your card details once on their secure platform.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              {currentStep === totalSteps && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span>E-Visa Application Fee:</span>
                      <span>$69.00</span>
                    </div>
                    {hasSupportingDocument === true && supportingDocumentDetails?.processingType && (
                      <div className="flex justify-between">
                        <span>PDF Document Fee:</span>
                        <span>${(() => {
                          const documentProcessingTypes = [
                            { value: "slow", price: 50 },
                            { value: "standard", price: 115 },
                            { value: "fast", price: 165 },
                            { value: "urgent_24", price: 280 },
                            { value: "urgent_12", price: 330 },
                            { value: "urgent_4", price: 410 },
                            { value: "urgent_1", price: 645 }
                          ];
                          return documentProcessingTypes.find(p => p.value === supportingDocumentDetails.processingType)?.price || 0;
                        })()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>${(() => {
                        if (hasSupportingDocument === true) {
                          return 0; // No separate processing fee for supporting documents
                        } else {
                          const processingType = form.watch("processingType") || "standard";
                          const selectedProcessing = processingTypes.find(p => p.value === processingType);
                          return selectedProcessing?.price || 25;
                        }
                      })()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total:</span>
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
                    Previous
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNextStep} className="order-1 sm:order-2 sm:ml-auto bg-primary hover:bg-primary/90 text-white">
                    Next Step
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
                          title: "Form Validation Error",
                          description: "Please fill in all required fields correctly",
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
                      {createApplicationMutation.isPending ? "Processing..." : "Submit Application & Pay $"}
                    </span>
                    <span className="sm:hidden">
                      {createApplicationMutation.isPending ? "Processing..." : "Pay $"}
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
