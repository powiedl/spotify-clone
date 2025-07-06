import { axiosInstance } from '@/lib/axios';
import type { Album, Song } from '@/types';
import { create } from 'zustand';

enum SpecialSongs {
  FEATURED = 'featured',
  MADE_FOR_YOU = 'made-for-you',
  TRENDING = 'trending',
}
interface MusicStore {
  songs: Song[];
  albums: Album[];
  currentAlbum: Album | null;
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  featuredSongs: Song[];
  isLoading: boolean;
  error: string | null;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;

  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => {
  const fetchSpecialSongs = async (kind: SpecialSongs) => {
    let url: string;
    switch (kind) {
      case SpecialSongs.FEATURED:
        url = 'featured';
        break;
      case SpecialSongs.MADE_FOR_YOU:
        url = 'made-for-you';
        break;
      case SpecialSongs.TRENDING:
        url = 'trending';
        break;
    }
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/songs/${url}`);
      switch (kind) {
        case SpecialSongs.FEATURED:
          set({ featuredSongs: res.data });
          break;
        case SpecialSongs.MADE_FOR_YOU:
          set({ madeForYouSongs: res.data });
          break;
        case SpecialSongs.TRENDING:
          set({ trendingSongs: res.data });
          break;
      }
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  };

  const store = {
    albums: [],
    currentAlbum: null,
    songs: [],
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    isLoading: false,
    error: null,
    fetchAlbums: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await axiosInstance.get('/albums');
        set({ albums: res.data });
      } catch (error: any) {
        set({ error: error.response.data.message });
      } finally {
        set({ isLoading: false });
      }
    },
    fetchAlbumById: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const res = await axiosInstance.get(`/albums/${id}`);
        set({ currentAlbum: res.data });
      } catch (error: any) {
        set({ error: error.response.data.message });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchFeaturedSongs: async () => {
      await fetchSpecialSongs(SpecialSongs.FEATURED);
    },

    fetchMadeForYouSongs: async () => {
      await fetchSpecialSongs(SpecialSongs.MADE_FOR_YOU);
    },

    fetchTrendingSongs: async () => {
      await fetchSpecialSongs(SpecialSongs.TRENDING);
    },
  };
  return store;
});
