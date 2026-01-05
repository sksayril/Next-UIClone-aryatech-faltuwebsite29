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
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { data: video, isLoading, isError } = useVideoBySlug(slug);
  const { data: relatedVideosResponse } = useVideos({ 
    sort: 'popular',
    page: 1,
    limit: 30,
    country: 'IN' // Indian content
  });
  
  // Extract videos array from response (handle both old array format and new object format)
  const relatedVideos = Array.isArray(relatedVideosResponse) 
    ? relatedVideosResponse 
    : (relatedVideosResponse?.videos || []);

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

  // Update video source when quality changes
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      const wasPlaying = !videoRef.current.paused;
      videoRef.current.src = currentVideoUrl;
      videoRef.current.load();
      if (wasPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [selectedQuality, currentVideoUrl]);

  // Close quality menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showQualityMenu && !(event.target as Element).closest('.quality-menu-container')) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQualityMenu]);

  // Load video when URL is available
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      videoRef.current.load();
    }
  }, [currentVideoUrl]);

  // Format numbers
  const formatNumber = (num: string) => {
    return num.replace(/,/g, '');
  };

  // Video playback handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    <div className="min-h-screen bg-[#222222] text-white font-sans overflow-x-auto" style={{ minWidth: '1200px' }}>
      <Header />

      <div className="flex max-w-[1600px] mx-auto px-8 py-6 gap-6">
        {/* Main Content - Left Side */}
        <div className="flex-1 min-w-0">
          {/* Video Player Section */}
          <div className="mb-6">
          {/* WATCH MORE Banner */}
          <div className="bg-yellow-500 text-black text-sm font-semibold px-4 py-2 mb-2 flex items-center justify-between rounded-t">
            <div className="flex items-center gap-2">
              <span>WATCH MORE</span>
              <span>Join me on FapHouse and watch Full videos</span>
              <Info className="h-4 w-4" />
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-black aspect-video w-full rounded-lg overflow-hidden shadow-2xl border border-[#333] relative group">
            {currentVideoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={currentVideoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                />
                
                {/* Play/Pause Button Overlay */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="bg-primary/90 p-8 rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(213,45,45,0.5)]">
                      <Play className="h-12 w-12 text-white fill-current ml-1" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <img 
                src={video.thumbnail} 
                className="w-full h-full object-cover" 
                alt={video.title} 
              />
            )}
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end px-4 py-2">
              <div className="w-full space-y-2">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-primary rounded-full relative transition-all"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={togglePlay}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-white fill-current" />
                      ) : (
                        <Play className="h-5 w-5 text-white fill-current" />
                      )}
                    </button>
                    <span className="text-xs text-white">
                      {formatTime(currentTime)} / {duration ? formatTime(duration) : video.duration}
                    </span>
                    <button className="hover:opacity-80 ml-2 transition-opacity">
                      <Volume2 className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white">1x</span>
                    {/* Quality Selection */}
                    {availableQualities.length > 0 && (
                      <div className="relative quality-menu-container">
                        <button 
                          onClick={() => setShowQualityMenu(!showQualityMenu)}
                          className="hover:opacity-80 transition-opacity flex items-center gap-1"
                        >
                          <Settings className="h-5 w-5 text-white" />
                          <span className="text-xs text-white">{selectedQuality}</span>
                        </button>
                        {showQualityMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-[#2a2a2a] rounded-lg shadow-lg border border-[#333] min-w-[120px] z-10">
                            {availableQualities.map((quality) => (
                              <button
                                key={quality}
                                onClick={() => {
                                  setSelectedQuality(quality);
                                  setShowQualityMenu(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#333] transition-colors ${
                                  selectedQuality === quality ? 'text-primary font-semibold' : 'text-white'
                                }`}
                              >
                                {quality.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={() => videoRef.current?.requestFullscreen()}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Maximize className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="mb-6">
          {/* Title and Stats */}
          <h1 className="text-2xl font-bold text-white mb-3">{video.title}</h1>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{formatNumber(video.views)} views</span>
              <span>{video.rating}%</span>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#333]">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {video.author[0]}
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold hover:text-primary cursor-pointer">{video.author}</div>
              <div className="text-xs text-gray-400">29.9K Subscribers</div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6">
              Subscribe 29.9K
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white text-sm rounded transition-colors flex items-center gap-1"
              >
                {tag === "Indian" && <span>🇮🇳</span>}
                {tag}
                {tag === "Hardcore" && <ChevronDown className="h-3 w-3" />}
              </button>
            ))}
          </div>

          {/* Engagement Buttons */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#333]">
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-2">
                <ThumbsUp className="h-4 w-4" />
                <span>92,890</span>
              </Button>
              <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-2">
                <ThumbsDown className="h-4 w-4" />
                <span>710</span>
              </Button>
            </div>
            <div className="w-px h-6 bg-[#333]" />
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-2">
              <Heart className="h-4 w-4" />
              Favorite
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-2">
              <MessageCircle className="h-4 w-4" />
              Comments 605
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a] gap-2">
              <Info className="h-4 w-4" />
              About
            </Button>
            <Button variant="ghost" className="text-white hover:bg-[#2a2a2a]">
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          {/* FapHouse Banner */}
          <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <div className="text-white font-semibold mb-1">{video.author}</div>
              <div className="text-sm text-gray-400">Join me on FapHouse and watch Full videos</div>
              <div className="text-xs text-gray-500">faphouse.tv</div>
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6">
              GET FULL VIDEO
            </Button>
          </div>
        </div>

        {/* Related Videos Tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6 border-b border-[#333]">
              <button
                onClick={() => setActiveTab('related')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'related'
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Related Videos
              </button>
              <button
                onClick={() => setActiveTab('channel')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'channel'
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                From {video.author}
              </button>
              <button
                onClick={() => setActiveTab('recommended')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'recommended'
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Recommended
              </button>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>By clicking the content here you will also see an ad</span>
              <Info className="h-3 w-3" />
            </div>
          </div>

          {/* Related Videos Grid */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            {Array.isArray(relatedVideos) && relatedVideos.length > 0 ? (
              relatedVideos.slice(0, 12).map((relatedVideo: VideoResponse) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))
            ) : (
              <div className="col-span-6 text-center text-gray-500 py-8">
                No related videos found.
              </div>
            )}
          </div>

          <div className="flex justify-center mb-8">
            <Button variant="outline" className="bg-[#2a2a2a] border-[#333] text-white hover:bg-[#333]">
              Show more related videos <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Comments 605</h2>
          
          {/* Login Prompt */}
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm">Please log in or register to post comments</p>
          </div>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm">User{i}</span>
                    <span className="text-gray-400 text-xs">1 month ago</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    This is a sample comment. Users can express their thoughts about the video here.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{Math.floor(Math.random() * 500)}</span>
                    </button>
                    <button className="text-gray-400 hover:text-white text-xs">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comments Pagination */}
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentCommentPage(page)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  currentCommentPage === page
                    ? 'bg-white text-[#222]'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333]'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1.5 text-sm font-medium rounded bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333] transition-colors">
              61
            </button>
            <button className="px-3 py-1.5 text-sm font-medium rounded bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333] transition-colors">
              121
            </button>
            <Button
              onClick={() => setCurrentCommentPage(prev => prev + 1)}
              className="bg-primary hover:bg-primary/90 text-white border-0 ml-2 px-4"
            >
              Next <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        </div>

        {/* Right Sidebar - Blank Space */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-[104px]">
            {/* Blank space or can add related videos sidebar here */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
