'use client';

import { useState } from 'react';
import { Button } from '@feedbase/ui/components/button';
import { Input } from '@feedbase/ui/components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@feedbase/ui/components/popover';
import { Toggle } from '@feedbase/ui/components/toggle';
import { Editor } from '@tiptap/react';
import {
  Check,
  Code2Icon,
  Image,
  LinkIcon,
  List,
  ListOrderedIcon,
  LucideBold,
  LucideItalic,
  Trash2Icon,
} from 'lucide-react';
import RichTextEditor from '@/components/shared/tiptap-editor';

export default function PostInput({
  content,
  setContent,
  commentEditor,
}: {
  commentEditor: React.MutableRefObject<Editor | null>;
  content: string;
  setContent: (content: string) => void;
}) {
  const [linkInput, setLinkInput] = useState('');
  const [activeMarks, setActiveMarks] = useState<string[]>([]);

  // Update active marks - for some reason it doesn't work without state change
  commentEditor.current?.on('transaction', () => {
    setActiveMarks(() => {
      const marks = [];

      if (commentEditor.current?.isActive('bold')) marks.push('bold');
      if (commentEditor.current?.isActive('italic')) marks.push('italic');

      return marks;
    });
  });

  return (
    <div className='flex h-full w-full max-w-full flex-col items-start justify-start gap-2'>
      {/* Editable Comment div with placeholder */}
      <RichTextEditor
        content={content}
        setContent={setContent}
        className='text-secondary-foreground min-h-full'
        parentClassName='w-full min-h-[50px] h-full'
        placeholder='Add description...'
        editorRef={commentEditor}
      />

      {/* Bottom Row */}
      <div className='z-50 flex w-fit items-center gap-2'>
        <Button size='icon' variant='ghost' className='text-muted-foreground hover:text-foreground h-6 w-6'>
          <Image className='h-4 w-4' />
        </Button>
        <Toggle
          className='h-6 w-6'
          pressed={activeMarks.includes('bold')}
          onPressedChange={() => {
            commentEditor.current?.chain().focus().toggleMark('bold').run();
          }}>
          <LucideBold className='h-4 w-4' />
        </Toggle>
        <Toggle
          pressed={activeMarks.includes('italic')}
          onPressedChange={() => {
            commentEditor.current?.chain().focus().toggleMark('italic').run();
          }}
          className='h-6 w-6'>
          <LucideItalic className='h-4 w-4' />
        </Toggle>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => {
            commentEditor.current?.commands.toggleBulletList();
          }}
          className='text-muted-foreground hover:text-foreground h-6 w-6'>
          <List className='h-4 w-4' />
        </Button>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => {
            commentEditor.current?.commands.toggleOrderedList();
          }}
          className='text-muted-foreground hover:text-foreground h-6 w-6'>
          <ListOrderedIcon className='h-4 w-4' />
        </Button>
        <Popover
          onOpenChange={(open) => {
            if (!open) {
              setLinkInput('');
            } else {
              // Pre-fill link input if there is a link
              const link = commentEditor.current?.getAttributes('link').href;

              if (link) {
                setLinkInput(link);
              }
            }
          }}>
          <PopoverTrigger asChild>
            <Button
              size='icon'
              variant='ghost'
              className='text-muted-foreground hover:text-foreground h-6 w-6'>
              <LinkIcon className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-56 p-1'>
            <form
              className='flex items-center gap-1'
              onSubmit={(e) => {
                e.preventDefault();

                // If no link input, return
                if (!linkInput) {
                  return;
                }

                commentEditor.current
                  ?.chain()
                  .focus()
                  .toggleLink({
                    href: linkInput.includes('http') ? linkInput : `https://${linkInput}`,
                  })
                  .run();
              }}>
              <Input
                placeholder='Enter URL'
                value={linkInput}
                onChange={(e) => {
                  setLinkInput(e.target.value);
                }}
                className='h-6 w-full border-transparent bg-transparent px-1 text-xs focus-visible:ring-0 focus-visible:ring-transparent'
              />
              <div className='flex items-center justify-center gap-0.5'>
                <Button
                  type='submit'
                  size='icon'
                  variant='ghost'
                  className='text-muted-foreground hover:text-foreground h-6 w-6 shrink-0'>
                  <Check className='h-4 w-4' />
                </Button>
                <Button
                  size='icon'
                  type='button'
                  variant='ghost'
                  className='text-muted-foreground hover:text-foreground h-6 w-6 shrink-0'
                  onClick={() => {
                    commentEditor.current?.chain().focus().unsetLink().run();
                  }}>
                  <Trash2Icon className='h-4 w-4' />
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>

        <Button
          size='icon'
          variant='ghost'
          onClick={() => {
            commentEditor.current?.commands.toggleCodeBlock();
          }}
          className='text-muted-foreground hover:text-foreground h-6 w-6'>
          <Code2Icon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
