import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

  const { data: countries = [], isLoading } = useQuery<Country[]>({
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
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800">
            <strong>{t('country.selector.visa.free.title')}</strong>
            <br />
            {t('country.selector.visa.free.description')}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-800">
          <strong>{t('country.selector.evisa.available.title')}</strong>
          <br />
          {t('country.selector.evisa.available.description')}
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
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading countries...</SelectItem>
              ) : countries.length === 0 ? (
                <SelectItem value="no-data" disabled>No countries available</SelectItem>
              ) : (
                countries.map((country: Country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {country.code === 'AFG' ? '🇦🇫' : 
                         country.code === 'ARM' ? '🇦🇲' : 
                         country.code === 'ATG' ? '🇦🇬' : 
                         country.code === 'AUS' ? '🇦🇺' : 
                         country.code === 'BGD' ? '🇧🇩' : 
                         country.code === 'BHS' ? '🇧🇸' : 
                         country.code === 'BMU' ? '🇧🇲' : 
                         country.code === 'BRA' ? '🇧🇷' : 
                         country.code === 'BRB' ? '🇧🇧' : 
                         country.code === 'BTN' ? '🇧🇹' : 
                         country.code === 'CAN' ? '🇨🇦' : 
                         country.code === 'CHN' ? '🇨🇳' : 
                         country.code === 'CPV' ? '🇨🇻' : 
                         country.code === 'DEU' ? '🇩🇪' : 
                         country.code === 'DMA' ? '🇩🇲' : 
                         country.code === 'DOM' ? '🇩🇴' : 
                         country.code === 'DZA' ? '🇩🇿' : 
                         country.code === 'EGY' ? '🇪🇬' : 
                         country.code === 'ESP' ? '🇪🇸' : 
                         country.code === 'EST' ? '🇪🇪' : 
                         country.code === 'FJI' ? '🇫🇯' : 
                         country.code === 'FRA' ? '🇫🇷' : 
                         country.code === 'GBR' ? '🇬🇧' : 
                         country.code === 'GNQ' ? '🇬🇶' : 
                         country.code === 'GRD' ? '🇬🇩' : 
                         country.code === 'HKG' ? '🇭🇰' : 
                         country.code === 'HRV' ? '🇭🇷' : 
                         country.code === 'HTI' ? '🇭🇹' : 
                         country.code === 'IND' ? '🇮🇳' : 
                         country.code === 'IRN' ? '🇮🇷' : 
                         country.code === 'IRQ' ? '🇮🇶' : 
                         country.code === 'ITA' ? '🇮🇹' : 
                         country.code === 'JAM' ? '🇯🇲' : 
                         country.code === 'JPN' ? '🇯🇵' : 
                         country.code === 'KHM' ? '🇰🇭' : 
                         country.code === 'LBY' ? '🇱🇾' : 
                         country.code === 'LCA' ? '🇱🇨' : 
                         country.code === 'LKA' ? '🇱🇰' : 
                         country.code === 'LTU' ? '🇱🇹' : 
                         country.code === 'LVA' ? '🇱🇻' : 
                         country.code === 'MDV' ? '🇲🇻' : 
                         country.code === 'MEX' ? '🇲🇽' : 
                         country.code === 'MUS' ? '🇲🇺' : 
                         country.code === 'NAM' ? '🇳🇦' : 
                         country.code === 'NGA' ? '🇳🇬' : 
                         country.code === 'NLD' ? '🇳🇱' : 
                         country.code === 'NPL' ? '🇳🇵' : 
                         country.code === 'PAK' ? '🇵🇰' : 
                         country.code === 'PHL' ? '🇵🇭' : 
                         country.code === 'PSE' ? '🇵🇸' : 
                         country.code === 'RUS' ? '🇷🇺' : 
                         country.code === 'SEN' ? '🇸🇳' : 
                         country.code === 'SLB' ? '🇸🇧' : 
                         country.code === 'SUR' ? '🇸🇷' : 
                         country.code === 'SYR' ? '🇸🇾' : 
                         country.code === 'TLS' ? '🇹🇱' : 
                         country.code === 'TWN' ? '🇹🇼' : 
                         country.code === 'USA' ? '🇺🇸' : 
                         country.code === 'VCT' ? '🇻🇨' : 
                         country.code === 'VNM' ? '🇻🇳' : 
                         country.code === 'VUT' ? '🇻🇺' : 
                         country.code === 'YEM' ? '🇾🇪' : 
                         country.code === 'ZAF' ? '🇿🇦' : '🌍'}
                      </span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))
              )}
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
