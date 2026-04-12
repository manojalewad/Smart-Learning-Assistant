import React from 'react'
import { FileText, Plus } from "lucide-react";
function Emptystate({ title, description, buttonText, onActionClick }) {
    return (
        <div className="flex min-h-105 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 shadow-sm">
            <div className="max-w-md text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-inner">
                    <FileText className="h-10 w-10" strokeWidth={2} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                    {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                    {description}
                </p>

                {buttonText && onActionClick && (
                    <button
                        onClick={onActionClick}
                        className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 transition-transform duration-200 group-hover:rotate-90">
                            <Plus className="h-5 w-5" strokeWidth={2.5} />
                        </span>

                        <span className="text-sm font-semibold">
                            {buttonText}
                        </span>

                        <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Emptystate