import { useAuthStore } from '@/store/useAuthStore';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { TabsContent, TabsTrigger } from '@radix-ui/react-tabs';
import { Album, Music } from 'lucide-react';
import SongsTabContent from './components/SongsTabContent';
import AlbumsTabContent from './components/AlbumsTabContent';
import { useEffect } from 'react';
import { useMusicStore } from '@/store/useMusicStore';

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchAlbums(), fetchSongs(), fetchStats()]);
    };
    fetchAll();
  }, [fetchAlbums, fetchSongs, fetchStats]);
  if (!isAdmin && !isLoading) return <div>Unauthorized</div>;
  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8'>
      <Header />
      <DashboardStats />

      <Tabs defaultValue='songs' className='space-y-6'>
        <TabsList className='p-1 bg-zinc-800/50 *:flex *:flex-row *:items-center *:px-2 *:rounded-sm'>
          <TabsTrigger
            value='songs'
            className='data-[state=active]:bg-zinc-700'
          >
            <Music className='mr-2 size-4' />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value='albums'
            className='data-[state=active]:bg-zinc-700'
          >
            <Album className='mr-2 size-4' />
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value='songs'>
          <SongsTabContent />
        </TabsContent>
        <TabsContent value='albums'>
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminPage;
