import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface SupportingDocumentCheckProps {
  onHasSupportingDocument: (hasDocument: boolean) => void;
  onDocumentDetailsChange: (details: any) => void;
  onProcessingTypeChange: (processingType: string) => void;
}

export function SupportingDocumentCheck({ 
  onHasSupportingDocument, 
  onDocumentDetailsChange,
  onProcessingTypeChange
}: SupportingDocumentCheckProps) {
  const [hasDocument, setHasDocument] = useState<boolean | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [visaCountry, setVisaCountry] = useState("");
  const [residenceCountry, setResidenceCountry] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [processingType, setProcessingType] = useState("");

  const documentProcessingTypes = [
    { value: "slow", label: "Slow Process (7 days)", price: 50 },
    { value: "standard", label: "Standard Process (4 days)", price: 115 },
    { value: "fast", label: "Fast Process (2 days)", price: 165 },
    { value: "super_fast_24", label: "Super Fast - 24 hours", price: 280 },
    { value: "super_fast_12", label: "Super Fast - 12 hours", price: 330 },
    { value: "super_fast_4", label: "Super Fast - 4 hours", price: 410 },
    { value: "super_fast_1", label: "Super Fast - 1 hour", price: 654 }
  ];

  const handleHasDocumentChange = (value: boolean) => {
    setHasDocument(value);
    onHasSupportingDocument(value);
    if (!value) {
      setProcessingType("");
      onProcessingTypeChange("");
    }
  };

  const handleProcessingTypeChange = (type: string) => {
    setProcessingType(type);
    onProcessingTypeChange(type);
  };

  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type);
    // Reset fields when document type changes
    setVisaCountry("");
    setResidenceCountry("");
    setDocumentNumber("");
    setStartDate("");
    setEndDate("");
    setIsUnlimited(false);
  };

  const handleDetailsChange = () => {
    const details = {
      documentType,
      visaCountry,
      residenceCountry,
      documentNumber,
      startDate,
      endDate: isUnlimited ? "unlimited" : endDate,
      processingType,
    };
    onDocumentDetailsChange(details);
  };

  const visaCountries = [
    { code: "IRL", name: "Ireland" },
    { code: "SCHENGEN", name: "Schengen" },
    { code: "USA", name: "United States" },
    { code: "GBR", name: "United Kingdom" },
  ];

  const residenceCountries = [
    { code: "USA", name: "United States" },
    { code: "GBR", name: "United Kingdom" },
    { code: "DEU", name: "Germany" },
    { code: "FRA", name: "France" },
    { code: "ITA", name: "Italy" },
    { code: "ESP", name: "Spain" },
    { code: "NLD", name: "Netherlands" },
    { code: "BEL", name: "Belgium" },
    { code: "AUT", name: "Austria" },
    { code: "CHE", name: "Switzerland" },
    { code: "SWE", name: "Sweden" },
    { code: "NOR", name: "Norway" },
    { code: "DNK", name: "Denmark" },
    { code: "FIN", name: "Finland" },
    { code: "CAN", name: "Canada" },
    { code: "AUS", name: "Australia" },
    { code: "JPN", name: "Japan" },
    { code: "KOR", name: "South Korea" },
    { code: "SGP", name: "Singapore" },
    { code: "ARE", name: "United Arab Emirates" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supporting Document Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Do you have a valid visa or residence permit from Ireland, Schengen countries, United States, or United Kingdom?
            </Label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleHasDocumentChange(true)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  hasDocument === true
                    ? "border-green-500 bg-green-50 text-green-900"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>Yes, I have a valid supporting document</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleHasDocumentChange(false)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  hasDocument === false
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-blue-500" />
                  <span>No, I don't have a supporting document</span>
                </div>
              </button>
            </div>
          </div>

          {hasDocument === false && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                Redirecting to insurance services...
              </AlertDescription>
            </Alert>
          )}

          {hasDocument === true && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentType">Document Type *</Label>
                <Select onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="residence">Residence Permit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {documentType === "visa" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="visaCountry">Visa Country *</Label>
                    <Select onValueChange={setVisaCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visa country" />
                      </SelectTrigger>
                      <SelectContent>
                        {visaCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documentNumber">Document Number *</Label>
                    <Input
                      id="documentNumber"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      placeholder="Enter document number"
                    />
                  </div>

                  {visaCountry === "SCHENGEN" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          disabled={isUnlimited}
                        />
                        <label className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={isUnlimited}
                            onChange={(e) => setIsUnlimited(e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm">Unlimited</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {(visaCountry === "IRL" || visaCountry === "USA" || visaCountry === "GBR") && (
                    <div>
                      <Label htmlFor="endDate">Expiry Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={isUnlimited}
                      />
                      <label className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={isUnlimited}
                          onChange={(e) => setIsUnlimited(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Unlimited</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Processing Type Selection */}
              {documentType && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="processingType">Processing Type *</Label>
                    <Select onValueChange={handleProcessingTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select processing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentProcessingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label} - ${type.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {processingType && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Processing Fee Summary:</h4>
                      <div className="text-sm text-blue-800">
                        <p>• Selected: {documentProcessingTypes.find(t => t.value === processingType)?.label}</p>
                        <p>• Processing Fee: ${documentProcessingTypes.find(t => t.value === processingType)?.price}</p>
                        <p>• Document PDF Fee: $69</p>
                        <p className="font-bold">• Total Additional Cost: ${(documentProcessingTypes.find(t => t.value === processingType)?.price || 0) + 69}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {documentType === "residence" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="residenceCountry">Residence Country *</Label>
                    <Select onValueChange={setResidenceCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select residence country" />
                      </SelectTrigger>
                      <SelectContent>
                        {residenceCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documentNumber">Document Number *</Label>
                    <Input
                      id="documentNumber"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      placeholder="Enter document number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">Expiry Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={isUnlimited}
                    />
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={isUnlimited}
                        onChange={(e) => setIsUnlimited(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Unlimited</span>
                    </label>
                  </div>
                </div>
              )}

              {documentType && (
                <Button 
                  onClick={handleDetailsChange}
                  className="w-full"
                  disabled={!documentNumber || (!isUnlimited && !endDate) || 
                    (documentType === "visa" && !visaCountry) || 
                    (documentType === "residence" && !residenceCountry) ||
                    (documentType === "visa" && visaCountry === "SCHENGEN" && !startDate)
                  }
                >
                  Continue with Supporting Document
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}