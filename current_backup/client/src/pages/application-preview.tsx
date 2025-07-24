import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, FileText, Calendar, MapPin, User, CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface ApplicationData {
  countryId: number;
  documentType: string;
  supportingDocument: string;
  supportingDocumentNumber: string;
  supportingDocumentStartDate: string;
  supportingDocumentEndDate: string;
  arrivalDate: string;
  processingType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  motherName: string;
  fatherName: string;
  address: string;
  country?: any;
}

export default function ApplicationPreview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('visaApplicationData');
    if (savedData) {
      setApplicationData(JSON.parse(savedData));
    } else {
      setLocation('/application');
    }
  }, [setLocation]);

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
    staleTime: 5 * 60 * 1000,
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!applicationData) throw new Error("No application data");
      
      const response = await apiRequest("/api/applications", {
        method: "POST",
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }

      return data;
    },
    onSuccess: (data) => {
      localStorage.removeItem('visaApplicationData');
      toast({
        title: "Application Submitted",
        description: `Your application number is ${data.applicationNumber}`,
        duration: 5000,
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

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const country = (countries as any[]).find((c: any) => c.id === applicationData.countryId);
  
  const getProcessingFee = () => {
    if (applicationData.supportingDocument && applicationData.supportingDocument !== "none") {
      return 195; // PDF Document Fee includes processing
    }
    
    switch (applicationData.processingType) {
      case "standard": return 25;
      case "fast": return 75;
      case "express": return 175;
      case "urgent": return 295;
      default: return 25;
    }
  };

  const visaFee = 25;
  const processingFee = getProcessingFee();
  const totalAmount = visaFee + processingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Preview</h1>
            <p className="text-gray-600">Please review your information before proceeding to payment</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          
          {/* Personal Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/application')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">First Name:</span>
                <span className="ml-2 text-gray-900">{applicationData.firstName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Name:</span>
                <span className="ml-2 text-gray-900">{applicationData.lastName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{applicationData.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="ml-2 text-gray-900">{applicationData.phone}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Passport Number:</span>
                <span className="ml-2 text-gray-900">{applicationData.passportNumber}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date of Birth:</span>
                <span className="ml-2 text-gray-900">{applicationData.dateOfBirth}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Place of Birth:</span>
                <span className="ml-2 text-gray-900">{applicationData.placeOfBirth}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Mother's Name:</span>
                <span className="ml-2 text-gray-900">{applicationData.motherName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Father's Name:</span>
                <span className="ml-2 text-gray-900">{applicationData.fatherName}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="ml-2 text-gray-900">{applicationData.address}</span>
              </div>
            </div>
          </Card>

          {/* Travel Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Travel Information</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/application')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Country:</span>
                <span className="ml-2 text-gray-900">{country?.name || 'Unknown'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Document Type:</span>
                <span className="ml-2 text-gray-900">{applicationData.documentType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Arrival Date:</span>
                <span className="ml-2 text-gray-900">{applicationData.arrivalDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Processing Type:</span>
                <span className="ml-2 text-gray-900 capitalize">{applicationData.processingType}</span>
              </div>
              {applicationData.supportingDocument && applicationData.supportingDocument !== "none" && (
                <>
                  <div>
                    <span className="font-medium text-gray-700">Supporting Document:</span>
                    <span className="ml-2 text-gray-900">{applicationData.supportingDocument}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Document Number:</span>
                    <span className="ml-2 text-gray-900">{applicationData.supportingDocumentNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Document Start Date:</span>
                    <span className="ml-2 text-gray-900">{applicationData.supportingDocumentStartDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Document End Date:</span>
                    <span className="ml-2 text-gray-900">{applicationData.supportingDocumentEndDate}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Payment Summary */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Visa Fee:</span>
                <span className="text-gray-900">${visaFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Processing Fee ({applicationData.processingType}):</span>
                <span className="text-gray-900">${processingFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-blue-600 text-lg">${totalAmount}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/application')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <Button
              onClick={() => submitApplicationMutation.mutate()}
              disabled={submitApplicationMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitApplicationMutation.isPending ? "Processing..." : `Proceed to Payment ($${totalAmount})`}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}