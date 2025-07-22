import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar, CreditCard, User, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Status() {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [searchType, setSearchType] = useState<"visa" | "insurance">("visa");
  const [shouldFetch, setShouldFetch] = useState(false);
  const { t } = useLanguage();

  // URL parametresi ile otomatik doldurma
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refNumber = urlParams.get('ref');
    if (refNumber) {
      setApplicationNumber(refNumber);
      setShouldFetch(true);
    }
  }, []);

  const { data: application, isLoading, error } = useQuery({
    queryKey: [searchType === "visa" ? "/api/applications" : "/api/insurance/applications", applicationNumber],
    enabled: shouldFetch && applicationNumber.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate application number
    if (!applicationNumber.trim()) {
      alert(t('status.error.enter.number'));
      return;
    }
    
    // Basic format validation (should be at least 6 characters)
    if (applicationNumber.trim().length < 6) {
      alert(t('status.error.number.length'));
      return;
    }
    
    setShouldFetch(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "processing":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return t('status.message.approved');
      case "pending":
        return t('status.message.pending');
      case "rejected":
        return t('status.message.rejected');
      case "processing":
        return t('status.message.processing');
      default:
        return t('status.message.default');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-8 sm:py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4">{t('status.title')}</h1>
            <p className="text-base sm:text-lg text-neutral-600 px-4">{t('status.subtitle')}</p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                {t('status.search.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={searchType === "visa" ? "default" : "outline"}
                    onClick={() => setSearchType("visa")}
                  >
                    {t('status.visa.application')}
                  </Button>
                  <Button
                    type="button"
                    variant={searchType === "insurance" ? "default" : "outline"}
                    onClick={() => setSearchType("insurance")}
                  >
                    {t('status.insurance.application')}
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="applicationNumber">{t('status.application.number')}</Label>
                  <Input
                    id="applicationNumber"
                    value={applicationNumber}
                    onChange={(e) => setApplicationNumber(e.target.value)}
                    placeholder={t('status.application.number.placeholder')}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('status.searching') : t('status.search.button')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Alert className="mb-8 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {t('status.error.not.found')}
              </AlertDescription>
            </Alert>
          )}

          {application && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('status.details')}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(application.status)}
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Message */}
                <div className={`p-4 rounded-lg border ${
                  application.status === 'approved' ? 'bg-green-50 border-green-200' :
                  application.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  application.status === 'rejected' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <p className="text-sm font-medium text-gray-800">
                    {getStatusMessage(application.status)}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium">Applicant Name</p>
                        <p className="text-sm text-neutral-600">{application.firstName} {application.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium">Application Date</p>
                        <p className="text-sm text-neutral-600">{formatDate(application.createdAt)}</p>
                      </div>
                    </div>
                    
                    {searchType === "visa" && application.arrivalDate && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="text-sm font-medium">Arrival Date</p>
                          <p className="text-sm text-neutral-600">{formatDate(application.arrivalDate)}</p>
                        </div>
                      </div>
                    )}
                    
                    {searchType === "insurance" && application.travelDate && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-neutral-500" />
                        <div>
                          <p className="text-sm font-medium">Travel Date</p>
                          <p className="text-sm text-neutral-600">{formatDate(application.travelDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium">Total Amount</p>
                        <p className="text-sm text-neutral-600">${application.totalAmount}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium">Payment Status</p>
                        <Badge className={getStatusColor(application.paymentStatus)}>
                          {application.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    {searchType === "visa" && application.processingType && (
                      <div>
                        <p className="text-sm font-medium">Processing Type</p>
                        <p className="text-sm text-neutral-600">{application.processingType}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {application.status === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">
                          {searchType === "visa" ? "E-Visa" : "Insurance Certificate"} Ready
                        </p>
                        <p className="text-sm text-green-600">
                          Your {searchType === "visa" ? "e-visa" : "insurance certificate"} is ready for download
                        </p>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
                
                {application.status === "pending" && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-800">
                      Your application is being processed. You will receive an email notification once it's approved.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
