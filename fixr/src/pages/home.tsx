import { MainLayout } from "@/components/layout/main-layout";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Droplets, Zap, Paintbrush, Wind, ShieldCheck, Clock, ThumbsUp } from "lucide-react";

export default function Home() {
  const { data: services, isLoading } = useListServices();

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("plumb")) return <Droplets className="w-8 h-8" />;
    if (lower.includes("electri")) return <Zap className="w-8 h-8" />;
    if (lower.includes("paint")) return <Paintbrush className="w-8 h-8" />;
    if (lower.includes("ac") || lower.includes("air")) return <Wind className="w-8 h-8" />;
    return <Wrench className="w-8 h-8" />;
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-24 pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover bg-center" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Your home fixed.<br />
              <span className="text-amber-500">Without the anxiety.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl">
              Fast, trustworthy neighborhood handyman network for urban India. Book a verified professional in minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base"
              >
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Verified Professionals</h3>
              <p className="text-muted-foreground">Every Fixr is background-checked, trained, and heavily vetted.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Emergency Service</h3>
              <p className="text-muted-foreground">Pipe burst? Power cut? Get a Fixr to your door within 60 minutes.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground">AI-estimated costs upfront. No haggling, no hidden fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">What do you need fixed?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose from our range of professional home services. Prices are clear, starting rates are honest.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl h-48 border border-border animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/book?service=${encodeURIComponent(service.name)}`} className="block group">
                    <div className="bg-white rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-all hover:border-amber-500/50 flex flex-col h-full">
                      <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform origin-left">
                        {getIcon(service.name)}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-slate-900">{service.name}</h3>
                      <p className="text-muted-foreground mb-6 line-clamp-2">{service.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-semibold text-slate-900">From ₹{service.basePrice}</span>
                        <span className="text-amber-600 group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
