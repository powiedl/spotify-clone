const UsersListSkeleton = () => {
  return Array.from({ length: 5 }).map((_, i) => (
    <div
      key={i}
      className='flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg animate-pulse'
    >
      <div className='size-12 rounded-full bg-zinc-800' />
      <div className='flex-1 lg:block hidden'>
        <div className='h-4 w-24 rounded mb-2 bg-zinc-800' />
        <div className='h-3 w-32 rounded bg-zinc-800' />
      </div>
    </div>
  ));
};
export default UsersListSkeleton;
