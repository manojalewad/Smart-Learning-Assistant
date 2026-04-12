import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
function MarkdownRender({content}) {
  return (
    <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ node, ...props }) => (
      <h1
        className="mb-4 mt-6 text-2xl font-bold text-slate-900"
        {...props}
      />
    ),

    h2: ({ node, ...props }) => (
      <h2
        className="mb-3 mt-5 text-xl font-bold text-slate-900"
        {...props}
      />
    ),

    h3: ({ node, ...props }) => (
      <h3
        className="mb-3 mt-4 text-lg font-semibold text-slate-900"
        {...props}
      />
    ),

    h4: ({ node, ...props }) => (
      <h4
        className="mb-2 mt-4 text-base font-semibold text-slate-800"
        {...props}
      />
    ),

    p: ({ node, ...props }) => (
      <p
        className="mb-4 text-sm leading-7 text-slate-700"
        {...props}
      />
    ),

    a: ({ node, ...props }) => (
      <a
        className="font-medium text-emerald-600 underline-offset-4 transition hover:text-emerald-700 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),

    ul: ({ node, ...props }) => (
      <ul
        className="mb-4 ml-5 list-disc space-y-2 text-sm text-slate-700"
        {...props}
      />
    ),

    ol: ({ node, ...props }) => (
      <ol
        className="mb-4 ml-5 list-decimal space-y-2 text-sm text-slate-700"
        {...props}
      />
    ),

    li: ({ node, ...props }) => (
      <li className="leading-7" {...props} />
    ),

    strong: ({ node, ...props }) => (
      <strong className="font-semibold text-slate-900" {...props} />
    ),

    em: ({ node, ...props }) => (
      <em className="italic text-slate-700" {...props} />
    ),

    blockquote: ({ node, ...props }) => (
      <blockquote
        className="mb-4 rounded-r-2xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm italic text-slate-700"
        {...props}
      />
    ),

    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {match[1]}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
          </div>

          <SyntaxHighlighter
            style={dracula}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "1rem",
              borderRadius: 0,
              fontSize: "0.875rem",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className="rounded-md bg-slate-100 px-1.5 py-1 font-mono text-sm text-emerald-700"
          {...props}
        >
          {children}
        </code>
      );
    },

    pre: ({ node, ...props }) => (
      <pre
        className="mb-4 overflow-x-auto rounded-2xl"
        {...props}
      />
    ),
  }}
>
  {content}
</ReactMarkdown>
  )
}

export default MarkdownRender