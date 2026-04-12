import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Left Section */}
      <div className="min-w-0">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Documents Workspace
        </div>

        <h1 className="truncate text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Actions */}
      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;