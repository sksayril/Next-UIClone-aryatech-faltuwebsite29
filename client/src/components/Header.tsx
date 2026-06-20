import { Search, Menu, Camera, Upload, Settings, ChevronDown, Heart, Crown, Bell, User, X, Play, Mic, Video, Grid, MoreVertical, ArrowLeft, Loader2 } from "lucide-react";
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  // Sync search with URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const urlSearchQuery = searchParams.get('search') || '';
    if (urlSearchQuery && urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [location]);

  // Reset active suggestion index when search query changes
  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [searchQuery]);

  // Fetch search suggestions with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/videos?search=${encodeURIComponent(searchQuery.trim())}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else if (data && Array.isArray(data.videos)) {
            setSuggestions(data.videos);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setLocation(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      setLocation("/");
    }
    setShowSuggestions(false);
    setIsMobileSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[activeSuggestionIndex];
        setLocation(`/video/${selected.slug || selected.id}`);
        setShowSuggestions(false);
        setIsMobileSearchOpen(false);
        setSearchQuery("");
      } else {
        handleSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const renderSuggestions = () => {
    if (!showSuggestions || searchQuery.trim().length < 2) return null;
    
    return (
      <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#121212] border border-[#303030] rounded-xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
        {isLoadingSuggestions ? (
          <div className="flex items-center justify-center p-4 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-red-500" />
            Searching...
          </div>
        ) : suggestions.length > 0 ? (
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id || index}
                onClick={() => {
                  setLocation(`/video/${suggestion.slug || suggestion.id}`);
                  setShowSuggestions(false);
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                }}
                onMouseDown={(e) => e.preventDefault()} // prevent input onBlur from firing before click
                className={`w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 transition-colors ${
                  index === activeSuggestionIndex ? 'bg-white/10' : ''
                }`}
              >
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-white truncate">
                    {suggestion.title}
                  </span>
                </div>
                {suggestion.thumbnail && (
                  <img 
                    src={suggestion.thumbnail} 
                    alt="" 
                    className="h-8 w-12 rounded object-cover ml-auto flex-shrink-0 bg-gray-800"
                  />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-400 text-center">
            No results found
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-[#0f0f0f] flex items-center px-4 justify-between gap-4">
      {isMobile && isMobileSearchOpen ? (
        <div className="flex flex-1 items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileSearchOpen(false)}
            className="text-white hover:bg-white/10 rounded-full h-10 w-10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1 flex h-10">
            <div className="flex-1 relative">
              <Input 
                placeholder="Search" 
                className="w-full h-full bg-[#121212] border-[#303030] text-white placeholder:text-gray-500 yt-search-radius pl-4 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                autoFocus
              />
              {renderSuggestions()}
            </div>
            <Button 
              onClick={() => handleSearch(searchQuery)}
              className="h-full px-5 bg-[#222222] border border-l-0 border-[#303030] hover:bg-[#2a2a2a] text-white yt-search-btn-radius"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <>
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
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {renderSuggestions()}
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
               <Button 
                 variant="ghost" 
                 size="icon" 
                 onClick={() => setIsMobileSearchOpen(true)}
                 className="text-white hover:bg-white/10 rounded-full"
               >
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
        </>
      )}
    </header>
  );
}
