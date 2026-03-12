"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogPostSchema, BlogPostFormData } from "@/lib/validation";
import { useCreateBlogPost, useUpdateBlogPost } from "@/hooks/use-blog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Loader2,
    X,
    Plus,
    ChevronRight,
    ImageIcon,
    Settings2,
    FileText,
    Tag,
} from "lucide-react";
import type { BlogPost } from "@/types";
import { TiptapEditor } from "./tiptap-editor";

const accent = "#00ff88";
const dim = "#555577";
// const subtle = "rgba(80,80,120,0.35)";

/* ─── section header ─── */
function SectionHeader({
    icon: Icon,
    label,
}: {
    icon: React.ElementType;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <Icon className="h-3.5 w-3.5 text-[#00ff88]" />
            <span
                className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase"
                style={{ color: accent }}
            >
                {label}
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-[#00ff8830] to-transparent" />
        </div>
    );
}

/* ─── tag badge ─── */
function TagBadge({ tag, onRemove }: { tag: string; onRemove: () => void }) {
    return (
        <span
            className="group flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-sm border transition-all duration-150"
            style={{
                background: "rgba(0,255,136,0.06)",
                borderColor: "rgba(0,255,136,0.25)",
                color: accent,
            }}
        >
            <span className="opacity-50 select-none">#</span>
            {tag}
            <button
                type="button"
                onClick={onRemove}
                className="ml-0.5 opacity-40 group-hover:opacity-100 transition-opacity"
            >
                <X className="h-2.5 w-2.5" />
            </button>
        </span>
    );
}

/* ─── field wrapper ─── */
function Field({
    label,
    error,
    children,
    hint,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label
                    className="text-[11px] font-mono tracking-widest uppercase"
                    style={{ color: "#8888aa" }}
                >
                    {label}
                </label>
                {hint && (
                    <span
                        className="text-[10px] font-mono"
                        style={{ color: dim }}
                    >
                        {hint}
                    </span>
                )}
            </div>
            {children}
            {error && (
                <p
                    className="text-[11px] font-mono"
                    style={{ color: "#ff4466" }}
                >
                    ✗ {error}
                </p>
            )}
        </div>
    );
}

const inputClass = `
    w-full bg-transparent border rounded-sm px-3 py-2 text-sm font-mono
    placeholder:text-[#444466] outline-none transition-all duration-200
    focus:ring-0
    [border-color:rgba(80,80,120,0.6)]
    [color:#e0e0ff]
    focus:[border-color:rgba(0,255,136,0.5)]
    focus:[box-shadow:0_0_0_1px_rgba(0,255,136,0.15),_0_0_12px_rgba(0,255,136,0.08)]
`;

interface BlogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: BlogPost | null;
}

