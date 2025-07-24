import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Shield, Calendar, MapPin, User, CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import type { InsuranceProduct } from "@shared/schema";

interface InsuranceApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelDate: string;
  returnDate: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  insuranceProductId: number;
  selectedProduct?: InsuranceProduct;
}

export default function InsurancePreview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [applicationData, setApplicationData] = useState<InsuranceApplicationData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('insuranceApplicationData');
    if (savedData) {
      setApplicationData(JSON.parse(savedData));
    } else {
      setLocation('/insurance');
    }
  }, [setLocation]);

  const { data: products = [] } = useQuery({
    queryKey: ["/api/insurance/products"],
    staleTime: 5 * 60 * 1000,
  }) as { data: InsuranceProduct[], isLoading: boolean };

  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      if (!applicationData) throw new Error("No application data");
      
      const travelDate = new Date(applicationData.travelDate);
      const returnDate = new Date(applicationData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - travelDate.getTime());
      const tripDurationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const countryFromUrl = new URLSearchParams(window.location.search).get('country') || '';
      
      const submitData = {
        ...applicationData,
        tripDurationDays,
        countryOfOrigin: countryFromUrl || "Direct Application"
      };

      const response = await apiRequest("/api/insurance/apply", {
        method: "POST",
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }

      return data;
    },
    onSuccess: (data) => {
      localStorage.removeItem('insuranceApplicationData');
      toast({
        title: "Application Submitted",
        description: `Your insurance application number is ${data.applicationNumber}`,
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

  const selectedProduct = products.find(p => p.id === applicationData.insuranceProductId);
  const travelDate = new Date(applicationData.travelDate);
  const returnDate = new Date(applicationData.returnDate);
  const diffTime = Math.abs(returnDate.getTime() - travelDate.getTime());
  const tripDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Application Preview</h1>
            <p className="text-gray-600">Please review your information before proceeding to payment</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          
          {/* Insurance Plan */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Selected Insurance Plan</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/insurance')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Change Plan
              </Button>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-blue-900">
                    {selectedProduct?.name.replace(" Coverage", "") || "Unknown Plan"}
                  </h4>
                  <p className="text-blue-700 text-sm">Turkey Travel Insurance</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ${selectedProduct?.price || 0}
                  </div>
                  <div className="text-blue-700 text-sm">Total Cost</div>
                </div>
              </div>
            </div>
          </Card>

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
                onClick={() => setLocation('/insurance')}
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
                <span className="font-medium text-gray-700">Nationality:</span>
                <span className="ml-2 text-gray-900">{applicationData.nationality || "Not specified"}</span>
              </div>
            </div>
          </Card>

          {/* Travel Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Travel Information</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/insurance')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Travel Date:</span>
                <span className="ml-2 text-gray-900">{applicationData.travelDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Return Date:</span>
                <span className="ml-2 text-gray-900">{applicationData.returnDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Trip Duration:</span>
                <span className="ml-2 text-gray-900">{tripDuration} days</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Destination:</span>
                <span className="ml-2 text-gray-900">Turkey</span>
              </div>
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
                <span className="text-gray-700">Insurance Premium:</span>
                <span className="text-gray-900">${selectedProduct?.price || 0}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-blue-600 text-lg">${selectedProduct?.price || 0}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/insurance')}
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
              {submitApplicationMutation.isPending ? "Processing..." : `Proceed to Payment ($${selectedProduct?.price || 0})`}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}