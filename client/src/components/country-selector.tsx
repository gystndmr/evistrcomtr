import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
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

const getCountryFlag = (countryCode: string): string => {
  const flags: { [key: string]: string } = {
    // Original countries
    'AFG': '🇦🇫', 'DZA': '🇩🇿', 'ATG': '🇦🇬', 'ARM': '🇦🇲', 'AUS': '🇦🇺', 
    'BHS': '🇧🇸', 'BGD': '🇧🇩', 'BRB': '🇧🇧', 'BMU': '🇧🇲', 'BTN': '🇧🇹',
    'KHM': '🇰🇭', 'CPV': '🇨🇻', 'CHN': '🇨🇳', 'HRV': '🇭🇷', 'DMA': '🇩🇲',
    'DOM': '🇩🇴', 'TLS': '🇹🇱', 'EGY': '🇪🇬', 'GNQ': '🇬🇶', 'EST': '🇪🇪',
    'FJI': '🇫🇯', 'GRD': '🇬🇩', 'HTI': '🇭🇹', 'HKG': '🇭🇰', 'IND': '🇮🇳',
    'IRQ': '🇮🇶', 'JAM': '🇯🇲', 'LVA': '🇱🇻', 'LBY': '🇱🇾', 'LTU': '🇱🇹',
    'MDV': '🇲🇻', 'MUS': '🇲🇺', 'MEX': '🇲🇽', 'NAM': '🇳🇦', 'NPL': '🇳🇵',
    'PAK': '🇵🇰', 'PSE': '🇵🇸', 'PHL': '🇵🇭', 'LCA': '🇱🇨', 'VCT': '🇻🇨',
    'SEN': '🇸🇳', 'SLB': '🇸🇧', 'ZAF': '🇿🇦', 'LKA': '🇱🇰', 'SUR': '🇸🇷',
    'TWN': '🇹🇼', 'VUT': '🇻🇺', 'VNM': '🇻🇳', 'YEM': '🇾🇪', 'RUS': '🇷🇺',
    
    // Major countries
    'USA': '🇺🇸', 'GBR': '🇬🇧', 'DEU': '🇩🇪', 'FRA': '🇫🇷', 'JPN': '🇯🇵',
    'CAN': '🇨🇦', 'ITA': '🇮🇹', 'ESP': '🇪🇸', 'NLD': '🇳🇱', 'BRA': '🇧🇷',
    'NGA': '🇳🇬', 'IRN': '🇮🇷', 'SYR': '🇸🇾', 
    
    // New countries added
    'TUR': '🇹🇷', 'ARG': '🇦🇷', 'CHE': '🇨🇭', 'AUT': '🇦🇹', 'BEL': '🇧🇪',
    'DNK': '🇩🇰', 'FIN': '🇫🇮', 'NOR': '🇳🇴', 'SWE': '🇸🇪', 'PRT': '🇵🇹',
    'GRC': '🇬🇷', 'POL': '🇵🇱', 'CZE': '🇨🇿', 'HUN': '🇭🇺', 'SVK': '🇸🇰',
    'SVN': '🇸🇮', 'ROU': '🇷🇴', 'BGR': '🇧🇬', 'LUX': '🇱🇺', 'IRL': '🇮🇪',
    'ISL': '🇮🇸', 'MLT': '🇲🇹', 'CYP': '🇨🇾', 'KOR': '🇰🇷', 'PRK': '🇰🇵',
    'MNG': '🇲🇳', 'KAZ': '🇰🇿', 'KGZ': '🇰🇬', 'TJK': '🇹🇯', 'TKM': '🇹🇲',
    'UZB': '🇺🇿', 'AZE': '🇦🇿', 'GEO': '🇬🇪', 'THA': '🇹🇭', 'MYS': '🇲🇾',
    'SGP': '🇸🇬', 'IDN': '🇮🇩', 'LAO': '🇱🇦', 'MMR': '🇲🇲', 'BRN': '🇧🇳',
    'SAU': '🇸🇦', 'ARE': '🇦🇪', 'QAT': '🇶🇦', 'BHR': '🇧🇭', 'KWT': '🇰🇼',
    'OMN': '🇴🇲', 'JOR': '🇯🇴', 'LBN': '🇱🇧', 'ISR': '🇮🇱', 'MAR': '🇲🇦',
    'TUN': '🇹🇳', 'ETH': '🇪🇹', 'KEN': '🇰🇪', 'UGA': '🇺🇬', 'TZA': '🇹🇿',
    'ZWE': '🇿🇼', 'ZMB': '🇿🇲', 'BWA': '🇧🇼', 'GHA': '🇬🇭', 'CIV': '🇨🇮',
    'CMR': '🇨🇲', 'AGO': '🇦🇴', 'MOZ': '🇲🇿', 'MDG': '🇲🇬', 'GTM': '🇬🇹',
    'BLZ': '🇧🇿', 'HND': '🇭🇳', 'SLV': '🇸🇻', 'NIC': '🇳🇮', 'CRI': '🇨🇷',
    'PAN': '🇵🇦', 'COL': '🇨🇴', 'VEN': '🇻🇪', 'GUY': '🇬🇾', 'ECU': '🇪🇨',
    'PER': '🇵🇪', 'BOL': '🇧🇴', 'PRY': '🇵🇾', 'URY': '🇺🇾', 'CHL': '🇨🇱',
    'NZL': '🇳🇿', 'PNG': '🇵🇬', 'WSM': '🇼🇸', 'TON': '🇹🇴', 'KIR': '🇰🇮',
    'TUV': '🇹🇻', 'NRU': '🇳🇷', 'PLW': '🇵🇼', 'MHL': '🇲🇭', 'FSM': '🇫🇲',
    
    // Balkan and other new countries  
    'ALB': '🇦🇱', 'MKD': '🇲🇰', 'SRB': '🇷🇸', 'BIH': '🇧🇦', 'MNE': '🇲🇪',
    'XKX': '🇽🇰', 'CUB': '🇨🇺', 'TTO': '🇹🇹', 'GGY': '🇬🇬', 'JEY': '🇯🇪',
    'IMN': '🇮🇲', 'DJI': '🇩🇯', 'ERI': '🇪🇷', 'GMB': '🇬🇲', 'GIN': '🇬🇳',
    'GNB': '🇬🇼', 'LSO': '🇱🇸', 'LBR': '🇱🇷', 'MLI': '🇲🇱', 'MRT': '🇲🇷',
    'NER': '🇳🇪', 'RWA': '🇷🇼', 'STP': '🇸🇹', 'SLE': '🇸🇱', 'SOM': '🇸🇴',
    'SSD': '🇸🇸', 'SDN': '🇸🇩', 'SWZ': '🇸🇿', 'TGO': '🇹🇬', 'TCD': '🇹🇩',
    'CAR': '🇨🇫', 'COD': '🇨🇩', 'COG': '🇨🇬', 'GAB': '🇬🇦', 'BFA': '🇧🇫',
    'BDI': '🇧🇮', 'COM': '🇰🇲', 'SYC': '🇸🇨', 'MWI': '🇲🇼'
  };
  
  return flags[countryCode] || '🌍';
};

