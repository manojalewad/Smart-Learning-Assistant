import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {Trash2,FileText,Award,BarChart2,Play} from "lucide-react";
function Quizecard({ quiz, onDelete }) {


    return (
        <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Top Header */}
            <div className="relative border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-teal-50 px-5 py-5">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(quiz);
                    }}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition-all duration-200 hover:bg-rose-100 hover:text-rose-600"
                >
                    <Trash2 className="h-5 w-5" strokeWidth={2} />
                </button>

                <div className="pr-14">
                    <h3
                        className="line-clamp-2 text-lg font-bold text-slate-900"
                        title={quiz.title}
                    >
                        {quiz.title ||
                            `Quiz - ${moment(quiz.createdat).format("MMM D, YYYY")}`}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Created {moment(quiz.createdat).format("MMM D, YYYY")}
                    </p>
                </div>
            </div>

            {/* Quiz Info */}
            <div className="space-y-4 px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                            <FileText className="h-5 w-5" strokeWidth={2.5} />
                        </div>

                        <div>
                            <span className="block text-lg font-bold text-slate-900">
                                {quiz.questions.length}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                                {quiz.questions.length === 1 ? "Question" : "Questions"}
                            </span>
                        </div>
                    </div>

                    {quiz?.useranswers?.length > 0 && (
                        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3">
                            <Award
                                className="h-5 w-5 text-amber-500"
                                strokeWidth={2.5}
                            />
                            <div>
                                <span className="block text-lg font-bold text-amber-600">
                                    {quiz.score}
                                </span>
                                <span className="text-xs font-medium text-amber-500">
                                    Score
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    {quiz?.useranswers?.length > 0 ? (
                        <Link to={`/quizess/${quiz._id}/result`}>
                            <button className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-100">
                                <BarChart2
                                    className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                                    strokeWidth={2.5}
                                />
                                View Results
                            </button>
                        </Link>
                    ) : (
                        <Link to={`/quizess/${quiz._id}`}>
                            <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                                <Play
                                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                                    strokeWidth={2.5}
                                />
                                Start Quiz
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Quizecard