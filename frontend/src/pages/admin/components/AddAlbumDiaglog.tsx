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
import { axiosInstance } from '@/lib/axios';
import { Plus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface NewAlbum {
  title: string;
  artist: string;
  releaseYear: number;
}
const AddAlbumDiaglog = () => {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newAlbum, setNewAlbum] = useState<NewAlbum>({
    title: '',
    artist: '',
    releaseYear: new Date().getFullYear(),
  });
  const [files, setFiles] = useState<{
    image: File | null;
  }>({
    image: null,
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files.image) {
        return toast.error('Please upload an image');
      }

      const formData = new FormData();
      formData.append('title', newAlbum.title);
      formData.append('artist', newAlbum.artist);
      formData.append('releaseYear', newAlbum.releaseYear.toString());
      formData.append('imageFile', files.image);

      await axiosInstance.post('/admin/albums', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewAlbum({
        title: '',
        artist: '',
        releaseYear: new Date().getFullYear(),
      });
      setFiles({ image: null });
      setAlbumDialogOpen(false);
      toast.success('Album created successfully');
      return;
    } catch (error: any) {
      toast.error('Error uploading album:' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
          <Plus className='mr-2 size-4' />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Add a new album to your music library
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
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
          {/* title */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Title</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              className='bg-zinc-800 border-zinc-700'
            />
          </div>
          {/* artist */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Artist</label>
            <Input
              value={newAlbum.artist}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, artist: e.target.value })
              }
              className='bg-zinc-800 border-zinc-700'
            />
          </div>
          {/* release year */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Release Year</label>
            <Input
              value={newAlbum.releaseYear}
              type='number'
              onChange={(e) => {
                console.log('releaseYear', e.target.value);
                setNewAlbum({
                  ...newAlbum,
                  releaseYear:
                    parseInt(e.target.value) || new Date().getFullYear(),
                });
              }}
              min={1900}
              max={new Date().getFullYear()}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={'outline'}
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Uploading ...' : 'Add Album'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddAlbumDiaglog;
