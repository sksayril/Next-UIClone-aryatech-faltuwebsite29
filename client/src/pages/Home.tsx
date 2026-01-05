import { useVideos } from "@/hooks/use-videos";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterSidebar } from "@/components/FilterSidebar";
import { VideoCard } from "@/components/VideoCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Crown, ChevronRight } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Home() {
  const [activeVideoType, setActiveVideoType] = useState<'free'|'short'|'premium'|'photos'>('free');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: response, isLoading, isError } = useVideos({
    sort: 'popular',
    page: currentPage,
    limit: 30,
    country: 'US' // US content
  });
  
  // Extract videos and pagination from response
  // Handle both old format (array) and new format (object with videos and pagination)
  const videos = Array.isArray(response) ? response : (response?.videos || []);
  const pagination = Array.isArray(response) ? null : (response?.pagination || null);
  const totalPages = pagination?.pages || 1;
  const currentPageFromApi = pagination?.page || currentPage;

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
    <div className="min-h-screen bg-[#222222] text-white font-sans overflow-x-auto" style={{ minWidth: '1200px' }}>
      <Header />

      <div className="flex min-h-[calc(100vh-104px)] bg-[#222222] w-full">
        {/* Left Sidebar - Filter Sidebar */}
        <div className="w-64 flex-shrink-0 sticky top-[104px] h-[calc(100vh-104px)] overflow-y-auto border-r border-[#333] bg-[#1e1e1e]">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-8 py-8 max-w-full bg-[#222222]">
          
          {/* Main Content Header */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl text-white font-bold">Porn Video Search</h1>
              {pagination && (
                <span className="text-gray-400 text-base whitespace-nowrap">
                  {pagination.total >= 1000000 
                    ? `${(pagination.total / 1000000).toFixed(1)}M Results`
                    : pagination.total >= 1000
                    ? `${(pagination.total / 1000).toFixed(1)}K Results`
                    : `${pagination.total} Results`}
                </span>
              )}
            </div>
          </div>

          {/* Video Type Filters */}
          <div className="flex items-center gap-4 mb-8 pb-3 border-b border-[#333]">
            <button
              onClick={() => setActiveVideoType('free')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeVideoType === 'free' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Free Videos
            </button>
            <button
              onClick={() => setActiveVideoType('short')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeVideoType === 'short' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Short videos
            </button>
            <button
              onClick={() => setActiveVideoType('premium')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1 ${
                activeVideoType === 'premium' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Crown className="h-4 w-4 text-yellow-500" />
              Premium Videos
            </button>
            <button
              onClick={() => setActiveVideoType('photos')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeVideoType === 'photos' 
                  ? 'text-primary border-primary' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Photos
            </button>
          </div>

          {/* Popular Search Tags */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white text-sm rounded transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Ad Disclaimer */}
          <div className="flex items-center gap-2 mb-10 text-xs text-gray-500">
            <span>By clicking the content you will also see an ad.</span>
            <button className="px-2 py-1 bg-[#2a2a2a] text-gray-400 rounded text-[10px]">AD</button>
          </div>

          {/* Videos Grid */}
          {isLoading ? (
            <div className="grid grid-cols-4 gap-6">
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
                  No videos found.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-6 mb-12">
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
                      <div className="flex items-center justify-center gap-1.5 mb-10">
                        {pagesToShow.map((page, index) => {
                          if (page === -1) {
                            return (
                              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
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
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="bg-primary hover:bg-primary/90 text-white border-0 ml-2 px-4"
                          >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
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
