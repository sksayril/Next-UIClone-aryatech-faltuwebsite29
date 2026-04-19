import { 
  Home, 
  Clock, 
  Flame, 
  PlaySquare,
  History,
  ThumbsUp,
  Library,
  ChevronRight,
  User,
  Film,
  Music2,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  ShoppingBag,
  Podcast,
  Clapperboard,
  Youtube
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const primaryItems = [
    { icon: Home, label: "Home", href: "/", active: location === "/" },
    { icon: Film, label: "Shorts", href: "/shorts" },
    { icon: Clapperboard, label: "Subscriptions", href: "/subscriptions" },
  ];

  const secondaryItems = [
    { icon: Library, label: "You", href: "/you", header: true },
    { icon: History, label: "History", href: "/history" },
    { icon: PlaySquare, label: "Your videos", href: "/your-videos" },
    { icon: Clock, label: "Watch later", href: "/watch-later" },
    { icon: ThumbsUp, label: "Liked videos", href: "/liked" },
  ];

  const exploreItems = [
    { icon: Flame, label: "Trending", href: "/trending" },
    { icon: ShoppingBag, label: "Shopping", href: "/shopping" },
    { icon: Music2, label: "Music", href: "/music" },
    { icon: Clapperboard, label: "Movies", href: "/movies" },
    { icon: Gamepad2, label: "Gaming", href: "/gaming" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: Trophy, label: "Sports", href: "/sports" },
    { icon: Lightbulb, label: "Courses", href: "/courses" },
    { icon: Podcast, label: "Podcasts", href: "/podcasts" },
  ];

  const NavSection = ({ items, title }: { items: any[], title?: string }) => (
    <div className="py-3 border-b border-white/10 last:border-0">
      {title && (
        <div className="px-6 py-2 flex items-center gap-2 group cursor-pointer">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <ChevronRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="px-3 space-y-1">
        {items.map((item) => (
          item.header ? (
            <div key={item.label} className="px-3 py-2 flex items-center gap-2 group cursor-pointer hover:bg-white/10 rounded-lg">
               <h3 className="text-base font-bold text-white flex-1">{item.label}</h3>
               <ChevronRight className="h-4 w-4 text-white" />
            </div>
          ) : (
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
          )
        ))}
      </div>
    </div>
  );

  return (
    <aside className={cn("w-60 bg-[#0f0f0f] flex flex-col h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide", className)}>
      <NavSection items={primaryItems} />
      <NavSection items={secondaryItems} />
      
      <div className="py-3 border-b border-white/10">
        <h3 className="px-6 py-2 text-sm font-medium text-white">Subscriptions</h3>
        <div className="px-3 space-y-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
              <div className="h-6 w-6 rounded-full bg-blue-500 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Channel" />
              </div>
              <span className="text-sm text-white truncate">Channel Name {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <NavSection items={exploreItems} title="Explore" />

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

