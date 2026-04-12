import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { BookOpen, BrainCircuit, Clock } from "lucide-react";

const formatfilesize = (bytes) => {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  let size = bytes;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(1)} ${units[index]}`;
};

function Documentcards({ document, onDelete }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)]"
      onClick={handleNavigate}
    >
      {/* Title */}
      <h3
        title={document.title}
        className="mb-4 line-clamp-2 text-lg font-bold leading-7 tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-600"
      >
        {document.title}
      </h3>

      {/* Document Info */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {document.filesize !== undefined && (
          <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
            {formatfilesize(document.filesize)}
          </span>
        )}

        {document.filetype && (
          <span className="inline-flex items-center rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {document.filetype}
          </span>
        )}
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap items-center gap-3">
        {document.flashcardcount !== undefined && (
          <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <BookOpen className="h-4 w-4" strokeWidth={2} />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-900">
                {document.flashcardcount}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Flashcards
              </span>
            </div>
          </div>
        )}

        {document.quzicount !== undefined && (
          <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <BrainCircuit className="h-4 w-4" strokeWidth={2} />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-900">
                {document.quzicount}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Quizzes
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Clock className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <span className="font-medium">
            Uploaded {moment(document.createdAt).fromNow()}
          </span>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          Delete
        </button>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-3xl bg-linear-to-r from-indigo-500 via-sky-500 to-cyan-500 opacity-0 transition-all duration-300 group-hover:opacity-100" />
    </div>
  );
}

export default Documentcards;