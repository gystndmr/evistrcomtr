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
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  arrivalDate: z.string().min(1, "Arrival date is required"),
  processingType: z.string().min(1, "Processing type is required"),
  documentType: z.string().min(1, "Document type is required"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const processingTypes = [
  { value: "standard", label: "Standard Processing (5-7 days)", price: 0 },
  { value: "fast", label: "Fast Processing (1-3 days)", price: 50 },
  { value: "express", label: "Express Processing (24 hours)", price: 150 },
  { value: "urgent", label: "Urgent Processing (4 hours)", price: 270 },
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
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      passportNumber: "",
      dateOfBirth: "",
      arrivalDate: "",
      processingType: "standard",
      documentType: "",
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const response = await apiRequest("POST", "/api/applications", {
        ...data,
        countryId: selectedCountry?.id,
        totalAmount: calculateTotal(),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted",
        description: `Your application number is ${data.applicationNumber}`,
      });
      // TODO: Redirect to payment or success page
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
    const baseFee = selectedCountry?.visaFee ? parseFloat(selectedCountry.visaFee) : 60;
    const processingFee = processingTypes.find(p => p.value === form.watch("processingType"))?.price || 0;
    return baseFee + processingFee;
  };

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);
    // Reset supporting document state when country changes
    setHasSupportingDocument(null);
    setSupportingDocumentDetails(null);
  };

  const handleNextStep = () => {
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
        // Will be redirected by the component
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New E-Visa Application</CardTitle>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
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
                <span className={`ml-2 font-medium ${
                  currentStep >= step.number ? "text-primary" : "text-neutral-400"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="flex-1 border-t border-neutral-300 mx-4" />
                )}
              </div>
            ))}
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
                  />
                </div>
              )}

              {/* Step 3: Travel Information */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Step 2: Travel Information</h3>
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
                                  {type.label} {type.price > 0 && `(+$${type.price})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                          <input type="checkbox" className="mr-2" required />
                          <span className="text-sm text-blue-800">You have an ordinary passport (not diplomatic or service passport)</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" required />
                          <span className="text-sm text-blue-800">Your passport is valid for at least 6 months</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" required />
                          <span className="text-sm text-blue-800">You will enter Turkey within 3 months of visa issuance</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" required />
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
                        <p>• Visa fee: ${selectedCountry?.visaFee || '60'}</p>
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
                        <span>${selectedCountry?.visaFee || "60.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span>${processingTypes.find(p => p.value === form.watch("processingType"))?.price || 0}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount</span>
                          <span>${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                
                {currentStep < 4 ? (
                  <Button type="button" onClick={handleNextStep} className="ml-auto">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="ml-auto bg-secondary hover:bg-secondary/90"
                    disabled={createApplicationMutation.isPending}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {createApplicationMutation.isPending ? "Processing..." : "Submit Application & Pay"}
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
    </div>
  );
}
