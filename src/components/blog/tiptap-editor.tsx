"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Heading1,
    Heading2,
    Heading3,
    Minus,
} from "lucide-react";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
}

function ToolbarBtn({
    onClick,
    active,
    children,
    title,
}: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className="p-1.5 rounded-sm border transition-all duration-100 active:scale-95"
            style={{
                borderColor: active ? "rgba(0,255,136,0.4)" : "transparent",
                background: active ? "rgba(0,255,136,0.1)" : "transparent",
                color: active ? accent : dim,
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "#aaaacc";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    (e.currentTarget as HTMLElement).style.color = dim;
                }
            }}
        >
            {children}
        </button>
    );
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
            Placeholder.configure({
                placeholder: "// Start writing your blog post...",
            }),
        ],
        content,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-sm max-w-none min-h-[200px] px-4 py-3 font-mono text-sm outline-none focus:outline-none",
                style: "color: #c0c0e0;",
            },
        },
    });

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const iconSize = "h-3.5 w-3.5";

    return (
        <div
            className="rounded-sm border overflow-hidden"
            style={{ borderColor: subtle, background: "#0a0a14" }}
        >
            {/* toolbar */}
            <div
                className="flex items-center gap-0.5 px-2 py-1.5 border-b flex-wrap"
                style={{
                    borderColor: subtle,
                    background: "rgba(255,255,255,0.02)",
                }}
            >
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    active={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    active={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    active={editor.isActive("heading", { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className={iconSize} />
                </ToolbarBtn>

                <div className="w-px h-4 mx-1" style={{ background: subtle }} />

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive("strike")}
                    title="Strikethrough"
                >
                    <Strikethrough className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive("code")}
                    title="Inline Code"
                >
                    <Code className={iconSize} />
                </ToolbarBtn>

                <div className="w-px h-4 mx-1" style={{ background: subtle }} />

                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    active={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    active={editor.isActive("orderedList")}
                    title="Numbered List"
                >
                    <ListOrdered className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    active={editor.isActive("blockquote")}
                    title="Blockquote"
                >
                    <Quote className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    title="Horizontal Rule"
                >
                    <Minus className={iconSize} />
                </ToolbarBtn>

                <div className="w-px h-4 mx-1" style={{ background: subtle }} />

                <ToolbarBtn
                    onClick={addLink}
                    active={editor.isActive("link")}
                    title="Add Link"
                >
                    <LinkIcon className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn onClick={addImage} title="Add Image">
                    <ImageIcon className={iconSize} />
                </ToolbarBtn>

                <div className="flex-1" />

                <ToolbarBtn
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >
                    <Undo className={iconSize} />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >
                    <Redo className={iconSize} />
                </ToolbarBtn>
            </div>

            {/* editor area */}
            <EditorContent editor={editor} />

            {/* footer */}
            <div
                className="flex items-center justify-between px-3 py-1.5 border-t text-[10px] font-mono"
                style={{
                    borderColor: subtle,
                    color: "rgba(80,80,120,0.5)",
                    background: "rgba(255,255,255,0.01)",
                }}
            >
                <span>markdown supported</span>
                <span>
                    {editor.storage.characterCount?.characters?.() ?? "—"} chars
                </span>
            </div>
        </div>
    );
}
