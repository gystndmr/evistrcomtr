import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportingDocumentCheckProps {
  onHasSupportingDocument: (hasDocument: boolean) => void;
  onDocumentDetailsChange: (details: any) => void;
  onValidationChange: (isValid: boolean) => void;
  onSupportingDocTypeChange: (docType: string) => void;
  onProcessingTypeChange?: (processingType: string) => void;
}

export function SupportingDocumentCheck({ 
  onHasSupportingDocument, 
  onDocumentDetailsChange,
  onValidationChange,
  onSupportingDocTypeChange,
  onProcessingTypeChange
}: SupportingDocumentCheckProps) {
  const { toast } = useToast();
  const [hasDocument, setHasDocument] = useState<boolean | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [visaCountry, setVisaCountry] = useState("");
  const [residenceCountry, setResidenceCountry] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [processingType, setProcessingType] = useState("");

  const handleHasDocumentChange = (value: boolean) => {
    setHasDocument(value);
    onHasSupportingDocument(value);
    if (!value) {
      setProcessingType("");
      if (onProcessingTypeChange) {
        onProcessingTypeChange("");
      }
      // No automatic redirect - let user choose manually via Get Insurance button
      return;
    }
    // Immediate call for better UX - no delay needed
    handleDetailsChange();
  };

  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type);
    onSupportingDocTypeChange(type); // Pass supporting document type to parent
    // Reset fields when document type changes
    setVisaCountry("");
    setResidenceCountry("");
    setDocumentNumber("");
    setStartDate("");
    setEndDate("");
    setIsUnlimited(false);
    // Trigger validation after reset
    setTimeout(() => {
      handleDetailsChange();
    }, 0);
  };

  const validateFields = () => {
    if (hasDocument === null) return false;
    if (hasDocument === false) return true; // No document is valid
    
    // If has document, check required fields
    if (!documentType) return false;
    if (!documentNumber) return false;
    
    if (documentType === "visa") {
      if (!visaCountry) return false;
      
      // For Schengen visa, start date is required
      if (visaCountry === "SCHENGEN" && !startDate) return false;
      
      // For all visa types, end date is required unless unlimited
      if (!isUnlimited && !endDate) return false;
    }
    
    if (documentType === "residence") {
      if (!residenceCountry) return false;
      if (!isUnlimited && !endDate) return false;
    }
    
    return true;
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
    onValidationChange(validateFields());
    if (onProcessingTypeChange && processingType) {
      onProcessingTypeChange(processingType);
    }
  };

  // Auto-update details when any field changes
  useEffect(() => {
    handleDetailsChange();
  }, [documentType, visaCountry, residenceCountry, documentNumber, startDate, endDate, isUnlimited]);

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
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Without supporting documentation, your visa application must be submitted directly to the Turkish Diplomatic Mission in your jurisdiction, however travel insurance remains legally mandatory under Turkish Law No. 6458 for all visitors entering Turkey.
                <div className="mt-4">
                  <button 
                    onClick={() => {
                      const urlParams = new URLSearchParams(window.location.search);
                      const country = urlParams.get('country') || '';
                      window.location.href = `/insurance?country=${encodeURIComponent(country)}`;
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
                  >
                    GET MANDATORY INSURANCE
                  </button>
                </div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date *</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Select
                            value={startDate ? startDate.split('-')[2] : ''}
                            onValueChange={(day) => {
                              const parts = startDate ? startDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                              const year = parts[0];
                              const month = parts[1];
                              setStartDate(`${year}-${month}-${day.padStart(2, '0')}`);
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
                            value={startDate ? startDate.split('-')[1] : ''}
                            onValueChange={(month) => {
                              const parts = startDate ? startDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                              const year = parts[0];
                              const day = parts[2];
                              setStartDate(`${year}-${month.padStart(2, '0')}-${day}`);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { value: '01', label: 'Ocak' },
                                { value: '02', label: 'Şubat' },
                                { value: '03', label: 'Mart' },
                                { value: '04', label: 'Nisan' },
                                { value: '05', label: 'Mayıs' },
                                { value: '06', label: 'Haziran' },
                                { value: '07', label: 'Temmuz' },
                                { value: '08', label: 'Ağustos' },
                                { value: '09', label: 'Eylül' },
                                { value: '10', label: 'Ekim' },
                                { value: '11', label: 'Kasım' },
                                { value: '12', label: 'Aralık' }
                              ].map((m) => (
                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={startDate ? startDate.split('-')[0] : ''}
                            onValueChange={(year) => {
                              const parts = startDate ? startDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                              const month = parts[1];
                              const day = parts[2];
                              setStartDate(`${year}-${month}-${day}`);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date *</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Select
                            value={endDate ? endDate.split('-')[2] : ''}
                            onValueChange={(day) => {
                              const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                              const year = parts[0];
                              const month = parts[1];
                              setEndDate(`${year}-${month}-${day.padStart(2, '0')}`);
                            }}
                            disabled={isUnlimited}
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
                            value={endDate ? endDate.split('-')[1] : ''}
                            onValueChange={(month) => {
                              const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                              const year = parts[0];
                              const day = parts[2];
                              setEndDate(`${year}-${month.padStart(2, '0')}-${day}`);
                            }}
                            disabled={isUnlimited}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { value: '01', label: 'Ocak' },
                                { value: '02', label: 'Şubat' },
                                { value: '03', label: 'Mart' },
                                { value: '04', label: 'Nisan' },
                                { value: '05', label: 'Mayıs' },
                                { value: '06', label: 'Haziran' },
                                { value: '07', label: 'Temmuz' },
                                { value: '08', label: 'Ağustos' },
                                { value: '09', label: 'Eylül' },
                                { value: '10', label: 'Ekim' },
                                { value: '11', label: 'Kasım' },
                                { value: '12', label: 'Aralık' }
                              ].map((m) => (
                                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={endDate ? endDate.split('-')[0] : ''}
                            onValueChange={(year) => {
                              const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                              const month = parts[1];
                              const day = parts[2];
                              setEndDate(`${year}-${month}-${day}`);
                            }}
                            disabled={isUnlimited}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
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
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={endDate ? endDate.split('-')[2] : ''}
                          onValueChange={(day) => {
                            const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0];
                            const month = parts[1];
                            setEndDate(`${year}-${month}-${day.padStart(2, '0')}`);
                          }}
                          disabled={isUnlimited}
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
                          value={endDate ? endDate.split('-')[1] : ''}
                          onValueChange={(month) => {
                            const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const year = parts[0];
                            const day = parts[2];
                            setEndDate(`${year}-${month.padStart(2, '0')}-${day}`);
                          }}
                          disabled={isUnlimited}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: '01', label: 'Ocak' },
                              { value: '02', label: 'Şubat' },
                              { value: '03', label: 'Mart' },
                              { value: '04', label: 'Nisan' },
                              { value: '05', label: 'Mayıs' },
                              { value: '06', label: 'Haziran' },
                              { value: '07', label: 'Temmuz' },
                              { value: '08', label: 'Ağustos' },
                              { value: '09', label: 'Eylül' },
                              { value: '10', label: 'Ekim' },
                              { value: '11', label: 'Kasım' },
                              { value: '12', label: 'Aralık' }
                            ].map((m) => (
                              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={endDate ? endDate.split('-')[0] : ''}
                          onValueChange={(year) => {
                            const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                            const month = parts[1];
                            const day = parts[2];
                            setEndDate(`${year}-${month}-${day}`);
                          }}
                          disabled={isUnlimited}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                    <div className="grid grid-cols-3 gap-2">
                      <Select
                        value={endDate ? endDate.split('-')[2] : ''}
                        onValueChange={(day) => {
                          const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                          const year = parts[0];
                          const month = parts[1];
                          setEndDate(`${year}-${month}-${day.padStart(2, '0')}`);
                        }}
                        disabled={isUnlimited}
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
                        value={endDate ? endDate.split('-')[1] : ''}
                        onValueChange={(month) => {
                          const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                          const year = parts[0];
                          const day = parts[2];
                          setEndDate(`${year}-${month.padStart(2, '0')}-${day}`);
                        }}
                        disabled={isUnlimited}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { value: '01', label: 'Ocak' },
                            { value: '02', label: 'Şubat' },
                            { value: '03', label: 'Mart' },
                            { value: '04', label: 'Nisan' },
                            { value: '05', label: 'Mayıs' },
                            { value: '06', label: 'Haziran' },
                            { value: '07', label: 'Temmuz' },
                            { value: '08', label: 'Ağustos' },
                            { value: '09', label: 'Eylül' },
                            { value: '10', label: 'Ekim' },
                            { value: '11', label: 'Kasım' },
                            { value: '12', label: 'Aralık' }
                          ].map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={endDate ? endDate.split('-')[0] : ''}
                        onValueChange={(selectedYear) => {
                          const parts = endDate ? endDate.split('-') : [new Date().getFullYear().toString(), '01', '01'];
                          const month = parts[1];
                          const day = parts[2];
                          setEndDate(`${selectedYear}-${month}-${day}`);
                        }}
                        disabled={isUnlimited}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()).map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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


            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}