import { MainLayout } from "@/components/layout/main-layout";
import { useListBookings } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronRight, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Bookings() {
  const { data: bookings, isLoading } = useListBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-3.5 h-3.5" />;
      case "completed": return <CheckCircle2 className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-50 text-red-600 border-red-200";
      case "urgent": return "bg-orange-50 text-orange-600 border-orange-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-muted-foreground mt-1">Track and manage your service requests</p>
          </div>
          <Link 
            href="/book" 
            className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
          >
            New Booking
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl h-32 border border-border animate-pulse" />
            ))}
          </div>
        ) : bookings?.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">You haven't requested any services yet. When you do, they will appear here.</p>
            <Link 
              href="/book" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 h-10 px-6"
            >
              Book a Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings?.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/bookings/${booking.id}`} className="block">
                  <div className="bg-white border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-sm transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.replace('_', ' ')}
                          </span>
                          {booking.urgency !== 'normal' && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getUrgencyColor(booking.urgency)}`}>
                              {booking.urgency}
                            </span>
                          )}
                          <span className="text-sm font-medium text-slate-500 ml-auto sm:ml-0">
                            #{booking.id.toString().padStart(4, '0')}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {booking.service}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-1 mt-0.5">
                            {booking.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(booking.createdAt), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {booking.city}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-border sm:pl-6">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-slate-500 mb-0.5">Estimated Cost</div>
                          <div className="text-lg font-bold text-slate-900">₹{booking.totalCost}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
