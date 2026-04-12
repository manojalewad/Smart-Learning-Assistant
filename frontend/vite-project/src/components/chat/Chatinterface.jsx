import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContexts';
import { useParams } from 'react-router-dom';
import { aiservices } from '../../services/aiservices';
import { useState } from 'react';
import { MessageSquare, Sparkles,Send } from 'lucide-react';
import MarkdownRender from '../common/MarkdownRender';
function Chatinterface() {
    const { user } = useAuth();
    const { id: documentid } = useParams();
    const [messages, setmessages] = React.useState('');
    const [loading, setloading] = React.useState(false);
    const [initialloading, setinitialloading] = useState(true);
    const [history, sethistory] = React.useState([]);
    const messageendref = React.useRef(null);
    const scrolltobottom = () => {
        messageendref.current?.scrollIntoView({ behavior: 'smooth' });
    }
    const fetchchathistory = async () => {
        try {
            setinitialloading(true);
            const response = await aiservices.getchathistory(documentid);
            sethistory(response.data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setinitialloading(false);
        }
    }
    useEffect(() => {
        fetchchathistory();
    }, [documentid]);

    useEffect(() => {
        scrolltobottom();
    }, [history]);
    const handlesendmessage = async (e) => {
        e.preventDefault();
        if (!messages.trim()) {
            return;
        }
        const usermessage = { role: 'user', content: messages, timestamps: new Date() };
        sethistory(prev => [...prev, usermessage]);
        setloading(true);
        setmessages('');
        try {
            const response = await aiservices.getchat(documentid, messages);
            const assistantmessage = { role: 'assistant', content: response.data.answer, timestamps: new Date(), reventchunks: response.data.relevantchunks };
            sethistory(prev => [...prev, assistantmessage]);

        } catch (error) {
            console.error('chat error', error);
            const chaterror = {
                role: 'assistant',
                content: "something went wrong,please try again later",
                timestamps: new Date()
            }
            sethistory(prev => [...prev, chaterror]);
        }
        finally {
            setloading(false);
        }
    }
    const rendermessage = (msg, index) => {
  const isUser = msg.role === "user";

  return (
    <div
      key={index}
      className={`flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
          <Sparkles className="h-5 w-5" strokeWidth={2} />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] rounded-3xl px-5 py-4 shadow-sm transition-all duration-200 ${
          isUser
            ? "rounded-br-lg bg-emerald-500 text-white"
            : "rounded-bl-lg border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-all text-sm leading-7 text-white">
            {msg.content}
          </p>
        ) : (
          <div className="text-sm leading-7 text-slate-700">
            <MarkdownRender content={msg.content} />
          </div>
        )}

        <div
          className={`mt-3 text-[11px] font-medium ${
            isUser ? "text-emerald-100" : "text-slate-400"
          }`}
        >
          {msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-sm font-semibold text-slate-700 shadow-sm">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
};
    if (initialloading) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                    <MessageSquare
                        className="h-8 w-8 text-emerald-600"
                        strokewdocumentidth={2}
                    />
                </div>

                <div className="relative mb-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                    Loading Chat History
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                    Please wait while we fetch your previous conversation...
                </p>
            </div>
        );
    }
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
                {history.length === 0 ? (
                    <div className="flex h-full min-h-96 flex-col items-center justify-center text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">
                            <MessageSquare
                                className="h-10 w-10 text-emerald-600"
                                strokeWidth={2}
                            />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900">
                            Start a Conversation
                        </h3>

                        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                            Ask me anything about this document and I’ll help you understand it,
                            create summaries, answer questions, and more.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {history.map(rendermessage)}
                    </div>
                )}

                <div ref={messageendref} />

                {loading && (
                    <div className="mt-6 flex items-start gap-3">
                        {/* AI Avatar */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                            <Sparkles className="h-5 w-5" strokeWidth={2} />
                        </div>

                        {/* Typing Bubble */}
                        <div className="max-w-60 rounded-3xl rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500"
                                    style={{ animationDelay: "0ms" }}
                                />
                                <span
                                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500"
                                    style={{ animationDelay: "150ms" }}
                                />
                                <span
                                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500"
                                    style={{ animationDelay: "300ms" }}
                                />
                            </div>

                            <p className="mt-3 text-sm font-medium text-slate-500">
                                AI is thinking...
                            </p>
                        </div>

                    </div>
                )}
            </div>
            <form
                onSubmit={handlesendmessage}
                className="border-t border-slate-200 bg-white p-5"
            >
                <div className="flex items-end gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={messages}
                            onChange={(e) => setmessages(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            disabled={loading}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 pr-14 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />

                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            Enter
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !messages.trim()}
                        className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm transition-all duration-200 hover:bg-emerald-600 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        <Send
                            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={2}
                        />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Chatinterface