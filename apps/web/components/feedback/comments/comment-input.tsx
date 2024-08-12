'use client';

import { useRef, useState } from 'react';
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
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import { actionFetcher } from '@/lib/utils';
import { Icons } from '@/components/shared/icons/icons-static';
import RichTextEditor from '@/components/shared/tiptap-editor';

export default function CommentInput({
  workspaceSlug,
  feedbackId,
  parentCommentId,
  onPostComment,
}: {
  workspaceSlug: string;
  feedbackId: string;
  parentCommentId?: string;
  onPostComment?: () => void;
}) {
  const commentEditor = useRef<Editor | null>(null);
  const [commentContent, setCommentContent] = useState('');
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

  const { trigger: postComment, isMutating: isPostingComment } = useSWRMutation(
    `/api/v1/workspaces/${workspaceSlug}/feedback/${feedbackId}/comments`,
    actionFetcher,
    {
      onSuccess: () => {
        commentEditor.current?.commands.clearContent();
        setCommentContent('');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return (
    <div className='flex h-fit w-full flex-col items-center justify-end rounded-md border p-3'>
      {/* Editable Comment div with placeholder */}
      <RichTextEditor
        content={commentContent}
        setContent={setCommentContent}
        className='h-full min-h-[50px] w-full min-w-full'
        parentClassName='w-full min-h-[50px] h-full'
        placeholder='Write your comment here...'
        editorRef={commentEditor}
      />

      {/* Bottom Row */}
      <div className='z-30 flex w-full flex-row items-center justify-between pt-1'>
        <div className='flex items-center gap-2'>
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

        {/* Submit Button */}
        <Button
          variant='default'
          size='sm'
          disabled={
            // disabled if content is 0 or its only html tags
            commentContent.replace(/<[^>]*>?/gm, '').length === 0 || isPostingComment
          }
          onClick={async () => {
            await postComment({ content: commentContent, reply_to_id: parentCommentId });
            if (onPostComment) onPostComment();
          }}>
          {isPostingComment ? <Icons.Spinner className='mr-2 h-3.5 w-3.5 animate-spin' /> : null}
          Post {parentCommentId ? 'reply' : 'comment'}
        </Button>
      </div>
    </div>
  );
}
