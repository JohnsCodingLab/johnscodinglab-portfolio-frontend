"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    FileText,
    Terminal,
    Calendar,
} from "lucide-react";
import { useBlogPosts } from "@/hooks/use-blog";
import type { BlogPost } from "@/types";
import { BlogDialog } from "@/components/blog/blog-dialog";
import { DeleteBlogDialog } from "@/components/blog/delete-blog-dialog";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";

/* ─── skeleton ─── */
function SkeletonCard() {
    return (
        <div
            className="rounded-sm border overflow-hidden animate-pulse"
            style={{ background: "#0e0e1a", borderColor: subtle }}
        >
            <div
                className="h-24"
                style={{ background: "rgba(255,255,255,0.03)" }}
            />
            <div className="p-4 space-y-3">
                <div
                    className="h-3 w-2/3 rounded-sm"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <div
                    className="h-2.5 w-full rounded-sm"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                />
                <div className="flex gap-1.5">
                    {[35, 45, 40].map((w, i) => (
                        <div
                            key={i}
                            className="h-5 rounded-sm"
                            style={{
                                width: w,
                                background: "rgba(255,255,255,0.04)",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── post card ─── */
function PostCard({
    post,
    index,
    onEdit,
    onDelete,
}: {
    post: BlogPost;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative group rounded-sm border overflow-hidden"
            style={{
                background: "#0e0e1a",
                borderColor: hovered ? "rgba(0,255,136,0.25)" : subtle,
                boxShadow: hovered ? "0 0 30px rgba(0,255,136,0.05)" : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
            }}
        >
            {/* scanline */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
                }}
            />

            {/* corner accents on hover */}
            {hovered && (
                <>
                    {[
                        "top-0 left-0 border-t border-l",
                        "top-0 right-0 border-t border-r",
                        "bottom-0 left-0 border-b border-l",
                        "bottom-0 right-0 border-b border-r",
                    ].map((pos, i) => (
                        <div
                            key={i}
                            className={`pointer-events-none absolute w-3 h-3 z-10 ${pos}`}
                            style={{ borderColor: "rgba(0,255,136,0.5)" }}
                        />
                    ))}
                </>
            )}

            {/* header area */}
            <div
                className="relative h-20 flex items-center justify-center border-b overflow-hidden"
                style={{
                    borderColor: subtle,
                    background:
                        "linear-gradient(135deg, rgba(170,136,255,0.04) 0%, rgba(0,200,255,0.03) 50%, transparent 100%)",
                }}
            >
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(170,136,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(170,136,255,0.4) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                />
                <FileText
                    className="relative z-10 h-6 w-6"
                    style={{ color: "rgba(170,136,255,0.25)" }}
                />

                {/* index */}
                <span
                    className="absolute top-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded-sm"
                    style={{
                        color: dim,
                        background: "rgba(0,0,0,0.4)",
                        border: `1px solid ${subtle}`,
                    }}
                >
                    #{String(index + 1).padStart(2, "0")}
                </span>

                {/* status */}
                <span
                    className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-sm border"
                    style={
                        post.published
                            ? {
                                  color: accent,
                                  borderColor: "rgba(0,255,136,0.3)",
                                  background: "rgba(0,255,136,0.07)",
                              }
                            : {
                                  color: dim,
                                  borderColor: subtle,
                                  background: "rgba(0,0,0,0.3)",
                              }
                    }
                >
                    {post.published ? (
                        <Eye className="h-2 w-2" />
                    ) : (
                        <EyeOff className="h-2 w-2" />
                    )}
                    {post.published ? "LIVE" : "DRAFT"}
                </span>
            </div>

            {/* body */}
            <div className="relative z-10 p-4">
                <h3
                    className="text-sm font-mono font-bold truncate mb-1"
                    style={{ color: "#e0e0ff" }}
                >
                    {post.title}
                </h3>
                <p
                    className="text-[11px] font-mono mt-0.5 mb-3"
                    style={{ color: dim }}
                >
                    <span style={{ color: "rgba(170,136,255,0.4)" }}>~/</span>
                    {post.slug}
                </p>

                {post.excerpt && (
                    <p
                        className="text-[11px] font-mono line-clamp-2 mb-3 leading-relaxed"
                        style={{ color: "#555577" }}
                    >
                        {post.excerpt}
                    </p>
                )}

                {/* tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 text-[10px] font-mono rounded-sm border"
                                style={{
                                    color: "rgba(170,136,255,0.7)",
                                    borderColor: "rgba(170,136,255,0.18)",
                                    background: "rgba(170,136,255,0.05)",
                                }}
                            >
                                #{tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span
                                className="px-2 py-0.5 text-[10px] font-mono rounded-sm border"
                                style={{ color: dim, borderColor: subtle }}
                            >
                                +{post.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* footer */}
                <div
                    className="flex items-center justify-between pt-3 border-t"
                    style={{ borderColor: subtle }}
                >
                    <div
                        className="flex items-center gap-1.5 text-[10px] font-mono"
                        style={{ color: dim }}
                    >
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                    </div>

                    <div
                        className="flex gap-1 transition-all duration-200"
                        style={{ opacity: hovered ? 1 : 0 }}
                    >
                        <button
                            onClick={onEdit}
                            className="p-1.5 rounded-sm border transition-all duration-150 hover:bg-[rgba(0,255,136,0.08)] active:scale-95"
                            style={{ borderColor: subtle }}
                        >
                            <Pencil
                                className="h-3 w-3"
                                style={{ color: accent }}
                            />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1.5 rounded-sm border transition-all duration-150 hover:bg-[rgba(255,50,80,0.08)] active:scale-95"
                            style={{ borderColor: subtle }}
                        >
                            <Trash2
                                className="h-3 w-3"
                                style={{ color: "#ff3250" }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── page ─── */
export default function BlogPage() {
    const { data: posts, isLoading, error } = useBlogPosts();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setDialogOpen(true);
    };
    const handleAdd = () => {
        setEditingPost(null);
        setDialogOpen(true);
    };

    const total = posts?.length ?? 0;
    const live = posts?.filter((p) => p.published).length ?? 0;

    return (
        <div
            className="space-y-8 min-h-screen p-6"
            style={{ background: "#080810" }}
        >
            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div
                        className="flex items-center gap-1.5 text-[10px] font-mono mb-2"
                        style={{ color: dim }}
                    >
                        <Terminal
                            className="h-3 w-3"
                            style={{ color: "rgba(0,255,136,0.5)" }}
                        />
                        <span>portfolio</span>
                        <span style={{ color: "rgba(0,255,136,0.3)" }}>/</span>
                        <span style={{ color: accent }}>blog</span>
                    </div>
                    <h1
                        className="text-xl font-mono font-bold tracking-tight"
                        style={{ color: "#e0e0ff" }}
                    >
                        _blog_posts
                    </h1>
                    <p className="text-[12px] font-mono" style={{ color: dim }}>
                        manage your blog content
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold tracking-widest uppercase rounded-sm border transition-all duration-150 hover:bg-[rgba(0,255,136,0.1)] active:scale-95"
                    style={{
                        border: "1px solid rgba(0,255,136,0.35)",
                        color: accent,
                        background: "rgba(0,255,136,0.05)",
                        boxShadow: "0 0 20px rgba(0,255,136,0.06)",
                    }}
                >
                    <Plus className="h-3.5 w-3.5" />
                    New Post
                </button>
            </div>

            {/* STAT BAR */}
            {!isLoading && !error && total > 0 && (
                <div
                    className="flex items-center gap-6 px-4 py-2.5 rounded-sm border text-[11px] font-mono"
                    style={{
                        borderColor: subtle,
                        background: "rgba(255,255,255,0.02)",
                    }}
                >
                    {[
                        { label: "TOTAL", value: total, color: "#e0e0ff" },
                        { label: "PUBLISHED", value: live, color: accent },
                        { label: "DRAFT", value: total - live, color: dim },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center gap-2">
                            <span style={{ color: dim }}>{label}</span>
                            <span className="font-bold" style={{ color }}>
                                {value}
                            </span>
                        </div>
                    ))}
                    <div className="flex-1" />
                    <span style={{ color: "rgba(80,80,120,0.5)" }}>
                        sorted by date
                    </span>
                </div>
            )}

            {/* LOADING */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div
                    className="rounded-sm border px-6 py-5 text-center font-mono"
                    style={{
                        borderColor: "rgba(255,50,80,0.2)",
                        background: "rgba(255,50,80,0.05)",
                    }}
                >
                    <p className="text-[12px]" style={{ color: "#ff3250" }}>
                        ✗ Failed to load blog posts —{" "}
                        <span style={{ color: dim }}>
                            make sure your backend is running.
                        </span>
                    </p>
                </div>
            )}

            {/* EMPTY */}
            {!isLoading && !error && total === 0 && (
                <div
                    className="rounded-sm border border-dashed px-8 py-20 text-center"
                    style={{
                        borderColor: subtle,
                        background: "rgba(255,255,255,0.01)",
                    }}
                >
                    <FileText
                        className="h-10 w-10 mx-auto mb-4"
                        style={{ color: "rgba(170,136,255,0.15)" }}
                    />
                    <h3
                        className="text-sm font-mono font-bold mb-1"
                        style={{ color: "#e0e0ff" }}
                    >
                        no posts initialized
                    </h3>
                    <p
                        className="text-[12px] font-mono mb-6"
                        style={{ color: dim }}
                    >
                        Write your first blog post to get started.
                    </p>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-mono tracking-widest uppercase rounded-sm border transition-all hover:bg-[rgba(0,255,136,0.08)] active:scale-95"
                        style={{
                            borderColor: "rgba(0,255,136,0.3)",
                            color: accent,
                        }}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Write First Post
                    </button>
                </div>
            )}

            {/* CARDS GRID */}
            {!isLoading && posts && total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {posts.map((post, index) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                index={index}
                                onEdit={() => handleEdit(post)}
                                onDelete={() => setDeleteTarget(post)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* DIALOGS */}
            <BlogDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                post={editingPost}
            />
            <DeleteBlogDialog
                post={deleteTarget}
                onClose={() => setDeleteTarget(null)}
            />
        </div>
    );
}
