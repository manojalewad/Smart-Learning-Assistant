import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { aiservices } from '../../services/aiservices';
import { Sparkles, BookOpen,Lightbulb } from 'lucide-react';
import Modal from '../common/Modal';
import MarkdownRender from '../common/MarkdownRender';
function Aiactions() {
    const {id: documentid}=useParams();
    const [loadingactions,setloadingactions]=useState(null);
    const [modalopen,setmodalopen]=useState(false);
    const [modalcontent,setmodalcontent]=useState('');
    const [modaltitle,setmodaltitle]=useState('');
    const [concept,setconcept]=useState('');

    const generatesummary=async()=>{
        setloadingactions('summary');
        try {
            const summary=await aiservices.generatesummary(documentid);
            setmodaltitle('Generated Summary');
            setmodalcontent(summary.data.summary);
            setmodalopen(true);
        } catch (error) {
            toast.error('Failed to generate summary');
        } finally {
            setloadingactions(null);
        }
    }
    

    const handleexplainconcept=async(e)=>{
        e.preventDefault();
        if(!concept.trim()){
            toast.error('Please enter a concept to explain');
            return;
        }
        setloadingactions('explain');
        try {
            const explanation=await aiservices.explainconcept(documentid,concept);
            setmodalcontent(explanation.data.response);
            setmodaltitle(`Explanation of ${concept}`);
            setconcept('');
            setmodalopen(true);
        } catch (error) {
            toast.error('Failed to explain concept');
        } finally {
            setloadingactions(null);
        }

    }



  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  {/* Header */}
  <div className="mb-6 flex items-center gap-4">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
      <Sparkles className="h-7 w-7" strokeWidth={2} />
    </div>

    <div>
      <h3 className="text-xl font-bold text-slate-900">
        AI Assistant
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Powered by advanced AI to help you understand your document
      </p>
    </div>
  </div>

  {/* Generate Summary */}
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/40">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <BookOpen className="h-6 w-6" strokeWidth={2} />
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-900">
            Generate Summary
          </h4>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Get a concise summary of the entire document.
          </p>
        </div>
      </div>

      <button
        onClick={generatesummary}
        disabled={loadingactions === "summary"}
        className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-600 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loadingactions === "summary" ? (
          <span className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Loading...
          </span>
        ) : (
          <>
            <BookOpen
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
              strokeWidth={2}
            />
            Summarize
          </>
        )}
      </button>
    </div>
  </div>
      {/* Explain Concept */}
<div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <form onSubmit={handleexplainconcept}>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50/40">
      {/* Header */}
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <Lightbulb className="h-6 w-6" strokeWidth={2} />
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-900">
            Explain a Concept
          </h4>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Enter a topic, term, or concept from the document and the AI will
            give you a simple explanation, important points, and practical
            understanding.
          </p>
        </div>
      </div>

      {/* Input + Button */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={concept}
            onChange={(e) => setconcept(e.target.value)}
            placeholder="e.g., React Hooks"
            disabled={loadingactions === "explain"}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            Topic
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingactions === "explain" || !concept.trim()}
          className="group inline-flex min-w-40 items-center justify-center gap-3 rounded-2xl bg-amber-500 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-600 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loadingactions === "explain" ? (
            <span className="flex items-center gap-3">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Loading...
            </span>
          ) : (
            <>
              <Lightbulb
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={2}
              />
              Explain
            </>
          )}
        </button>
      </div>

    </div>
  </form>
</div>


          {/*Result modal*/}
            <Modal isOpen={modalopen} onClose={()=>setmodalopen(false)} title={modaltitle}>
                <div className="whitespace-pre-wrap text-sm text-slate-700 overflow-y-auto max-h-96">
                <MarkdownRender content={modalcontent} />
                </div>
            </Modal>
</div>
  )
}

export default Aiactions