export function CountrySelector({
  onCountrySelect,
  onDocumentTypeSelect,
  selectedCountry,
  selectedDocumentType,
}: CountrySelectorProps) {
  const [showEligibilityStatus, setShowEligibilityStatus] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: countries = [], isLoading, error } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
  });

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c: Country) => c.code === countryCode);
    onCountrySelect(country || null);
    setShowEligibilityStatus(!!country && !!selectedDocumentType);
    
    // Clear any existing interval first
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Show eligibility status but don't redirect automatically
    setRedirectCountdown(null);
  };

  const handleDocumentTypeChange = (documentType: string) => {
    onDocumentTypeSelect(documentType);
    setShowEligibilityStatus(!!selectedCountry && !!documentType);
    
    // Clear any existing interval first
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Show eligibility status but don't redirect automatically
    setRedirectCountdown(null);
  };

  const renderEligibilityStatus = () => {
    if (!selectedCountry || !selectedDocumentType) return null;

    // Scenario 4: Not eligible for e-visa (red warning) - Check this first, but exclude scenario 3!
    if ((!selectedCountry.isEligible && selectedCountry.scenario !== 3) || selectedCountry.scenario === 4) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-3">
              <div>
                <strong className="block text-red-900 mb-2">Important Notice:</strong>
                <p>An e‑Visa cannot be issued for citizens of the country you selected. You must apply for a visa at your nearest Turkish mission or consulate. However, according to Turkish immigration law, travel insurance is mandatory for all visitors to Turkey regardless of visa type.</p>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => window.location.href = '/insurance'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Get Insurance
                </button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    // Scenario 3: Visa-free + insurance required (soft blue warning)
    if (selectedCountry.scenario === 3) {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div>
              <strong className="text-blue-900">{t('country.selector.visa.free.title')}</strong>
              <br />
              {t('form.warning.visa.exempt.insurance.description')}
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    // Scenario 1 & 2: E-visa available (green confirmation)
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
              ) : error ? (
                <SelectItem value="error" disabled>Error: {error.message}</SelectItem>
              ) : countries.length === 0 ? (
                <SelectItem value="no-data" disabled>No countries available (Query returned empty)</SelectItem>
              ) : (
                [...countries]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((country: Country) => (
                    <SelectItem key={`${country.code}-${country.id}`} value={country.code}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getCountryFlag(country.code)}
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
              <SelectValue placeholder="Please select document type (required)" />
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
