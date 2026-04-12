import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="space-y-5">
      {/* Navigation Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`group relative flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {/* Icon */}
                {tab.icon && (
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-emerald-500"
                    }`}
                  >
                    {tab.icon}
                  </div>
                )}

                {/* Text */}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">
                    {tab.label}
                  </span>

                  {tab.description && (
                    <span
                      className={`text-xs ${
                        isActive
                          ? "text-emerald-100"
                          : "text-slate-400"
                      }`}
                    >
                      {tab.description}
                    </span>
                  )}
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-2xl border border-emerald-400/30" />
                    <div className="absolute -bottom-1 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-emerald-300" />
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {tabs.map((tab) =>
          tab.name === activeTab ? (
            <div
              key={tab.name}
              className="animate-[fadeIn_0.3s_ease-in-out]"
            >
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Tabs;