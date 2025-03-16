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
    <div className="flex flex-wrap gap-1 mb-2 p-2 border border-gray-300 rounded-t-md bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
      >
        Ordered List
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-2 py-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'bg-white border border-gray-300'}`}
      >
        Link
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Image URL');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="px-2 py-1 rounded bg-white border border-gray-300"
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
      }),
      Image,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editorContent) {
      editor.commands.setContent(content);
      setEditorContent(content);
    }
  }, [content, editor, editorContent]);

  return (
    <div className="border border-gray-300 rounded-md">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="p-3 min-h-[200px] prose max-w-none"
      />
    </div>
  );
};

export default TipTapEditor;
