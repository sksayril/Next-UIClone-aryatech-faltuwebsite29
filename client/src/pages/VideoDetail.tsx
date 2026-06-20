import { useVideoBySlug, useVideos } from "@/hooks/use-videos";
import { Header } from "@/components/Header";
import Adbannersecond from "@/components/Adbannersecond";
import VideoTopAd from "@/components/VideoTopAd";
import React, { useRef, useMemo } from "react";
import { useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function VideoDetail() {
  const [match, params] = useRoute("/video/:slug");
  const slug = params?.slug || '';
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
    video ? `${video.title} - xHamster` : "Free Porn Videos & XXX Movies: Sex Videos Tube | xHamster",
    video ? `Watch ${video.title} on xHamster.` : undefined
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

  const videoUrl = (video as any).videoQualities?.['720p'] || (video as any).videoQualities?.['1080p'] || video.previewVideo;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />

      <main className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 p-4 md:px-6 lg:px-10 py-6">
        {/* Left Side: Video & Info */}
        <div className="flex-1 min-w-0">
          <VideoTopAd />
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
              {relatedVideos.length === 0 && <Adbannersecond />}
              {relatedVideos.map((v: VideoResponse, index: number) => (
                <React.Fragment key={v.id}>
                  <a href={`/video/${(v as any).slug || v.id}`} className="flex gap-2 group cursor-pointer">
                    <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                      <img src={v.thumbnail} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded">
                        {v.duration || "10:00"}
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0 pr-2 flex-1">
                      <h4 className="text-sm font-bold line-clamp-2 leading-tight mb-1 group-hover:text-white">
                        {v.title}
                      </h4>
                      <div className="text-[12px] text-gray-400">
                        <span>{v.views} views</span>
                        <span className="mx-1">•</span>
                        <span>1 year ago</span>
                      </div>
                    </div>
                  </a>
                  {index === 0 && <Adbannersecond />}
                </React.Fragment>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