export function BlogDialog({ open, onOpenChange, post }: BlogDialogProps) {
    const isEditing = !!post;
    const createMutation = useCreateBlogPost();
    const updateMutation = useUpdateBlogPost();
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const [tagInput, setTagInput] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BlogPostFormData>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            coverImage: "",
            tags: [],
            published: false,
        },
    });

    const tags = watch("tags");
    const title = watch("title");
    const content = watch("content");

    // Populate form when editing
    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt || "",
                coverImage: post.coverImage || "",
                tags: post.tags,
                published: post.published,
            });
        } else {
            reset({
                title: "",
                slug: "",
                content: "",
                excerpt: "",
                coverImage: "",
                tags: [],
                published: false,
            });
        }
    }, [post, reset]);

    // Auto-slug from title (create mode only)
    useEffect(() => {
        if (!isEditing && title) {
            setValue(
                "slug",
                title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, ""),
            );
        }
    }, [title, isEditing, setValue]);

    // Tag helpers
    const addTag = () => {
        const trimmed = tagInput.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
            setValue("tags", [...tags, trimmed]);
            setTagInput("");
        }
    };
    const removeTag = (tag: string) =>
        setValue(
            "tags",
            tags.filter((t) => t !== tag),
        );
    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const onSubmit = async (data: BlogPostFormData) => {
        try {
            if (isEditing && post) {
                await updateMutation.mutateAsync({
                    slug: post.slug,
                    formData: data,
                });
            } else {
                await createMutation.mutateAsync(data);
            }
            onOpenChange(false);
        } catch {}
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-3xl p-0 overflow-hidden border-0 shadow-2xl"
                style={{
                    background: "#0c0c14",
                    boxShadow:
                        "0 0 0 1px rgba(0,255,136,0.15), 0 0 60px rgba(0,0,0,0.8), 0 0 80px rgba(0,255,136,0.04)",
                }}
            >
                {/* scanline */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                    }}
                />

                {/* corner accents */}
                {[
                    "top-0 left-0 border-t border-l",
                    "top-0 right-0 border-t border-r",
                    "bottom-0 left-0 border-b border-l",
                    "bottom-0 right-0 border-b border-r",
                ].map((pos, i) => (
                    <div
                        key={i}
                        className={`pointer-events-none absolute w-4 h-4 z-10 ${pos}`}
                        style={{ borderColor: accent, opacity: 0.6 }}
                    />
                ))}

                {/* HEADER */}
                <div
                    className="relative z-10 px-6 pt-5 pb-4 border-b"
                    style={{ borderColor: "rgba(80,80,120,0.4)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm border"
                            style={{
                                color: isEditing ? "#ffaa00" : accent,
                                borderColor: isEditing
                                    ? "rgba(255,170,0,0.3)"
                                    : "rgba(0,255,136,0.3)",
                                background: isEditing
                                    ? "rgba(255,170,0,0.07)"
                                    : "rgba(0,255,136,0.07)",
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{
                                    background: isEditing ? "#ffaa00" : accent,
                                }}
                            />
                            {isEditing ? "EDIT MODE" : "NEW POST"}
                        </span>
                        <span
                            className="text-[10px] font-mono"
                            style={{ color: "#333355" }}
                        >
                            {isEditing
                                ? `// modifying: ${post?.slug}`
                                : "// blog.posts.create()"}
                        </span>
                    </div>

                    <DialogHeader className="space-y-0.5">
                        <DialogTitle
                            className="text-base font-mono font-bold tracking-tight"
                            style={{ color: "#e0e0ff" }}
                        >
                            {isEditing ? "_edit_post" : "_new_post"}
                        </DialogTitle>
                        <DialogDescription
                            className="text-[12px] font-mono"
                            style={{ color: dim }}
                        >
                            {isEditing
                                ? "Update blog post content and metadata."
                                : "Compose a new blog post with rich text."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* BODY */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="relative z-10 px-6 py-5 space-y-7 max-h-[65vh] overflow-y-auto"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(0,255,136,0.2) transparent",
                    }}
                >
                    {/* BASIC INFO */}
                    <div>
                        <SectionHeader icon={ChevronRight} label="Basic Info" />
                        <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                    label="Title"
                                    error={errors.title?.message}
                                >
                                    <input
                                        className={inputClass}
                                        placeholder="My Blog Post Title"
                                        {...register("title")}
                                    />
                                </Field>
                                <Field
                                    label="Slug"
                                    hint="auto-generated"
                                    error={errors.slug?.message}
                                >
                                    <input
                                        className={inputClass}
                                        placeholder="my-blog-post-title"
                                        {...register("slug")}
                                    />
                                </Field>
                            </div>

                            <Field label="Excerpt" hint="optional">
                                <input
                                    className={inputClass}
                                    placeholder="// Brief summary for previews..."
                                    {...register("excerpt")}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div>
                        <SectionHeader icon={FileText} label="Content" />
                        <Field label="Body" error={errors.content?.message}>
                            <TiptapEditor
                                content={content || ""}
                                onChange={(html) =>
                                    setValue("content", html, {
                                        shouldValidate: true,
                                    })
                                }
                            />
                        </Field>
                    </div>

                    {/* TAGS */}
                    <div>
                        <SectionHeader icon={Tag} label="Tags" />
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    className={inputClass}
                                    placeholder="javascript, react, nextjs — press Enter"
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    onKeyDown={handleTagKeyDown}
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono font-bold tracking-widest uppercase rounded-sm border transition-all duration-150 hover:bg-[rgba(0,255,136,0.1)] active:scale-95"
                                    style={{
                                        borderColor: "rgba(0,255,136,0.35)",
                                        color: accent,
                                    }}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add
                                </button>
                            </div>

                            {tags.length > 0 && (
                                <div
                                    className="flex flex-wrap gap-2 p-3 rounded-sm border"
                                    style={{
                                        borderColor: "rgba(80,80,120,0.3)",
                                        background: "rgba(255,255,255,0.02)",
                                    }}
                                >
                                    {tags.map((tag) => (
                                        <TagBadge
                                            key={tag}
                                            tag={tag}
                                            onRemove={() => removeTag(tag)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MEDIA & SETTINGS */}
                    <div>
                        <SectionHeader icon={Settings2} label="Settings" />
                        <div className="space-y-4">
                            <Field label="Cover Image" hint="optional">
                                <div className="relative">
                                    <ImageIcon
                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                                        style={{ color: dim }}
                                    />
                                    <input
                                        className={`${inputClass} pl-9`}
                                        placeholder="https://..."
                                        {...register("coverImage")}
                                    />
                                </div>
                            </Field>

                            <div
                                className="flex items-center justify-between px-4 py-3 rounded-sm border"
                                style={{
                                    borderColor: "rgba(80,80,120,0.3)",
                                    background: "rgba(255,255,255,0.02)",
                                }}
                            >
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            {...register("published")}
                                        />
                                        <div
                                            className="w-3.5 h-3.5 rounded-sm border transition-all peer-checked:bg-[#00ff88] peer-checked:border-[#00ff88]"
                                            style={{
                                                borderColor:
                                                    "rgba(80,80,120,0.6)",
                                            }}
                                        />
                                    </div>
                                    <span
                                        className="text-[11px] font-mono tracking-widest uppercase"
                                        style={{ color: "#8888aa" }}
                                    >
                                        Published
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>

                {/* FOOTER */}
                <div
                    className="relative z-10 border-t px-6 py-4 flex items-center justify-between"
                    style={{
                        borderColor: "rgba(80,80,120,0.4)",
                        background: "rgba(0,0,0,0.3)",
                    }}
                >
                    <span
                        className="text-[10px] font-mono"
                        style={{ color: "#333355" }}
                    >
                        {isEditing
                            ? `// updating ${post?.slug}`
                            : "// ready to publish"}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 text-[11px] font-mono tracking-widest uppercase rounded-sm border transition-all duration-150 hover:bg-white/5 active:scale-95"
                            style={{
                                borderColor: "rgba(80,80,120,0.5)",
                                color: "#8888aa",
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                            className="relative flex items-center gap-2 px-5 py-2 text-[11px] font-mono font-bold tracking-widest uppercase rounded-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,200,255,0.1))",
                                border: "1px solid rgba(0,255,136,0.4)",
                                color: accent,
                                boxShadow: "0 0 20px rgba(0,255,136,0.08)",
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Saving...
                                </>
                            ) : isEditing ? (
                                "Update Post"
                            ) : (
                                "Publish Post"
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
