import React from 'react'

import { RotateCcw, Star } from 'lucide-react';
function Flashcard({ flashcard, onToggleStar, isFlipped, setIsFlipped }) {

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };
    return (
        <div
            className="mx-auto w-full max-w-4xl"
            style={{ perspective: "1200px" }}
        >
            <div
                className="relative h-105 w-full cursor-pointer transition-all duration-500"
                onClick={handleFlip}
            >
                <div
                    className="relative h-full w-full transition-transform duration-700"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    {/* Front of Card */}
                    <div
                        className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                        }}
                    >
                        {/* Top Section */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                    <RotateCcw className="h-6 w-6" strokeWidth={2} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                                        Flashcard
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Question Side
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${flashcard.difficulty === "easy"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : flashcard.difficulty === "medium"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-rose-100 text-rose-700"
                                        }`}
                                >
                                    {flashcard.difficulty}
                                </div>

                                <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Tap to Flip
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleStar(flashcard._id);
                                    }}
                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${flashcard.isstarred
                                            ? "bg-amber-400 text-white shadow-lg shadow-amber-200"
                                            : "bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-500"
                                        }`}
                                >
                                    <Star
                                        className="h-5 w-5"
                                        strokeWidth={2}
                                        fill={flashcard.isstarred ? "currentColor" : "none"}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="flex flex-1 items-center justify-center px-8 py-10 text-center">
                            <p className="max-w-3xl text-2xl font-semibold leading-10 text-slate-900 md:text-3xl">
                                {flashcard.question}
                            </p>
                        </div>

                        {/* Bottom Hint */}
                        <div className="border-t border-slate-100 px-6 py-4">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                                <RotateCcw className="h-4 w-4" strokeWidth={2} />
                                <span>Click to reveal answer</span>
                            </div>
                        </div>
                    </div>

                    {/* Back of Card */}
                    <div
                        className="absolute inset-0 flex h-full w-full rotate-y-180 flex-col overflow-hidden rounded-4xl border border-emerald-100 bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-[0_20px_50px_rgba(16,185,129,0.25)]"
                        style={{
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                        }}
                    >
                        {/* Top Section */}
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                                    <RotateCcw className="h-6 w-6" strokeWidth={2} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                                        Flashcard
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-emerald-50/80">
                                        Answer Side
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleStar(flashcard._id);
                                }}
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${flashcard.isstarred
                                    ? "bg-white text-amber-500 shadow-lg"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                <Star
                                    className="h-5 w-5"
                                    strokeWidth={2}
                                    fill={flashcard.isstarred ? "currentColor" : "none"}
                                />
                            </button>
                        </div>

                        {/* Answer Content */}
                        <div className="flex flex-1 items-center justify-center px-8 py-10 text-center">
                            <p className="max-w-3xl text-xl leading-9 text-white md:text-2xl">
                                {flashcard.answer}
                            </p>
                        </div>

                        {/* Bottom Hint */}
                        <div className="border-t border-white/10 px-6 py-4">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-50/90">
                                <RotateCcw className="h-4 w-4" strokeWidth={2} />
                                <span>Click to go back to question</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Flashcard