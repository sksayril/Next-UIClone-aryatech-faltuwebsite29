import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const primaryItems = [
    { icon: Home, label: "Home", href: "/", active: location === "/" }
  ];

  const NavSection = ({ items }: { items: any[] }) => (
    <div className="py-3 border-b border-white/10 last:border-0">
      <div className="px-3 space-y-1">
        {items.map((item) => (
          <Link 
            key={item.label} 
            href={item.href}
            className={cn(
              "w-full flex items-center gap-6 px-3 py-2 rounded-lg text-sm font-normal transition-colors",
              item.active 
                ? "bg-white/10 text-white font-bold" 
                : "text-white hover:bg-white/10"
            )}
          >
            <item.icon className={cn("h-6 w-6", item.active ? "text-white" : "text-white")} />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <aside className={cn("w-60 bg-[#0f0f0f] flex flex-col h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide", className)}>
      <NavSection items={primaryItems} />
      
      <div className="py-3 px-6 text-[12px] text-gray-400 font-bold space-y-4">
        <div className="flex flex-wrap gap-x-2">
          <span>About</span><span>Press</span><span>Copyright</span>
          <span>Contact us</span><span>Creator</span><span>Advertise</span>
          <span>Developers</span>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <span>Terms</span><span>Privacy</span><span>Policy & Safety</span>
          <span>How XXXHamster works</span><span>Test new features</span>
        </div>
        <div className="text-[10px] font-normal text-gray-500">
          © 2025 XXXHamster LLC
        </div>
      </div>
    </aside>
  );
}

