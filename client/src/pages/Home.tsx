import { useVideos } from "@/hooks/use-videos";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterSidebar } from "@/components/FilterSidebar";
import { VideoCard } from "@/components/VideoCard";
import AdBanner from "@/components/AdBanner";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Crown, ChevronRight } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useRoute, useLocation } from "wouter";

export default function Home() {
  const [activeVideoType, setActiveVideoType] = useState<'free'|'short'|'premium'|'photos'>('free');
  const [location, setLocation] = useLocation();
  
  // Parse search query from URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = searchParams.get('search') || undefined;
  
  // Get page number from URL - parse directly from location to support /page-X format
  // Wouter doesn't support parameters after hyphens well, so we parse manually
  let pageFromUrl = 1;
  
  // Check if URL matches /page-X format
  if (location.startsWith('/page-')) {
    // Parse /page-X format (e.g., /page-2 or /page-2?search=query)
    const pageMatch = location.match(/^\/page-(\d+)(\?.*)?$/);
    if (pageMatch && pageMatch[1]) {
      const parsed = parseInt(pageMatch[1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        pageFromUrl = parsed;
      }
    }
    // Also extract search query from URL if present
    const urlSearchQuery = searchParams.get('search') || undefined;
    if (urlSearchQuery && urlSearchQuery !== searchQuery) {
      // Search query in URL will be handled by the searchQuery variable above
    }
  } else if (location === '/' || location.startsWith('/?')) {
    // Home page - check for page in query params
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        pageFromUrl = parsed;
      }
    } else {
      pageFromUrl = 1;
    }
  }
  
  // Ensure page is valid (at least 1, and is a number)
  const currentPage = (pageFromUrl >= 1 && !isNaN(pageFromUrl) && isFinite(pageFromUrl)) ? pageFromUrl : 1;
  
  // Fetch videos without search parameter (frontend filtering)
  const { data: response, isLoading, isError } = useVideos({
    sort: 'popular',
    page: currentPage,
    limit: 50,
    country: 'US' // US content
  });
  
  // Extract videos and pagination from response
  // Handle both old format (array) and new format (object with videos and pagination)
  const allVideos = Array.isArray(response) ? response : (response?.videos || []);
  const pagination = Array.isArray(response) ? null : (response?.pagination || null);
  
  // Frontend title-based filtering (only when search query exists)
  const filteredVideos = searchQuery 
    ? allVideos.filter((video: VideoResponse) => 
        video.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allVideos;
  
  // Use API pagination when available, otherwise calculate from filtered results
  let totalPages = 1;
  let videos = filteredVideos;
  
  if (searchQuery) {
    // When searching, paginate filtered results on frontend
    const videosPerPage = 50;
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    videos = filteredVideos.slice(startIndex, endIndex);
    const totalFilteredVideos = filteredVideos.length;
    totalPages = Math.ceil(totalFilteredVideos / videosPerPage) || 1;
  } else {
    // When not searching, use API pagination data directly
    videos = allVideos;
    
    // Always use API pagination.pages if available (this is the source of truth)
    if (pagination) {
      // Priority 1: Use pagination.pages directly from API (e.g., 31)
      if (typeof pagination.pages === 'number' && pagination.pages > 0) {
        totalPages = pagination.pages;
      } 
      // Priority 2: Calculate from total and limit if pages not provided
      else if (pagination.total && pagination.limit) {
        totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
      } 
      // Priority 3: Calculate from total using default limit
      else if (pagination.total) {
        const limit = 50; // Default limit used in API call
        totalPages = Math.ceil(pagination.total / limit) || 1;
      }
    }
  }
  
  // Debug: Log pagination info to verify API response is being used
  if (pagination && !searchQuery) {
    console.log('Pagination from API:', {
      page: pagination.page,
      pages: pagination.pages,
      total: pagination.total,
      limit: pagination.limit,
      calculatedTotalPages: totalPages
    });
  }
  
  const currentPageFromApi = pagination?.page || currentPage;
  
  // Function to update page and URL
  const setCurrentPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    const searchParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
    if (validPage === 1) {
      setLocation(`/${searchParam}`);
    } else {
      setLocation(`/page-${validPage}${searchParam}`);
    }
  };
  
  // Update URL if page from API doesn't match URL (redirect to correct page)
  useEffect(() => {
    if (pagination && pagination.page && pagination.page !== currentPage) {
      if (pagination.page === 1) {
        setLocation("/");
      } else {
        setLocation(`/page-${pagination.page}`);
      }
    }
  }, [pagination, currentPage, setLocation]);

  const popularTags = ["Xnxx", "Xvideos", "Xxx", "Free Sex", "Mature Tube", "Stripchat", "Best Videos"];

  // Update document title and meta tags
  useDocumentTitle(
    "xHamster - Free Porn Videos & Adult Entertainment",
    "Watch free porn videos on xHamster. Discover millions of HD and 4K adult videos, amateur content, and premium XXX movies. Browse by category, quality, and more."
  );

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#222222] text-white font-sans">
      <Header />

      <div className="flex min-h-[calc(100vh-104px)] md:min-h-[calc(100vh-114px)] bg-[#222222] w-full">
        {/* Left Sidebar - Filter Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-[104px] h-[calc(100vh-104px)] overflow-y-auto border-r border-[#333] bg-[#1e1e1e]">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-3 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 max-w-full bg-[#222222]">
          
          {/* Main Content Header */}
          {/* Commented out: Porn Video Search title and results count */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-8 gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Porn Video Search'}
              </h1>
              {pagination && (
                <span className="text-gray-400 text-sm md:text-base whitespace-nowrap">
                  {pagination.total >= 1000000 
                    ? `${(pagination.total / 1000000).toFixed(1)}M Results`
                    : pagination.total >= 1000
                    ? `${(pagination.total / 1000).toFixed(1)}K Results`
                    : `${pagination.total} Results`}
                </span>
              )}
            </div>
          </div> */}

          {/* Video Type Filters */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8 pb-3 border-b border-[#333] overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveVideoType('free')}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeVideoType === 'free' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Free Videos
            </button>
            <button
              onClick={() => setActiveVideoType('short')}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeVideoType === 'short' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Short videos
            </button>
            {/* Premium Videos button commented out */}
            {/* <button
              onClick={() => setActiveVideoType('premium')}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 flex items-center gap-1 whitespace-nowrap ${
                activeVideoType === 'premium' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
              Premium Videos
            </button> */}
            <button
              onClick={() => setActiveVideoType('photos')}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeVideoType === 'photos' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Photos
            </button>
          </div>

          {/* Popular Search Tags - Horizontal scroll on mobile */}
          <div className="flex gap-2 md:gap-2.5 mb-4 md:mb-6 overflow-x-auto scrollbar-hide pb-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white text-xs md:text-sm rounded transition-colors whitespace-nowrap flex-shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Ad Disclaimer */}
          <div className="flex flex-col items-center gap-3 mb-10">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>By clicking the content you will also see an ad.</span>
              <button className="px-2 py-1 bg-[#2a2a2a] text-gray-400 rounded text-[10px]">AD</button>
            </div>
            {/* Banner Ad */}
            <AdBanner />
          </div>

          {/* Videos Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-video bg-[#1a1a1a] rounded-lg animate-pulse" />
                  <div className="h-4 bg-[#1a1a1a] rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-red-500 mb-4">Failed to load videos</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          ) : !Array.isArray(videos) ? (
            <div className="text-center py-20 text-gray-500">
              Invalid data format received.
            </div>
          ) : (
            <>
              {videos.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  {searchQuery ? (
                    <>
                      <p className="text-lg mb-2">No videos found for "{searchQuery}"</p>
                      <p className="text-sm">Try a different search term</p>
                    </>
                  ) : (
                    <p>No videos found.</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-8 md:mb-12">
                    {videos.map((video: VideoResponse) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>

                  {/* Pagination - Based on API response */}
                  {totalPages > 1 && (() => {
                    // Calculate which pages to show
                    const pagesToShow: number[] = [];
                    const maxVisible = 6;
                    
                    if (totalPages <= maxVisible) {
                      // Show all pages if total is small
                      for (let i = 1; i <= totalPages; i++) {
                        pagesToShow.push(i);
                      }
                    } else {
                      // Show pages around current page
                      const startPage = Math.max(1, currentPage - 2);
                      const endPage = Math.min(totalPages, currentPage + 2);
                      
                      // Always show first page
                      if (startPage > 1) {
                        pagesToShow.push(1);
                        if (startPage > 2) {
                          pagesToShow.push(-1); // -1 represents ellipsis
                        }
                      }
                      
                      // Show pages around current
                      for (let i = startPage; i <= endPage; i++) {
                        pagesToShow.push(i);
                      }
                      
                      // Always show last page
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pagesToShow.push(-1); // -1 represents ellipsis
                        }
                        pagesToShow.push(totalPages);
                      }
                    }
                    
                    return (
                      <div className="flex items-center justify-center gap-1 md:gap-1.5 mb-6 md:mb-10 flex-wrap">
                        {pagesToShow.map((page, index) => {
                          if (page === -1) {
                            return (
                              <span key={`ellipsis-${index}`} className="px-1 md:px-2 text-gray-400 text-sm">...</span>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded transition-colors ${
                                currentPage === page
                                  ? 'bg-white text-[#222]'
                                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333]'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        {/* Next button */}
                        {currentPage < totalPages && (
                          <Button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="bg-primary hover:bg-primary/90 text-white border-0 ml-1 md:ml-2 px-3 md:px-4 text-xs md:text-sm h-8 md:h-9"
                          >
                            Next <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Alternative Search Results */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white rounded flex items-center gap-2 text-sm transition-colors">
                      <span className="text-blue-500">♂</span>
                      Gay search results
                    </button>
                    <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white rounded flex items-center gap-2 text-sm transition-colors">
                      <span className="text-purple-500">⚧</span>
                      Shemale search results
                    </button>
                  </div>

                  {/* Promotional Banner */}
                  <div className="bg-[#2a2a2a] rounded-lg p-5 mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white">Chat with </span>
                      <span className="text-primary font-bold">xHamsterLive</span>
                      <span className="text-white"> girls now!</span>
                      <span className="text-gray-400 text-xs">!</span>
                    </div>
                    <Button variant="outline" className="bg-[#1e1e1e] border-[#333] text-gray-300 hover:text-white hover:bg-[#2a2a2a]">
                      More Girls
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
