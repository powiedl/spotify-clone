import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDuration } from '@/pages/album/AlbumPage';
import { usePlayerStore } from '@/store/usePlayerStore';
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } =
    usePlayerStore();
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };
    audioRef.current = document.querySelector('audio');
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };
  return (
    <footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
      <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
        {/* currently playing song */}
        <div className='current-song hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className='size-14 object-cover rounded-md'
              />
              <div className='flex-1 min-w-0'>
                <div className='font-medium truncate hover:underline cursor-pointer'>
                  {currentSong.title}
                </div>
                <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>
        {/* player controls */}
        <div className='player-controls flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
          <div className='flex items-center gap-4 sm:gap-6'>
            <Button
              size='icon'
              variant={'ghost'}
              className='hidden sm:inline-flex hover:text-white text-zinc-400'
            >
              <Shuffle className='size-4' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400'
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className='size-4' />
            </Button>
            <Button
              size='icon'
              onClick={togglePlay}
              disabled={!currentSong}
              className='bg-white hover:bg-white/80 text-black rounded-full size-8'
            >
              {isPlaying ? (
                <Pause className='size-5' />
              ) : (
                <Play className='size-5' />
              )}
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400'
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className='size-4' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400'
            >
              <Repeat className='size-4' />
            </Button>
          </div>

          <div className='hidden sm:flex items-center gap-2 w-full'>
            <div className='text-xs text-zinc-400'>
              {formatDuration(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className='w-full hover:cursor-grab active:cursor-grabbing'
              onValueChange={(value) => {
                setCurrentTime(value[0]);
                if (audioRef.current) {
                  audioRef.current.currentTime = value[0];
                }
              }}
            />
            <div className='text-xs text-zinc-400'>
              {formatDuration(duration)}
            </div>
          </div>
        </div>

        {/* volume controls */}
        <div className='volume-controls hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
          <Button
            size='icon'
            variant='ghost'
            className='hover:text-white text-zinc-400'
          >
            <Mic2 className='size-4' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='hover:text-white text-zinc-400'
          >
            <ListMusic className='size-4' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='hover:text-white text-zinc-400'
          >
            <Laptop2 className='size-4' />
          </Button>
          <div className='flex items-center gap-2'>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400'
            >
              <Volume1 className='size-4' />
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className='w-24 hover:cursor-grab active:cursor-grabbing'
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
export default PlaybackControls;
