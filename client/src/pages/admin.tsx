import { useState } from "react";
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
import { Shield, Users, CreditCard, FileText, Eye, Search, Download, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Application, InsuranceApplication } from "@shared/schema";

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
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
    enabled: isAuthenticated,
  });

  const { data: insuranceApplications = [] } = useQuery<InsuranceApplication[]>({
    queryKey: ["/api/admin/insurance-applications"],
    enabled: isAuthenticated,
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

  const filteredApplications = applications.filter(app => 
    app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInsuranceApplications = insuranceApplications.filter(app => 
    app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/applications/${id}/status`, { status });
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
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/insurance-applications/${id}/status`, { status });
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
              placeholder="Ad, soyad, email veya başvuru numarası ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="visa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visa">Vize Başvuruları ({filteredApplications.length})</TabsTrigger>
            <TabsTrigger value="insurance">Sigorta Başvuruları ({filteredInsuranceApplications.length})</TabsTrigger>
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
                        <TableHead>Ülke</TableHead>
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
                          <TableCell>{app.countryId}</TableCell>
                          <TableCell>${app.totalAmount}</TableCell>
                          <TableCell>{getPaymentStatusBadge(app.paymentStatus)}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>{formatDate(app.createdAt!)}</TableCell>
                          <TableCell>
                            {app.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => updateApplicationStatusMutation.mutate({ id: app.id, status: "approved" })}
                                  disabled={updateApplicationStatusMutation.isPending}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Onayla
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
                              </div>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                        <TableHead>Seyahat Tarihi</TableHead>
                        <TableHead>Dönüş Tarihi</TableHead>
                        <TableHead>Tutar</TableHead>
                        <TableHead>Ödeme Durumu</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInsuranceApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.applicationNumber}</TableCell>
                          <TableCell>{app.firstName} {app.lastName}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>{formatDate(app.travelDate)}</TableCell>
                          <TableCell>{formatDate(app.returnDate)}</TableCell>
                          <TableCell>${app.totalAmount}</TableCell>
                          <TableCell>{getPaymentStatusBadge(app.paymentStatus)}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>{formatDate(app.createdAt!)}</TableCell>
                          <TableCell>
                            {app.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => updateInsuranceStatusMutation.mutate({ id: app.id, status: "approved" })}
                                  disabled={updateInsuranceStatusMutation.isPending}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Onayla
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
                              </div>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}