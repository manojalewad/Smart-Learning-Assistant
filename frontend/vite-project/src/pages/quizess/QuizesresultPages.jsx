import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizeservices } from '../../services/quizeservices';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { FileQuestion, ArrowLeft, Trophy, BookOpen, XCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function QuizesresultPages() {
  const { id: quizeid } = useParams();
  const [loading, setloading] = useState(true);
  const [quizeresult, setquizeresult] = useState(null);
  const navigate = useNavigate();
  const fetchquizeresult = async () => {
    setloading(true);
    try {
      const response = await quizeservices.getquizresult(quizeid);
      setquizeresult(response.data);
    } catch (error) {
      toast.error("Failed to fetch quiz result");
      console.error(error);
    } finally {
      setloading(false);
    }
  }
  useEffect(() => {
    fetchquizeresult();
  }, [quizeid])
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <Spinner />
      </div>
    )
  }
  if (!quizeresult) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
            <FileQuestion className="h-8 w-8 text-rose-500" strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Quiz quizeresult Not Found
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            We couldn&apos;t find the quiz quizeresult. The quiz may not have been
            submitted yet or the result no longer exists.
          </p>

          <button
            onClick={() => navigate(`/documents/${quizeresult.quize.document?._id}`)}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const score = quizeresult.quize.score;
  const totalquestions = quizeresult.quize.totalquestions;
  const correctanswers = quizeresult.results.filter((result) => result.iscorrect).length;
  const incorrectanswers = totalquestions - correctanswers;
  const getscorecolor = (score) => {
    if (score >= 80) {
      return 'from-emerald-500 to-teal-500';
    }
    if (score >= 60) {
      return 'from-yellow-400 to-yellow-500';
    }
    return 'from-rose-400 to-rose-500';
  }

  const getscoremessage = (score) => {
    if (score >= 90) {
      return 'Outstanding performance!';
    }
    if (score >= 80) {
      return 'Excellent work!';
    }
    if (score >= 70) {
      return 'Good job!';
    }
    if (score >= 60) {
      return 'Not bad!';
    }
    return 'Keep practicing!';
  }


  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to={`/documents/${quizeresult.quize.document?._id}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to Document
        </Link>
      </div>

      {/* Score Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
              <Trophy className="h-10 w-10 text-white" strokeWidth={2.5} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">
              Quiz Completed
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Your Score
            </h1>

            <div className="mt-6 inline-flex items-center rounded-3xl bg-white/10 px-8 py-4 backdrop-blur-sm">
              <span className="text-5xl font-black text-white">
                {score}%
              </span>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-emerald-50">
              {getscoremessage(score)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 border-t border-slate-200 p-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Correct
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {correctanswers}
            </p>
          </div>

          <div className="rounded-2xl bg-rose-50 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
              Incorrect
            </p>
            <p className="mt-2 text-3xl font-bold text-rose-600">
              {incorrectanswers}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Total Questions
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {totalquestions}
            </p>
          </div>
        </div>
      </div>
      {/* Questions Review */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <BookOpen className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Detailed Review
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Review every question and compare your answer with the correct one.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {quizeresult.results.map((result, index) => {
            const userAnswerIndex = result.selectedanswer
              ? parseInt(result.selectedanswer.match(/\d+/)?.[0], 10) - 1
              : -1;

            const correctanswerIndex = result.correctanswer
              ? parseInt(result.correctanswer.match(/\d+/)?.[0], 10) - 1
              : -1;

            const iscorrect = userAnswerIndex === correctanswerIndex;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/70"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iscorrect
                        ? "border border-emerald-200 bg-emerald-50"
                        : "border border-rose-200 bg-rose-50"
                        }`}
                    >
                      {iscorrect ? (
                        <CheckCircle2
                          className="h-5 w-5 text-emerald-500"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <XCircle
                          className="h-5 w-5 text-rose-500"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>

                    <div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Question {index + 1}
                      </span>

                      <h4 className="mt-3 text-lg font-semibold leading-8 text-slate-900">
                        {result.question}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${iscorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {iscorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                {/* Options */}
                <div className="space-y-3 p-6">
                  {result.options.map((option, optIndex) => {
                    const iscorrectOption = optIndex === correctanswerIndex;
                    const isUserAnswer = optIndex === userAnswerIndex;
                    const isWrongAnswer = isUserAnswer && !iscorrect;

                    return (
                      <div
                        key={optIndex}
                        className={`flex items-center justify-between rounded-2xl border-2 px-4 py-4 transition-all ${iscorrectOption
                          ? "border-emerald-300 bg-emerald-50 shadow-sm"
                          : isWrongAnswer
                            ? "border-rose-300 bg-rose-50"
                            : "border-slate-200 bg-white"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${iscorrectOption
                              ? "bg-emerald-500 text-white"
                              : isWrongAnswer
                                ? "bg-rose-500 text-white"
                                : "bg-slate-100 text-slate-500"
                              }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </div>

                          <span
                            className={`text-sm font-medium ${iscorrectOption
                              ? "text-emerald-900"
                              : isWrongAnswer
                                ? "text-rose-900"
                                : "text-slate-700"
                              }`}
                          >
                            {option}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {iscorrectOption && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2
                                className="h-4 w-4"
                                strokeWidth={2.5}
                              />
                              Correct Answer
                            </span>
                          )}

                          {isWrongAnswer && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                              <XCircle
                                className="h-4 w-4"
                                strokeWidth={2.5}
                              />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {result.explanation && (
                  <div className="mx-6 mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-start gap-4 p-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <BookOpen className="h-5 w-5" strokeWidth={2} />
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
                          Explanation
                        </p>

                        <p className="mt-3 text-sm leading-7 text-slate-700">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuizesresultPages