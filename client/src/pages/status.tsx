import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar, CreditCard, User, MapPin } from "lucide-react";

export default function Status() {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [searchType, setSearchType] = useState<"visa" | "insurance">("visa");
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: application, isLoading, error } = useQuery({
    queryKey: [searchType === "visa" ? "/api/applications" : "/api/insurance/applications", applicationNumber],
    enabled: shouldFetch && applicationNumber.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (applicationNumber.trim()) {
      setShouldFetch(true);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Check Application Status</h1>
            <p className="text-lg text-neutral-600">Enter your application number to check your visa or insurance application status</p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search Application
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
                    Visa Application
                  </Button>
                  <Button
                    type="button"
                    variant={searchType === "insurance" ? "default" : "outline"}
                    onClick={() => setSearchType("insurance")}
                  >
                    Insurance Application
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="applicationNumber">Application Number</Label>
                  <Input
                    id="applicationNumber"
                    value={applicationNumber}
                    onChange={(e) => setApplicationNumber(e.target.value)}
                    placeholder="Enter your application number (e.g., TR12345678)"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search Application"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Alert className="mb-8 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Application not found. Please check your application number and try again.
              </AlertDescription>
            </Alert>
          )}

          {application && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Application Details</span>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
