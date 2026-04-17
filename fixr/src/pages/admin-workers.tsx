import { AdminLayout } from "@/components/layout/admin-layout";
import { useListWorkers } from "@workspace/api-client-react";
import { ShieldCheck, ShieldAlert, Star, Search, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function AdminWorkers() {
  const [search, setSearch] = useState("");
  const { data: workers, isLoading } = useListWorkers({ search: search || undefined });

  return (
    <AdminLayout>
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
        <div className="p-6 md:p-8 border-b border-border bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Worker Management</h1>
              <p className="text-sm text-muted-foreground mt-1">View, verify, and manage service professionals.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search workers..." 
                className="w-full pl-9 pr-4 h-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-gray-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Worker</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-center">Experience</th>
                    <th className="px-6 py-4 text-center">Rating</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-10 w-48 bg-slate-100 rounded-md"></div></td>
                        <td className="px-6 py-4"><div className="h-5 w-24 bg-slate-100 rounded-md"></div></td>
                        <td className="px-6 py-4"><div className="h-5 w-32 bg-slate-100 rounded-md"></div></td>
                        <td className="px-6 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md mx-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md mx-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded-full"></div></td>
                        <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-100 rounded-md ml-auto"></div></td>
                      </tr>
                    ))
                  ) : workers?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        No workers found matching your search.
                      </td>
                    </tr>
                  ) : (
                    workers?.map((worker) => (
                      <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner"
                              style={{ backgroundColor: worker.avatarColor }}
                            >
                              {worker.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{worker.name}</div>
                              <div className="text-xs text-slate-500">ID: WKR-{worker.id.toString().padStart(4, '0')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700">{worker.specialty}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600">{worker.locationCity}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {worker.experienceYears} yrs
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 font-medium">
                            {worker.rating.toFixed(1)}
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {worker.verified ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
