'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@feedbase/ui/components/button';
import { cn } from '@feedbase/ui/lib/utils';
import { FeedbackBoardProps } from '@/lib/types';

export default function FeedbackBoardList({
  boards,
  initialBoard,
}: {
  boards: FeedbackBoardProps['Row'][];
  initialBoard: FeedbackBoardProps['Row'] | undefined;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [currentBoard, setCurrentBoard] = useState<FeedbackBoardProps['Row'] | undefined>(initialBoard);

  useEffect(() => {
    const boardName = pathname.split('/').pop();
    const board = boards.find((board) => board.name.toLowerCase().replace(/\s+/g, '-') === boardName);
    setCurrentBoard(board);
  }, [pathname, boards]);

  return (
    <div className='-mt-1 flex h-full w-fit min-w-[250px] flex-col items-start justify-start gap-2'>
      <span className='text-sm'>Boards</span>
      <div className='flex h-full w-full flex-col gap-1.5'>
        <Link href={`/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} passHref>
          <Button
            key='all'
            variant={currentBoard ? 'ghost' : 'outline'}
            onClick={() => {
              setCurrentBoard(undefined);
            }}
            className={cn(
              'text-secondary-foreground w-full justify-start text-sm font-normal',
              !currentBoard && 'text-foreground'
            )}>
            View All Boards
          </Button>
        </Link>
        {boards.map((board) => (
          <Link
            href={`/board/${board.name.toLowerCase().replace(/\s+/g, '-')}${
              searchParams.toString() ? `?${searchParams.toString()}` : ''
            }`}
            key={board.id}
            passHref>
            <Button
              variant={currentBoard?.id === board.id ? 'outline' : 'ghost'}
              onClick={() => {
                setCurrentBoard(board);
              }}
              className={cn(
                'text-secondary-foreground w-full justify-start text-sm font-normal',
                currentBoard?.id === board.id && 'text-foreground'
              )}>
              {board.name}
            </Button>
          </Link>
        ))}
      </div>

      {/* Powered by Feedbase */}
      <div className='flex w-full flex-row items-center justify-center pt-2'>
        <Link
          className='text-muted-foreground hover:text-secondary-foreground text-xs transition-colors duration-150 hover:cursor-pointer hover:underline'
          href="https://feedbase.app"
          target='_blank'
          rel='noreferrer'>
          Powered by Feedbase
        </Link>
      </div>
    </div>
  );
}
