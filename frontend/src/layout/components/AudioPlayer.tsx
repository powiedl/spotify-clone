import { usePlayerStore } from '@/store/usePlayerStore';
import { useEffect, useRef } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const { currentSong, isPlaying, playNext } = usePlayerStore();

  // handle play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = async () => {
      // vor dem nächsten Song 800ms Pause
      await new Promise((resolve) => setTimeout(resolve, 800));
      playNext();
    };
    audio?.addEventListener('ended', handleEnded);

    return () => audio?.removeEventListener('ended', handleEnded); // cleanup the eventhandler when the component gets unmounted
  }, [playNext]);

  // handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;

    // check if this is a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      // reset the playback position
      audio.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;
      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);
  return <audio ref={audioRef} />;
};
export default AudioPlayer;
