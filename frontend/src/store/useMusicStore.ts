import { axiosInstance } from '@/lib/axios';
import type { Album, Song, Stats } from '@/types';
import toast from 'react-hot-toast';
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
  stats: Stats;
  isLoading: boolean;
  error: string | null;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;

  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;

  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
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

  const store: MusicStore = {
    albums: [],
    currentAlbum: null,
    songs: [],
    stats: {
      totalSongs: 0,
      totalAlbums: 0,
      totalArtists: 0,
      totalUsers: 0,
    },
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
    fetchSongs: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await axiosInstance.get('/songs');
        set({ songs: res.data });
      } catch (error: any) {
        set({ error: error.response.data.message });
      } finally {
        set({ isLoading: false });
      }
    },
    fetchStats: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await axiosInstance.get('/stats');
        //set({ : res.data });
        set({ stats: res.data });
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
    deleteSong: async (id) => {
      set({ isLoading: true });
      try {
        await axiosInstance.delete(`/admin/songs/${id}`);
        set((state) => ({
          songs: state.songs.filter((song) => song._id !== id),
        }));
        toast.success('Song deleted successfully');
      } catch (error: any) {
        set({ error: error.response.data.message });
        toast.error('Error deleting song');
      } finally {
        set({ isLoading: false });
      }
    },
    deleteAlbum: async (id) => {
      set({ isLoading: true });
      try {
        await axiosInstance.delete(`/admin/albums/${id}`);
        set((state) => ({
          albums: state.albums.filter((album) => album._id !== id),
          songs: state.songs.map((song) =>
            song.albumId === state.albums.find((a) => a._id === id)?._id
              ? { ...song, album: null }
              : song
          ),
        }));
        toast.success('Album deleted successfully');
      } catch (error: any) {
        set({ error: error.response.data.message });
        toast.error('Error deleting album');
      } finally {
        set({ isLoading: false });
      }
    },
  };
  return store;
});
