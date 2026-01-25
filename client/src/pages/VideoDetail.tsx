import { useVideoBySlug, useVideos } from "@/hooks/use-videos";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useRoute } from "wouter";
import { Loader2, ThumbsUp, ThumbsDown, Share2, Heart, Flag, Info, MessageCircle, Play, Volume2, Maximize, Settings, ChevronDown, Pause } from "lucide-react";
import { type VideoResponse } from "@shared/routes";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function VideoDetail() {
  const [match, params] = useRoute("/video/:slug");
  const slug = params?.slug || '';
  const [activeTab, setActiveTab] = useState<'related' | 'channel' | 'recommended'>('related');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videosToShow, setVideosToShow] = useState(12); // Number of videos to display initially
  const [relatedVideosPage, setRelatedVideosPage] = useState(1);
  const [allRelatedVideos, setAllRelatedVideos] = useState<VideoResponse[]>([]);
  const [videoError, setVideoError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailVideoPlaying, setThumbnailVideoPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHoveringPlayer, setIsHoveringPlayer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: video, isLoading, isError } = useVideoBySlug(slug);
  
  // Initialize thumbnailError if thumbnail is missing or empty when video loads
  useEffect(() => {
    if (video) {
      setThumbnailError(!video.thumbnail || video.thumbnail.trim() === '');
    }
  }, [video]);
  const { data: relatedVideosResponse, isLoading: isLoadingMoreVideos } = useVideos({ 
    sort: 'popular',
    page: relatedVideosPage,
    limit: 30,
    country: 'IN' // Indian content
  });
  
  // Extract videos array from response (handle both old array format and new object format)
  const relatedVideos = Array.isArray(relatedVideosResponse) 
    ? relatedVideosResponse 
    : (relatedVideosResponse?.videos || []);
  
  // Accumulate videos when new page loads
  useEffect(() => {
    if (relatedVideos && relatedVideos.length > 0) {
      if (relatedVideosPage === 1) {
        // First page - replace all videos
        setAllRelatedVideos(relatedVideos);
      } else {
        // Subsequent pages - append new videos (avoid duplicates)
        setAllRelatedVideos(prev => {
          const existingIds = new Set(prev.map((v: VideoResponse) => v.id));
          const newVideos = relatedVideos.filter((v: VideoResponse) => !existingIds.has(v.id));
          return [...prev, ...newVideos];
        });
      }
    }
  }, [relatedVideos, relatedVideosPage]);
  
  // Reset when tab changes
  useEffect(() => {
    setVideosToShow(12);
    setRelatedVideosPage(1);
    setAllRelatedVideos([]);
  }, [activeTab]);

  // Get video qualities from video object (safe access)
  const videoQualities = video ? ((video as any)?.videoQualities || {}) : {};
  const previewVideo = video ? ((video as any)?.previewVideo || video.previewVideo) : '';
  
  // Get available qualities and select best one
  const availableQualities = Object.keys(videoQualities).filter(q => videoQualities[q]);
  const defaultQuality = availableQualities.includes('1080p') ? '1080p' : 
                        availableQualities.includes('720p') ? '720p' : 
                        availableQualities.includes('480p') ? '480p' : 
                        availableQualities[0] || '1080p';
  
  // Get current video URL based on selected quality
  const currentVideoUrl = videoQualities[selectedQuality] || videoQualities[defaultQuality] || previewVideo || '';

  // Reset error state when video URL changes
  useEffect(() => {
    setVideoError(false);
    setThumbnailVideoPlaying(false);
    setIsVideoLoading(false);
    setIsPlaying(false);
    // Reset thumbnail error when video changes, but check if thumbnail exists
    if (video) {
      setThumbnailError(!video.thumbnail || video.thumbnail.trim() === '');
    }
  }, [currentVideoUrl, video]);

  // Update video source when quality changes
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      const wasPlaying = !videoRef.current.paused;
      setVideoError(false); // Reset error when changing source
      videoRef.current.src = currentVideoUrl;
      videoRef.current.load();
      if (wasPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
          setVideoError(true);
        });
      }
    }
  }, [selectedQuality, currentVideoUrl]);

  // Close quality menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showQualityMenu && !target.closest('.quality-menu-container')) {
        setShowQualityMenu(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showQualityMenu) {
        setShowQualityMenu(false);
      }
    };
    if (showQualityMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showQualityMenu]);

  // Load video when URL is available
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      videoRef.current.load();
      // Ensure video element is properly configured
      videoRef.current.style.display = 'block';
      videoRef.current.style.position = 'absolute';
      videoRef.current.style.top = '0';
      videoRef.current.style.left = '0';
      videoRef.current.style.width = '100%';
      videoRef.current.style.height = '100%';
    }
  }, [currentVideoUrl]);

  // Ensure video is visible when playing
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.style.opacity = '1';
      videoRef.current.style.display = 'block';
      videoRef.current.style.zIndex = '10';
    }
  }, [isPlaying]);

  // Get duration from video element when it's ready
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      const checkDuration = () => {
        if (videoRef.current && videoRef.current.duration && isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
          setDuration(videoRef.current.duration);
        }
      };
      
      // Check immediately
      checkDuration();
      
      // Also check after a short delay to catch duration when metadata loads
      const timeout = setTimeout(checkDuration, 500);
      
      // Listen for duration change events
      videoRef.current.addEventListener('durationchange', checkDuration);
      videoRef.current.addEventListener('loadedmetadata', checkDuration);
      
      return () => {
        clearTimeout(timeout);
        if (videoRef.current) {
          videoRef.current.removeEventListener('durationchange', checkDuration);
          videoRef.current.removeEventListener('loadedmetadata', checkDuration);
        }
      };
    }
  }, [currentVideoUrl]);

  // Pause thumbnail video when main video is playing
  useEffect(() => {
    if (thumbnailVideoRef.current) {
      if (isPlaying) {
        thumbnailVideoRef.current.pause();
        setThumbnailVideoPlaying(false);
      } else if (thumbnailError && !isPlaying && !thumbnailVideoPlaying) {
        // Resume thumbnail video when main video is paused
        thumbnailVideoRef.current.play()
          .then(() => {
            setThumbnailVideoPlaying(true);
          })
          .catch(() => {
            // Auto-play failed, ignore
          });
      }
    }
  }, [isPlaying, thumbnailError, thumbnailVideoPlaying]);

  // Format numbers
  const formatNumber = (num: string) => {
    return num.replace(/,/g, '');
  };

  // Video playback handlers
  const togglePlay = () => {
    if (videoRef.current && !videoError && currentVideoUrl) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsVideoLoading(false);
        setShowControls(true); // Always show controls when paused
      } else {
        // Show loading state when starting to play
        setIsVideoLoading(true);
        setShowControls(true);
        
        // Ensure video is loaded and ready
        if (videoRef.current.readyState < 2) {
          videoRef.current.load();
        }
        
        // Play the video
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video started playing successfully
              setIsPlaying(true);
              setIsVideoLoading(false);
              setVideoError(false);
            })
            .catch((error) => {
              console.error('Failed to play video:', error);
              setVideoError(true);
              setIsPlaying(false);
              setIsVideoLoading(false);
            });
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration && isFinite(videoRef.current.duration)) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      console.log('Video duration loaded:', videoDuration, formatTime(videoDuration));
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (seconds: number | null | undefined) => {
    if (seconds === null || seconds === undefined || !isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Ad script is loaded globally in index.html
  // The script will automatically populate divs with id="b3a4498413dba25bcd98e67937ca5a54"

  // Update document title with video title
  useDocumentTitle(
    video ? `${video.title} - xHamster` : "xHamster - Free Porn Videos",
    video ? `Watch "${video.title}" on xHamster. ${video.views} views. ${video.is4k ? '4K' : video.isHd ? 'HD' : ''} quality porn video.` : undefined
  );

  if (isLoading) return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  
  if (isError || !video) return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center text-white">
      Video not found
    </div>
  );

  const tags = ["Indian", "18 Year Old", "4K Porn", "Asian", "BBW", "BDSM", "Eating Pussy", "Foreplay", "Foursome", "HD Videos", "Hardcore"];

  return (
    <div className="min-h-screen bg-[#222222] text-white font-sans">
      <Header />

      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6 gap-4 md:gap-6">
        {/* Main Content - Left Side */}
        <div className="flex-1 min-w-0">
          {/* Video Player Section */}
          <div className="mb-6">
          {/* WATCH MORE Banner - Removed */}
          {/* <div className="bg-yellow-500 text-black text-xs md:text-sm font-semibold px-3 md:px-4 py-2 mb-2 flex items-center justify-between rounded-t">
            <div className="flex items-center gap-1 md:gap-2 flex-wrap">
              <span className="whitespace-nowrap">WATCH MORE</span>
              <span className="hidden sm:inline">Join me on FapHouse and watch Full videos</span>
              <span className="sm:hidden">Full videos</span>
              <Info className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            </div>
          </div> */}

          {/* Ad Above Video Player */}
          {video && (
            <div className="mb-4 md:mb-6 flex justify-center" id="ad-above-player">
              <div id="b3a4498413dba25bcd98e67937ca5a54" style={{ width: '320px', height: '50px' }}></div>
            </div>
          )}

          {/* Video Player */}
          <div 
            className="bg-black aspect-video w-full rounded-lg overflow-visible shadow-2xl border border-[#333] relative group" 
            style={{ position: 'relative', minHeight: '400px' }}
            onMouseEnter={() => {
              setIsHoveringPlayer(true);
              setShowControls(true);
              if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
                controlsTimeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              setIsHoveringPlayer(false);
              // Keep controls visible when paused, auto-hide when playing
              if (!isPlaying) {
                setShowControls(true);
              }
            }}
            onMouseMove={() => {
              // Show controls on mouse move
              setShowControls(true);
              if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
              }
            }}
          >
            {/* Thumbnail - Always visible when video is paused, has error, or no video URL */}
            {!thumbnailError && video.thumbnail && (
              <img 
                src={video.thumbnail} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-0 ${
                  currentVideoUrl && isPlaying && !videoError ? 'opacity-0' : 'opacity-100'
                }`}
                alt={video.title}
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

            {/* Video as Thumbnail - Show when thumbnail fails to load (404 error) */}
            {(!video.thumbnail || thumbnailError) && !isPlaying && (
              <>
                {currentVideoUrl ? (
                  <video
                    ref={thumbnailVideoRef}
                    src={currentVideoUrl}
                    key={currentVideoUrl} // Force re-render when URL changes
                    className="absolute inset-0 w-full h-full object-cover z-0"
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
                ) : (
                  // Show loading state while video URL is being fetched
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            )}
            
            {/* Loading state - Show while video is loading but not playing yet */}
            {(!video.thumbnail || thumbnailError) && !isPlaying && currentVideoUrl && !thumbnailVideoPlaying && (
              <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Video Error Message - Show when video fails to load */}
            {videoError && (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4"
                style={{ 
                  zIndex: 50,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              >
                <div className="text-center">
                  <div className="text-red-500 mb-2">
                    <Info className="h-12 w-12 md:h-16 md:w-16 mx-auto" />
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1">Video Cannot Load</h3>
                  <p className="text-gray-400 text-xs md:text-sm mb-4">This video cannot be played. The video file may be corrupted or unavailable.</p>
                  <button
                    onClick={() => {
                      setVideoError(false);
                      setIsVideoLoading(true);
                      if (videoRef.current && currentVideoUrl) {
                        videoRef.current.load();
                        videoRef.current.play().catch(() => {
                          setVideoError(true);
                          setIsVideoLoading(false);
                        });
                      }
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {/* Video Loading Indicator - Show when video is loading */}
            {isVideoLoading && currentVideoUrl && !videoError && (
              <div 
                className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center"
                style={{ 
                  zIndex: 40,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin text-primary" />
                  <p className="text-white text-sm md:text-base font-medium">Loading video...</p>
                </div>
              </div>
            )}

            {/* Video Element - Only show when video URL is available and no error */}
            {currentVideoUrl && !videoError && (
                <video
                  ref={videoRef}
                  src={currentVideoUrl}
                  className="w-full h-full"
                  style={{ 
                    backgroundColor: '#000',
                    objectFit: 'contain',
                    display: 'block',
                    position: 'relative',
                    zIndex: 10
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={(e) => {
                    // Get duration from video element
                    const videoEl = e.currentTarget;
                    if (videoEl.duration && isFinite(videoEl.duration)) {
                      setDuration(videoEl.duration);
                      console.log('Video duration from metadata:', videoEl.duration, formatTime(videoEl.duration));
                    }
                    handleLoadedMetadata();
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                    setVideoError(true);
                    setIsPlaying(false);
                    setIsVideoLoading(false);
                  }}
                  onLoadStart={() => {
                    setVideoError(false);
                    // Always show loading when video starts loading
                    setIsVideoLoading(true);
                  }}
                  onLoadedData={() => {
                    // Video data loaded - also try to get duration here
                    if (videoRef.current && videoRef.current.duration && isFinite(videoRef.current.duration)) {
                      setDuration(videoRef.current.duration);
                    }
                    setIsVideoLoading(false);
                  }}
                  onCanPlay={() => {
                    // Video is ready to play - ensure duration is set
                    if (videoRef.current && videoRef.current.duration && isFinite(videoRef.current.duration)) {
                      setDuration(videoRef.current.duration);
                    }
                    setIsVideoLoading(false);
                  }}
                  onCanPlayThrough={() => {
                    // Video can play through without buffering
                    setIsVideoLoading(false);
                  }}
                  onWaiting={() => {
                    // Video is waiting for data (buffering)
                    if (isPlaying) {
                      setIsVideoLoading(true);
                    }
                  }}
                  onPlaying={() => {
                    // Video started playing
                    setIsPlaying(true);
                    setIsVideoLoading(false);
                    setVideoError(false);
                  }}
                  onPause={() => {
                    setIsPlaying(false);
                    setIsVideoLoading(false);
                  }}
                  onEnded={() => {
                    setIsPlaying(false);
                    setIsVideoLoading(false);
                  }}
                  onSeeking={() => {
                    // Show loading when seeking
                    setIsVideoLoading(true);
                  }}
                  onSeeked={() => {
                    // Hide loading when seek completed
                    setIsVideoLoading(false);
                  }}
                  playsInline
                  muted={isMuted}
                  controls
                  preload="metadata"
                />
            )}
            
            {/* Custom Video Controls - Hidden when using default browser controls */}
            {/* Default browser controls are enabled on the video element above */}
            {false && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-14 md:h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end px-2 md:px-4 py-2 z-50"
              style={{ 
                zIndex: 50,
                pointerEvents: 'auto',
                opacity: 1
              }}
              onMouseEnter={() => {
                setShowControls(true);
                if (controlsTimeoutRef.current) {
                  clearTimeout(controlsTimeoutRef.current);
                }
              }}
            >
              <div className="w-full space-y-1 md:space-y-2">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-primary rounded-full relative transition-all"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 md:gap-2">
                    <button 
                      onClick={togglePlay}
                      className="hover:opacity-80 transition-opacity z-50"
                      type="button"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 md:h-5 md:w-5 text-white fill-current" />
                      ) : (
                        <Play className="h-4 w-4 md:h-5 md:w-5 text-white fill-current" />
                      )}
                    </button>
                    {/* Video Duration Display in Controls - Commented out */}
                    {/* <span className="text-[10px] md:text-xs text-white whitespace-nowrap">
                      Current Time / Total Duration
                      {formatTime(currentTime)} / {duration && duration > 0 ? formatTime(duration) : (video.duration || '0:00')}
                    </span> */}
                    <button 
                      className="hover:opacity-80 ml-1 md:ml-2 transition-opacity hidden sm:block relative" 
                      type="button"
                      onClick={() => {
                        if (videoRef.current) {
                          const newMuted = !isMuted;
                          videoRef.current.muted = newMuted;
                          setIsMuted(newMuted);
                        }
                      }}
                    >
                      {isMuted ? (
                        <Volume2 className="h-4 w-4 md:h-5 md:w-5 text-white" style={{ opacity: 0.5 }} />
                      ) : (
                        <Volume2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="text-[10px] md:text-xs text-white hidden sm:inline">1x</span>
                    {/* Quality Selection */}
                    {availableQualities.length > 0 && (
                      <div className="relative quality-menu-container z-50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowQualityMenu(!showQualityMenu);
                          }}
                          className="hover:opacity-80 transition-opacity flex items-center gap-1 z-50"
                          type="button"
                        >
                          <Settings className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          <span className="text-[10px] md:text-xs text-white hidden sm:inline">{selectedQuality}</span>
                        </button>
                        {showQualityMenu && (
                          <>
                            {/* Backdrop to catch clicks outside */}
                            <div 
                              className="fixed inset-0 z-[99]"
                              onClick={() => setShowQualityMenu(false)}
                              style={{ zIndex: 99 }}
                            />
                            {/* Quality Menu */}
                            <div 
                              className="absolute bottom-full right-0 mb-2 bg-[#2a2a2a] rounded-lg shadow-2xl border border-[#333] min-w-[120px] overflow-hidden"
                              style={{ 
                                zIndex: 100,
                                position: 'absolute',
                                bottom: '100%',
                                right: 0,
                                marginBottom: '0.5rem'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {availableQualities.map((quality, index) => (
                                <button
                                  key={quality}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedQuality(quality);
                                    setShowQualityMenu(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-[#333] transition-colors ${
                                    index === 0 ? 'rounded-t-lg' : ''
                                  } ${
                                    index === availableQualities.length - 1 ? 'rounded-b-lg' : ''
                                  } ${
                                    selectedQuality === quality ? 'text-primary font-semibold bg-[#333]' : 'text-white'
                                  }`}
                                  type="button"
                                >
                                  {quality.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.requestFullscreen) {
                            videoRef.current.requestFullscreen();
                          } else if ((videoRef.current as any).webkitRequestFullscreen) {
                            (videoRef.current as any).webkitRequestFullscreen();
                          } else if ((videoRef.current as any).mozRequestFullScreen) {
                            (videoRef.current as any).mozRequestFullScreen();
                          } else if ((videoRef.current as any).msRequestFullscreen) {
                            (videoRef.current as any).msRequestFullscreen();
                          }
                        }
                      }}
                      className="hover:opacity-80 transition-opacity hidden sm:block"
                      type="button"
                    >
                      <Maximize className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
          
        </div>

        {/* Video Info Section */}
        <div className="mb-4 md:mb-6">
          {/* Ad Above Title */}
          {video && (
            <div className="mb-3 md:mb-4 flex justify-center" id="ad-above-title">
              <div id="b3a4498413dba25bcd98e67937ca5a54" style={{ width: '320px', height: '50px' }}></div>
            </div>
          )}
          
          {/* Title and Stats */}
          {video && (
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 leading-tight">{video.title}</h1>
          )}
          
          <div className="flex items-center justify-between mb-3 md:mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
              <span>{formatNumber(video.views)} views</span>
              <span className="hidden sm:inline">{video.rating}%</span>
            </div>
            {/* Video Duration Display - Commented out */}
            {/* <div className="text-xs md:text-sm text-gray-400">
              Show video duration: Use actual duration from video element metadata, fallback to video.duration from API
              {duration && duration > 0 ? (
                <span>{formatTime(duration)}</span>
              ) : video.duration ? (
                <span>{video.duration}</span>
              ) : (
                <span>0:00</span>
              )}
            </div> */}
          </div>

          {/* Channel Info */}
          {/* <div className="flex items-center gap-3 md:gap-4 mb-4 pb-4 border-b border-[#333]">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0">
              {video.author[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold hover:text-primary cursor-pointer text-sm md:text-base truncate">{video.author}</div>
              <div className="text-xs text-gray-400">29.9K Subscribers</div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 md:px-6 text-xs md:text-sm h-8 md:h-10 whitespace-nowrap flex-shrink-0">
              <span className="hidden sm:inline">Subscribe </span>29.9K
            </Button>
          </div> */}

          {/* Tags */}
          {/* <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4 overflow-x-auto scrollbar-hide pb-2">
            {tags.map((tag, index) => (
              <button
                key={index}
                className="px-2 md:px-3 py-1 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white text-xs md:text-sm rounded transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {tag === "Indian" && <span>🇮🇳</span>}
                {tag}
                {tag === "Hardcore" && <ChevronDown className="h-3 w-3" />}
              </button>
            ))}
          </div> */}

          {/* Engagement Buttons */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 pb-4 border-b border-[#333] overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-1 md:gap-2 h-8 md:h-10 px-2 md:px-3">
                <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">92,890</span>
              </Button>
              <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-1 md:gap-2 h-8 md:h-10 px-2 md:px-3">
                <ThumbsDown className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">710</span>
              </Button>
            </div>
            <div className="w-px h-6 bg-[#333] hidden sm:block" />
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-1 md:gap-2 h-8 md:h-10 px-2 md:px-3">
              <Heart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Favorite</span>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-1 md:gap-2 h-8 md:h-10 px-2 md:px-3">
              <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm"><span className="hidden sm:inline">Comments </span>605</span>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-1 md:gap-2 h-8 md:h-10 px-2 md:px-3">
              <Share2 className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-1 md:gap-2 h-8 md:h-10 px-2 md:px-3 hidden md:flex">
              <Info className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">About</span>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] h-8 md:h-10 px-2 md:px-3">
              <Flag className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>

          {/* FapHouse Banner */}
          {/* <div className="bg-[#2a2a2a] rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold mb-1 text-sm md:text-base truncate">{video.author}</div>
              <div className="text-xs md:text-sm text-gray-400">Join me on FapHouse and watch Full videos</div>
              <div className="text-[10px] md:text-xs text-gray-500">faphouse.tv</div>
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 md:px-6 text-xs md:text-sm h-9 md:h-10 w-full sm:w-auto whitespace-nowrap">
              GET FULL VIDEO
            </Button>
          </div> */}
        </div>

        {/* Related Videos Tabs */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
            <div className="flex items-center gap-2 md:gap-6 border-b border-[#333] overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('related')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'related'
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Related Videos
              </button>
              <button
                onClick={() => setActiveTab('channel')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'channel'
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                From {video.author}
              </button>
              <button
                onClick={() => setActiveTab('recommended')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'recommended'
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Recommended
              </button>
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
              <span className="hidden sm:inline">By clicking the content here you will also see an ad</span>
              <span className="sm:hidden">Click content = ad</span>
              <Info className="h-3 w-3 flex-shrink-0" />
            </div>
          </div>

          {/* Related Videos Grid - 2 columns on mobile, 6 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 mb-6 md:mb-8">
            {allRelatedVideos.length > 0 ? (
              allRelatedVideos.slice(0, videosToShow).map((relatedVideo: VideoResponse) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))
            ) : Array.isArray(relatedVideos) && relatedVideos.length > 0 ? (
              relatedVideos.slice(0, videosToShow).map((relatedVideo: VideoResponse) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))
            ) : (
              <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 text-center text-gray-500 py-8">
                No related videos found.
              </div>
            )}
          </div>

          {/* Show More Button - Only show if there are more videos to load */}
          {(allRelatedVideos.length > videosToShow || (Array.isArray(relatedVideos) && relatedVideos.length >= videosToShow)) && (
            <div className="flex justify-center mb-6 md:mb-8">
              <Button 
                variant="outline" 
                onClick={() => {
                  const currentDisplayed = videosToShow;
                  const availableVideos = allRelatedVideos.length > 0 ? allRelatedVideos.length : (Array.isArray(relatedVideos) ? relatedVideos.length : 0);
                  
                  // If we've shown all available videos, load next page
                  if (currentDisplayed >= availableVideos) {
                    setRelatedVideosPage(prev => prev + 1);
                  }
                  
                  // Show 12 more videos
                  setVideosToShow(prev => prev + 12);
                }}
                disabled={isLoadingMoreVideos}
                className="bg-[#2a2a2a] border-[#333] text-white hover:bg-[#333] text-xs md:text-sm h-9 md:h-10 px-4 md:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMoreVideos ? (
                  <>
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Show more related videos <ChevronDown className="h-3 w-3 md:h-4 md:w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        </div>

        {/* Right Sidebar - Blank Space - Hidden on mobile */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-[104px]">
            {/* Blank space or can add related videos sidebar here */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
