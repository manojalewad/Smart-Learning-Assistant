import React from 'react'
import {useAuth} from '../../context/AuthContexts'
import { Menu, Bell, User } from "lucide-react";
function Header({togglesidebar}) {
    const {user}=useAuth();
   return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        
        {/* Mobile Menu Button */}
        <button
          onClick={togglesidebar}
          className="p-2 rounded-lg hover:bg-slate-100 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100">
          <Bell
            size={20}
            strokeWidth={2}
            className="transition-transform group-hover:scale-110"
          />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <User size={18} strokeWidth={2.5} className="text-white" />
          </div>

          {/* User Info */}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.email || "user@example.com"}
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header