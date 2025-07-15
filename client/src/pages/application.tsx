import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { VisaForm } from "@/components/visa-form";
import { Star } from "lucide-react";
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
      
      <section className="relative py-16 bg-gradient-to-br from-blue-50 to-red-50 min-h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-full mb-4 shadow-lg">
              <div className="relative flex items-center justify-center">
                {/* Turkish Flag: Crescent and Star */}
                <svg className="w-6 h-6 text-white" viewBox="0 0 30 20" fill="currentColor">
                  {/* Crescent Moon */}
                  <path d="M8 4C8 4 6 6 6 10C6 14 8 16 8 16C6 16 4 14 4 10C4 6 6 4 8 4Z" />
                  {/* Five-pointed Star */}
                  <path d="M16 6L17.5 9.5L21 9.5L18.25 12L19.5 15.5L16 13.5L12.5 15.5L13.75 12L11 9.5L14.5 9.5L16 6Z" />
                </svg>
              </div>
            </div>
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
