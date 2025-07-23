import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Smartphone, Monitor, Tablet } from "lucide-react";

export default function MobileTest() {
  const [currentTest, setCurrentTest] = useState("insurance");
  const [testResults, setTestResults] = useState({
    header: "pending",
    background: "pending", 
    typography: "pending",
    form: "pending",
    countries: "pending",
    dates: "pending",
    payment: "pending",
    products: "pending",
    performance: "pending",
    touch: "pending"
  });

  const tests = [
    { id: "header", name: "Header Navigation", desc: "Menu collapsible, logo visible, responsive layout" },
    { id: "background", name: "Background Image", desc: "Professional team image loads, proper positioning" },
    { id: "typography", name: "Typography", desc: "Headers scale properly (text-2xl → text-3xl → text-4xl)" },
    { id: "form", name: "Form Layout", desc: "2-column grid on mobile (md:grid-cols-2), proper spacing" },
    { id: "countries", name: "Country Selector", desc: "Flags display, dropdown works, search functionality" },
    { id: "dates", name: "Date Dropdowns", desc: "Day/Month/Year dropdowns work, proper validation" },
    { id: "payment", name: "Payment Integration", desc: "Payment form submits, GPay redirect works" },
    { id: "products", name: "Insurance Products", desc: "7 products display correctly, pricing visible" },
    { id: "performance", name: "Loading Performance", desc: "Fast skeleton loading, no delays in navigation" },
    { id: "touch", name: "Touch Interactions", desc: "Buttons respond to touch, no accidental clicks" }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pass": return <Badge className="bg-green-100 text-green-800">PASS</Badge>;
      case "fail": return <Badge className="bg-red-100 text-red-800">FAIL</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>;
    }
  };

  const markTestResult = (testId: string, result: "pass" | "fail") => {
    setTestResults(prev => ({ ...prev, [testId]: result }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Mobile Responsive Test</h1>
            <p className="text-lg text-gray-600">Turkey E-Visa Insurance System Mobile Compatibility</p>
          </div>

          {/* Test Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              variant={currentTest === "insurance" ? "default" : "outline"}
              onClick={() => setCurrentTest("insurance")}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Test Insurance Page
            </Button>
            <Button 
              variant={currentTest === "apply" ? "default" : "outline"}
              onClick={() => setCurrentTest("apply")}
              className="flex items-center gap-2"
            >
              <Tablet className="h-4 w-4" />
              Test Apply Page
            </Button>
            <Button 
              variant={currentTest === "home" ? "default" : "outline"}
              onClick={() => setCurrentTest("home")}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              Test Home Page
            </Button>
          </div>

          {/* Test Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{test.name}</CardTitle>
                    {getStatusBadge(testResults[test.id as keyof typeof testResults])}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3">{test.desc}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => markTestResult(test.id, "pass")}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pass
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => markTestResult(test.id, "fail")}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Fail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Test Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Test Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/insurance', '_blank')}
                >
                  🏥 Insurance Page
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/apply', '_blank')}
                >
                  📝 Apply Page  
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/', '_blank')}
                >
                  🏠 Home Page
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/status', '_blank')}
                >
                  📊 Status Page
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/faq', '_blank')}
                >
                  ❓ FAQ Page
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/requirements', '_blank')}
                >
                  📋 Requirements
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Test Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Manual Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Test "No" button redirect on /apply page (should go to insurance instantly)</li>
                <li>Test insurance form submission with all required fields</li>
                <li>Test nationality dropdown with flag selection</li>
                <li>Test date dropdowns for travel dates</li>
                <li>Test payment flow (GPay integration)</li>
                <li>Check header navigation and footer</li>
                <li>Verify loading states and skeleton animation</li>
                <li>Test portrait/landscape orientation</li>
                <li>Check touch target sizes (minimum 44px)</li>
                <li>Verify responsive breakpoints (sm, md, lg)</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}