import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { documentservices } from '../../services/documentservies';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import Tabs from '../../components/common/Tabs';
import Pageheader from '../../components/common/Pageheaders';
import {Link} from "react-router-dom";
import {FileX,ExternalLink,ArrowLeft,FileText} from 'lucide-react'
import Chatinterface from '../../components/chat/Chatinterface';
import Aiactions from '../../components/ai actions/Aiactions';
import Flashcardtab from '../../components/flashcards/Flashcardtab';
import Quizetab from '../../components/quizess/Quizetab';
function Documentdetailespages() {
  const [loading,setloading]=useState(true);
  const [isdocument,setisdocument]=useState(null);
  const [activetab,setactivetab]=useState('content');
  const {id}=useParams();

  const fetchdocuments=async()=>{
    try {
      const document=await documentservices.getdocumentbyid(id);
      setisdocument(document);
    } catch (error) {
      toast.error("failed to fetch Documents");
      console.error(error);
    }
    finally{
      setloading(false);
    }
    
  }
  useEffect(()=>{
    fetchdocuments();
  },[id])

  const getpdfurl=()=>{
    if(!isdocument?.data?.filepath){
      return null;
    }
    const filepath=isdocument.data.filepath;
    if(filepath.startsWith('https://') || filepath.startsWith('http://')){
      return filepath;
    }
    const baseurl=process.env.REACT_APP_URL || 'https://localhost:8000';
    return `${baseurl}${filepath.startsWith('/') ? '':'/'} ${filepath}`
  }
const rendercontent = () => {
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
            <div className="absolute inset-2 rounded-full bg-emerald-100" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            Loading Document
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Please wait while we prepare your PDF viewer and fetch the document.
          </p>
        </div>
      </div>
    );
  }


  if (!isdocument || !isdocument.data || !isdocument.data.filepath) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
            <FileX className="h-10 w-10" strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            PDF Not Available
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            The requested document could not be found or may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  const pdfUrl = getpdfurl();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-slate-200 bg-slate-50 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <FileText className="h-7 w-7" strokeWidth={2.5} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Document Viewer
            </p>

            <h2 className="mt-1 truncate text-xl font-bold text-slate-900">
              {isdocument?.data?.title || "Untitled Document"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Preview your uploaded PDF document
            </p>
          </div>
        </div>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800"
        >
          <ExternalLink
            size={18}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
          Open in New Tab
        </a>
      </div>

      {/* PDF Section */}
      <div className="bg-slate-100 p-4 md:p-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            frameBorder="0"
            className="h-[80vh] w-full"
          />
        </div>
      </div>
    </div>
  );
};
  const renderchat=()=>{
    return <Chatinterface/>
  }
  const renderai=()=>{
    return <Aiactions/>
  }
  const renderflashcardstab=()=>{
    return <Flashcardtab/>
  }
  const renderquizestab=()=>{
    return <Quizetab/>
  }
  const tabs=[
    {name:'content',label:'Content',content:rendercontent()},
    {name:'chat',label:'Chat',content:renderchat()},
    {name:'ai',label:'Ai Actions',content:renderai()},
    {name:'flashcardstab',label:'Flashcards',content:renderflashcardstab()},
    {name:'quizestab',label:'Quizzes',content:renderquizestab()},
  ]
  if(loading){
    return <Spinner/>;
  }
  if(!document){
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Document Not Found</p>
      </div>
    )
  }

  return (
  <div className="space-y-6">
    {/* Back Button */}
    <div>
      <Link
        to="/documents"
        className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-300"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
          <ArrowLeft
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
        </div>

        <div className="flex flex-col leading-none">
          <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500 group-hover:text-cyan-400/80">
            Navigation
          </span>
          <span className="mt-1 text-sm font-semibold">
            Back to Documents
          </span>
        </div>
      </Link>
    </div>

    {/* Header */}
    <Pageheader
      title={document?.data?.title}
      subtitle="View, manage and interact with your uploaded document and generated learning resources."
    />

    {/* Tabs */}
    <Tabs
      tabs={tabs}
      activeTab={activetab}
      setActiveTab={setactivetab}
    />
  </div>
  )
}

export default Documentdetailespages