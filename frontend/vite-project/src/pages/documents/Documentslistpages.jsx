import React, { useEffect, useState } from 'react'
import { documentservices } from '../../services/documentservies';
import toast from "react-hot-toast"
import Button from '../../components/common/Buttons';
import {Plus,FileText,Upload,X,Trash2} from "lucide-react"
import Documentcards from '../../components/documents/Documentcards.jsx';
function Documentslistpages() {

  const [loading,setloading]=useState(false);
  const [isdocuments,setisdocuments]=useState([]);

  //file uploading
  const [fileupload,setfileupload]=useState(null);
  const [titleupload,settitleupload]=useState('');
  const [uploadingopen,setuploadingopen]=useState(false);
  const [uploading,setuploading]=useState(false);

  //state for delete confirmation model
  const [isdeleteopen,setisdeleteopen]=useState(false);
  const [deleting,setdeleting]=useState(false);
  const [selectdoc,setselectdoc]=useState(null);

  const fetchdocument=async()=>{
    try {
      const documents=await documentservices.getdocuments();
    
      setisdocuments(documents.data);
      // console.log(isdocuments);
    } catch (error) {
      toast.error("Failed to fetch documents");
      console.error(error);
    }
    finally{
      setloading(false);
    }
  }
  useEffect(()=>{
    fetchdocument();
  },[])
  const handlefilechange=(e)=>{
    const file=e.target.files[0];
    if(file){
      setfileupload(file);
      settitleupload(file.name.replace(/\.[^/.]+$/, ""));
    }
  }
  const handlefilesubmit=async(e)=>{
    e.preventDefault();
    if(!fileupload || !titleupload){
      toast.error("Please select a file and enter a title");
      return;
    }
    const formdata=new FormData();
    formdata.append('file',fileupload);
    formdata.append('title',titleupload);
    setuploading(true);
    try {
      await documentservices.uploaddocument(formdata);
      setfileupload(null);
      settitleupload('');
      setuploading(false);
      setloading(true);
      toast.success("Document uploaded successfully");
      setuploadingopen(false);
      fetchdocument();
    } catch (error) {
      toast.error("Failed to upload document");
    }
    finally{
      setuploading(false);
    }
  }
  const handledeleterequest=(doc)=>{
    setisdeleteopen(true);
    setselectdoc(doc);
  }
  const handledelete=async()=>{
    if(!selectdoc){
      return ;
    }
    setdeleting(true);
    try {
      await documentservices.deletedocument(selectdoc._id);
      setselectdoc(null);
      setdeleting(false);
      setisdeleteopen(false);
      toast.success(`${selectdoc.title} deleted successfully`);
      setisdocuments(isdocuments.filter(doc=>doc._id!==selectdoc._id));
    } catch (error) {
      toast.error("Failed to delete document");
    }
    finally{
      setdeleting(false);
    }
  };

  const rendercontent=()=>{
    if (isdocuments.length === 0) {
  return (
    <div className="flex items-center justify-center py-20 px-6">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)]">
        {/* Background Glow */}
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center px-8 py-14">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/25">
            <FileText
              className="h-10 w-10 text-white"
              strokeWidth={1.8}
            />
          </div>

          <h3 className="text-3xl font-bold tracking-tight text-slate-900">
            No Documents Yet
          </h3>

          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Get started by uploading your first PDF document and build your
            personal learning workspace.
          </p>

          <Button
            onClick={() => setuploadingopen(true)}
            className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-indigo-600 to-sky-500 px-6 py-4 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 transition-transform duration-300 group-hover:rotate-90">
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            </div>

            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-white/70">
                Start Here
              </p>
              <p className="text-sm font-semibold">Upload Document</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {isdocuments?.map((doc) => (
      <div
        key={doc._id}
        className="group transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]"
      >
        <Documentcards
          document={doc}
          onDelete={handledeleterequest}
        />
      </div>
    ))}
  </div>
);
  };
  return (
<div className="min-h-screen bg-slate-50 relative overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)]" />

  <div className="relative max-w-7xl mx-auto px-6 py-10">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
          Workspace
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          My Documents
        </h1>

        <p className="mt-3 text-slate-600 text-lg max-w-2xl leading-relaxed">
          Manage, organize and quickly access all your learning materials in one elegant place.
        </p>
      </div>

      {isdocuments.length>0 && (
        <Button
          onClick={() => setuploadingopen(true)}
          className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-linear-to-r from-indigo-600 to-sky-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-sm text-white/80 leading-none">New File</p>
            <p className="leading-none mt-1">Upload Document</p>
          </div>
        </Button>
      )}
    </div>



    {/* Main Content */}
    <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/40">
      {rendercontent()}
    </div>

{uploadingopen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-600/10 via-cyan-500/5 to-emerald-500/10" />
      <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Upload New Document
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Add a PDF document to your library and organize it easily.
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setuploadingopen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:scale-105 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlefilesubmit} className="space-y-7">
          {/* Title Input */}
          <div>
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-gray-300">
              Document Title
            </label>

            <input
              type="text"
              value={titleupload}
              onChange={(e) => settitleupload(e.target.value)}
              required
              placeholder="e.g., React Interview Prep"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-violet-500 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/20"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-gray-300">
              PDF File
            </label>

            <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-white/15 bg-white/5 transition-all duration-300 hover:border-violet-400/50 hover:bg-white/10">
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handlefilechange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />

              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
                  <Upload className="h-10 w-10 text-white" />
                </div>

                <p className="text-lg font-semibold text-white">
                  {fileupload ? (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-300">
                      <FileText className="h-5 w-5" />
                      {fileupload.name}
                    </span>
                  ) : (
                    <>
                      <span className="text-violet-400">Click to upload</span>{" "}
                      <span className="text-gray-300">or drag and drop</span>
                    </>
                  )}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  PDF only • Maximum size 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setuploadingopen(false)}
              disabled={uploading}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Uploading...
                </span>
              ) : (
                <>
                  <Upload className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-px" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    {isdeleteopen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-[#0f172a] shadow-[0_25px_80px_rgba(239,68,68,0.25)]">
      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative p-7">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => !deleting && setisdeleteopen(false)}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30">
            <Trash2 className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl font-bold text-white">
            Confirm Deletion
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            This action cannot be undone.
          </p>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm leading-7 text-slate-300">
            Are you sure you want to permanently delete this document?
          </p>

          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-slate-300">
              Document:
            </p>

            <p className="mt-1 overflow-ellipsis overflow-hidden text-base font-semibold text-red-300">
              {selectdoc?.title}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setisdeleteopen(false)}
            disabled={deleting}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handledelete}
            disabled={deleting}
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-red-600 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting...
              </span>
            ) : (
              <>
                <Trash2
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={2.5}
                />
                Delete Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

  </div>
</div>


  );

}

export default Documentslistpages