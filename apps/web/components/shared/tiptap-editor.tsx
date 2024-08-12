'use client';

import './placeholder.css';
import React, { useRef } from 'react';
import { cn } from '@feedbase/ui/lib/utils';
import { BulletList } from '@tiptap/extension-bullet-list';
import { CharacterCount } from '@tiptap/extension-character-count';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Typography } from '@tiptap/extension-typography';
import { AnyExtension, Editor, EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

export default function RichTextEditor({
  content,
  setContent,
  placeholder,
  className,
  parentClassName,
  characterLimit,
  editorRef,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>> | ((content: string) => void);
  placeholder?: string;
  className?: string;
  parentClassName?: string;
  characterLimit?: number;
  editorRef?: React.MutableRefObject<Editor | null>;
}) {
  const localEditorRef = useRef<Editor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        codeBlock: false,
      }) as AnyExtension,
      Highlight,
      Typography,
      BulletList,
      OrderedList,
      CodeBlock,
      Link.configure({
        HTMLAttributes: {
          class: 'cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
      CharacterCount.configure({
        limit: characterLimit || undefined,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(`prose prose-sm dark:prose-invert focus:outline-none`, className),
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Set the editor instance to the ref
  if (editorRef) {
    editorRef.current = editor;
  } else {
    localEditorRef.current = editor;
  }

  return (
    <EditorContent
      editor={editor}
      className={cn('h-full w-full p-0 text-sm outline-none', parentClassName)}
    />
  );
}
