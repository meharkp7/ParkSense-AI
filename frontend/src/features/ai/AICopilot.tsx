import { useState } from "react";
import { api } from "@/services/api/client";

export default function AICopilot() {
  const [isOpen, setIsOpen] =
    useState(false);

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [answer, setAnswer] =
    useState("");

  async function askAI() {
    if (!question.trim())
      return;

    setLoading(true);

    try {
      const res =
        await api.post(
          "/copilot",
          {
            question,
          }
        );

      setAnswer(
        res.data.answer
      );
    } catch {
      setAnswer(
        "Unable to generate insights."
      );
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() =>
            setIsOpen(true)
          }
          className="
            fixed
            bottom-6
            right-6
            z-[1000]
            h-16
            w-16
            rounded-full
            bg-slate-900
            text-3xl
            shadow-2xl
            transition
            hover:scale-105
          "
        >
          🤖
        </button>
      )}

      {/* AI Panel */}
      {isOpen && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-[1000]
            w-[400px]
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-2xl
          "
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              rounded-t-3xl
              bg-slate-900
              p-4
              text-white
            "
          >
            <div>
              <h2 className="font-bold">
                🤖 ParkSense AI
              </h2>

              <p className="text-sm text-slate-300">
                Smart City Copilot
              </p>
            </div>

            <button
              onClick={() =>
                setIsOpen(false)
              }
              className="
                rounded-full
                px-3
                py-1
                text-xl
                hover:bg-slate-700
              "
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 p-4">
            <textarea
              rows={3}
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              placeholder="Why is KR Market congested?"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                p-3
                text-slate-900
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {[
                "Why is KR Market congested?",
                "Which area is most risky?",
                "Where should tow units be deployed?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() =>
                    setQuestion(q)
                  }
                  className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-xs
                    text-slate-600
                    transition
                    hover:bg-slate-200
                  "
                >
                  {q}
                </button>
              ))}
            </div>

            <button
              onClick={askAI}
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-slate-900
                py-3
                font-semibold
                text-white
                transition
                hover:bg-slate-800
              "
            >
              {loading
                ? "Thinking..."
                : "Ask AI"}
            </button>

            {answer && (
              <div
                className="
                  max-h-[250px]
                  overflow-y-auto
                  rounded-2xl
                  bg-slate-50
                  p-4
                "
              >
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {answer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}