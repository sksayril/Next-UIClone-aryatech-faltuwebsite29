import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useVideos(filters?: { search?: string; category?: string; sort?: 'newest' | 'popular' | 'best'; page?: number; limit?: number; country?: string }) {
  // Construct the query key properly to include filters
  const queryKey = [api.videos.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build the URL with query parameters manually since api.videos.list.path is just the base path
      const url = new URL(api.videos.list.path, window.location.origin);
      if (filters?.search) url.searchParams.append('search', filters.search);
      if (filters?.category) url.searchParams.append('category', filters.category);
      if (filters?.sort) url.searchParams.append('sort', filters.sort);
      if (filters?.page) url.searchParams.append('page', filters.page.toString());
      if (filters?.limit) url.searchParams.append('limit', filters.limit.toString());
      if (filters?.country) url.searchParams.append('country', filters.country);
      // Default to US
      if (!filters?.country) url.searchParams.append('country', 'US');

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      
      // Handle both old format (array) and new format (object with videos and pagination)
      if (Array.isArray(data)) {
        // Legacy format - return as array for backward compatibility
        return data;
      } else if (data && data.videos && Array.isArray(data.videos)) {
        // New format with pagination
        return data;
      } else {
        // Fallback to empty array if format is unexpected
        return { videos: [], pagination: { page: 1, limit: 30, pages: 1, total: 0 } };
      }
    },
  });
}

export function useVideo(id: number) {
  return useQuery({
    queryKey: [api.videos.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.videos.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch video");
      const data = await res.json();
      // Return data directly without strict validation to allow API data
      return data;
    },
  });
}

export function useVideoBySlug(slug: string | null) {
  return useQuery({
    queryKey: [api.videos.getBySlug.path, slug],
    queryFn: async () => {
      if (!slug) return null;
      const url = buildUrl(api.videos.getBySlug.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch video");
      const data = await res.json();
      return data;
    },
    enabled: !!slug, // Only fetch if slug is provided
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}
