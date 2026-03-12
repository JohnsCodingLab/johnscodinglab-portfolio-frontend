"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    useMarkAsRead,
    useDeleteContact,
    useReplyToContact,
} from "@/hooks/use-contact";
import {
    Loader2,
    Trash2,
    Mail,
    MailOpen,
    User,
    Clock,
    Send,
    CheckCircle2,
} from "lucide-react";
import type { ContactMessage } from "@/types";
import { useEffect, useRef, useState } from "react";

const accent = "#00ff88";
const dim = "#555577";
const cyan = "#00c8ff";

interface MessageDetailProps {
    message: ContactMessage | null;
    onClose: () => void;
}

export function MessageDetail({ message, onClose }: MessageDetailProps) {
    const markAsRead = useMarkAsRead();
    const deleteMutation = useDeleteContact();
    const replyMutation = useReplyToContact();
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);

    // Auto-mark as read when opened
    useEffect(() => {
        if (message && !message.read) {
            markAsRead.mutate(message.id);
        }
    }, [message]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset reply state when message changes (ref-based to avoid cascading renders)
    const prevMessageId = useRef(message?.id);
    if (message?.id !== prevMessageId.current) {
        prevMessageId.current = message?.id;
        setReplyText("");
        setShowReply(false);
    }

    const handleDelete = async () => {
        if (!message) return;
        try {
            await deleteMutation.mutateAsync(message.id);
            onClose();
        } catch {}
    };

    const handleReply = async () => {
        if (!message || replyText.trim().length < 10) return;
        try {
            await replyMutation.mutateAsync({
                id: message.id,
                message: replyText.trim(),
            });
            setReplyText("");
            setShowReply(false);
        } catch {}
    };

    const formattedDate = message
        ? new Date(message.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    const hasReplied = !!message?.repliedAt;

    return (
        <Dialog open={!!message} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-lg p-0 overflow-hidden border-0"
                style={{
                    background: "#0c0c14",
                    boxShadow:
                        "0 0 0 1px rgba(0,200,255,0.15), 0 0 60px rgba(0,0,0,0.8), 0 0 80px rgba(0,200,255,0.04)",
                }}
            >
                {/* scanlines */}
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
                        style={{ borderColor: "rgba(0,200,255,0.4)" }}
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
                                color: cyan,
                                borderColor: "rgba(0,200,255,0.3)",
                                background: "rgba(0,200,255,0.07)",
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ background: cyan }}
                            />
                            MESSAGE
                        </span>

                        {hasReplied && (
                            <span
                                className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm border"
                                style={{
                                    color: accent,
                                    borderColor: "rgba(0,255,136,0.3)",
                                    background: "rgba(0,255,136,0.07)",
                                }}
                            >
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                REPLIED
                            </span>
                        )}

                        <span
                            className="text-[10px] font-mono"
                            style={{ color: "#333355" }}
                        >
                            contacts.inbox.read()
                        </span>
                    </div>

                    <DialogHeader className="space-y-0.5">
                        <DialogTitle
                            className="text-base font-mono font-bold tracking-tight"
                            style={{ color: "#e0e0ff" }}
                        >
                            {message?.subject || "_no_subject"}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Message from {message?.name}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* META */}
                <div
                    className="relative z-10 px-6 py-3 border-b flex flex-wrap gap-4 text-[11px] font-mono"
                    style={{
                        borderColor: "rgba(80,80,120,0.3)",
                        background: "rgba(255,255,255,0.01)",
                    }}
                >
                    <div
                        className="flex items-center gap-1.5"
                        style={{ color: "#8888aa" }}
                    >
                        <User className="h-3 w-3" style={{ color: cyan }} />
                        {message?.name}
                    </div>
                    <div
                        className="flex items-center gap-1.5"
                        style={{ color: "#8888aa" }}
                    >
                        <Mail className="h-3 w-3" style={{ color: cyan }} />
                        {message?.email}
                    </div>
                    <div
                        className="flex items-center gap-1.5"
                        style={{ color: dim }}
                    >
                        <Clock className="h-3 w-3" />
                        {formattedDate}
                    </div>
                </div>

                {/* BODY — scrollable area */}
                <div
                    className="relative z-10 max-h-[50vh] overflow-y-auto"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(0,200,255,0.2) transparent",
                    }}
                >
                    {/* original message */}
                    <div className="px-6 py-5">
                        <p
                            className="text-sm font-mono leading-relaxed whitespace-pre-wrap"
                            style={{ color: "#c0c0e0" }}
                        >
                            {message?.message}
                        </p>
                    </div>

                    {/* previous reply (if exists) */}
                    {hasReplied && message?.replyText && (
                        <div
                            className="mx-6 mb-4 px-4 py-3 rounded-sm border-l-2"
                            style={{
                                borderColor: accent,
                                background: "rgba(0,255,136,0.03)",
                            }}
                        >
                            <div
                                className="flex items-center gap-1.5 mb-2 text-[10px] font-mono tracking-widest uppercase"
                                style={{ color: accent }}
                            >
                                <Send className="h-2.5 w-2.5" />
                                YOUR REPLY
                                <span style={{ color: dim }}>
                                    {" "}
                                    —{" "}
                                    {new Date(
                                        message.repliedAt!,
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <p
                                className="text-[12px] font-mono leading-relaxed whitespace-pre-wrap"
                                style={{ color: "#aaaacc" }}
                            >
                                {message.replyText}
                            </p>
                        </div>
                    )}

                    {/* reply compose area */}
                    {showReply && (
                        <div
                            className="mx-6 mb-4 p-4 rounded-sm border"
                            style={{
                                borderColor: "rgba(0,200,255,0.2)",
                                background: "rgba(0,200,255,0.03)",
                            }}
                        >
                            <div
                                className="flex items-center gap-1.5 mb-3 text-[10px] font-mono tracking-widest uppercase"
                                style={{ color: cyan }}
                            >
                                <Send className="h-2.5 w-2.5" />
                                COMPOSE REPLY
                            </div>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply... (minimum 10 characters)"
                                className="w-full bg-transparent border rounded-sm px-3 py-2 text-sm font-mono placeholder:text-[#444466] outline-none transition-all duration-200 resize-none min-h-[100px]"
                                style={{
                                    borderColor: "rgba(80,80,120,0.6)",
                                    color: "#e0e0ff",
                                }}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <span
                                    className="text-[10px] font-mono"
                                    style={{
                                        color:
                                            replyText.trim().length < 10
                                                ? "#ff4466"
                                                : dim,
                                    }}
                                >
                                    {replyText.trim().length}/10 min chars
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReply(false);
                                            setReplyText("");
                                        }}
                                        className="px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-sm border transition-all hover:bg-white/5 active:scale-95"
                                        style={{
                                            borderColor: "rgba(80,80,120,0.5)",
                                            color: "#8888aa",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReply}
                                        disabled={
                                            replyMutation.isPending ||
                                            replyText.trim().length < 10
                                        }
                                        className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase rounded-sm transition-all active:scale-95 disabled:opacity-40"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, rgba(0,200,255,0.15), rgba(0,200,255,0.08))",
                                            border: "1px solid rgba(0,200,255,0.4)",
                                            color: cyan,
                                            boxShadow:
                                                "0 0 15px rgba(0,200,255,0.06)",
                                        }}
                                    >
                                        {replyMutation.isPending ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Send className="h-3 w-3" />
                                        )}
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div
                    className="relative z-10 border-t flex items-center justify-between px-6 py-4"
                    style={{
                        borderColor: "rgba(80,80,120,0.3)",
                        background: "rgba(0,0,0,0.3)",
                    }}
                >
                    <div
                        className="flex items-center gap-1.5 text-[10px] font-mono"
                        style={{ color: dim }}
                    >
                        {message?.read ? (
                            <>
                                <MailOpen
                                    className="h-3 w-3"
                                    style={{ color: accent }}
                                />
                                <span style={{ color: accent }}>read</span>
                            </>
                        ) : (
                            <>
                                <Mail className="h-3 w-3" />
                                <span>unread</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Reply button */}
                        {!showReply && (
                            <button
                                type="button"
                                onClick={() => setShowReply(true)}
                                className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-mono tracking-widest uppercase rounded-sm border transition-all duration-150 hover:bg-[rgba(0,200,255,0.06)] active:scale-95"
                                style={{
                                    borderColor: "rgba(0,200,255,0.35)",
                                    color: cyan,
                                }}
                            >
                                <Send className="h-3 w-3" />
                                {hasReplied ? "Reply Again" : "Reply"}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[11px] font-mono tracking-widest uppercase rounded-sm border transition-all duration-150 hover:bg-white/5 active:scale-95"
                            style={{
                                borderColor: "rgba(80,80,120,0.5)",
                                color: "#8888aa",
                            }}
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold tracking-widest uppercase rounded-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(255,50,80,0.15), rgba(255,50,80,0.08))",
                                border: "1px solid rgba(255,50,80,0.4)",
                                color: "#ff3250",
                                boxShadow: "0 0 20px rgba(255,50,80,0.08)",
                            }}
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DialogHeader({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return <div className={className}>{children}</div>;
}
