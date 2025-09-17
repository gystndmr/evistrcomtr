import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Users, CreditCard, FileText, Eye, Search, Download, CheckCircle, XCircle, Info, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Application, InsuranceApplication } from "@shared/schema";
import ChatAdminPanel from "../components/chat-admin-panel";

interface AdminStats {
  totalApplications: number;
  totalInsuranceApplications: number;
  totalRevenue: number;
  pendingApplications: number;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedInsuranceApp, setSelectedInsuranceApp] = useState<InsuranceApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [insuranceCurrentPage, setInsuranceCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pdfFile, setPdfFile] = useState<string>("");
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [currentAppId, setCurrentAppId] = useState<number | null>(null);
  const [currentAppType, setCurrentAppType] = useState<"visa" | "insurance" | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
    setInsuranceCurrentPage(1);
  }, [debouncedSearchTerm]);

  interface PaginatedResponse<T> {
    applications: T[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  }

  const { data: applicationsData } = useQuery<PaginatedResponse<Application>>({
    queryKey: ["/api/admin/applications", currentPage, debouncedSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "50",
        search: debouncedSearchTerm
      });
      const response = await fetch(`/api/admin/applications?${params}`);
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const { data: insuranceApplicationsData, isLoading: insuranceLoading, error: insuranceError } = useQuery<PaginatedResponse<InsuranceApplication>>({
    queryKey: ["/api/admin/insurance-applications", insuranceCurrentPage, debouncedSearchTerm],
    queryFn: async () => {
      console.log('Making insurance applications request with params:', {
        page: insuranceCurrentPage,
        limit: 50,
        search: debouncedSearchTerm,
        isAuthenticated
      });
      
      const params = new URLSearchParams({
        page: insuranceCurrentPage.toString(),
        limit: "50", 
        search: debouncedSearchTerm
      });
      
      const url = `/api/admin/insurance-applications?${params}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Insurance applications data received:', {
        applications: data.applications?.length || 0,
        totalCount: data.totalCount,
        currentPage: data.currentPage,
        totalPages: data.totalPages
      });
      return data;
    },
    enabled: isAuthenticated,
  });

  const applications = applicationsData?.applications || [];
  const insuranceApplications = insuranceApplicationsData?.applications || [];
  
  // Debug log
  console.log('Insurance applications state:', {
    isAuthenticated,
    insuranceLoading,
    insuranceError,
    insuranceApplicationsData,
    insuranceApplications: insuranceApplications.length
  });

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  const handleLogin = () => {
    // Simple password check (in production, use proper authentication)
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Yanlış şifre!");
    }
  };

  // No need for client-side filtering since backend handles it
  const filteredApplications = applications;
  const filteredInsuranceApplications = insuranceApplications;

  // Helper function to format dates - handle both Date objects and strings
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Dosya boyutu kontrolü (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Hata",
          description: "PDF dosyası çok büyük. Maksimum 5MB olmalı.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPdfFile(base64);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Hata",
        description: "Lütfen sadece PDF dosyası seçin.",
        variant: "destructive",
      });
    }
  };

  const handleApproveWithPdf = (appId: number, appType: "visa" | "insurance") => {
    setCurrentAppId(appId);
    setCurrentAppType(appType);
    setPdfDialogOpen(true);
  };

  const handlePdfSubmit = () => {
    if (currentAppId && currentAppType) {
      // PDF dosyası boyut kontrolü tekrar
      if (pdfFile) {
        const fileSize = Math.round((pdfFile.length * 3 / 4) / 1024 / 1024 * 100) / 100; // Base64 to MB
        if (fileSize > 5) {
          toast({
            title: "Hata",
            description: `PDF dosyası çok büyük (${fileSize}MB). Maksimum 5MB olmalı.`,
            variant: "destructive",
          });
          return;
        }
      }
      
      if (currentAppType === "visa") {
        updateApplicationStatusMutation.mutate({ 
          id: currentAppId, 
          status: "approved", 
          pdfAttachment: pdfFile || undefined 
        });
      } else {
        updateInsuranceStatusMutation.mutate({ 
          id: currentAppId, 
          status: "approved", 
          pdfAttachment: pdfFile || undefined 
        });
      }
      setPdfDialogOpen(false);
      setPdfFile("");
      setCurrentAppId(null);
      setCurrentAppType(null);
    }
  };

  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ id, status, pdfAttachment }: { id: number; status: string; pdfAttachment?: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/applications/${id}/status`, { status, pdfAttachment });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Başarılı",
        description: "Başvuru durumu güncellendi ve müşteriye e-posta gönderildi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateInsuranceStatusMutation = useMutation({
    mutationFn: async ({ id, status, pdfAttachment }: { id: number; status: string; pdfAttachment?: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/insurance-applications/${id}/status`, { status, pdfAttachment });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/insurance-applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Başarılı",
        description: "Sigorta başvuru durumu güncellendi ve müşteriye e-posta gönderildi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateVisaTypeMutation = useMutation({
    mutationFn: async ({ id, visaCountry }: { id: number; visaCountry: string }) => {
      const response = await apiRequest("POST", `/api/admin/applications/${id}/visa-type`, { visaType: visaCountry });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({
        title: "Başarılı",
        description: "Visa türü güncellendi.",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateVisaType = (id: number, visaCountry: string) => {
    updateVisaTypeMutation.mutate({ id, visaCountry });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Beklemede</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-500">Onaylandı</Badge>;
      case "rejected":
        return <Badge variant="destructive">Reddedildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Beklemede</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500">Tamamlandı</Badge>;
      case "failed":
        return <Badge variant="destructive">Başarısız</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSupportingDocumentTypeDisplay = (docType: string, visaCountry?: string, visaNumber?: string) => {
    
    switch (docType) {
      case "visa":
        // Spesifik visa ülkesini göster
        if (visaCountry === "SCHENGEN") return "Schengen Vizesi";
        if (visaCountry === "USA") return "ABD Vizesi";
        if (visaCountry === "GBR") return "İngiltere Vizesi";
        if (visaCountry === "IRL") return "İrlanda Vizesi";
        // Eski kayıtlar için (visa country bilgisi yok ama visa number var)
        if (visaNumber && !visaCountry) {
          return `Visa Mevcut (No: ${visaNumber.substring(0, 6)}...)`;
        }
        return "Visa (Tür Belirsiz)";
      case "residence":
        // Kapsamlı ülke listesi - tüm ISO ülke kodları
        const residenceCountryNames: Record<string, string> = {
          "USA": "Amerika",
          "GBR": "İngiltere", 
          "IRL": "İrlanda",
          "DEU": "Almanya",
          "FRA": "Fransa",
          "ITA": "İtalya", 
          "ESP": "İspanya",
          "NLD": "Hollanda",
          "BEL": "Belçika",
          "AUT": "Avusturya",
          "CHE": "İsviçre",
          "SWE": "İsveç",
          "NOR": "Norveç",
          "DNK": "Danimarka",
          "FIN": "Finlandiya",
          "BGR": "Bulgaristan",
          "HRV": "Hırvatistan",
          "CYP": "Kıbrıs",
          "CZE": "Çek Cumhuriyeti",
          "EST": "Estonya",
          "GRC": "Yunanistan",
          "HUN": "Macaristan",
          "LVA": "Letonya",
          "LTU": "Litvanya", 
          "LUX": "Lüksemburg",
          "MLT": "Malta",
          "POL": "Polonya",
          "PRT": "Portekiz",
          "ROU": "Romanya",
          "SVK": "Slovakya",
          "SVN": "Slovenya",
          "ISL": "İzlanda",
          "LIE": "Liechtenstein",
          "CAN": "Kanada",
          "AUS": "Avustralya", 
          "JPN": "Japonya",
          "KOR": "Güney Kore",
          "SGP": "Singapur",
          "ARE": "BAE"
        };
        
        if (visaCountry && residenceCountryNames[visaCountry]) {
          return `${residenceCountryNames[visaCountry]} İkamet İzni`;
        }
        
        // Eski kayıtlar için
        if (visaNumber && !visaCountry) {
          return `İkamet İzni Mevcut (No: ${visaNumber.substring(0, 6)}...)`;
        }
        
        // Ülke kodu bilinmiyorsa ama var ise, kodu göster
        if (visaCountry) {
          return `İkamet İzni (${visaCountry})`;
        }
        
        return "İkamet İzni (Ülke Belirsiz)";
      case "passport":
        return "Pasaport";
      case "id_card":
        return "Kimlik Kartı";
      default:
        return docType || 'Belirtilmemiş';
    }
  };



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Shield className="w-6 h-6" />
                Admin Paneli
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Admin şifresini girin"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Giriş Yap
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Paneli</h1>
          <Button 
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
          >
            Çıkış Yap
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Vize Başvuru</p>
                  <p className="text-2xl font-bold">{stats?.totalApplications || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sigorta Başvuru</p>
                  <p className="text-2xl font-bold">{stats?.totalInsuranceApplications || 0}</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Gelir</p>
                  <p className="text-2xl font-bold">${stats?.totalRevenue || 0}</p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bekleyen Başvuru</p>
                  <p className="text-2xl font-bold">{stats?.pendingApplications || 0}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or application number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="visa" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visa">Vize Başvuruları ({applicationsData?.totalCount || 0})</TabsTrigger>
            <TabsTrigger value="insurance">Sigorta Başvuruları ({insuranceApplicationsData?.totalCount || 0})</TabsTrigger>
            <TabsTrigger value="chat">Canlı Destek</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visa" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vize Başvuruları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Başvuru No</TableHead>
                        <TableHead>Ad Soyad</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Hangi Ülkeden</TableHead>
                        <TableHead>Pasaport No</TableHead>
                        <TableHead>Pasaport Veriliş</TableHead>
                        <TableHead>Pasaport Geçerlilik</TableHead>
                        <TableHead>Doğum Tarihi</TableHead>
                        <TableHead>Doğum Yeri</TableHead>
                        <TableHead>Anne Adı</TableHead>
                        <TableHead>Baba Adı</TableHead>
                        <TableHead>Adres</TableHead>
                        <TableHead>Varış Tarihi</TableHead>
                        <TableHead>İşlem Türü</TableHead>
                        <TableHead>Belge Türü</TableHead>
                        <TableHead>Destekleyici Belge</TableHead>
                        <TableHead>Belge No</TableHead>
                        <TableHead>Belge Başlangıç</TableHead>
                        <TableHead>Belge Bitiş</TableHead>
                        <TableHead>Tutar</TableHead>
                        <TableHead>Ödeme Durumu</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.applicationNumber}</TableCell>
                          <TableCell>{app.firstName} {app.lastName}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>{app.countryOfOrigin || app.countryId}</TableCell>
                          <TableCell>{app.passportNumber}</TableCell>
                          <TableCell>{app.passportIssueDate ? formatDate(app.passportIssueDate) : 'N/A'}</TableCell>
                          <TableCell>{app.passportExpiryDate ? formatDate(app.passportExpiryDate) : 'N/A'}</TableCell>
                          <TableCell>{app.dateOfBirth ? formatDate(app.dateOfBirth) : 'N/A'}</TableCell>
                          <TableCell>{app.placeOfBirth || 'N/A'}</TableCell>
                          <TableCell>{app.motherName || 'N/A'}</TableCell>
                          <TableCell>{app.fatherName || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate">{app.address || 'N/A'}</TableCell>
                          <TableCell>{app.arrivalDate ? formatDate(app.arrivalDate) : 'N/A'}</TableCell>
                          <TableCell>{app.processingType}</TableCell>
                          <TableCell>{app.documentType}</TableCell>
                          <TableCell>{getSupportingDocumentTypeDisplay((app as any).supportingDocumentType || (app as any).supporting_document_type, (app as any).supportingDocumentCountry || (app as any).supporting_document_country, (app as any).supportingDocumentNumber || (app as any).supporting_document_number)}</TableCell>
                          <TableCell>{app.supportingDocumentNumber || 'N/A'}</TableCell>
                          <TableCell>{app.supportingDocumentStartDate ? formatDate(app.supportingDocumentStartDate) : 'N/A'}</TableCell>
                          <TableCell>{app.supportingDocumentEndDate ? formatDate(app.supportingDocumentEndDate) : 'N/A'}</TableCell>
                          <TableCell>${app.totalAmount}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {/* Payment Status Badge */}
                              {app.paymentStatus === "completed" || app.paymentStatus === "succeeded" ? (
                                <Badge variant="default" className="bg-green-500">✓ Ödemesi Tamam</Badge>
                              ) : app.paymentStatus === "processing" ? (
                                <Badge variant="secondary" className="bg-yellow-500">⏳ İşlemde</Badge>
                              ) : app.paymentStatus === "failed" ? (
                                <Badge variant="destructive">✗ Başarısız</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100">⏸️ Beklemede</Badge>
                              )}
                              
                              {/* Arrival Date Countdown - Show for ALL applications */}
                              {app.arrivalDate && (() => {
                                const today = new Date();
                                const arrivalDate = new Date(app.arrivalDate);
                                const diffTime = arrivalDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays <= 0) {
                                  return <span className="text-xs text-red-600 font-medium">🚨 Seyahat tarihi geçti!</span>;
                                } else if (diffDays <= 7) {
                                  return <span className="text-xs text-orange-600 font-medium">⚠️ {diffDays} gün kaldı!</span>;
                                } else if (diffDays <= 30) {
                                  return <span className="text-xs text-blue-600">{diffDays} gün kaldı</span>;
                                } else {
                                  return <span className="text-xs text-green-600">{diffDays} gün</span>;
                                }
                              })()}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>{formatDate(app.createdAt!)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              {/* Eski visa kayıtları için visa türü güncelleme */}
                              {(app as any).supportingDocumentType === "visa" && !((app as any).supportingDocumentCountry || (app as any).supporting_document_country) && (app.supportingDocumentNumber || (app as any).supporting_document_number) && (
                                <div className="flex flex-col gap-1 p-2 bg-blue-50 rounded text-xs">
                                  <div className="text-blue-600 font-medium">
                                    📋 Visa Mevcut: {app.supportingDocumentNumber}
                                  </div>
                                  <div className="text-gray-600 mb-1">
                                    {app.countryOfOrigin} → Hangi ülke vizesi?
                                  </div>
                                  <div className="flex gap-1 flex-wrap">
                                    {app.countryOfOrigin === "Pakistan" && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "SCHENGEN")}
                                          className="text-xs px-2 py-1 h-6 bg-green-50 hover:bg-green-100"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇪🇺 Schengen
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "GBR")}
                                          className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇬🇧 İngiltere
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "USA")}
                                          className="text-xs px-2 py-1 h-6 bg-red-50 hover:bg-red-100"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇺🇸 ABD
                                        </Button>
                                      </>
                                    )}
                                    {app.countryOfOrigin === "Egypt" && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "SCHENGEN")}
                                          className="text-xs px-2 py-1 h-6 bg-green-50 hover:bg-green-100"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇪🇺 Schengen
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "GBR")}
                                          className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇬🇧 İngiltere
                                        </Button>
                                      </>
                                    )}
                                    {/* Diğer ülkeler için genel seçenekler */}
                                    {!["Pakistan", "Egypt"].includes(app.countryOfOrigin || "") && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "SCHENGEN")}
                                          className="text-xs px-2 py-1 h-6"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇪🇺 Schengen
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "USA")}
                                          className="text-xs px-2 py-1 h-6"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇺🇸 ABD
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateVisaType(app.id, "GBR")}
                                          className="text-xs px-2 py-1 h-6"
                                          disabled={updateVisaTypeMutation.isPending}
                                        >
                                          🇬🇧 İngiltere
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Eski residence permit kayıtları için ülke güncelleme */}
                              {(app as any).supportingDocumentType === "residence" && !((app as any).supportingDocumentCountry || (app as any).supporting_document_country) && (app.supportingDocumentNumber || (app as any).supporting_document_number) && (
                                <div className="flex flex-col gap-1 p-2 bg-purple-50 rounded text-xs">
                                  <div className="text-purple-600 font-medium">
                                    🏠 İkamet İzni: {app.supportingDocumentNumber}
                                  </div>
                                  <div className="text-gray-600 mb-1">
                                    {app.countryOfOrigin} → Hangi ülkenin ikamet izni?
                                  </div>
                                  <div className="flex gap-1 flex-wrap">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "GERMANY")}
                                      className="text-xs px-2 py-1 h-6 bg-yellow-50 hover:bg-yellow-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇩🇪 Almanya
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "NETHERLANDS")}
                                      className="text-xs px-2 py-1 h-6 bg-orange-50 hover:bg-orange-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇳🇱 Hollanda
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "FRANCE")}
                                      className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇫🇷 Fransa
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "ITALY")}
                                      className="text-xs px-2 py-1 h-6 bg-green-50 hover:bg-green-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇮🇹 İtalya
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "SPAIN")}
                                      className="text-xs px-2 py-1 h-6 bg-red-50 hover:bg-red-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇪🇸 İspanya
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "SWEDEN")}
                                      className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇸🇪 İsveç
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "AUSTRIA")}
                                      className="text-xs px-2 py-1 h-6 bg-red-50 hover:bg-red-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇦🇹 Avusturya
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "BELGIUM")}
                                      className="text-xs px-2 py-1 h-6 bg-yellow-50 hover:bg-yellow-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇧🇪 Belçika
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "DENMARK")}
                                      className="text-xs px-2 py-1 h-6 bg-red-50 hover:bg-red-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇩🇰 Danimarka
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "NORWAY")}
                                      className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇳🇴 Norveç
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateVisaType(app.id, "SWITZERLAND")}
                                      className="text-xs px-2 py-1 h-6 bg-red-50 hover:bg-red-100"
                                      disabled={updateVisaTypeMutation.isPending}
                                    >
                                      🇨🇭 İsviçre
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedApplication(app)}
                                  >
                                    <Info className="w-4 h-4 mr-1" />
                                    İncele
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="visa-application-details">
                                  <DialogHeader>
                                    <DialogTitle>Başvuru Detayları - {app.applicationNumber}</DialogTitle>
                                    <DialogDescription id="visa-application-details">
                                      Vize başvurusunun detaylı bilgilerini görüntüleme ve düzenleme paneli
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedApplication && (
                                    <div className="grid md:grid-cols-2 gap-4 py-4">
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-blue-900">Kişisel Bilgiler</h4>
                                        <div><strong>Ad Soyad:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</div>
                                        <div><strong>Email:</strong> {selectedApplication.email}</div>
                                        <div><strong>Telefon:</strong> {selectedApplication.phone}</div>
                                        <div><strong>Pasaport No:</strong> {selectedApplication.passportNumber}</div>
                                        <div><strong>Pasaport Veriliş:</strong> {selectedApplication.passportIssueDate ? formatDate(selectedApplication.passportIssueDate) : 'N/A'}</div>
                                        <div><strong>Pasaport Geçerlilik:</strong> {selectedApplication.passportExpiryDate ? formatDate(selectedApplication.passportExpiryDate) : 'N/A'}</div>
                                        <div><strong>Doğum Tarihi:</strong> {selectedApplication.dateOfBirth ? formatDate(selectedApplication.dateOfBirth) : 'N/A'}</div>
                                        <div><strong>Doğum Yeri:</strong> {selectedApplication.placeOfBirth || 'N/A'}</div>
                                        <div><strong>Anne Adı:</strong> {selectedApplication.motherName || 'N/A'}</div>
                                        <div><strong>Baba Adı:</strong> {selectedApplication.fatherName || 'N/A'}</div>
                                        <div><strong>Adres:</strong> {selectedApplication.address || 'N/A'}</div>
                                      </div>
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-blue-900">Başvuru Bilgileri</h4>
                                        <div><strong>Hangi Ülkeden:</strong> {selectedApplication.countryOfOrigin || selectedApplication.countryId}</div>
                                        <div><strong>Varış Tarihi:</strong> {selectedApplication.arrivalDate ? formatDate(selectedApplication.arrivalDate) : 'N/A'}</div>
                                        <div><strong>İşlem Türü:</strong> {selectedApplication.processingType}</div>
                                        <div><strong>Belge Türü:</strong> {selectedApplication.documentType}</div>
                                        <div><strong>Destekleyici Belge:</strong> {getSupportingDocumentTypeDisplay((selectedApplication as any).supportingDocumentType || (selectedApplication as any).supporting_document_type, (selectedApplication as any).supportingDocumentCountry || (selectedApplication as any).supporting_document_country, (selectedApplication as any).supportingDocumentNumber || (selectedApplication as any).supporting_document_number)}</div>
                                        <div><strong>Belge No:</strong> {selectedApplication.supportingDocumentNumber || 'N/A'}</div>
                                        <div><strong>Belge Başlangıç:</strong> {selectedApplication.supportingDocumentStartDate ? formatDate(selectedApplication.supportingDocumentStartDate) : 'N/A'}</div>
                                        <div><strong>Belge Bitiş:</strong> {selectedApplication.supportingDocumentEndDate ? formatDate(selectedApplication.supportingDocumentEndDate) : 'N/A'}</div>
                                        <div><strong>Toplam Tutar:</strong> ${selectedApplication.totalAmount}</div>
                                        <div><strong>Ödeme Durumu:</strong> {selectedApplication.paymentStatus}</div>
                                        <div><strong>Başvuru Durumu:</strong> {selectedApplication.status}</div>
                                        <div><strong>Başvuru Tarihi:</strong> {formatDate(selectedApplication.createdAt!)}</div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              {app.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApproveWithPdf(app.id, "visa")}
                                    disabled={updateApplicationStatusMutation.isPending}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Onayla + Dosya
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateApplicationStatusMutation.mutate({ id: app.id, status: "rejected" })}
                                    disabled={updateApplicationStatusMutation.isPending}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reddet
                                  </Button>
                                </>
                              )}
                              {app.status === "approved" && (
                                <div className="text-green-600 font-medium">
                                  ✓ Onaylandı & E-posta Gönderildi
                                </div>
                              )}
                              {app.status === "rejected" && (
                                <div className="text-red-600 font-medium">
                                  ✗ Reddedildi & E-posta Gönderildi
                                </div>
                              )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Visa Applications Pagination */}
                {applicationsData && applicationsData.totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-gray-700">
                      Sayfa {applicationsData.currentPage} / {applicationsData.totalPages} 
                      (Toplam {applicationsData.totalCount} kayıt)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(applicationsData.totalPages, currentPage + 1))}
                        disabled={currentPage === applicationsData.totalPages}
                      >
                        Sonraki
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insurance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sigorta Başvuruları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Başvuru No</TableHead>
                        <TableHead>Ad Soyad</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Pasaport</TableHead>
                        <TableHead>Ülke</TableHead>
                        <TableHead>Seyahat Tarihi</TableHead>
                        <TableHead>Dönüş Tarihi</TableHead>
                        <TableHead>Hedef</TableHead>
                        <TableHead>Kaç Gün</TableHead>
                        <TableHead>Ürün ID</TableHead>
                        <TableHead>Tutar</TableHead>
                        <TableHead>Ödeme Durumu</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insuranceLoading ? (
                        <TableRow>
                          <TableCell colSpan={16} className="text-center py-8">
                            Sigorta başvuruları yükleniyor...
                          </TableCell>
                        </TableRow>
                      ) : insuranceError ? (
                        <TableRow>
                          <TableCell colSpan={16} className="text-center py-8 text-red-500">
                            Hata: {insuranceError.message}
                          </TableCell>
                        </TableRow>
                      ) : filteredInsuranceApplications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={16} className="text-center py-8">
                            Hiç sigorta başvurusu bulunamadı. Debug: isAuth={isAuthenticated ? 'true' : 'false'}, hasData={!!insuranceApplicationsData ? 'true' : 'false'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInsuranceApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.applicationNumber}</TableCell>
                          <TableCell>{app.firstName} {app.lastName}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>{(app as any).passportNumber || 'N/A'}</TableCell>
                          <TableCell>{(app as any).countryOfOrigin || 'N/A'}</TableCell>
                          <TableCell>{formatDate(app.travelDate)}</TableCell>
                          <TableCell>{formatDate(app.returnDate)}</TableCell>
                          <TableCell>{app.destination}</TableCell>
                          <TableCell>{app.tripDurationDays || 'N/A'} gün</TableCell>
                          <TableCell>{app.productId}</TableCell>
                          <TableCell>${app.totalAmount}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {/* Payment Status Badge */}
                              {app.paymentStatus === "completed" || app.paymentStatus === "succeeded" ? (
                                <Badge variant="default" className="bg-green-500">✓ Ödemesi Tamam</Badge>
                              ) : app.paymentStatus === "processing" ? (
                                <Badge variant="secondary" className="bg-yellow-500">⏳ İşlemde</Badge>
                              ) : app.paymentStatus === "failed" ? (
                                <Badge variant="destructive">✗ Başarısız</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100">⏸️ Beklemede</Badge>
                              )}
                              
                              {/* Travel Date Countdown - Show for ALL applications */}
                              {app.travelDate && (() => {
                                const today = new Date();
                                const travelDate = new Date(app.travelDate);
                                const diffTime = travelDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays <= 0) {
                                  return <span className="text-xs text-red-600 font-medium">🚨 Seyahat tarihi geçti!</span>;
                                } else if (diffDays <= 7) {
                                  return <span className="text-xs text-orange-600 font-medium">⚠️ {diffDays} gün kaldı!</span>;
                                } else if (diffDays <= 30) {
                                  return <span className="text-xs text-blue-600">{diffDays} gün kaldı</span>;
                                } else {
                                  return <span className="text-xs text-green-600">{diffDays} gün</span>;
                                }
                              })()}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>{formatDate(app.createdAt!)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedInsuranceApp(app)}
                                  >
                                    <Info className="w-4 h-4 mr-1" />
                                    İncele
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="insurance-application-details">
                                  <DialogHeader>
                                    <DialogTitle>Sigorta Başvuru Detayları - {app.applicationNumber}</DialogTitle>
                                    <DialogDescription id="insurance-application-details">
                                      Sigorta başvurusunun detaylı bilgilerini görüntüleme ve onaylama paneli
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedInsuranceApp && (
                                    <div className="grid md:grid-cols-2 gap-4 py-4">
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-blue-900">Kişisel Bilgiler</h4>
                                        <div><strong>Ad Soyad:</strong> {selectedInsuranceApp.firstName} {selectedInsuranceApp.lastName}</div>
                                        <div><strong>Email:</strong> {selectedInsuranceApp.email}</div>
                                        <div><strong>Telefon:</strong> {selectedInsuranceApp.phone}</div>
                                        <div><strong>Pasaport No:</strong> {(selectedInsuranceApp as any).passportNumber || 'N/A'}</div>
                                        <div><strong>Ülke:</strong> {(selectedInsuranceApp as any).countryOfOrigin || 'N/A'}</div>
                                        <div><strong>Doğum Tarihi:</strong> {selectedInsuranceApp.dateOfBirth || 'N/A'}</div>
                                        <div><strong>Hedef:</strong> {selectedInsuranceApp.destination}</div>
                                        
                                        {/* Parent ID Photos Display for Under 18 */}
                                        {selectedInsuranceApp.parentIdPhotos && Array.isArray(selectedInsuranceApp.parentIdPhotos) && (selectedInsuranceApp.parentIdPhotos as any[]).length > 0 ? (
                                          <div className="space-y-3">
                                            <div><strong>Ebeveyn Kimlik Fotoğrafları:</strong> (18 yaş altı)</div>
                                            
                                            {/* Group photos by type if available */}
                                            {(() => {
                                              const motherPhotos = selectedInsuranceApp.parentIdPhotos.filter((photo: any) => 
                                                typeof photo === 'object' && photo.type === 'mother'
                                              );
                                              const fatherPhotos = selectedInsuranceApp.parentIdPhotos.filter((photo: any) => 
                                                typeof photo === 'object' && photo.type === 'father'
                                              );
                                              const generalPhotos = selectedInsuranceApp.parentIdPhotos.filter((photo: any) => 
                                                typeof photo === 'string' || (typeof photo === 'object' && photo.type === 'parent')
                                              );

                                              return (
                                                <div className="space-y-4">
                                                  {/* Mother's Photos */}
                                                  {motherPhotos.length > 0 && (
                                                    <div className="border border-pink-200 bg-pink-50 rounded-lg p-3">
                                                      <div className="text-sm font-semibold text-pink-800 mb-2">👩 Anne Kimlik Fotoğrafları</div>
                                                      <div className="grid grid-cols-2 gap-2">
                                                        {motherPhotos.map((photo: any, index: number) => (
                                                          <div key={`mother-${index}`} className="border rounded-lg p-2 bg-white">
                                                            <img 
                                                              src={photo.data} 
                                                              alt={`Anne Kimlik ${index + 1}`}
                                                              className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                                                              onClick={() => {
                                                                const newWindow = window.open();
                                                                if (newWindow) {
                                                                  newWindow.document.write(`
                                                                    <html>
                                                                      <head><title>Anne Kimlik ${index + 1}</title></head>
                                                                      <body style="margin:0;padding:20px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                                                                        <img src="${photo.data}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Anne Kimlik ${index + 1}"/>
                                                                      </body>
                                                                    </html>
                                                                  `);
                                                                  newWindow.document.close();
                                                                }
                                                              }}
                                                            />
                                                            <p className="text-xs text-gray-600 mt-1 text-center">Anne Kimlik {index + 1}</p>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Father's Photos */}
                                                  {fatherPhotos.length > 0 && (
                                                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                                                      <div className="text-sm font-semibold text-blue-800 mb-2">👨 Baba Kimlik Fotoğrafları</div>
                                                      <div className="grid grid-cols-2 gap-2">
                                                        {fatherPhotos.map((photo: any, index: number) => (
                                                          <div key={`father-${index}`} className="border rounded-lg p-2 bg-white">
                                                            <img 
                                                              src={photo.data} 
                                                              alt={`Baba Kimlik ${index + 1}`}
                                                              className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                                                              onClick={() => {
                                                                const newWindow = window.open();
                                                                if (newWindow) {
                                                                  newWindow.document.write(`
                                                                    <html>
                                                                      <head><title>Baba Kimlik ${index + 1}</title></head>
                                                                      <body style="margin:0;padding:20px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                                                                        <img src="${photo.data}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Baba Kimlik ${index + 1}"/>
                                                                      </body>
                                                                    </html>
                                                                  `);
                                                                  newWindow.document.close();
                                                                }
                                                              }}
                                                            />
                                                            <p className="text-xs text-gray-600 mt-1 text-center">Baba Kimlik {index + 1}</p>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* General Parent Photos (backward compatibility) */}
                                                  {generalPhotos.length > 0 && (
                                                    <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                                                      <div className="text-sm font-semibold text-gray-800 mb-2">📄 Ebeveyn Kimlik Fotoğrafları</div>
                                                      <div className="grid grid-cols-2 gap-2">
                                                        {generalPhotos.map((photo: any, index: number) => {
                                                          const photoSrc = typeof photo === 'string' ? photo : photo.data;
                                                          return (
                                                            <div key={`general-${index}`} className="border rounded-lg p-2 bg-white">
                                                              <img 
                                                                src={photoSrc} 
                                                                alt={`Ebeveyn Kimlik ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                                                                onClick={() => {
                                                                  const newWindow = window.open();
                                                                  if (newWindow) {
                                                                    newWindow.document.write(`
                                                                      <html>
                                                                        <head><title>Ebeveyn Kimlik ${index + 1}</title></head>
                                                                        <body style="margin:0;padding:20px;background:#f0f0f0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                                                                          <img src="${photoSrc}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Ebeveyn Kimlik ${index + 1}"/>
                                                                        </body>
                                                                      </html>
                                                                    `);
                                                                    newWindow.document.close();
                                                                  }
                                                                }}
                                                              />
                                                              <p className="text-xs text-gray-600 mt-1 text-center">Ebeveyn Kimlik {index + 1}</p>
                                                            </div>
                                                          );
                                                        })}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        ) : (
                                          // Check if user is under 18 but no parent photos
                                          (() => {
                                            if (selectedInsuranceApp.dateOfBirth) {
                                              const birthDate = new Date(selectedInsuranceApp.dateOfBirth);
                                              const today = new Date();
                                              const age = today.getFullYear() - birthDate.getFullYear();
                                              const monthDiff = today.getMonth() - birthDate.getMonth();
                                              
                                              const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                                              
                                              if (actualAge < 18) {
                                                return (
                                                  <div className="text-red-600">
                                                    <strong>⚠️ Eksik:</strong> 18 yaş altı - Ebeveyn kimlik fotoğrafları gerekli ama yüklenmemiş!
                                                  </div>
                                                );
                                              }
                                            }
                                            return null;
                                          })()
                                        )}
                                      </div>
                                      <div className="space-y-3">
                                        <h4 className="font-semibold text-blue-900">Seyahat Bilgileri</h4>
                                        <div><strong>Seyahat Tarihi:</strong> {formatDate(selectedInsuranceApp.travelDate)}</div>
                                        <div><strong>Dönüş Tarihi:</strong> {formatDate(selectedInsuranceApp.returnDate)}</div>
                                        <div><strong>Kaç Gün:</strong> {selectedInsuranceApp.tripDurationDays || 'N/A'} gün</div>
                                        <div><strong>Ürün ID:</strong> {selectedInsuranceApp.productId}</div>
                                        <div><strong>Toplam Tutar:</strong> ${selectedInsuranceApp.totalAmount}</div>
                                        <div><strong>Ödeme Durumu:</strong> {selectedInsuranceApp.paymentStatus}</div>
                                        <div><strong>Başvuru Durumu:</strong> {selectedInsuranceApp.status}</div>
                                        <div><strong>Başvuru Tarihi:</strong> {formatDate(selectedInsuranceApp.createdAt!)}</div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              {app.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApproveWithPdf(app.id, "insurance")}
                                    disabled={updateInsuranceStatusMutation.isPending}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Onayla + Dosya
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateInsuranceStatusMutation.mutate({ id: app.id, status: "rejected" })}
                                    disabled={updateInsuranceStatusMutation.isPending}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reddet
                                  </Button>
                                </>
                              )}
                              {app.status === "approved" && (
                                <div className="text-green-600 font-medium">
                                  ✓ Onaylandı & E-posta Gönderildi
                                </div>
                              )}
                              {app.status === "rejected" && (
                                <div className="text-red-600 font-medium">
                                  ✗ Reddedildi & E-posta Gönderildi
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Insurance Applications Pagination */}
                {insuranceApplicationsData && insuranceApplicationsData.totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-gray-700">
                      Sayfa {insuranceApplicationsData.currentPage} / {insuranceApplicationsData.totalPages} 
                      (Toplam {insuranceApplicationsData.totalCount} kayıt)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInsuranceCurrentPage(Math.max(1, insuranceCurrentPage - 1))}
                        disabled={insuranceCurrentPage === 1}
                      >
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInsuranceCurrentPage(Math.min(insuranceApplicationsData.totalPages, insuranceCurrentPage + 1))}
                        disabled={insuranceCurrentPage === insuranceApplicationsData.totalPages}
                      >
                        Sonraki
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chat" className="mt-6">
            <ChatAdminPanel />
          </TabsContent>
        </Tabs>

        {/* PDF Upload Dialog */}
        <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
          <DialogContent className="max-w-md" aria-describedby="pdf-upload-description">
            <DialogHeader>
              <DialogTitle>
                {currentAppType === "visa" ? "E-Visa" : "Sigorta Poliçesi"} PDF Dosyası Ekle
              </DialogTitle>
            </DialogHeader>
            <div id="pdf-upload-description" className="text-sm text-gray-600 mb-4">
              {currentAppType === "visa" ? "E-visa" : "Sigorta poliçesi"} PDF dosyasını yükleyerek müşteriye e-posta ile gönderin.
            </div>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="pdf-upload">PDF Dosyası Seç (İsteğe bağlı - Max 5MB)</Label>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PDF dosyası maksimum 5MB olmalıdır
                </p>
                {pdfFile && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ PDF dosyası seçildi
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handlePdfSubmit}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Onayla & E-posta Gönder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPdfDialogOpen(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}