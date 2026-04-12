import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from 'moment';
function Flashcardsetcard({ flashcardset }) {
    const navigate = useNavigate();
    const handlestudyhow = () => {
        navigate(`/documents/${flashcardset._id}/flashcards`);
    };
    const reviewcount = flashcardset.cards.filter((card) => card.reviewcount).length;
    const totalcount = flashcardset.cards.length;
    const progresspercentage = totalcount > 0 ? Math.round((reviewcount / totalcount) * 100) : 0;

    return (
        <div
            className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50"
            onClick={handlestudyhow}
        >
            <div className="space-y-5">
                {/* Icon and Title */}
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                        <BookOpen className="h-7 w-7" strokeWidth={2} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3
                            className="truncate text-lg font-bold text-slate-900"
                            title={flashcardset?.documentid?.title}
                        >
                            {flashcardset?.documentid?.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Created {moment(flashcardset.createdAt).fromNow()}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-slate-100 px-4 py-2">
                        <span className="text-sm font-semibold text-slate-700">
                            {totalcount} {totalcount === 1 ? 'Card' : 'Cards'}
                        </span>
                    </div>

                    {reviewcount > 0 && (
                        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2">
                            <TrendingUp
                                className="h-4 w-4 text-emerald-500"
                                strokeWidth={2.5}
                            />
                            <span className="text-sm font-semibold text-emerald-600">
                                {progresspercentage}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {totalcount > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Progress
                            </span>

                            <span className="text-sm font-medium text-slate-500">
                                {reviewcount}/{totalcount} reviewed
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                style={{ width: `${progresspercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Study Button */}
                <div className="pt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlestudyhow();
                        }}
                        className="group/button relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                            Study Now
                        </span>

                        <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover/button:translate-x-0" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Flashcardsetcard