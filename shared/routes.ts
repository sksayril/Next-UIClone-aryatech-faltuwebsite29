import { z } from 'zod';
import { insertVideoSchema, insertCategorySchema, videos, categories } from './schema';

// External API base URL
export const EXTERNAL_API_BASE_URL = 'https://api.xhamster01.com';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  videos: {
    list: {
      method: 'GET' as const,
      path: '/api/videos',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        sort: z.enum(['newest', 'popular', 'best']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof videos.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/videos/:id',
      responses: {
        200: z.custom<typeof videos.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getBySlug: {
      method: 'GET' as const,
      path: '/api/videos/slug/:slug',
      responses: {
        200: z.custom<typeof videos.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories',
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect>()),
      },
    },
  },
  channels: {
    list: {
      method: 'GET' as const,
      path: '/api/channels',
      responses: {
        200: z.array(z.any()),
      },
    },
  },
  actors: {
    list: {
      method: 'GET' as const,
      path: '/api/actors',
      responses: {
        200: z.array(z.any()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

/**
 * Build external API URL (for xhamster01.com API)
 * @param endpoint - API endpoint (e.g., 'movies/all', 'movies/{slug}')
 * @param params - Query parameters or path parameters
 * @returns Full external API URL
 */
export function buildExternalApiUrl(
  endpoint: string, 
  params?: Record<string, string | number>
): string {
  let url = `${EXTERNAL_API_BASE_URL}/${endpoint}`;
  
  // Replace path parameters (e.g., {slug} or :slug)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
      url = url.replace(`:${key}`, String(value));
    });
    
    // Build query string from remaining params (not used in path)
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (!url.includes(`{${key}}`) && !url.includes(`:${key}`)) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
}

export type VideoInput = z.infer<typeof insertVideoSchema>;
export type VideoResponse = z.infer<typeof api.videos.get.responses[200]>;
export type VideoListResponse = z.infer<typeof api.videos.list.responses[200]>;
