import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VisaForm } from "@/components/visa-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Application() {
  const { toast } = useToast();

  // Seed initial data on component mount
  const seedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/seed");
    },
    onError: (error) => {
      console.error("Failed to seed data:", error);
    },
  });

  useEffect(() => {
    // Seed data when component mounts
    seedMutation.mutate();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">E-Visa Application</h1>
            <p className="text-lg text-neutral-600">Complete your Turkey e-visa application in simple steps</p>
          </div>
          
          <VisaForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
