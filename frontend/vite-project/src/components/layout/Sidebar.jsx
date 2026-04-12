import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  FileText,
  BookOpen,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContexts";

const Sidebar = ({ issidebaropen, togglesidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  return (
    <>
      {/* 🌑 Overlay (FIXED - no blur) */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-all duration-300 ${
          issidebaropen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={togglesidebar}
      />

      {/* 🚀 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 
        bg-white/70 backdrop-blur-xl border-r border-white/20 
        shadow-2xl z-50 
        transform transition-all duration-500 ease-in-out
        ${issidebaropen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* 🔝 Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500" size={20} />
            <h1 className="font-semibold tracking-wide">
              AI Assistant
            </h1>
          </div>

          <button
            onClick={togglesidebar}
            className="p-2 rounded-lg hover:bg-slate-200/50 md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* 📌 Navigation */}
        <nav className="p-3 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "text-slate-700 hover:bg-white/60 hover:shadow-md"
                }`
              }
            >
              <link.icon
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              {link.text}
            </NavLink>
          ))}
        </nav>

        {/* 🔻 Logout */}
        <div className="absolute bottom-0 w-full p-3 border-t border-slate-200/50">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <LogOut
              size={18}
              className="transition-transform group-hover:scale-110"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;