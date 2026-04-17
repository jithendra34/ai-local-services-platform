import { MainLayout } from "@/components/layout/main-layout";
import { useListServices, useEstimateBookingCost, useCreateBooking, CreateBookingBodyUrgency } from "@workspace/api-client-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Clock, FileText, MapPin, Building, AlertCircle } from "lucide-react";

export default function Book() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialService = searchParams.get("service") || "";

  const { data: services, isLoading: isLoadingServices } = useListServices();
  const estimateMutation = useEstimateBookingCost();
  const createMutation = useCreateBooking();
  const { toast } = useToast();

  const [service, setService] = useState(initialService);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [urgency, setUrgency] = useState<CreateBookingBodyUrgency>("normal");

  const [estimate, setEstimate] = useState<{ baseEstimate: number; urgencyFee: number; totalEstimate: number } | null>(null);

  const estimateRef = useRef(estimateMutation.mutate);
  estimateRef.current = estimateMutation.mutate;

  useEffect(() => {
    if (service) {
      estimateRef.current(
        { data: { service, urgency, description } },
        {
          onSuccess: (data) => {
            setEstimate(data);
          }
        }
      );
    } else {
      setEstimate(null);
    }
  }, [service, urgency, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !description || !address || !city) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createMutation.mutate(
      {
        data: {
          service,
          description,
          address,
          city,
          urgency
        }
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Booking Created",
            description: "Your service request has been received.",
          });
          setLocation(`/bookings/${data.id}`);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create booking. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Book a Service</h1>
          <p className="text-muted-foreground">Tell us what you need fixed, and we'll get a professional to your door.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Select Service *
                    </label>
                    <select
                      className="w-full h-11 px-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      required
                    >
                      <option value="">-- Choose a service --</option>
                      {services?.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      Urgency
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['normal', 'urgent', 'emergency'] as const).map(u => (
                        <label 
                          key={u} 
                          className={`cursor-pointer border rounded-md p-3 text-center transition-all ${
                            urgency === u 
                              ? 'border-primary bg-primary/10 text-primary font-medium' 
                              : 'border-border hover:border-primary/50 text-muted-foreground'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="urgency" 
                            value={u} 
                            checked={urgency === u} 
                            onChange={() => setUrgency(u)} 
                            className="sr-only" 
                          />
                          <span className="capitalize">{u}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Issue Description *
                    </label>
                    <textarea
                      className="w-full p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
                      placeholder="Please describe the problem in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Address *
                      </label>
                      <input
                        type="text"
                        className="w-full h-11 px-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="House/Flat No., Street"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary" />
                        City *
                      </label>
                      <input
                        type="text"
                        className="w-full h-11 px-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending || !service || !description || !address || !city}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {createMutation.isPending ? "Creating..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Cost Estimate
              </h3>
              
              {estimateMutation.isPending ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-800 rounded w-1/2 mt-4"></div>
                </div>
              ) : estimate ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Base Estimate</span>
                    <span>₹{estimate.baseEstimate}</span>
                  </div>
                  {estimate.urgencyFee > 0 && (
                    <div className="flex justify-between text-sm text-amber-400">
                      <span>Urgency Fee</span>
                      <span>+₹{estimate.urgencyFee}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-800 flex justify-between font-bold text-lg">
                    <span>Total Estimate</span>
                    <span className="text-amber-500">₹{estimate.totalEstimate}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    *Final cost may vary based on actual work required. AI-generated estimate based on typical cases.
                  </p>
                </motion.div>
              ) : (
                <div className="text-slate-400 text-sm">
                  Select a service to see an AI-generated cost estimate based on historical data.
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">What happens next?</h3>
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">1</div>
                  <p>We'll match your request with a verified professional nearby.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
                  <p>You'll receive a notification when the worker is assigned and on their way.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
                  <p>Worker inspects, confirms final cost, and gets the job done.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
