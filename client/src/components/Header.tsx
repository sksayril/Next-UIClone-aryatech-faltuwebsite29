import { Search, Menu, Camera, Upload, Settings, ChevronDown, Heart, Crown, Bell, User, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVideos, useCategories, useChannels, useActors } from "@/hooks/use-videos";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useLocation();
  
  // Fetch videos for search suggestions
  const { data: videosData } = useVideos({
    sort: 'popular',
    page: 1,
    limit: 200, // Fetch more for better suggestions
    country: 'US'
  });
  
  // Extract all videos for suggestions
  const allVideos = videosData 
    ? (Array.isArray(videosData) ? videosData : (videosData?.videos || []))
        .filter((v: any) => v && v.title && v.title.trim())
    : [];
  
  // Generate search suggestions based on input - return video objects
  useEffect(() => {
    const query = desktopSearchQuery || searchQuery;
    if (query.trim().length > 0) {
      const queryLower = query.toLowerCase();
      // Get videos that match the query by title
      const matchingVideos = allVideos
        .filter((v: any) => v.title && typeof v.title === 'string' && v.title.toLowerCase().includes(queryLower))
        .slice(0, 10); // Limit to 10 suggestions
      
      setSearchSuggestions(matchingVideos);
      setShowSuggestions(matchingVideos.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [desktopSearchQuery, searchQuery, allVideos]);
  
  // Sync desktop search with URL search query
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const urlSearchQuery = searchParams.get('search') || '';
    if (urlSearchQuery && !desktopSearchQuery) {
      setDesktopSearchQuery(urlSearchQuery);
    }
  }, [location, desktopSearchQuery]);

  // Function to handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to home page with search query
      setLocation(`/?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  // Handle Enter key press in search inputs
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, query: string) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };
  
  // Handle suggestion click - navigate to video or search
  const handleSuggestionClick = (suggestion: any) => {
    if (typeof suggestion === 'string') {
      // If it's a string (old format), do search
      setDesktopSearchQuery(suggestion);
      setSearchQuery(suggestion);
      handleSearch(suggestion);
    } else if (suggestion && suggestion.slug) {
      // If it's a video object with slug, navigate to video detail page
      setLocation(`/video/${suggestion.slug}`);
      setSearchOpen(false);
      setShowSuggestions(false);
    } else if (suggestion && suggestion.title) {
      // If it's a video object without slug, search for it
      setDesktopSearchQuery(suggestion.title);
      setSearchQuery(suggestion.title);
      handleSearch(suggestion.title);
    }
  };

  // Categories dropdown content component - fetches categories from API
  function CategoriesDropdownContent() {
    // Fetch categories when dropdown opens (on hover or click)
    const { data: categories, isLoading } = useCategories();
    
    if (isLoading) {
      return (
        <div className="px-4 py-2 text-sm text-gray-400">
          Loading categories...
        </div>
      );
    }
    
    if (!categories || categories.length === 0) {
      return (
        <div className="px-4 py-2 text-sm text-gray-400">
          No categories available
        </div>
      );
    }
    
    return (
      <>
        {categories.map((category: any) => (
          <DropdownMenuItem 
            key={category.id || category.name || category._id}
            onClick={() => {
              // Redirect to random page when category is clicked
              const randomPage = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
              setLocation(`/page-${randomPage}`);
            }}
            className="text-white hover:bg-[#333] cursor-pointer"
          >
            {category.name || category.Name || 'Unnamed Category'}
          </DropdownMenuItem>
        ))}
      </>
    );
  }

  // Channels dropdown content component - fetches channels from API
  function ChannelsDropdownContent() {
    // Fetch channels when dropdown opens (on hover or click)
    const { data: channels, isLoading } = useChannels();
    
    if (isLoading) {
      return (
        <div className="px-4 py-2 text-sm text-gray-400">
          Loading channels...
        </div>
      );
    }
    
    if (!channels || channels.length === 0) {
      return (
        <div className="px-4 py-2 text-sm text-gray-400">
          No channels available
        </div>
      );
    }
    
    return (
      <>
        {channels.map((channel: any) => (
          <DropdownMenuItem 
            key={channel.id || channel.name || channel._id}
            onClick={() => {
              // Redirect to random page when channel is clicked
              const randomPage = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
              setLocation(`/page-${randomPage}`);
            }}
            className="text-white hover:bg-[#333] cursor-pointer flex items-center gap-2 py-2"
          >
            {channel.logo && (
              <img 
                src={channel.logo} 
                alt={channel.name || channel.Name || 'Channel'} 
                className="w-6 h-6 rounded object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="truncate">{channel.name || channel.Name || 'Unnamed Channel'}</span>
          </DropdownMenuItem>
        ))}
      </>
    );
  }

  // Actors dropdown content component - fetches actors from API
  function ActorsDropdownContent() {
    // Fetch actors when dropdown opens (on hover or click)
    const { data: actors, isLoading } = useActors();
    
    if (isLoading) {
      return (
        <div className="px-4 py-2 text-sm text-gray-400">
          Loading actors...
        </div>
      );
    }
    
    if (!actors || actors.length === 0) {
      return (
        <div className="px-4 py-2 text-sm text-gray-400">
          No actors available
        </div>
      );
    }
    
    return (
      <>
        {actors.map((actor: any) => (
          <DropdownMenuItem 
            key={actor.id || actor.name || actor._id}
            onClick={() => {
              // Redirect to random page when actor is clicked
              const randomPage = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
              setLocation(`/page-${randomPage}`);
            }}
            className="text-white hover:bg-[#333] cursor-pointer flex items-center gap-2 py-2"
          >
            {actor.image && (
              <img 
                src={actor.image} 
                alt={actor.name || actor.Name || 'Actor'} 
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="truncate">{actor.name || actor.Name || 'Unnamed Actor'}</span>
          </DropdownMenuItem>
        ))}
      </>
    );
  }

  // Function to redirect to random page when clicking navigation items
  const handleRandomRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Generate random page number between 10 and 100
    const randomPage = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    // Generate random page paths - mix of home, paginated pages, and video pages
    const randomPaths = [
      '/', // Home page
      `/page-${randomPage}`, // Random paginated page (10-100)
      `/page-${Math.floor(Math.random() * (100 - 10 + 1)) + 10}`, // Another random paginated page
      // '/video/random-video-' + Math.floor(Math.random() * 1000),
      // '/video/random-video-' + Math.floor(Math.random() * 1000),
      // '/video/random-video-' + Math.floor(Math.random() * 1000),
    ];
    // Pick a random path
    const randomPath = randomPaths[Math.floor(Math.random() * randomPaths.length)];
    // Redirect to random page
    setLocation(randomPath);
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full sticky top-0 z-50 bg-[#151515]">
      {/* Primary Header */}
      <header className="h-14 md:h-16 bg-[#151515] border-b border-[#222] flex items-center px-3 md:px-4 justify-between gap-2 md:gap-4">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-2 md:gap-3">
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white hover:bg-[#222]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-[#1e1e1e] border-[#333] p-0">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <img 
                      src="https://static.xhpingcdn.com/xh-desktop/images/logo/logo-nightmode.svg" 
                      alt="Logo" 
                      className="h-8"
                    />
                    <span className="text-gray-400 text-xs">IN</span>
                  </div>
                  <nav className="space-y-2">
                    <a href="#" onClick={handleRandomRedirect} className="block text-white hover:text-primary py-2">Videos</a>
                    <a href="#" onClick={handleRandomRedirect} className="block text-gray-300 hover:text-primary py-2">Live Sex</a>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <a href="#" onClick={(e) => e.preventDefault()} className="block text-gray-300 hover:text-primary py-2 cursor-pointer">
                          Categories
                        </a>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white max-h-[400px] overflow-y-auto w-64">
                        <CategoriesDropdownContent />
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <a href="#" onClick={(e) => e.preventDefault()} className="block text-gray-300 hover:text-primary py-2 cursor-pointer">Pornstars</a>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white max-h-[400px] overflow-y-auto w-64">
                        <ActorsDropdownContent />
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Creators section commented out */}
                    {/* <a href="#" onClick={handleRandomRedirect} className="block text-gray-300 hover:text-primary py-2">Creators</a> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <a href="#" onClick={(e) => e.preventDefault()} className="block text-gray-300 hover:text-primary py-2 cursor-pointer">
                          Channels
                        </a>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white max-h-[400px] overflow-y-auto w-64">
                        <ChannelsDropdownContent />
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <a href="#" onClick={handleRandomRedirect} className="block text-gray-300 hover:text-primary py-2">Photos</a>
                    <a href="#" onClick={handleRandomRedirect} className="block text-gray-300 hover:text-primary py-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-500" />
                      Nude Chat
                    </a>
                    <a href="#" onClick={handleRandomRedirect} className="block text-gray-300 hover:text-primary py-2 flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      Premium Videos
                    </a>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link href="/">
            <img 
              src="https://static.xhpingcdn.com/xh-desktop/images/logo/logo-nightmode.svg" 
              alt="Logo" 
              className="h-8 md:h-10 cursor-pointer"
            />
          </Link>
          <span className="text-gray-400 text-xs hidden sm:inline">IN</span>
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-400 hover:text-white hover:bg-[#222]">
                  <span className="text-red-500">♂</span>
                  <span className="text-blue-500">♀</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white">
                <DropdownMenuItem className="text-white hover:bg-[#333]">Straight</DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-[#333]">Gay</DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-[#333]">Transgender</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Center: Search - Hidden on mobile */}
        {!isMobile && (
          <div className="flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-r-none bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333] border-r-0 h-10 px-3">
                    <Camera className="h-5 w-5 text-gray-400" />
                    <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white">
                  <DropdownMenuItem className="text-white hover:bg-[#333]">Search by Image</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative flex-1">
                <Input 
                  placeholder="Search for videos" 
                  className="w-full bg-[#1e1e1e] border-[#333] text-white placeholder:text-gray-500 rounded-none border-r-0 focus-visible:ring-primary h-10"
                  value={desktopSearchQuery}
                  onChange={(e) => setDesktopSearchQuery(e.target.value)}
                  onKeyPress={(e) => handleSearchKeyPress(e, desktopSearchQuery)}
                  onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e1e1e] border border-[#333] rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => {
                      const videoTitle = typeof suggestion === 'string' ? suggestion : (suggestion?.title || '');
                      const videoSlug = suggestion?.slug || null;
                      const hasSlug = videoSlug !== null;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors border-b border-[#333] last:border-b-0 flex items-center gap-2"
                        >
                          {hasSlug ? (
                            <Play className="h-4 w-4 text-primary flex-shrink-0" />
                          ) : (
                            <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          )}
                          <span className="truncate flex-1">{videoTitle}</span>
                          {hasSlug && (
                            <span className="text-xs text-gray-500 flex-shrink-0">View Video</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <Button 
                onClick={() => handleSearch(desktopSearchQuery)}
                className="bg-primary hover:bg-primary/90 text-white rounded-l-none h-10 px-4"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {isMobile ? (
            <>
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white hover:bg-[#222] relative">
                    <Search className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1e1e1e] border-[#333] text-white p-0 max-w-full sm:max-w-lg top-[5%] sm:top-[50%] translate-y-0 sm:translate-y-[-50%] max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="p-4 border-b border-[#333]">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-gray-400" />
                      <h2 className="text-lg font-semibold text-white">Search</h2>
                    </div>
                  </DialogHeader>
                  <div className="p-4">
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          type="text"
                          placeholder="Search for videos..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => handleSearchKeyPress(e, searchQuery)}
                          onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          className="w-full bg-[#2a2a2a] border-[#333] text-white placeholder:text-gray-500 pl-10 pr-4 h-11 rounded-md focus-visible:ring-primary"
                          autoFocus
                        />
                        {/* Mobile Search Suggestions Dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e1e1e] border border-[#333] rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                            {searchSuggestions.map((suggestion, index) => {
                              const videoTitle = typeof suggestion === 'string' ? suggestion : (suggestion?.title || '');
                              const videoSlug = suggestion?.slug || null;
                              const hasSlug = videoSlug !== null;
                              
                              return (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors border-b border-[#333] last:border-b-0 flex items-center gap-2"
                                >
                                  {hasSlug ? (
                                    <Play className="h-4 w-4 text-primary flex-shrink-0" />
                                  ) : (
                                    <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  )}
                                  <span className="truncate flex-1">{videoTitle}</span>
                                  {hasSlug && (
                                    <span className="text-xs text-gray-500 flex-shrink-0">View Video</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="bg-[#2a2a2a] hover:bg-[#333] border border-[#333] h-11 px-3">
                            <Camera className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1e1e1e] border-[#333] text-white">
                          <DropdownMenuItem className="text-white hover:bg-[#333]">Search by Image</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {searchQuery && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Search results for: "{searchQuery}"</p>
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleSearch(searchQuery)}
                            className="w-full text-left px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded text-sm text-gray-300 hover:text-white transition-colors"
                          >
                            Search videos
                          </button>
                          <button 
                            onClick={() => handleSearch(searchQuery)}
                            className="w-full text-left px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded text-sm text-gray-300 hover:text-white transition-colors"
                          >
                            Search categories
                          </button>
                          <button 
                            onClick={() => handleSearch(searchQuery)}
                            className="w-full text-left px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded text-sm text-gray-300 hover:text-white transition-colors"
                          >
                            Search pornstars
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="mt-6 pt-4 border-t border-[#333]">
                      <p className="text-xs text-gray-500 mb-3">Popular searches</p>
                      <div className="flex flex-wrap gap-2">
                        {["Indian", "18 Year Old", "Desi", "Mom", "4K Porn", "HD Videos", "VR Porn", "Amateur"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSearchQuery(tag);
                              handleSearch(tag);
                            }}
                            className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white text-xs rounded transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white hover:bg-[#222] relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-4 w-4 bg-primary rounded-full text-[10px] flex items-center justify-center">1</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white hover:bg-[#222]">
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#222]">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs">🇮🇳</span>
                    <span>EN</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1e1e1e] border-[#333] text-white">
                  <DropdownMenuItem className="text-white hover:bg-[#333]">English</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#333]">Spanish</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#333]">French</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Login and Sign up buttons commented out */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-primary font-medium h-9">
                    Login
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1e1e1e] border-[#333] text-white">
                  <DropdownMenuItem className="text-white hover:bg-[#333]">Sign In</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#333]">Create Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded px-6 h-9 text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Sign up for free
              </Button> */}
            </>
          )}
        </div>
      </header>

      {/* Secondary Nav - Desktop */}
      {!isMobile && (
        <nav className="flex h-10 bg-[#1e1e1e] items-center px-4 justify-between text-sm font-medium border-b border-[#333]">
          <div className="flex items-center gap-6 text-gray-300 overflow-x-auto scrollbar-hide">
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group relative border-b-2 border-primary pb-1.5 px-1">
              Videos
              <ChevronDown className="h-3 w-3" />
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
              <span className="flex items-center gap-1">
                <span className="text-primary">Live</span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              </span>
              <span className="ml-1">Sex</span>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1 cursor-pointer">
                  Categories
                  <ChevronDown className="h-3 w-3" />
                </a>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white max-h-[400px] overflow-y-auto w-64">
                <CategoriesDropdownContent />
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1 cursor-pointer">
                  Pornstars
                  <ChevronDown className="h-3 w-3" />
                </a>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white max-h-[400px] overflow-y-auto w-64">
                <ActorsDropdownContent />
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Creators section commented out */}
            {/* <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
              Creators
              <ChevronDown className="h-3 w-3" />
            </a> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-primary whitespace-nowrap transition-colors px-1 cursor-pointer">
                  Channels
                </a>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#1e1e1e] border-[#333] text-white max-h-[400px] overflow-y-auto w-64">
                <ChannelsDropdownContent />
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Photos, Nude Chat, Premium Videos, Dating, and Subscriptions commented out */}
            {/* <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
              Photos
              <ChevronDown className="h-3 w-3" />
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
              <Heart className="h-3 w-3 text-pink-500" />
              Nude Chat
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 group px-1">
              <Crown className="h-3 w-3 text-yellow-500" />
              Premium Videos
              <span className="bg-primary text-white text-[10px] px-1 rounded ml-1">-60%</span>
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors px-1">
              Dating
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors px-1">
              Subscriptions
            </a> */}
          </div>
          {/* Upload button commented out */}
          {/* <div className="flex items-center pl-4 border-l border-[#333] h-full">
             <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white gap-2 h-full rounded-none">
               <Upload className="h-4 w-4" />
               Upload
             </Button>
          </div> */}
        </nav>
      )}

      {/* Mobile Navigation Tabs */}
      {isMobile && (
        <nav className="flex h-12 bg-[#1e1e1e] items-center px-2 overflow-x-auto scrollbar-hide border-b border-[#333]">
          <div className="flex items-center gap-2 text-xs font-medium">
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 px-3 py-2 rounded-md bg-[#2a2a2a] text-white">
              <span className="flex items-center gap-1">
                <span className="text-primary">Live</span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              </span>
              <span className="ml-1">Sex</span>
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 px-3 py-2 text-gray-300">
              <Crown className="h-3 w-3 text-yellow-500" />
              Premium
              <span className="bg-primary text-white text-[9px] px-1 rounded ml-1">-60%</span>
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors flex items-center gap-1 px-3 py-2 text-gray-300">
              <Heart className="h-3 w-3 text-pink-500" />
              Nude Chat
            </a>
            <a href="#" onClick={handleRandomRedirect} className="hover:text-primary whitespace-nowrap transition-colors px-3 py-2 text-gray-300">
              Porn
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}
