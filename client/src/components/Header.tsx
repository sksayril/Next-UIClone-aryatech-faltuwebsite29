import { Search, Menu, Camera, Upload, Settings, ChevronDown, Heart, Crown, Bell, User, X, Play, Mic, Video, Grid, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVideos } from "@/hooks/use-videos";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useLocation();
  
  // Sync search with URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const urlSearchQuery = searchParams.get('search') || '';
    if (urlSearchQuery && urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [location]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setLocation(`/?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-[#0f0f0f] flex items-center px-4 justify-between gap-4">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <img src="/xxx_heart_logo.png" className="h-9 w-9 object-contain" alt="Logo" />
          <span className="text-xl md:text-2xl font-black tracking-tighter flex items-center bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            XXXHamster
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-[720px] items-center gap-4">
        <div className="flex flex-1 items-center">
          <div className="relative flex-1 flex h-10">
            <div className="flex-1 relative">
              <Input 
                placeholder="Search" 
                className="w-full h-full bg-[#121212] border-[#303030] text-white placeholder:text-gray-500 yt-search-radius pl-4 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
            </div>
            <Button 
              onClick={() => handleSearch(searchQuery)}
              className="h-full px-5 bg-[#222222] border border-l-0 border-[#303030] hover:bg-[#2a2a2a] text-white yt-search-btn-radius"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="bg-[#181818] hover:bg-[#2a2a2a] text-white rounded-full h-10 w-10">
          <Mic className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Search Icon */}
      {isMobile && (
        <div className="flex-1 flex justify-end">
           <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
            <Search className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full hidden sm:flex">
          <Video className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-600 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-[#0f0f0f]">
            9+
          </span>
        </Button>
        <div className="h-8 w-8 ml-2 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium cursor-pointer overflow-hidden">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=YouTube`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
