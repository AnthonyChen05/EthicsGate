'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Quote,
    Undo,
    Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProposalEditorProps {
    content: Record<string, unknown>;
    onChange?: (content: Record<string, unknown>) => void;
    editable?: boolean;
    placeholder?: string;
}

const ToolbarButton = ({
    onClick,
    isActive,
    children
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
}) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={cn(
            'h-8 w-8 p-0',
            isActive
                ? 'bg-muted text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
    >
        {children}
    </Button>
);

export function ProposalEditor({
    content,
    onChange,
    editable = true,
    placeholder = 'Start writing your proposal...',
}: ProposalEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getJSON());
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-stone max-w-none min-h-[300px] p-4 focus:outline-none text-foreground',
            },
        },
    });

    if (!editor) {
        return (
            <div className="border border-border rounded-lg bg-background min-h-[350px] animate-pulse" />
        );
    }

    return (
        <div className="border border-border rounded-lg bg-card overflow-hidden">
            {editable && (
                <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                    >
                        <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                    >
                        <Italic className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-5 bg-border mx-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                    >
                        <Heading2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                    >
                        <List className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                    >
                        <Quote className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="flex-1" />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <Undo className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <Redo className="h-4 w-4" />
                    </ToolbarButton>
                </div>
            )}
            <EditorContent editor={editor} />
            <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--muted-foreground);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .ProseMirror p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror blockquote {
          border-left: 3px solid var(--border);
          padding-left: 1rem;
          color: var(--muted-foreground);
          font-style: italic;
          margin: 1rem 0;
        }
      `}</style>
        </div>
    );
}
