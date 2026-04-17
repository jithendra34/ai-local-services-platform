import { MainLayout } from "@/components/layout/main-layout";
import { useGetBooking, useUpdateBookingStatus, BookingStatus } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin, Calendar, ArrowLeft, CheckCircle2, Clock, Wrench, ChevronRight, Activity, ShieldCheck, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function BookingDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: booking, isLoading, refetch } = useGetBooking(id, { query: { enabled: !!id } });
  const updateStatusMutation = useUpdateBookingStatus();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = (status: BookingStatus) => {
    setIsUpdating(true);
    updateStatusMutation.mutate(
      {
        id,
        data: { status }
      },
      {
        onSuccess: () => {
          toast({ title: "Status Updated", description: `Booking marked as ${status}` });
          refetch();
          setIsUpdating(false);
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
          setIsUpdating(false);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!booking) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Link href="/bookings" className="text-primary hover:underline">Return to bookings</Link>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-50 text-red-600 border-red-200";
      case "urgent": return "bg-orange-50 text-orange-600 border-orange-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const timelineSteps = [
    { label: "Booking Created", time: format(new Date(booking.createdAt), "MMM d, yyyy h:mm a"), active: true, icon: <Activity className="w-4 h-4" /> },
    { label: "Worker Assigned", time: booking.workerId ? "Assigned" : "Pending", active: !!booking.workerId, icon: <User className="w-4 h-4" /> },
    { label: "Job In Progress", time: booking.status === "in_progress" || booking.status === "completed" ? "In Progress" : "Pending", active: booking.status === "in_progress" || booking.status === "completed", icon: <Wrench className="w-4 h-4" /> },
    { label: "Job Completed", time: booking.completedAt ? format(new Date(booking.completedAt), "MMM d, yyyy h:mm a") : "Pending", active: booking.status === "completed", icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/bookings" className="inline-flex items-center text-sm text-muted-foreground hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Bookings
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">#{booking.id.toString().padStart(4, '0')}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                {booking.status.replace('_', ' ')}
              </span>
              {booking.urgency !== 'normal' && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getUrgencyColor(booking.urgency)}`}>
                  {booking.urgency}
                </span>
              )}
            </div>
            <h2 className="text-xl text-slate-600 font-medium">{booking.service}</h2>
          </div>

          {/* Actions for demo purposes - normally these would be worker/admin actions */}
          <div className="flex gap-2">
            {booking.status === "pending" && (
              <button 
                onClick={() => handleStatusUpdate("cancelled")} 
                disabled={isUpdating}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-border pb-4">Job Details</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Description</h4>
                  <p className="text-slate-900 bg-slate-50 p-4 rounded-md text-sm leading-relaxed border border-slate-100">
                    {booking.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-primary"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Location</h4>
                      <p className="text-slate-900 mt-1">{booking.address}</p>
                      <p className="text-slate-600 text-sm">{booking.city}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-0.5 text-primary"><Calendar className="w-5 h-5" /></div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Requested On</h4>
                      <p className="text-slate-900 mt-1">{format(new Date(booking.createdAt), "MMM d, yyyy")}</p>
                      <p className="text-slate-600 text-sm">{format(new Date(booking.createdAt), "h:mm a")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Worker Assigned Section */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Assigned Professional
              </h3>
              
              {booking.workerId ? (
                <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-slate-50">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    W
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Worker #{booking.workerId}</p>
                    <p className="text-sm text-muted-foreground">Verified Professional</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed border-border rounded-lg bg-slate-50">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Matching with a professional...</p>
                  <p className="text-sm text-slate-500 mt-1">We'll notify you once a worker accepts this job.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Payment Summary */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                Payment Summary
                <span className="text-xs font-normal bg-slate-800 px-2 py-1 rounded text-slate-300">ESTIMATE</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-slate-300">
                  <span>Base Service</span>
                  <span>₹{booking.baseCost}</span>
                </div>
                
                {booking.urgencyFee > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Urgency Fee ({booking.urgency})</span>
                    <span>+₹{booking.urgencyFee}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                  <div>
                    <div className="font-bold text-xl text-amber-500">Total</div>
                    <div className="text-xs text-slate-400 mt-1">To be paid after completion</div>
                  </div>
                  <div className="font-bold text-2xl text-white">₹{booking.totalCost}</div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Status Timeline</h3>
              
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${step.active ? 'bg-primary text-primary-foreground' : 'bg-slate-200 text-slate-400'}`}>
                      {step.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${step.active ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</h4>
                      <p className="text-xs text-slate-500 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
