import { useVideoBySlug, useVideos } from "@/hooks/use-videos";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRoute } from "wouter";
import { 
  Loader2, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  MoreHorizontal,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  Scissors,
  Plus
} from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function VideoDetail() {
  const [match, params] = useRoute("/video/:slug");
  const slug = params?.slug || '';
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { data: video, isLoading, isError } = useVideoBySlug(slug);
  const { data: relatedVideosResponse } = useVideos({ 
    sort: 'popular',
    page: 1,
    limit: 20
  });
  
  const relatedVideos = useMemo(() => {
    const vids = Array.isArray(relatedVideosResponse) 
      ? relatedVideosResponse 
      : (relatedVideosResponse?.videos || []);
    return vids.filter((v: VideoResponse) => (v as any).slug !== slug);
  }, [relatedVideosResponse, slug]);

  useDocumentTitle(
    video ? `${video.title} - XXXHamster` : "XXXHamster",
    video ? `Watch ${video.title} on XXXHamster.` : undefined
  );

  if (isLoading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );
  
  if (isError || !video) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
      Video not found
    </div>
  );

  const channelName = video.author || `Channel ${video.id.toString().slice(-3)}`;
  const videoUrl = (video as any).videoQualities?.['720p'] || (video as any).videoQualities?.['1080p'] || video.previewVideo;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />

      <main className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 p-4 md:px-6 lg:px-10 py-6">
        {/* Left Side: Video & Info */}
        <div className="flex-1 min-w-0">
          {/* Player */}
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
            <video 
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
            />
          </div>

          {/* Title */}
          <h1 className="mt-4 text-xl font-bold line-clamp-2 md:text-2xl">
            {video.title}
          </h1>

          {/* Channel & Actions */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden cursor-pointer">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${channelName}`} 
                  alt="Avatar" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 group cursor-pointer text-white">
                  <span className="font-bold">{channelName}</span>
                  <CheckCircle2 className="h-4 w-4 fill-gray-400 text-[#0f0f0f]" />
                </div>
                <span className="text-sm text-gray-400">1.2M subscribers</span>
              </div>
              <Button className="ml-4 bg-white text-black hover:bg-gray-200 rounded-full px-4 font-bold">
                Subscribe
              </Button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <div className="flex items-center bg-white/10 rounded-full overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 border-r border-white/10 text-sm font-medium">
                  <ThumbsUp className="h-5 w-5" /> 125K
                </button>
                <button className="px-4 py-2 hover:bg-white/10 border-white/10 flex items-center">
                  <ThumbsDown className="h-5 w-5" />
                </button>
              </div>
              
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 rounded-full gap-2 text-sm font-medium">
                <Share2 className="h-5 w-5" /> Share
              </Button>
              
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 rounded-full gap-2 text-sm font-medium hidden sm:flex">
                <Download className="h-5 w-5" /> Download
              </Button>

              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 rounded-full gap-2 text-sm font-medium hidden md:flex">
                <Scissors className="h-5 w-5" /> Clip
              </Button>

              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 rounded-full p-2 h-10 w-10">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Description Box */}
          <div className="mt-4 p-3 bg-white/10 rounded-xl hover:bg-white/15 transition-colors cursor-pointer" onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
            <div className="flex gap-2 text-sm font-bold mb-1">
              <span>{video.views} views</span>
              <span>2 days ago</span>
              <div className="flex gap-2 text-gray-400">
                <span>#trending</span><span>#music</span><span>#video</span>
              </div>
            </div>
            <p className={`text-sm whitespace-pre-wrap ${!isDescriptionExpanded && "line-clamp-2"}`}>
              {video.description || "No description provided."}
              {"\n\n"}
              Enjoy this amazing video and don't forget to like and subscribe for more content! 
              Follow us on social media for updates.
            </p>
            <button className="text-sm font-bold mt-2">
              {isDescriptionExpanded ? "Show less" : "Show more"}
            </button>
          </div>

          {/* Comments Section (Placeholder) */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-6">1,245 Comments</h3>
            <div className="flex gap-4 mb-8">
               <div className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden flex-shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="User" />
               </div>
               <div className="flex-1 flex flex-col gap-2">
                 <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="bg-transparent border-b border-white/20 py-1 focus:outline-none focus:border-white transition-colors"
                 />
                 <div className="flex justify-end gap-2 mt-1">
                    <Button variant="ghost" className="rounded-full">Cancel</Button>
                    <Button className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4">Comment</Button>
                 </div>
               </div>
            </div>
            
            {/* Fake Comments */}
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=commenter${i}`} alt="Avatar" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-bold">@User_{i}73</span>
                      <span className="text-[12px] text-gray-400">3 hours ago</span>
                    </div>
                    <p className="text-sm text-white leading-relaxed">
                      Wow, this is such an amazing quality video! Thanks for sharing. Keep up the great work!
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 group cursor-pointer">
                        <ThumbsUp className="h-4 w-4 group-hover:text-blue-500" />
                        <span className="text-[12px] text-gray-400">24</span>
                      </div>
                      <ThumbsDown className="h-4 w-4 cursor-pointer hover:text-red-500" />
                      <span className="text-[12px] font-bold cursor-pointer hover:bg-white/10 px-3 py-1 rounded-full">Reply</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Related Videos */}
        <div className="w-full xl:w-[400px] flex-shrink-0">
           <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 mb-4">
              {["All", "Related", "Recently uploaded", "Watched"].map(t => (
                <button key={t} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium whitespace-nowrap">
                  {t}
                </button>
              ))}
           </div>

           <div className="flex flex-col gap-3">
              {relatedVideos.map((v: VideoResponse) => (
                <a key={v.id} href={`/video/${(v as any).slug || v.id}`} className="flex gap-2 group cursor-pointer">
                  <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                    <img src={v.thumbnail} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded">
                      {v.duration || "10:00"}
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0 pr-2">
                    <h4 className="text-sm font-bold line-clamp-2 leading-tight mb-1 group-hover:text-white">
                      {v.title}
                    </h4>
                    <span className="text-[12px] text-gray-400 hover:text-white transition-colors">
                      {v.author || "Channel Name"}
                    </span>
                    <div className="text-[12px] text-gray-400">
                      <span>{v.views} views</span>
                      <span className="mx-1">•</span>
                      <span>1 year ago</span>
                    </div>
                  </div>
                </a>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
