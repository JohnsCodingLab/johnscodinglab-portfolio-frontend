"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useDeleteProject } from "@/hooks/use-projects";
import { Loader2, Trash2 } from "lucide-react";
import type { Project } from "@/types";

interface DeleteProjectDialogProps {
    project: Project | null;
    onClose: () => void;
}

export function DeleteProjectDialog({
    project,
    onClose,
}: DeleteProjectDialogProps) {
    const deleteMutation = useDeleteProject();

    const handleDelete = async () => {
        if (!project) return;
        try {
            await deleteMutation.mutateAsync(project.slug);
            onClose();
        } catch {}
    };

    return (
        <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-md p-0 overflow-hidden border-0"
                style={{
                    background: "#0c0c14",
                    boxShadow:
                        "0 0 0 1px rgba(255,50,80,0.2), 0 0 60px rgba(0,0,0,0.9), 0 0 80px rgba(255,50,80,0.04)",
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

                {/* red corner accents */}
                {[
                    "top-0 left-0 border-t border-l",
                    "top-0 right-0 border-t border-r",
                    "bottom-0 left-0 border-b border-l",
                    "bottom-0 right-0 border-b border-r",
                ].map((pos, i) => (
                    <div
                        key={i}
                        className={`pointer-events-none absolute w-4 h-4 z-10 ${pos}`}
                        style={{ borderColor: "rgba(255,50,80,0.5)" }}
                    />
                ))}

                {/* BODY */}
                <div className="relative z-10 px-6 pt-6 pb-5 space-y-5">
                    {/* status badge */}
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm border"
                            style={{
                                color: "#ff3250",
                                borderColor: "rgba(255,50,80,0.3)",
                                background: "rgba(255,50,80,0.07)",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3250] animate-pulse" />
                            DESTRUCTIVE ACTION
                        </span>
                    </div>

                    {/* icon + title */}
                    <div className="flex items-start gap-4">
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-sm border shrink-0"
                            style={{
                                borderColor: "rgba(255,50,80,0.3)",
                                background: "rgba(255,50,80,0.08)",
                            }}
                        >
                            <Trash2
                                className="h-4 w-4"
                                style={{ color: "#ff3250" }}
                            />
                        </div>

                        <div className="space-y-1 pt-0.5">
                            <DialogTitle
                                className="text-sm font-mono font-bold tracking-tight"
                                style={{ color: "#e0e0ff" }}
                            >
                                _delete_project
                            </DialogTitle>
                            <DialogDescription
                                className="text-[12px] font-mono leading-relaxed"
                                style={{ color: "#666688" }}
                            >
                                This will permanently remove{" "}
                                <span
                                    className="px-1.5 py-0.5 rounded-sm font-bold"
                                    style={{
                                        color: "#ff3250",
                                        background: "rgba(255,50,80,0.1)",
                                        border: "1px solid rgba(255,50,80,0.2)",
                                    }}
                                >
                                    {project?.title}
                                </span>{" "}
                                from your portfolio.{" "}
                                <span style={{ color: "#444466" }}>
                                    This action cannot be undone.
                                </span>
                            </DialogDescription>
                        </div>
                    </div>

                    {/* warning bar */}
                    <div
                        className="flex items-center gap-2 px-3 py-2 rounded-sm border text-[11px] font-mono"
                        style={{
                            borderColor: "rgba(255,170,0,0.2)",
                            background: "rgba(255,170,0,0.05)",
                            color: "#ffaa00",
                        }}
                    >
                        <span className="opacity-60">⚠</span>
                        All associated data will be lost permanently.
                    </div>
                </div>

                {/* FOOTER */}
                <div
                    className="relative z-10 border-t flex items-center justify-between px-6 py-4"
                    style={{
                        borderColor: "rgba(80,80,120,0.3)",
                        background: "rgba(0,0,0,0.3)",
                    }}
                >
                    <span
                        className="text-[10px] font-mono"
                        style={{ color: "#2a2a44" }}
                    >
                        proceed with caution
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[11px] font-mono tracking-widest uppercase rounded-sm border transition-all duration-150 hover:bg-white/5 active:scale-95"
                            style={{
                                borderColor: "rgba(80,80,120,0.5)",
                                color: "#8888aa",
                            }}
                        >
                            Abort
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-2 px-5 py-2 text-[11px] font-mono font-bold tracking-widest uppercase rounded-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(255,50,80,0.15), rgba(255,50,80,0.08))",
                                border: "1px solid rgba(255,50,80,0.4)",
                                color: "#ff3250",
                                boxShadow: "0 0 20px rgba(255,50,80,0.08)",
                            }}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Confirm Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
