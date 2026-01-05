import { Play } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoBySlug } from "@/hooks/use-videos";

interface VideoCardProps {
  video: VideoResponse;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [actualDuration, setActualDuration] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fetch video details by slug when hovering (using slug from video object)
  const slug = (video as any).slug || null;
  const { data: videoDetails } = useVideoBySlug(isHovered || isFocused ? slug : null);
  
  // Use video URL from slug API if available, otherwise use previewVideo
  const videoUrl = videoDetails?.previewVideo || video.previewVideo;

  // Format views to match the image (e.g., "115.1M views")
  const formatViews = (views: string) => {
    return views;
  };

  // Format duration from seconds to MM:SS or HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Extract actual duration from video metadata when it loads
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoUrl) return;

    const handleLoadedMetadata = () => {
      if (videoElement.duration && isFinite(videoElement.duration)) {
        setActualDuration(formatDuration(videoElement.duration));
      }
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // If metadata is already loaded
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl]);

  // Handle video auto-play on hover/focus with enhanced preview behavior
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoUrl) return;

    if (isHovered || isFocused) {
      // Set playback rate to 2x for faster preview
      videoElement.playbackRate = 2.0;
      
      // Ensure video is loaded and ready
      if (videoElement.readyState >= 2 && videoElement.duration) {
        // Video has enough data to play
        // Start from 20% of video duration for better preview
        const startTime = videoElement.duration * 0.2;
        videoElement.currentTime = startTime;
        videoElement.play().catch((error) => {
          // Auto-play may be blocked by browser, handle silently
          console.debug('Video autoplay prevented:', error);
        });
      } else {
        // Wait for video to load enough data
        const handleCanPlay = () => {
          if (videoElement.duration) {
            // Start from 20% of video duration
            const startTime = videoElement.duration * 0.2;
            videoElement.currentTime = startTime;
          }
          videoElement.play().catch((error) => {
            console.debug('Video autoplay prevented:', error);
          });
          videoElement.removeEventListener('canplay', handleCanPlay);
        };
        
        const handleLoadedMetadata = () => {
          if (videoElement.duration) {
            // Start from 20% of video duration
            const startTime = videoElement.duration * 0.2;
            videoElement.currentTime = startTime;
          }
        };
        
        videoElement.addEventListener('canplay', handleCanPlay);
        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.load(); // Force reload to ensure it starts loading
        
        return () => {
          videoElement.removeEventListener('canplay', handleCanPlay);
          videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
      }
    } else {
      videoElement.pause();
      videoElement.playbackRate = 1.0; // Reset playback rate
      // Reset to 20% position for next hover (not 0, to match preview behavior)
      if (videoElement.duration) {
        videoElement.currentTime = videoElement.duration * 0.2;
      } else {
        videoElement.currentTime = 0;
      }
    }
  }, [isHovered, isFocused, videoUrl]);

  // Use actual duration if available, otherwise use estimated duration
  const displayDuration = actualDuration || video.duration || '0:00';
  
  // Get slug from video object (fallback to id if slug not available for backward compatibility)
  const videoSlug = (video as any).slug || video.id;

  return (
    <div 
      className="group relative flex flex-col gap-2.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      {/* Thumbnail Container */}
      <a 
        href={`/video/${videoSlug}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer shadow-lg shadow-black/20 group-hover:shadow-primary/10 transition-all border border-transparent group-hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#222222]"
      >
        
        {/* Main Image */}
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            (isHovered || isFocused) && videoUrl ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Video Preview (auto-play on hover/focus) - Uses video from slug API */}
        <AnimatePresence>
          {(isHovered || isFocused) && videoUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black flex items-center justify-center"
            >
              <video
                ref={videoRef}
                src={videoUrl}
                key={videoUrl} // Force re-render when video URL changes
                className="w-full h-full object-cover"
                muted
                loop={false} // We'll handle looping manually to restart at 20%
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  const videoEl = e.currentTarget;
                  // Duration will be extracted in the useEffect
                  // Skip to 20% of video for better preview
                  if (videoEl.duration && (isHovered || isFocused)) {
                    videoEl.currentTime = videoEl.duration * 0.2;
                  }
                }}
                onMouseEnter={(e) => {
                  const videoEl = e.currentTarget;
                  // Start from 20% of video if not already set
                  if (videoEl.currentTime === 0 && videoEl.duration) {
                    videoEl.currentTime = videoEl.duration * 0.2;
                  }
                  // Set playback rate to 2x for faster preview
                  videoEl.playbackRate = 2.0;
                  videoEl.play().catch(() => {
                    // Auto-play failed, ignore
                  });
                }}
                onMouseLeave={(e) => {
                  const videoEl = e.currentTarget;
                  videoEl.pause();
                  // Reset to 20% position for next hover
                  if (videoEl.duration) {
                    videoEl.currentTime = videoEl.duration * 0.2;
                  }
                }}
                onEnded={(e) => {
                  const videoEl = e.currentTarget;
                  // Loop back to 20% when video ends
                  if (videoEl.duration) {
                    videoEl.currentTime = videoEl.duration * 0.2;
                    videoEl.play().catch(() => {
                      // Auto-play failed, ignore
                    });
                  }
                }}
                onCanPlay={() => {
                  // Video is ready to play, ensure it's playing if hovering
                  if ((isHovered || isFocused) && videoRef.current) {
                    if (videoRef.current.duration) {
                      // Start from 20% of video duration
                      videoRef.current.currentTime = videoRef.current.duration * 0.2;
                    }
                    videoRef.current.playbackRate = 2.0; // Set 2x speed
                    videoRef.current.play().catch((error) => {
                      console.debug('Video autoplay prevented:', error);
                    });
                  }
                }}
                onError={(e) => {
                  // Fallback to thumbnail if video fails to load
                  console.debug('Video preview failed to load, using thumbnail');
                }}
              />
              <div className="absolute inset-0 bg-black/10" /> 
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duration Overlay - Bottom Right */}
        <div className="absolute bottom-1 right-1 bg-black/90 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
          {video.is4k && (
            <span className="bg-white text-black text-[9px] font-bold px-1 rounded uppercase">4K</span>
          )}
          <span>{displayDuration}</span>
        </div>
        
        {/* Quality Badges - Top Right (if not 4K) */}
        {!video.is4k && (
          <div className="absolute top-1 right-1 flex gap-1">
            {video.isVr && (
              <span className="bg-purple-600 text-white text-[9px] font-bold px-1 rounded-sm uppercase">VR</span>
            )}
            {video.isHd && (
              <span className="bg-[#333] border border-gray-600 text-gray-200 text-[9px] font-bold px-1 rounded-sm uppercase">HD</span>
            )}
          </div>
        )}

        {/* Hover/Focus Play Button Overlay - Show when no video preview or as subtle indicator when video is playing */}
        {(isHovered || isFocused) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`p-3 rounded-full shadow-lg transition-all ${
              videoUrl 
                ? 'bg-primary/30 scale-75' // Subtle when video is playing
                : 'bg-primary/90 scale-90 group-hover:scale-100' // More prominent when no video
            }`}>
              <Play className="h-6 w-6 text-white fill-current ml-1" />
            </div>
          </div>
        )}
      </a>

      {/* Meta Info */}
      <div className="flex flex-col gap-1 md:gap-1.5 mt-1">
        <a 
          href={`/video/${videoSlug}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs sm:text-sm font-medium text-white group-hover:text-primary transition-colors leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]"
        >
          {video.title}
        </a>
        
        <div className="flex items-center text-[10px] sm:text-xs text-gray-400 gap-1 sm:gap-1.5">
          <span className="hover:text-gray-300 cursor-pointer truncate">{video.author}</span>
          <span>|</span>
          <span className="whitespace-nowrap">{formatViews(video.views)} views</span>
        </div>
      </div>
    </div>
  );
}
