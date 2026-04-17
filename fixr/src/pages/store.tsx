import { MainLayout } from "@/components/layout/main-layout";
import { useListMaterials, MaterialCategory } from "@workspace/api-client-react";
import { useState } from "react";
import { Search, ShoppingCart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Store() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();

  const { data: materials, isLoading } = useListMaterials({
    search: search || undefined,
    category: category !== "all" ? category : undefined
  });

  const categories = [
    { id: "all", label: "All Items" },
    { id: "plumbing", label: "Plumbing" },
    { id: "electrical", label: "Electrical" },
    { id: "hardware_tools", label: "Hardware & Tools" },
    { id: "paint", label: "Paint" }
  ];

  const handleAddToCart = (name: string) => {
    setCartCount(prev => prev + 1);
    toast({
      title: "Added to Job",
      description: `${name} has been added to your materials list.`
    });
  };

  return (
    <MainLayout>
      <div className="border-b border-border bg-white sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Materials Store</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search materials..." 
                className="w-full pl-9 pr-4 h-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 h-10 px-4 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex-shrink-0">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-6 py-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`pb-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  category === c.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-slate-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 flex-1">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-white rounded-xl h-72 border border-border animate-pulse" />
              ))}
            </div>
          ) : materials?.length === 0 ? (
            <div className="text-center py-24 bg-white border border-border rounded-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">No materials found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {materials?.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col group">
                    <div className="aspect-square bg-slate-100 border-b border-border flex items-center justify-center p-6 relative">
                      <div className="w-16 h-16 bg-slate-200 rounded-md rotate-3 absolute group-hover:rotate-6 transition-transform"></div>
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-md -rotate-3 shadow-sm absolute group-hover:-rotate-6 transition-transform flex items-center justify-center text-slate-400">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 uppercase tracking-wider">
                        {material.category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{material.brand}</div>
                      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 leading-tight flex-1">{material.name}</h3>
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                        <div>
                          <span className="font-bold text-lg text-slate-900">₹{material.price}</span>
                          <span className="text-xs text-slate-500 ml-1">/{material.unit}</span>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(material.name)}
                          className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
