import React, { useEffect, useState } from "react";
import Spinner from "../../components/common/Spinner";
import progresservies from "../../services/progressservices";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function DashboardPages() {
  const [dashboard, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdashboard = async () => {
      try {
        const data = await progresservies.dashboard();
        setDashboardData(data);
      } catch (error) {
        toast.error("Failed to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchdashboard();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboard || !dashboard.overview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No dashboard data available</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Documents",
      value: dashboard.overview.totaldocuments,
      icon: FileText,
      color: "from-blue-400 to-cyan-500",
    },
    {
      label: "Flashcards",
      value: dashboard.overview.totalflashcardsets,
      icon: BookOpen,
      color: "from-purple-400 to-pink-500",
    },
    {
      label: "Quizzes",
      value: dashboard.overview.totalquizes,
      icon: BrainCircuit,
      color: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-linear-to-br from-slate-50 via-white to-slate-100 min-h-screen">

      {/* 🔝 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back 👋</p>
        </div>

        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">
          <TrendingUp size={18} />
          <span className="text-sm font-medium">Progress Overview</span>
        </div>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="relative p-6 rounded-2xl bg-white/70 backdrop-blur-xl border shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className={`absolute inset-0 opacity-20 rounded-2xl bg-linear-to-r ${stat.color}`}></div>

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <h2 className="text-3xl font-bold">{stat.value}</h2>
              </div>

              <div className={`p-4 rounded-xl bg-linear-to-r ${stat.color} text-white`}>
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📌 Recent Activity */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>

        {dashboard?.recentactivity ? (
          <div className="relative border-l border-slate-200 pl-6 space-y-6">

            {[
              ...(dashboard.recentactivity.documents || []).map(doc => ({
                id: doc._id,
                description: doc.title,
                timestamp: doc.lastaccessed,
                type: "document",
                link: `/documents/${doc._id}`, 
              })),
              ...(dashboard.recentactivity.quizes || []).map(quiz => ({
                id: quiz._id,
                description: quiz.title,
                timestamp: quiz.completedat,
                type: "quiz",
                link: `/quizess/${quiz._id}`,    
              })),
            ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 6)
              .map((activity, index) => (
                <div key={activity.id || index} className="relative">

                  {/* Dot */}
                  <div
                    className={`absolute -left-3 top-2 w-3 h-3 rounded-full ${
                      activity.type === "document"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  ></div>

                  {/* Card */}
                  <div className="p-4 rounded-xl bg-white shadow hover:shadow-md transition">
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">
                        {activity.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>

                        {/* ✅ View Button */}
                        {activity.link && (
                          <Link
                            to={activity.link}
                            className="px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 capitalize mt-1">
                      {activity.type}
                    </p>

                  </div>
                </div>
              ))}

          </div>
        ) : (
          <p className="text-sm text-slate-500">No recent activity</p>
        )}
      </div>

    </div>
  );
}

export default DashboardPages;