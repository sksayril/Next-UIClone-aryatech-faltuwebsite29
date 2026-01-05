import type { Express } from "express";
import type { Server } from "http";
import { api, buildExternalApiUrl } from "@shared/routes";
import { z } from "zod";

// Map external API response to our video format
function mapApiVideoToVideo(apiVideo: any, index: number, page: number, limit: number): any {
  // Extract all available video qualities from Videos array
  const videosArray = apiVideo.Videos || [];
  const videoQualities: Record<string, string> = {}; // quality -> url mapping
  
  videosArray.forEach((video: any) => {
    if (video.Quality && video.Url) {
      const quality = video.Quality.toLowerCase();
      videoQualities[quality] = video.Url;
    }
  });

  // Determine highest quality available and quality flags
  const has1080p = videoQualities['1080p'] || videoQualities['1080'];
  const has720p = videoQualities['720p'] || videoQualities['720'];
  const has480p = videoQualities['480p'] || videoQualities['480'];
  const has4k = videoQualities['2160p'] || videoQualities['4k'] || videoQualities['2160'];
  
  const is4k = !!has4k;
  const isHd = !!has1080p || !!has720p;
  
  // Select best quality for preview (prefer 720p for faster loading, then 1080p, then 480p)
  const previewVideoUrl = has720p ? videoQualities['720p'] || videoQualities['720'] :
                          has1080p ? videoQualities['1080p'] || videoQualities['1080'] :
                          has480p ? videoQualities['480p'] || videoQualities['480'] :
                          videosArray[0]?.Url || null;
  
  // Format views properly (without "views" suffix - VideoCard adds it)
  const views = apiVideo.Views || 0;
  let formattedViews: string;
  if (views >= 1000000) {
    formattedViews = (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    formattedViews = (views / 1000).toFixed(1) + 'K';
  } else {
    formattedViews = views.toString();
  }

  // Calculate rating from likes/views ratio, with minimum of 85
  const rating = views > 0 
    ? Math.max(Math.round((apiVideo.Likes || 0) / views * 100), 85)
    : 95;
  
  // Estimate duration from video file size (will be updated by client when video loads)
  // Estimate: ~1-2MB per minute for compressed video (varies by quality)
  const fileSizeBytes = videosArray[0]?.FileSize || 0;
  let duration = '0:00'; // Will be set by client when video metadata loads
  
  if (fileSizeBytes > 0) {
    const fileSizeMB = fileSizeBytes / (1024 * 1024);
    // Rough estimate: 1080p ~1.5MB/min, 720p ~1MB/min, 4K ~3MB/min, 480p ~0.5MB/min
    const mbPerMinute = is4k ? 3 : (has1080p ? 1.5 : (has720p ? 1 : 0.5));
    const estimatedMinutes = Math.max(Math.round(fileSizeMB / mbPerMinute), 1);
    const minutes = Math.min(estimatedMinutes, 120); // Cap at 120 minutes
    const seconds = Math.floor((fileSizeMB / mbPerMinute - estimatedMinutes) * 60);
    duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Get author/channel name
  const author = apiVideo.SubCategory?.Name || apiVideo.Director || `Channel${(page - 1) * limit + index + 1}`;

  // Use a hash of the _id for numeric ID, or generate from index
  const numericId = (page - 1) * limit + index + 1;

  return {
    id: numericId,
    title: apiVideo.Title || 'Untitled',
    thumbnail: apiVideo.Thumbnail || apiVideo.Poster || '',
    previewVideo: previewVideoUrl, // Use best quality for preview (720p preferred)
    duration: duration, // Estimated, will be updated by client
    views: formattedViews,
    author: author,
    isHd: isHd && !is4k,
    is4k: is4k,
    isVr: false,
    rating: rating,
    createdAt: apiVideo.createdAt ? new Date(apiVideo.createdAt) : (apiVideo.ReleaseDate ? new Date(apiVideo.ReleaseDate) : new Date()),
    // Store all available video qualities
    videoQualities: videoQualities, // { '1080p': url, '720p': url, '480p': url }
    // Store slug for fetching video details
    slug: apiVideo.Slug || null,
    // Store original API data for reference
    _apiId: apiVideo._id,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.videos.list.path, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 30;
      const country = (req.query.country as string) || 'US'; // Default to US
      
      console.log(`Fetching videos from API: page=${page}, limit=${limit}, country=${country}`);
      
      // Fetch from external API - Note: sort parameter is not supported by external API
      const apiUrl = buildExternalApiUrl('api/movies/all', {
        page: page.toString(),
        limit: limit.toString(),
        country: country
      });
      
      console.log(`Calling external API: ${apiUrl}`);
      
      const apiResponse = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!apiResponse.ok) {
        console.error(`API returned status ${apiResponse.status}: ${apiResponse.statusText}`);
        return res.status(apiResponse.status).json({ 
          message: `Failed to fetch videos: ${apiResponse.statusText}` 
        });
      }
      
      const apiData = await apiResponse.json();
      console.log(`API response received: success=${apiData.success}, data length=${apiData.data?.length || 0}`);
      
      if (apiData.success && apiData.data && Array.isArray(apiData.data)) {
        const mappedVideos = apiData.data.map((apiVideo: any, index: number) => 
          mapApiVideoToVideo(apiVideo, index, page, limit)
        );
        
        // Return videos with pagination data from API
        const pagination = apiData.pagination || {
          page: page,
          limit: limit,
          pages: 1,
          total: mappedVideos.length
        };
        
        console.log(`Returning ${mappedVideos.length} videos from API with pagination:`, pagination);
        return res.json({
          videos: mappedVideos,
          pagination: pagination
        });
      }
      
      console.log('API returned no data or invalid response');
      return res.json({
        videos: [],
        pagination: {
          page: page,
          limit: limit,
          pages: 1,
          total: 0
        }
      });
    } catch (error) {
      console.error('Error fetching from external API:', error);
      // Return consistent format even on error
      return res.status(500).json({ 
        videos: [],
        pagination: {
          page: page,
          limit: limit,
          pages: 1,
          total: 0
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get(api.videos.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      // Try to get from external API
      const limit = 30;
      const page = Math.ceil(id / limit);
      const country = 'US';
      const apiUrl = buildExternalApiUrl('api/movies/all', {
        page: page.toString(),
        limit: limit.toString(),
        country: country
      });
      
      const apiResponse = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        if (apiData.success && apiData.data && Array.isArray(apiData.data)) {
          const indexInPage = (id - 1) % limit;
          if (apiData.data[indexInPage]) {
            const mappedVideo = mapApiVideoToVideo(apiData.data[indexInPage], indexInPage, page, limit);
            return res.json(mappedVideo);
          }
        }
      }
      
      return res.status(404).json({ message: "Video not found" });
    } catch (error) {
      console.error('Error fetching video:', error);
      return res.status(500).json({ 
        message: "Failed to fetch video",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get(api.videos.getBySlug.path, async (req, res) => {
    try {
      const slug = req.params.slug;
      
      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }

      const apiUrl = buildExternalApiUrl('api/movies/{slug}', { slug });
      console.log(`Fetching video by slug: ${apiUrl}`);
      
      const apiResponse = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!apiResponse.ok) {
        console.error(`API returned status ${apiResponse.status} for slug: ${slug}`);
        return res.status(apiResponse.status).json({ 
          message: `Failed to fetch video: ${apiResponse.statusText}` 
        });
      }
      
      const apiData = await apiResponse.json();
      
      // Handle both object and array responses from API
      let apiVideo: any = null;
      if (apiData.success && apiData.data) {
        if (Array.isArray(apiData.data) && apiData.data.length > 0) {
          // Response is an array (from /movies/all endpoint)
          apiVideo = apiData.data[0];
        } else if (typeof apiData.data === 'object' && apiData.data._id) {
          // Response is an object (from /movies/{slug} endpoint)
          apiVideo = apiData.data;
        }
      }
      
      if (apiVideo) {
        const mappedVideo = mapApiVideoToVideo(apiVideo, 0, 1, 1);
        return res.json(mappedVideo);
      }
      
      return res.status(404).json({ message: "Video not found" });
    } catch (error) {
      console.error('Error fetching video by slug:', error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get(api.categories.list.path, async (req, res) => {
    // Categories are not available from external API, return empty array
    res.json([]);
  });

  return httpServer;
}
