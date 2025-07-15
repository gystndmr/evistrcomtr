import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { Country } from "@shared/schema";

interface CountrySelectorProps {
  onCountrySelect: (country: Country | null) => void;
  onDocumentTypeSelect: (documentType: string) => void;
  selectedCountry: Country | null;
  selectedDocumentType: string;
}

const documentTypes = [
  { value: "ordinary", label: "Ordinary Passport" },
  { value: "diplomatic", label: "Diplomatic Passport" },
  { value: "service", label: "Service Passport" },
  { value: "special", label: "Special Passport" },
  { value: "identity", label: "Identity Card" },
];

export function CountrySelector({
  onCountrySelect,
  onDocumentTypeSelect,
  selectedCountry,
  selectedDocumentType,
}: CountrySelectorProps) {
  const [showEligibilityStatus, setShowEligibilityStatus] = useState(false);

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
  });

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c: Country) => c.code === countryCode);
    onCountrySelect(country || null);
    setShowEligibilityStatus(!!country && !!selectedDocumentType);
  };

  const handleDocumentTypeChange = (documentType: string) => {
    onDocumentTypeSelect(documentType);
    setShowEligibilityStatus(!!selectedCountry && !!documentType);
  };

  const renderEligibilityStatus = () => {
    if (!selectedCountry || !selectedDocumentType) return null;

    if (!selectedCountry.isEligible) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            <strong>E-Visa Not Available</strong>
            <br />
            E-visa service is not available for your country.{" "}
            <button
              onClick={() => window.location.href = "/insurance"}
              className="underline font-medium hover:text-red-600"
            >
              Get travel insurance instead
            </button>
          </AlertDescription>
        </Alert>
      );
    }

    if (selectedCountry.requiresSupportingDocs) {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-800">
            <strong>Supporting Documents Required</strong>
            <br />
            Your country requires additional supporting documents for e-visa approval.{" "}
            <button
              onClick={() => window.location.href = "/insurance"}
              className="underline font-medium hover:text-yellow-600"
            >
              Skip documents and get travel insurance
            </button>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-800">
          <strong>E-Visa Available</strong>
          <br />
          Great! You can apply for an e-visa for Turkey.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="country">Country/Region of Travel Document *</Label>
          <Select onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country/Region" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country: Country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="documentType">Travel Document Type *</Label>
          <Select onValueChange={handleDocumentTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Document Type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showEligibilityStatus && (
        <div className="mt-6">
          {renderEligibilityStatus()}
        </div>
      )}
    </div>
  );
}
