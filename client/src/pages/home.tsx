import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard, CreditCard, Download, Shield, Star, Crown, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Turkey E-Visa Application</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Official Government Service for Electronic Visa Applications</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/application">
                <Button size="lg" className="bg-white text-primary hover:bg-neutral-100 px-8 py-4 text-lg">
                  <IdCard className="w-5 h-5 mr-2" />
                  Apply for E-Visa
                </Button>
              </Link>
              <Link href="/status">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Check Application Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Simple 3-Step Process</h2>
            <p className="text-lg text-neutral-600">Get your Turkish e-visa in minutes</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Complete Application</h3>
              <p className="text-neutral-600">Fill out the visa application form with your correct information</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Make Payment</h3>
              <p className="text-neutral-600">Pay securely with your credit card or debit card</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Download E-Visa</h3>
              <p className="text-neutral-600">Download your e-visa when application is completed successfully</p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Insurance Services */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Travel Insurance Services</h2>
            <p className="text-lg text-neutral-600">Protect your trip with comprehensive travel insurance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Basic Coverage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Medical Emergency Coverage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Trip Cancellation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Lost Luggage Protection
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    24/7 Support
                  </li>
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">$29.99</div>
                  <Link href="/insurance">
                    <Button className="w-full">Get Basic Coverage</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <div className="text-center">
                  <Star className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Premium Coverage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    All Basic Coverage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Adventure Sports Coverage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Pre-existing Conditions
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Rental Car Protection
                  </li>
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">$59.99</div>
                  <Link href="/insurance">
                    <Button className="w-full">Get Premium Coverage</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="text-center">
                  <Crown className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle>Comprehensive</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    All Premium Coverage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Business Equipment
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Extended Stay Coverage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Concierge Services
                  </li>
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">$99.99</div>
                  <Link href="/insurance">
                    <Button className="w-full">Get Comprehensive</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
