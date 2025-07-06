import { create } from 'zustand';
import type { Song } from '@/types';
export enum PlayerMode {
  NORMAL = 'NORMAL',
  RANDOM = 'RANDOM',
  ENDLESS = 'ENDLESS',
}

interface PlayerStore {
  currentSong: Song | null;
  mode: PlayerMode;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlayerMode: (m: PlayerMode) => void;
  getPlayerMode: () => PlayerMode;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  mode: PlayerMode.NORMAL,
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  queue: [],
  initializeQueue: (songs) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  playAlbum: (songs, startIndex = 0) => {
    if (songs.length === 0) return;
    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },
  setCurrentSong: (song) => {
    if (!song) return;
    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      currentSong: song,
      isPlaying: true,
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    set({ isPlaying: willStartPlaying });
  },
  playNext: () => {
    const { queue, currentIndex } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      if (get().mode === PlayerMode.ENDLESS) {
        const nextSong = queue[0];
        set({
          currentSong: nextSong,
          currentIndex: 0,
          isPlaying: true,
        });
      } else set({ isPlaying: false });
    }
  },
  playPrevious: () => {
    const { queue, currentIndex } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else set({ isPlaying: false });
  },
  setPlayerMode: (m) => {
    set({ mode: m });
  },
  getPlayerMode: () => get().mode,
}));
