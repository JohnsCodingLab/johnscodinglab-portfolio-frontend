"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MailOpen, Trash2, Terminal, Inbox } from "lucide-react";
import { useContacts, useDeleteContact } from "@/hooks/use-contact";
import type { ContactMessage } from "@/types";
import { MessageDetail } from "@/components/contacts/message-detail";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";
const cyan = "#00c8ff";

/* ─── skeleton ─── */
function SkeletonRow() {
    return (
        <div
            className="flex items-center gap-4 px-4 py-3.5 border-b animate-pulse"
            style={{ borderColor: "rgba(80,80,120,0.2)" }}
        >
            <div
                className="w-3 h-3 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div className="flex-1 space-y-2">
                <div
                    className="h-3 w-1/3 rounded-sm"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <div
                    className="h-2.5 w-2/3 rounded-sm"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                />
            </div>
            <div
                className="h-2.5 w-16 rounded-sm"
                style={{ background: "rgba(255,255,255,0.04)" }}
            />
        </div>
    );
}

/* ─── message row ─── */
function MessageRow({
    msg,
    index,
    onOpen,
    onDelete,
}: {
    msg: ContactMessage;
    index: number;
    onOpen: () => void;
    onDelete: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    const formattedDate = new Date(msg.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8, height: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onOpen}
            className="relative flex items-center gap-4 px-4 py-3.5 border-b cursor-pointer transition-all duration-150"
            style={{
                borderColor: "rgba(80,80,120,0.2)",
                background: hovered
                    ? "rgba(0,200,255,0.03)"
                    : msg.read
                      ? "transparent"
                      : "rgba(0,200,255,0.02)",
            }}
        >
            {/* unread indicator */}
            <div className="shrink-0 w-5 flex justify-center">
                {!msg.read ? (
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            background: cyan,
                            boxShadow: "0 0 8px rgba(0,200,255,0.4)",
                        }}
                    />
                ) : (
                    <MailOpen
                        className="h-3.5 w-3.5"
                        style={{ color: "rgba(80,80,120,0.3)" }}
                    />
                )}
            </div>

            {/* sender + subject */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span
                        className="text-[12px] font-mono font-bold truncate"
                        style={{ color: msg.read ? "#8888aa" : "#e0e0ff" }}
                    >
                        {msg.name}
                    </span>
                    <span
                        className="text-[10px] font-mono truncate"
                        style={{ color: dim }}
                    >
                        &lt;{msg.email}&gt;
                    </span>
                </div>
                <p
                    className="text-[11px] font-mono truncate"
                    style={{ color: msg.read ? dim : "#aaaacc" }}
                >
                    <span style={{ color: msg.read ? dim : cyan }}>
                        {msg.subject}
                    </span>
                    <span style={{ color: "rgba(80,80,120,0.4)" }}> — </span>
                    <span style={{ color: "rgba(80,80,120,0.5)" }}>
                        {msg.message.slice(0, 80)}
                    </span>
                </p>
            </div>

            {/* date + actions */}
            <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: dim }}>
                    {formattedDate}
                </span>

                {hovered && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-1.5 rounded-sm border transition-all duration-150 hover:bg-[rgba(255,50,80,0.08)] active:scale-95"
                        style={{ borderColor: subtle }}
                    >
                        <Trash2
                            className="h-3 w-3"
                            style={{ color: "#ff3250" }}
                        />
                    </button>
                )}
            </div>
        </motion.div>
    );
}

/* ─── page ─── */
export default function ContactsPage() {
    const { data: messages, isLoading, error } = useContacts();
    const deleteMutation = useDeleteContact();
    const [selectedMessage, setSelectedMessage] =
        useState<ContactMessage | null>(null);

    const total = messages?.length ?? 0;
    const unread = messages?.filter((m) => !m.read).length ?? 0;

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
        } catch {}
    };

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
                        <span style={{ color: accent }}>contacts</span>
                    </div>
                    <h1
                        className="text-xl font-mono font-bold tracking-tight"
                        style={{ color: "#e0e0ff" }}
                    >
                        _inbox
                    </h1>
                    <p className="text-[12px] font-mono" style={{ color: dim }}>
                        messages from your portfolio visitors
                    </p>
                </div>

                {unread > 0 && (
                    <span
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono rounded-sm border"
                        style={{
                            color: cyan,
                            borderColor: "rgba(0,200,255,0.3)",
                            background: "rgba(0,200,255,0.07)",
                            boxShadow: "0 0 12px rgba(0,200,255,0.06)",
                        }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ background: cyan }}
                        />
                        {unread} unread
                    </span>
                )}
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
                        { label: "UNREAD", value: unread, color: cyan },
                        { label: "READ", value: total - unread, color: dim },
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
                        sorted by newest
                    </span>
                </div>
            )}

            {/* LOADING */}
            {isLoading && (
                <div
                    className="rounded-sm border overflow-hidden"
                    style={{ borderColor: subtle, background: "#0e0e1a" }}
                >
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonRow key={i} />
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
                        ✗ Failed to load contacts —{" "}
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
                    <Inbox
                        className="h-10 w-10 mx-auto mb-4"
                        style={{ color: "rgba(0,200,255,0.15)" }}
                    />
                    <h3
                        className="text-sm font-mono font-bold mb-1"
                        style={{ color: "#e0e0ff" }}
                    >
                        inbox empty
                    </h3>
                    <p className="text-[12px] font-mono" style={{ color: dim }}>
                        No messages from visitors yet.
                    </p>
                </div>
            )}

            {/* MESSAGE LIST */}
            {!isLoading && messages && total > 0 && (
                <div
                    className="rounded-sm border overflow-hidden"
                    style={{ borderColor: subtle, background: "#0e0e1a" }}
                >
                    {/* list header */}
                    <div
                        className="flex items-center gap-4 px-4 py-2 border-b text-[10px] font-mono tracking-widest uppercase"
                        style={{
                            borderColor: "rgba(80,80,120,0.3)",
                            background: "rgba(255,255,255,0.02)",
                            color: dim,
                        }}
                    >
                        <div className="w-5" />
                        <div className="flex-1">Sender / Subject</div>
                        <div>Date</div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, index) => (
                            <MessageRow
                                key={msg.id}
                                msg={msg}
                                index={index}
                                onOpen={() => setSelectedMessage(msg)}
                                onDelete={() => handleDelete(msg.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* MESSAGE DETAIL DIALOG */}
            <MessageDetail
                message={selectedMessage}
                onClose={() => setSelectedMessage(null)}
            />
        </div>
    );
}
