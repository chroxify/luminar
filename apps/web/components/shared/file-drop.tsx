'use client';

/*
  This component is a modified version of Steven Tey's OGSection component from the dub project.
  Big shoutout to him for making this component open source!
  Credits: https://github.com/steven-tey/dub/blob/23cea302493a2e240fb31a75d3bf0da3979a0abc/components/app/modals/add-edit-link-modal/og-section.tsx#L4
*/
import { Dispatch, useCallback, useState } from 'react';
import Image from 'next/image';
import { cn } from '@feedbase/ui/lib/utils';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function FileDrop({
  image,
  setImage,
  allowedTypes = ['image/png', 'image/jpeg'],
  maxFileSize = 5,
  labelComponent,
  className,
}: {
  image: string | null;
  setImage: Dispatch<React.SetStateAction<string | null>> | ((image: string | null) => void);
  allowedTypes?: string[];
  maxFileSize?: number;
  labelComponent?: React.ReactNode;
  className?: string;
}) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const renderFile = useCallback(
    (file: File) => {
      if (!file) {
        return;
      }

      if (file.size / 1024 / 1024 > maxFileSize) {
        setFileError('File size too big (max 5MB)');
      } else if (!allowedTypes.includes(file.type)) {
        setFileError('File type not supported.');
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [allowedTypes, maxFileSize, setImage]
  );

  const onChangePicture = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      setFileError(null);
      const file = e.target.files[0];
      renderFile(file);
    },
    [renderFile]
  );

  return (
    <div className='flex h-fit flex-col gap-1'>
      <div className='flex items-center justify-between'>
        {labelComponent}

        {fileError ? <p className='text-destructive text-sm'>{fileError}</p> : null}
      </div>
      {/* BUG: Fix this so that its not a fixed height but rather just takes over full height properly */}
      {/* As currently it is not on the same level as the other inputs */}
      <label
        htmlFor='image'
        className={cn(
          'border-input bg-background hover:bg-accent group relative mt-1 flex h-44 cursor-pointer flex-col items-center justify-center rounded-md border shadow-sm transition-all',
          className
        )}>
        <div
          className='absolute z-[5] h-full w-full rounded-md'
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            setFileError(null);
            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
            const file = e.dataTransfer.files && e.dataTransfer.files[0];

            renderFile(file);
          }}
        />
        <div
          className={`${
            dragActive ? 'border-foreground bg-background cursor-copy border-2 opacity-100' : ''
          } bg-background absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md transition-all ${
            image ? 'opacity-0 group-hover:opacity-100' : 'group-hover:bg-accent'
          }`}>
          <CloudArrowUpIcon
            className={`${
              dragActive ? 'scale-110' : 'scale-100'
            } text-foreground/50 h-7 w-7  transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
          />
          <p className='text-foreground/50 mt-2 text-center text-sm '>Drag and drop or click to upload.</p>
          <p className='text-foreground/50 mt-2 text-center text-sm '>Recommended: 1200 x 630 pixels</p>
          <span className='sr-only'>OG image upload</span>
        </div>
        {image ? (
          <Image src={image} alt='Preview' fill className='h-full w-full rounded-md object-cover' />
        ) : null}
      </label>
      <div className='flex rounded-md shadow-sm'>
        <input
          id='image'
          name='image'
          type='file'
          accept='image/*'
          className='sr-only'
          onChange={onChangePicture}
        />
      </div>
    </div>
  );
}
