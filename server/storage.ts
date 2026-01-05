import {
  type Video,
  type InsertVideo,
  type Category,
  type InsertCategory,
} from "@shared/schema";

export interface IStorage {
  // Videos
  getVideos(params?: { search?: string; category?: string; limit?: number }): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Seed check
  hasVideos(): Promise<boolean>;
}

// Mock data storage
class MockStorage implements IStorage {
  private videos: Video[] = [];
  private categories: Category[] = [];
  private nextVideoId = 1;
  private nextCategoryId = 1;

  async getVideos(params?: { search?: string; category?: string; limit?: number }): Promise<Video[]> {
    let result = [...this.videos];
    
    // Simple search filtering
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(v => 
        v.title.toLowerCase().includes(searchLower) ||
        v.author.toLowerCase().includes(searchLower)
      );
    }
    
    // Limit results
    if (params?.limit) {
      result = result.slice(0, params.limit);
    }
    
    return result;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.find(v => v.id === id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const video: Video = {
      id: this.nextVideoId++,
      title: insertVideo.title,
      thumbnail: insertVideo.thumbnail,
      previewVideo: insertVideo.previewVideo ?? null,
      duration: insertVideo.duration,
      views: insertVideo.views,
      author: insertVideo.author,
      isHd: insertVideo.isHd ?? false,
      is4k: insertVideo.is4k ?? false,
      isVr: insertVideo.isVr ?? false,
      rating: insertVideo.rating ?? 100,
      createdAt: new Date(),
    };
    this.videos.push(video);
    return video;
  }

  async getCategories(): Promise<Category[]> {
    return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      id: this.nextCategoryId++,
      name: insertCategory.name,
      count: insertCategory.count ?? null,
    };
    this.categories.push(category);
    return category;
  }
  
  async hasVideos(): Promise<boolean> {
    return this.videos.length > 0;
  }
}

export const storage = new MockStorage();
