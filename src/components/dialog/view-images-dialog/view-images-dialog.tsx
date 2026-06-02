'use client';

import {
  CloseIcon,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  NoRecordFound,
} from '@/components';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface ViewImagesDialogProps {
  open: boolean;
  onClose: () => void;
  /** Pre-translated dialog title */
  title: string;
  /** Pre-resolved image URLs */
  imageUrls: string[];
  /** Optional notes to display below the title */
  notes?: string;
}

/* ── Skeleton-wrapped image ── */
function ImageWithSkeleton({
  src,
  className,
  width,
  height,
}: {
  src: string;
  className: string;
  width: number;
  height: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='relative size-full'>
      {!loaded && (
        <div className='absolute inset-0 animate-pulse rounded-[inherit] bg-[var(--neutral-400)]' />
      )}
      <Image
        src={src}
        width={width}
        height={height}
        alt=''
        aria-hidden='true'
        className={cn(
          className,
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function ViewImagesDialog({
  open,
  onClose,
  title,
  imageUrls,
  notes,
}: ViewImagesDialogProps) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!mainApi) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(mainApi.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(mainApi.selectedScrollSnap() + 1);
    };

    mainApi.on('select', onSelect);

    return () => {
      mainApi.off('select', onSelect);
    };
  }, [mainApi]);

  const handleThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-3xl'
        aria-labelledby='view-images-title'
        aria-describedby='view-images-description'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex flex-row items-center justify-between gap-4 border-b border-[var(--neutral-300)] px-5 py-4 sm:px-8 sm:py-5'>
          <DialogTitle
            id='view-images-title'
            className='text-base font-semibold text-[var(--neutral-900)] sm:text-[18px]'
          >
            {title}
          </DialogTitle>
          <DialogDescription id='view-images-description' className='sr-only'>
            {title}
          </DialogDescription>
          <DialogClose
            render={
              <button
                type='button'
                className='flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--neutral-900)] transition-colors hover:opacity-70'
                aria-label='Close dialog'
              >
                <CloseIcon className='size-5' aria-hidden='true' />
                <span className='sr-only'>Close</span>
              </button>
            }
          />
        </DialogHeader>

        {imageUrls.length === 0 && <NoRecordFound message='No images available' />}

        {/* ── Body ── */}
        {imageUrls?.length > 0 && (
          <div className='flex flex-col gap-4 px-5 py-5 sm:px-8 sm:py-6'>
            {notes && (
              <div>
                <div className=''>Notes</div>
                <p className='text-sm text-[var(--neutral-600)]'>{notes}</p>
              </div>
            )}
            {/* Main carousel */}
            <Carousel className='w-full' setApi={setMainApi}>
              <CarouselContent>
                {imageUrls.map((url) => (
                  <CarouselItem key={url}>
                    <div className='relative aspect-video overflow-hidden rounded-lg bg-[var(--neutral-100)] border-2'>
                      <ImageWithSkeleton
                        width={500}
                        height={281}
                        src={url}
                        className='size-full object-contain'
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Thumbnail strip — only when there are multiple images */}
            {imageUrls.length > 1 && (
              <div className='relative mx-6'>
                <Carousel className='w-full'>
                  <div
                    className={cn(
                      '',
                      imageUrls.length > 4
                        ? 'px-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]'
                        : '',
                    )}
                  >
                    <CarouselContent
                      carouselRefClassName={cn(
                        imageUrls?.length > 4 ? 'overflow-hidden' : 'overflow-visible',
                      )}
                      className='my-1 flex gap-3'
                    >
                      {imageUrls.map((url, index) => (
                        <CarouselItem
                          key={url}
                          className={cn(
                            'basis-[calc(25%-10px)] pl-0 cursor-pointer transition-opacity border rounded-md p-2',
                            current === index + 1 ? 'border border-[var(--primary-500)]' : '',
                          )}
                          onClick={() => handleThumbClick(index)}
                        >
                          <div className='aspect-video overflow-hidden rounded-md bg-[var(--neutral-100)]'>
                            <ImageWithSkeleton
                              width={200}
                              height={113}
                              src={url}
                              className='size-full object-cover'
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </div>
                  {imageUrls?.length > 4 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
