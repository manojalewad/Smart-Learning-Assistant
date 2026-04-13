import React, { use } from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { quizeservices } from '../../services/quizeservices';
import Spinner from '../../components/common/Spinner';
import { FileQuestion, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/common/Pageheaders';
function TakequizessPages() {
  const { id: quizeid } = useParams();
  const [quiz, setquiz] = useState(null);
  const [loading, setloading] = useState(true);
  const [selectanswer, setselectanswer] = useState({});
  const [currqquestionindex, setcurrquestionindex] = useState(0);
  const [submitting, setsubmitting] = useState(false);

  const navigate = useNavigate();


  const fetchquiz = async () => {
    setloading(true);
    try {
      const response = await quizeservices.getquizebyid(quizeid);
      setquiz(response.data);
    } catch (error) {
      toast.error("Failed to fetch quiz");
      console.error(error);
    } finally {
      setloading(false);
    }
  }
  useEffect(() => {
    if (quizeid) {
      fetchquiz();
    }
  }, [quizeid])
  const handleoptionchange = (questionid, optionid) => {
    setselectanswer((prev) => (
      { ...prev, [questionid]: optionid }
    ))
  }
  const handlenextquestion = () => {
    if (currqquestionindex < quiz.questions.length - 1) {
      setcurrquestionindex(currqquestionindex + 1);
    }
  }
  const handleprevquestion = () => {
    if (currqquestionindex > 0) {
      setcurrquestionindex(currqquestionindex - 1);
    }
  }
  const handlesubmit = async () => {
    setsubmitting(true);
    try {
      const formatanswer=Object.keys(selectanswer).map((questionid)=>{
        const currquestion=quiz.questions.find((q)=>q._id===questionid);
        const selectedoptionindex=selectanswer[questionid];
        const questionindex=quiz.questions.findIndex((q)=>q._id===questionid);
        const selectedanswer = `0${selectedoptionindex + 1}: ${currquestion.options[selectedoptionindex]}`;
        return {
          questionindex,
          selectedanswer
        }
      })
      await quizeservices.submitquize(quizeid,formatanswer);
      toast.success("Quiz submitted successfully");
      navigate(`/quizess/${quizeid}/result`);
    } catch (error) {
      toast.error("Failed to submit quiz");
      console.error(error);
    } finally {
      setsubmitting(false);
    }
  }
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <Spinner />
      </div>
    )
  }
  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <FileQuestion className="h-8 w-8 text-amber-500" strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Quiz Not Found
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            This quiz could not be found or it doesn’t contain any questions yet.
          </p>
        </div>
      </div>
    );
  }
  const currquestion = quiz.questions[currqquestionindex];
  const isanswered = selectanswer.hasOwnProperty(currquestion._id);
  const answercount = Object.keys(selectanswer).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={quiz.title || "Take Quiz"}
        subtitle="Answer each question carefully and track your progress below."
      />

      {/* Progress Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Question {currqquestionindex + 1} of {quiz.questions.length}
          </span>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
            {answercount} answered
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{
              width: `${((currqquestionindex + 1) / quiz.questions.length) * 100
                }%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <span className="text-lg font-bold">
              {currqquestionindex + 1}
            </span>
          </div>

          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Question {currqquestionindex + 1}
          </span>
        </div>

        <h3 className="text-2xl font-bold leading-10 text-slate-900">
          {currquestion.question}
        </h3>
      </div>
      {/* Options */}
      <div className="mt-8 space-y-4">
        {currquestion.options.map((option, index) => {
          const isSelected = selectanswer[currquestion._id] === index;

          return (
            <label
              key={index}
              className={`group relative flex cursor-pointer items-center rounded-2xl border-2 p-4 transition-all duration-200 ${isSelected
                ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <input
                type="radio"
                name={`question-${currquestion._id}`}
                value={index}
                checked={isSelected}
                onClick={() => {
                  if (isSelected) {
                    setselectanswer((prev) => {
                      const updated = { ...prev };
                      delete updated[currquestion._id];
                      return updated;
                    });
                  } else {
                    handleoptionchange(currquestion._id, index);
                  }
                }}
                readOnly
                className="sr-only"
              />

              {/* Custom Radio */}
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${isSelected
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-slate-300 bg-white group-hover:border-emerald-400"
                  }`}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </div>

              {/* Option Letter */}
              <div
                className={`ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${isSelected
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* Option Text */}
              <span
                className={`ml-4 flex-1 text-sm font-medium transition-colors duration-200 ${isSelected
                  ? "text-emerald-900"
                  : "text-slate-700 group-hover:text-slate-900"
                  }`}
              >
                {option}
              </span>

              {/* Selected Checkmark */}
              {isSelected && (
                <CheckCircle2
                  className="ml-3 h-6 w-6 text-emerald-300"
                  strokeWidth={2.5}
                />
              )}
            </label>
          );
        })}
      </div>
      {/* Question Navigation Dots */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            Question Navigation
          </p>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {answercount}/{quiz.questions.length} answered
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {quiz.questions.map((_, index) => {
            const isAnsweredQuestion = selectanswer.hasOwnProperty(
              quiz.questions[index]._id
            );
            const isCurrent = index === currqquestionindex;

            return (
              <button
                key={index}
                onClick={() => setcurrquestionindex(index)}
                disabled={submitting}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-200 ${isCurrent
                  ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                  : isAnsweredQuestion
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-400 hover:bg-emerald-100"
                    : "border border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-200"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <button
          onClick={handleprevquestion}
          disabled={currqquestionindex === 0 || submitting}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          Previous
        </button>

        {currqquestionindex === quiz.questions.length - 1 ? (
          <button
            onClick={handlesubmit}
            disabled={submitting}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                Submit Quiz
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handlenextquestion}
            disabled={submitting}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export default TakequizessPages