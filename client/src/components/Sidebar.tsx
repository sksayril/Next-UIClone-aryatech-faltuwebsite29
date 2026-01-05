import { 
  Home, 
  Heart, 
  Clock, 
  Flame, 
  Trophy, 
  Zap, 
  Star, 
  Users,
  Film
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-videos";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: categories } = useCategories();

  const navItems = [
    { icon: Home, label: "Subscriptions", active: true },
    { icon: Heart, label: "Liked Videos" },
    { icon: Clock, label: "Watch Later" },
    { icon: Clock, label: "History" },
    { icon: Zap, label: "Newest Videos" },
    { icon: Trophy, label: "Best Videos" },
    { icon: Film, label: "Shorts" },
    { icon: Users, label: "Top Creators" },
    { icon: Star, label: "Awards 2025" },
  ];

  return (
    <aside className={cn("w-60 bg-[#151515] flex flex-col h-[calc(100vh-64px)] overflow-y-auto border-r border-[#222]", className)}>
      <div className="p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              item.active 
                ? "bg-[#252525] text-primary" 
                : "text-gray-400 hover:bg-[#252525] hover:text-white"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-2 px-4 pb-2 border-b border-[#222]">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
        <input 
          type="text" 
          placeholder="Filter..." 
          className="w-full bg-[#0a0a0a] border border-[#333] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary mb-2"
        />
      </div>

      <div className="p-2 space-y-0.5">
        {categories?.map((cat) => (
          <button
            key={cat.id}
            className="w-full text-left px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-[#252525] rounded transition-colors flex justify-between items-center group"
          >
            <span>{cat.name}</span>
            {cat.count && (
              <span className="text-[10px] bg-[#333] px-1.5 py-0.5 rounded text-gray-500 group-hover:text-white transition-colors">
                {cat.count}
              </span>
            )}
          </button>
        )) || (
          // Loading skeletons
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-7 w-full bg-[#1e1e1e] rounded animate-pulse mb-1" />
          ))
        )}
      </div>
      
      {/* Footer Area */}
      <div className="mt-auto p-4 border-t border-[#222] text-[10px] text-gray-600">
        <div className="flex flex-wrap gap-2 mb-2">
          <a href="#" className="hover:text-gray-400">Terms</a>
          <a href="#" className="hover:text-gray-400">Privacy</a>
          <a href="#" className="hover:text-gray-400">DMCA</a>
          <a href="#" className="hover:text-gray-400">2257</a>
        </div>
        <p>© 2025 xHamster Clone</p>
      </div>
    </aside>
  );
}
