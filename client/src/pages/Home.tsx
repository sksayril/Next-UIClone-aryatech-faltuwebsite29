import { useVideos, useCategories } from "@/hooks/use-videos";
import { Header } from "@/components/Header";
import AdBanner from "@/components/AdBanner";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useLocation } from "wouter";

export default function Home() {
  const [location, setLocation] = useLocation();
  const [activeCategorySlug, setActiveCategorySlug] = useState("all");
  
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const searchQuery = searchParams.get('search') || undefined;
  
  let pageFromUrl = 1;
  if (location.startsWith('/page-')) {
    const pageMatch = location.match(/^\/page-(\d+)(\?.*)?$/);
    if (pageMatch && pageMatch[1]) {
      pageFromUrl = parseInt(pageMatch[1], 10) || 1;
    }
  }

  const currentPage = (pageFromUrl >= 1) ? pageFromUrl : 1;
  
  const { data: response, isLoading, isError } = useVideos({
    sort: 'popular',
    page: currentPage,
    limit: 20,
    country: 'US',
    search: searchQuery,
    category: searchQuery ? undefined : (activeCategorySlug !== "all" ? activeCategorySlug : undefined)
  });
  
  const { data: categoriesData } = useCategories();
  
  const categoriesList = useMemo(() => {
    const list = [{ name: "All", slug: "all" }];
    if (Array.isArray(categoriesData)) {
      categoriesData.forEach(cat => {
        list.push({
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase()
        });
      });
    }
    return list;
  }, [categoriesData]);
  
  const allVideos = Array.isArray(response) ? response : (response?.videos || []);
  const pagination = Array.isArray(response) ? null : (response?.pagination || null);
  
  const filteredVideos = allVideos;

  const totalPages = pagination?.pages || 1;

  const setCurrentPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    const searchParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
    if (validPage === 1) {
      setLocation(`/${searchParam}`);
    } else {
      setLocation(`/page-${validPage}${searchParam}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useDocumentTitle("Free Porn Videos & XXX Movies: Sex Videos Tube | xHamster", "Free porn videos and exclusive XXX movies are here at xHamster. Instantly stream 6M+ hardcore sex videos from pros and amateurs on high quality porn tube!");

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0 sticky top-14 self-start">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 bg-[#0f0f0f]">
          {/* Category Tags */}
          <div className="sticky top-14 z-40 bg-[#0f0f0f]/95 backdrop-blur-sm px-4 py-3 flex gap-3 overflow-x-auto scrollbar-hide border-b border-transparent">
            {categoriesList.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setActiveCategorySlug(cat.slug);
                  // Clear search query from URL when switching categories
                  if (searchQuery) {
                    setLocation("/");
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  (searchQuery ? cat.slug === "all" : activeCategorySlug === cat.slug)
                    ? "bg-white text-black" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="px-4 md:px-6 lg:px-8 py-6">
            <AdBanner />
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-video bg-white/10 rounded-xl animate-pulse" />
                    <div className="flex gap-3 px-1">
                      <div className="h-9 w-9 rounded-full bg-white/10 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
                        <div className="h-3 bg-white/10 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-red-500 mb-4 font-medium">Something went wrong. Please try again later.</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="border-white/20 hover:bg-white/10 rounded-full">
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 mb-20">
                  {filteredVideos.map((video: VideoResponse) => (
                    <VideoCard key={`home-video-${video.id}`} video={video} />
                  ))}
                </div>

                {/* Proper Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pb-20">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      variant="ghost"
                      className="text-white hover:bg-white/10 rounded-full px-4 h-10 border border-white/10"
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" /> Previous
                    </Button>
                    
                    <div className="hidden sm:flex items-center gap-1">
                       {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                         const p = i + 1;
                         return (
                           <Button
                             key={p}
                             onClick={() => setCurrentPage(p)}
                             variant={currentPage === p ? "default" : "ghost"}
                             className={`h-10 w-10 rounded-full ${currentPage === p ? "bg-white text-black" : "text-white hover:bg-white/10"}`}
                           >
                             {p}
                           </Button>
                         );
                       })}
                       {totalPages > 5 && <span className="text-gray-500 mx-1">...</span>}
                    </div>

                    <Button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      variant="ghost"
                      className="text-white hover:bg-white/10 rounded-full px-4 h-10 border border-white/10"
                    >
                      Next <ChevronRight className="h-5 w-5 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

