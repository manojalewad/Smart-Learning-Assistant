import React, { useState } from 'react'
import authservices from "../../services/authserives.js"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, BrainCircuit } from "lucide-react";
import { useAuth } from '../../context/AuthContexts';
function Loginpage() {

  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');
  const [loading,setloading]=useState(false);
  const [focusfield,setfocusfield]=useState(null);
  const [error,seterror]=useState('');

  const navigate=useNavigate();
  const {login}=useAuth();

  const handlesubmit=async(e)=>{
    e.preventDefault();
    setloading(true);
    seterror('');
    try {
      const {token,user}=await authservices.login(email,password);

      login(user,token);
      toast.success('Logged in Sucessfully!')
      navigate('/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to login";

            seterror(message);
          toast.error(message);
    }
    finally{
      setloading(false);
    }
  }
  return (

    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-200">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]" />

      <div className="relative w-full max-w-md px-6">

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-10">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 mb-4">
              <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2}/>
            </div>

            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>

            <p className="text-slate-500 text-sm">
              Sign in to continue your journey
            </p>

          </div>

          <form onSubmit={handlesubmit} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Email
              </label>

              <div className="relative group">

                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                    focusfield === "email"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                >
                  <Mail className="h-5 w-5" strokeWidth={2}/>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setemail(e.target.value)}
                  onFocus={()=>setfocusfield("email")}
                  onBlur={()=>setfocusfield(null)}
                  placeholder="you@gamil.com"
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition"
                />

              </div>

            </div>

            {/* Password Field */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Password
              </label>

              <div className="relative group">

                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                    focusfield === "password"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                >
                  <Lock className="h-5 w-5" strokeWidth={2}/>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e)=>setpassword(e.target.value)}
                  onFocus={()=>setfocusfield("password")}
                  onBlur={()=>setfocusfield(null)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition"
                />

              </div>

            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-xs text-red-600 font-medium text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="relative w-full h-12 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition flex items-center justify-center group overflow-hidden"
            >

              <span className="relative z-10 flex items-center gap-2">

                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition"/>
                  </>
                )}

              </span>

            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Sign up
              </Link>
            </p>

          </div>

          {/* Subtle footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>

        </div>

      </div>

    </div>
  )
}

export default Loginpage