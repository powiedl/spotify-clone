import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { axiosInstance } from '@/lib/axios';
import { useMusicStore } from '@/store/useMusicStore';
import { Plus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface NewSong {
  title: string;
  artist: string;
  albumId: string;
  duration: string;
}
const AddSongDialog = () => {
  const { albums } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState<NewSong>({
    title: '',
    artist: '',
    albumId: '',
    duration: '0',
  });
  const [files, setFiles] = useState<{
    audio: File | null;
    image: File | null;
  }>({
    audio: null,
    image: null,
  });
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!files.audio || !files.image) {
        return toast.error('Please upload both audtio and image files');
      }
      const formData = new FormData();
      formData.append('title', newSong.title);
      formData.append('artist', newSong.artist);
      formData.append('duration', newSong.duration);
      if (newSong.albumId && newSong.albumId !== 'none') {
        formData.append('albumId', newSong.albumId);
      }
      formData.append('audioFile', files.audio);
      formData.append('imageFile', files.image);
      await axiosInstance.post('/admin/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewSong({
        title: '',
        artist: '',
        albumId: '',
        duration: '0',
      });
      setFiles({
        audio: null,
        image: null,
      });
      toast.success('Song added successfully');
    } catch (error: any) {
      toast.error('Failed to add song;' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
          <Plus className='mr-2 size-4' />
          Add Song
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <input
            type='file'
            accept='audio/*'
            ref={audioInputRef}
            hidden
            onChange={(e) =>
              setFiles((p) => ({ ...p, audio: e.target.files![0] }))
            }
          />
          <input
            type='file'
            accept='image/*'
            ref={imageInputRef}
            hidden
            onChange={(e) =>
              setFiles((p) => ({ ...p, image: e.target.files![0] }))
            }
          />
          {/* image upload area */}
          <div
            className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => imageInputRef.current?.click()}
          >
            {files.image ? (
              <div className='space-y-2'>
                <div className='text-sm text-emerald-500'>Image selected</div>
                <div className='text-xs text-zinc-400'>
                  {files.image.name.slice(0, 20)}
                </div>
              </div>
            ) : (
              <>
                <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                  <Upload className='size-6 text-zinc-400' />
                </div>
                <div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
                <Button variant='outline' size='sm' className='text-xs'>
                  Choose File
                </Button>
              </>
            )}
          </div>
          {/* audio upload */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Audio File</label>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => audioInputRef.current?.click()}
                className='w-full'
              >
                {files.audio
                  ? files.audio.name.slice(0, 20)
                  : 'Choose Audio File'}
              </Button>
            </div>
          </div>
          {/* title */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Title</label>
            <Input
              value={newSong.title}
              onChange={(e) =>
                setNewSong({ ...newSong, title: e.target.value })
              }
              className='bg-zinc-800 border-zinc-700'
            />
          </div>
          {/* artist */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Artist</label>
            <Input
              value={newSong.artist}
              onChange={(e) =>
                setNewSong({ ...newSong, artist: e.target.value })
              }
              className='bg-zinc-800 border-zinc-700'
            />
          </div>
          {/* duration */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Duration (seconds)</label>
            <Input
              value={newSong.duration}
              type='number'
              onChange={(e) =>
                setNewSong({
                  ...newSong,
                  duration: e.target.value || '0',
                })
              }
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          {/* album */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Album (optional)</label>
            <Select
              value={newSong.albumId}
              onValueChange={(v) => setNewSong({ ...newSong, albumId: v })}
            >
              <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                <SelectValue placeholder='Select album' />
              </SelectTrigger>
              <SelectContent className='bg-zinc-800 border-zinc-700'>
                <SelectItem value='none'>No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={'outline'}
            onClick={() => setSongDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Uploading ...' : 'Add Song'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddSongDialog;
