"use client"

import React, { useState } from "react";
import { Heart, Mail, Phone, Copy } from "lucide-react";
import { UserCardProps } from "../../../types";



const statusColor = (s?: UserCardProps["status"]) => {
    switch (s) {
        case "SUCCESS":
            return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        case "PENDING":
            return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        case "FAILED":
            return "bg-rose-500/20 text-rose-400 border-rose-500/30";
        default:
            return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
};

const formatCurrency = (amount: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);

const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "";

const initials = (name: string) =>
    name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const UserCard = ({
    name,
    amount,
    currency = "INR",
    status,
    email,
    phone,
    note,
    createdAt,
    onClick,
}: UserCardProps) => {

    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    };

    return (
        <article
            role="group"
            onClick={onClick}
            className="relative w-80 min-h-96 p-6 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-500/20 hover:shadow-2xl bg-slate-900"
        >
            {/* Decorative glow effects */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Animated top border accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Heart (favorite) */}
            <button
                aria-pressed={liked}
                onClick={(e) => {
                    e.stopPropagation();
                    setLiked((s) => !s);
                }}
                className="absolute top-5 right-5 z-20 p-2 rounded-full flex items-center justify-center hover:bg-slate-800 focus:outline-none transition-all"
                title={liked ? "Remove favorite" : "Add favorite"}
            >
                <Heart
                    className={`transition-all ${liked ? "scale-110" : ""}`}
                    size={20}
                    strokeWidth={2}
                    fill={liked ? "#FF6B81" : "none"}
                    color={liked ? "#FF6B81" : "#94a3b8"}
                />
            </button>

            {/* Header: avatar + name */}
            <header className="flex items-start gap-4 mb-6 relative z-10">
                <div
                    aria-hidden
                    className="flex-none w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-lg font-bold text-white shadow-lg shadow-indigo-500/30"
                    title={name}
                >
                    {initials(name)}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-xl font-bold text-slate-100 truncate mb-1">{name}</h3>
                    <p className="text-sm text-slate-400 truncate">{note || "No note provided"}</p>
                </div>
            </header>

            {/* Status badge */}
            {status && (
                <div className="relative z-10 mb-5">
                    <span
                        className={`inline-flex px-3 py-1.5 text-xs rounded-full font-semibold border backdrop-blur-sm ${statusColor(status)}`}
                        title={`Status: ${status}`}
                    >
                        {status}
                    </span>
                </div>
            )}

            {/* Body: amount & date */}
            <div className="relative z-10 mb-6">
                <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">Amount</p>
                            <p className="text-3xl font-bold text-slate-100">{formatCurrency(amount, currency)}</p>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium mb-1">Date</p>
                            <p className="text-sm font-semibold text-slate-300">{formatDate(createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact details */}
            <div className="relative z-10 space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/60 transition-all">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Mail size={16} className="text-slate-500 flex-shrink-0" aria-hidden />
                        <span className="truncate text-sm text-slate-300">{email}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopyEmail();
                        }}
                        className="ml-3 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-600/50 transition-all text-slate-300 font-medium border border-slate-600/50"
                        aria-label="Copy email"
                    >
                        <Copy size={13} />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/60 transition-all">
                    <div className="flex items-center gap-2">
                        <Phone size={16} className="text-slate-500 flex-shrink-0" aria-hidden />
                        <span className="text-sm text-slate-300">{phone ?? "—"}</span>
                    </div>

                    <a
                        href={`tel:${phone ?? ""}`}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-3 text-xs px-2.5 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-600/50 transition-all inline-flex items-center gap-1 text-slate-300 font-medium border border-slate-600/50"
                    >
                        <Phone size={13} />
                        Call
                    </a>
                </div>
            </div>

            {/* Footer actions */}
            <footer className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-xs text-[#13cf5b]">
                    Thank You
                </span>
            </footer>
        </article>
    );
};

export default UserCard