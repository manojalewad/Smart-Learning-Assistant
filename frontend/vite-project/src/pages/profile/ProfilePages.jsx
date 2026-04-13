import React, { useEffect, useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContexts';
import authservices from '../../services/authserives';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/Pageheaders';

function ProfilePages() {
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [oldpassword, setoldpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [passwordloading, setpasswordloading] = useState(false);

  const { user } = useAuth();

  const fetchuser = async () => {
    setloading(true);
    try {
      const { data } = await authservices.getprofile();
      const fetcheduser = data;
      setemail(fetcheduser.email);
      setusername(fetcheduser.username);
    } catch (error) {
      toast.error(error.message || "Failed to fetch user profile");
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);

  const handlepasswordchange = async (e) => {
    e.preventDefault();

    if (!oldpassword || !newpassword || !confirmpassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newpassword !== confirmpassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setpasswordloading(true);

    try {
      await authservices.changepassword({
        oldpassword,
        newpassword
      });

      toast.success("Password changed successfully");

      setnewpassword("");
      setconfirmpassword("");
      setoldpassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
      console.error(error);
    } finally {
      setpasswordloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
          <span className="text-sm font-medium text-slate-600">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account information and update your password."
      />

      <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        {/* Top Banner */}
        <div className="relative h-40 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_40%)]" />

          <div className="absolute -bottom-12 left-8 flex items-end gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-white shadow-xl">
              <span className="text-3xl font-black text-emerald-600">
                {username?.charAt(0)?.toUpperCase()}
              </span>
            </div>

            <div className="mb-4 text-green-950">
              <h2 className="text-3xl font-bold">{username}</h2>
              <p className="mt-1 text-sm text-green-700">
                Welcome back to your profile
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 px-8 pb-8 pt-16">
          {/* User Information */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <User className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  User Information
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your personal account details.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Username */}
              <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Username
                </label>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {username}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Your display username
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100/40">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Email Address
                </label>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 transition-colors duration-300 group-hover:bg-cyan-500 group-hover:text-white">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-slate-900">
                      {email}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Your registered email address
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Change Password
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Update your account password securely.
                </p>
              </div>
            </div>

            <form
              onSubmit={handlepasswordchange}
              className="grid gap-5 md:grid-cols-2"
            >
              {/* Old Password */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Current Password
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-emerald-400 focus-within:bg-white">
                  <Lock className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={oldpassword}
                    onChange={(e) => setoldpassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-emerald-400 focus-within:bg-white">
                  <Lock className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={newpassword}
                    onChange={(e) => setnewpassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-emerald-400 focus-within:bg-white">
                  <Lock className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={passwordloading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePages;