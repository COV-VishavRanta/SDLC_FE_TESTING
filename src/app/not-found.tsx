export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-12 bg-[var(--neutral-200)] p-8'>
      {/* Main content */}
      <div className='flex w-full max-w-[500px] flex-col items-center gap-1 text-center font-bold'>
        <p className='text-[151px] font-bold leading-none text-[var(--primary)]'>404</p>
        <p className='text-[58px] font-bold leading-12 text-[var(--neutral-500)]'>Not Found</p>
      </div>

      {/* Subtitle */}
      <p className='text-[14px] leading-[21px] text-[var(--gray-600)]'>
        The resource requested could not be found on this server
      </p>
    </div>
  );
}
