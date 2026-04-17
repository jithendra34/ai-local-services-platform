import { MainLayout } from "@/components/layout/main-layout";
import { useListWorkers } from "@workspace/api-client-react";
import { useState } from "react";
import { Search, MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Workers() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");

  const { data: workers, isLoading } = useListWorkers({ 
    search: search || undefined, 
    specialty: specialty || undefined 
  });

  const specialties = ["Plumbing", "Electrical", "Carpentry", "Cleaning", "AC Service", "Painting"];

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Our Verified Professionals</h1>
            <p className="text-lg text-slate-300 mb-8">
              Every Fixr worker goes through a rigorous background check and skills assessment. Trust your home with the best in the neighborhood.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search by name or skill..." 
                  className="w-full pl-10 pr-4 h-12 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select 
                className="h-12 px-4 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[200px]"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="" className="text-slate-900">All Specialties</option>
                {specialties.map(s => (
                  <option key={s} value={s} className="text-slate-900">{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl h-64 border border-border animate-pulse" />
            ))}
          </div>
        ) : workers?.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No workers found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers?.map((worker, index) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="w-16 h-16 rounded-full flex flex-shrink-0 items-center justify-center text-white font-bold text-xl shadow-inner"
                      style={{ backgroundColor: worker.avatarColor }}
                    >
                      {worker.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-1.5">
                        {worker.name}
                        {worker.verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                      </h3>
                      <p className="text-primary font-medium text-sm">{worker.specialty}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm text-slate-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {worker.locationArea}, {worker.locationCity}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 my-2">
                    <div className="text-center border-r border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Experience</div>
                      <div className="font-semibold text-slate-900">{worker.experienceYears} Years</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Rating</div>
                      <div className="font-semibold text-slate-900 flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {worker.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 mb-6">
                    <div className="flex flex-wrap gap-1.5">
                      {worker.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                      {worker.skills.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                          +{worker.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-sm">
                      <span className="text-slate-500">Rate: </span>
                      <span className="font-bold text-slate-900">₹{worker.ratePerHour}/hr</span>
                    </div>
                    <button className="text-primary font-medium text-sm flex items-center group-hover:underline">
                      View Profile <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
