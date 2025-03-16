import { useEditor, EditorContent } from '@tiptap/react';
import { default as StarterKit } from '@tiptap/starter-kit';
import { default as Link } from '@tiptap/extension-link';
import { default as Image } from '@tiptap/extension-image';
import { useState, useEffect } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

interface MenuBarProps {
  editor: ReturnType<typeof useEditor> | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b bg-muted/50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
          editor.isActive('bold') 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-background border border-input hover:bg-accent hover:text-accent-foreground'
        }`}
        title="Bold"
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
          editor.isActive('italic') 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-background border border-input hover:bg-accent hover:text-accent-foreground'
        }`}
        title="Italic"
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
          editor.isActive('heading', { level: 2 }) 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-background border border-input hover:bg-accent hover:text-accent-foreground'
        }`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
          editor.isActive('heading', { level: 3 }) 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-background border border-input hover:bg-accent hover:text-accent-foreground'
        }`}
        title="Heading 3"
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
          editor.isActive('bulletList') 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-background border border-input hover:bg-accent hover:text-accent-foreground'
        }`}
        title="Bullet List"
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
          editor.isActive('orderedList') 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-background border border-input hover:bg-accent hover:text-accent-foreground'
        }`}
        title="Ordered List"
      >
        Ordered List
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter the URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
          editor.isActive('link') 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-background border border-input hover:bg-accent hover:text-accent-foreground'
        }`}
        title="Add Link"
      >
        Link
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter the image URL:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors bg-background border border-input hover:bg-accent hover:text-accent-foreground"
        title="Add Image"
      >
        Image
      </button>
    </div>
  );
};

const TipTapEditor = ({ content, onChange }: TipTapEditorProps) => {
  const [editorContent, setEditorContent] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md',
        },
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editorContent) {
      editor.commands.setContent(content);
      setEditorContent(content);
    }
  }, [content, editor, editorContent]);

  return (
    <div className="rounded-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[250px] focus:outline-none"
      />
    </div>
  );
};

export default TipTapEditor;
