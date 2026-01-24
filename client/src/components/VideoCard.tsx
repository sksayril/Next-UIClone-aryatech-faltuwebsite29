import { Play } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoBySlug } from "@/hooks/use-videos";

interface VideoCardProps {
  video: VideoResponse;
}

// Helper to check if thumbnail URL is valid
function isValidThumbnailUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === '') return false;
  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // If it's a relative URL, check if it's not empty
    return url.trim().length > 0 && !url.startsWith('data:') && url !== 'null' && url !== 'undefined';
  }
}

export function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [actualDuration, setActualDuration] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [thumbnailVideoPlaying, setThumbnailVideoPlaying] = useState(false);
  // Initialize thumbnailError if thumbnail is missing, empty, or invalid
  const [thumbnailError, setThumbnailError] = useState(!isValidThumbnailUrl(video.thumbnail));
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  
  // Fetch video details by slug when hovering OR when thumbnail fails (to get video URL)
  const slug = (video as any).slug || null;
  const { data: videoDetails } = useVideoBySlug((isHovered || isFocused || thumbnailError) ? slug : null);
  
  // Use video URL from slug API if available, otherwise use previewVideo
  // Always use previewVideo from video object for thumbnail fallback
  const videoUrl = videoDetails?.previewVideo || video.previewVideo;
  const thumbnailVideoUrl = video.previewVideo || videoDetails?.previewVideo || (video as any)?.videoQualities?.['720p'] || (video as any)?.videoQualities?.['480p'] || (video as any)?.videoQualities?.['1080p'];

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
    if (!videoElement || !videoUrl) {
      setActualDuration(null);
      return;
    }

    const handleLoadedMetadata = () => {
      if (videoElement.duration && isFinite(videoElement.duration)) {
        setActualDuration(formatDuration(videoElement.duration));
      }
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // If metadata is already loaded
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      // Force load if URL changed
      videoElement.load();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl]);

  // Reset video ready state when URL changes
  useEffect(() => {
    setIsVideoReady(false);
  }, [videoUrl]);

  // Reset thumbnail error and video playing state when video changes
  useEffect(() => {
    setThumbnailError(!isValidThumbnailUrl(video.thumbnail));
    setThumbnailVideoPlaying(false);
  }, [video.id, video.thumbnail]);

  // Handle video auto-play on hover/focus
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoUrl) {
      setIsVideoReady(false);
      return;
    }

    if (isHovered || isFocused) {
      // Set playback rate to 2x for faster preview
      videoElement.playbackRate = 2.0;
      
      // Function to attempt playing the video
      const attemptPlay = async () => {
        try {
          // If video has duration, start from 20%
          if (videoElement.duration && isFinite(videoElement.duration)) {
            const startTime = videoElement.duration * 0.2;
            videoElement.currentTime = startTime;
          }
          
          await videoElement.play();
          setIsVideoReady(true);
        } catch (error) {
          console.debug('Video autoplay prevented:', error);
          setIsVideoReady(false);
        }
      };

      // If video is already loaded enough, play immediately
      if (videoElement.readyState >= 2) {
        attemptPlay();
      } else {
        // Wait for video to be ready
        const handleCanPlay = () => {
          attemptPlay();
          videoElement.removeEventListener('canplay', handleCanPlay);
        };
        
        const handleLoadedData = () => {
          attemptPlay();
          videoElement.removeEventListener('loadeddata', handleLoadedData);
        };

        videoElement.addEventListener('canplay', handleCanPlay);
        videoElement.addEventListener('loadeddata', handleLoadedData);
        
        // Force load if not already loading
        if (videoElement.readyState === 0) {
          videoElement.load();
        }

        return () => {
          videoElement.removeEventListener('canplay', handleCanPlay);
          videoElement.removeEventListener('loadeddata', handleLoadedData);
        };
      }
    } else {
      // Pause video when not hovering
      videoElement.pause();
      videoElement.playbackRate = 1.0;
      setIsVideoReady(false);
      
      // Reset to 20% position for next hover
      if (videoElement.duration && isFinite(videoElement.duration)) {
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

  // Handle hover events with smooth transitions
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div 
      className="group relative flex flex-col gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
    >
      {/* Thumbnail Container */}
      <a 
        href={`/video/${videoSlug}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block relative aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer shadow-lg shadow-black/20 group-hover:shadow-primary/10 transition-all border border-transparent group-hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#222222]"
      >
        
        {/* Main Image - Hide if thumbnail error or video is playing on hover */}
        {!thumbnailError && isValidThumbnailUrl(video.thumbnail) && (
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              (isHovered || isFocused) && videoUrl && isVideoReady ? 'opacity-0' : 'opacity-100'
            }`}
            onError={(e) => {
              // Detect 404 or any image load error
              const img = e.currentTarget;
              // Check if it's a 404 or invalid image
              if (img.naturalWidth === 0 || img.naturalHeight === 0 || !img.complete) {
                setThumbnailError(true);
              }
              // Also check the error event itself
              setThumbnailError(true);
            }}
            onLoad={(e) => {
              // Check if image actually loaded (not a placeholder or broken)
              const img = e.currentTarget;
              if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                setThumbnailError(true);
              }
            }}
            onAbort={() => {
              // Image load was aborted (404, network error, etc.)
              setThumbnailError(true);
            }}
          />
        )}
        
        {/* If no thumbnail URL at all or thumbnail error (404), show video immediately */}
        {(!isValidThumbnailUrl(video.thumbnail) || thumbnailError) && thumbnailVideoUrl && (
          <video
            ref={thumbnailVideoRef}
            src={thumbnailVideoUrl}
            key={thumbnailVideoUrl} // Force re-render when URL changes
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            loop
            onLoadedMetadata={(e) => {
              const videoEl = e.currentTarget;
              // Set initial position to a random section (0-30% of video) for variety
              if (videoEl.duration && isFinite(videoEl.duration)) {
                const randomPosition = Math.random() * 0.3; // Random between 0% and 30%
                videoEl.currentTime = videoEl.duration * randomPosition;
              }
              // Force load and play
              videoEl.load();
              // Auto-play the video as thumbnail
              const playVideo = () => {
                videoEl.play()
                  .then(() => {
                    setThumbnailVideoPlaying(true);
                  })
                  .catch(() => {
                    // Auto-play failed, try again after a short delay
                    setTimeout(() => {
                      videoEl.play()
                        .then(() => {
                          setThumbnailVideoPlaying(true);
                        })
                        .catch(() => {
                          // Still failed, try with user interaction simulation
                          videoEl.muted = true;
                          videoEl.play().catch(() => {});
                        });
                    }, 200);
                  });
              };
              playVideo();
            }}
            onCanPlay={(e) => {
              // Also try to play when video can play
              const videoEl = e.currentTarget;
              if (videoEl.paused && !thumbnailVideoPlaying) {
                videoEl.play()
                  .then(() => {
                    setThumbnailVideoPlaying(true);
                  })
                  .catch(() => {
                    // Auto-play failed, ignore
                  });
              }
            }}
            onLoadedData={(e) => {
              // Try to play when data is loaded
              const videoEl = e.currentTarget;
              if (videoEl.paused && !thumbnailVideoPlaying) {
                videoEl.play()
                  .then(() => {
                    setThumbnailVideoPlaying(true);
                  })
                  .catch(() => {
                    // Auto-play failed, ignore
                  });
              }
            }}
            onPlaying={() => {
              setThumbnailVideoPlaying(true);
            }}
            onPause={() => {
              // Don't set to false on pause, only when video ends or errors
            }}
            onEnded={(e) => {
              const videoEl = e.currentTarget;
              // Loop back to random position (0-30%) when video ends
              if (videoEl.duration && isFinite(videoEl.duration)) {
                const randomPosition = Math.random() * 0.3; // Random between 0% and 30%
                videoEl.currentTime = videoEl.duration * randomPosition;
                videoEl.play()
                  .then(() => {
                    setThumbnailVideoPlaying(true);
                  })
                  .catch(() => {
                    // Auto-play failed, ignore
                  });
              }
            }}
            onError={(e) => {
              // If video also fails, show nothing (black background)
              console.debug('Video thumbnail also failed to load', e);
              setThumbnailVideoPlaying(false);
            }}
          />
        )}
        
        {/* Loading state - Show while video is loading but not playing yet */}
        {(!isValidThumbnailUrl(video.thumbnail) || thumbnailError) && thumbnailVideoUrl && !thumbnailVideoPlaying && (
          <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}


        {/* Video Preview (auto-play on hover/focus) - Always render but conditionally show - Hide if using video as thumbnail */}
        {videoUrl && !thumbnailError && (
          <div
            className={`absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-300 ${
              (isHovered || isFocused) ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              key={videoUrl} // Force re-render when video URL changes
              className="w-full h-full object-cover"
              muted
              loop={false}
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => {
                const videoEl = e.currentTarget;
                // Set initial position to 20% when metadata loads
                if (videoEl.duration && isFinite(videoEl.duration)) {
                  videoEl.currentTime = videoEl.duration * 0.2;
                }
              }}
              onEnded={(e) => {
                const videoEl = e.currentTarget;
                // Loop back to 20% when video ends if still hovering
                if ((isHovered || isFocused) && videoEl.duration && isFinite(videoEl.duration)) {
                  videoEl.currentTime = videoEl.duration * 0.2;
                  videoEl.play().catch(() => {
                    // Auto-play failed, ignore
                  });
                }
              }}
              onPlaying={() => {
                setIsVideoReady(true);
              }}
              onPause={() => {
                // Don't set isVideoReady to false on pause, only when leaving hover
              }}
              onError={(e) => {
                // Fallback to thumbnail if video fails to load
                console.debug('Video preview failed to load, using thumbnail');
                setIsVideoReady(false);
                // Stop trying to play if video has error
                const videoEl = e.currentTarget;
                videoEl.pause();
                videoEl.src = ''; // Clear invalid source
              }}
            />
            <div className="absolute inset-0 bg-black/10" /> 
          </div>
        )}

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
