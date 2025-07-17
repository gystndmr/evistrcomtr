import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";

export default function DebugPayment() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("01k0c2zxvymffgs5q4m62cmzmx");

  const testPaymentAPI = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/payment/create", {
        amount: 114,
        currency: "USD",
        orderId: "DEBUG-TEST-" + Date.now(),
        description: "Debug Test Payment",
        customerEmail: "debug@test.com",
        customerName: "Debug Test"
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      
      if (data.success && data.paymentUrl) {
        setTimeout(() => {
          window.location.href = data.paymentUrl;
        }, 2000);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  const testDirectRedirect = () => {
    const url = `https://getvisa.gpayprocessing.com/checkout/${transactionId}`;
    setResult(`Redirecting to: ${url}`);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>GPay Payment Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>

            <div className="space-y-2">
              <Button onClick={testPaymentAPI} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test Payment API"}
              </Button>
              
              <Button onClick={testDirectRedirect} variant="outline" className="w-full">
                Test Direct Redirect
              </Button>
            </div>

            {result && (
              <Alert>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}