import { Play, MoreVertical, CheckCircle2 } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useState, useRef, useEffect, useCallback } from "react";
import { useVideoBySlug } from "@/hooks/use-videos";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  video: VideoResponse;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [actualDuration, setActualDuration] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const slug = (video as any).slug || null;
  const { data: videoDetails } = useVideoBySlug(isHovered ? slug : null);
  const videoUrl = videoDetails?.previewVideo || video.previewVideo;

  const formatViews = (views: string | null | undefined) => {
    if (!views) return '0';
    const num = parseInt(views.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return views;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isHovered && videoRef.current && videoUrl) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, videoUrl]);

  const displayDuration = actualDuration || video.duration || '0:00';
  const videoSlug = (video as any).slug || video.id;
  const channelName = video.author || `Channel ${video.id.toString().slice(-3)}`;

  return (
    <div 
      className="flex flex-col gap-3 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <a href={`/video/${videoSlug}`} className="relative aspect-video rounded-xl overflow-hidden bg-[#181818]">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {videoUrl && isHovered && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        )}
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[12px] font-bold px-1.5 py-0.5 rounded-md">
          {displayDuration}
        </div>
      </a>

      {/* Meta */}
      <div className="flex gap-3 px-1">
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-white line-clamp-2 leading-[1.4rem] mb-1 group-hover:text-white transition-colors">
            {video.title}
          </h3>
          <div className="flex flex-col text-[14px] text-gray-400">
            <div className="flex items-center">
              <span>{formatViews(video.views)} views</span>
              <span className="mx-1">•</span>
              <span>2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

