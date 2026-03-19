import { Cat, Send, Settings2 } from "lucide-react";
import { useEffect, useRef, type FormEvent } from "react";

import {
  QUICK_CHAT_ACTIONS,
  formatTime,
  isCurrentUserMessage,
} from "@/components/dashboard-utils";
import type { ChatMessage, CoachTone } from "@/types";

type TabAiChatProps = {
  chatMessages: ChatMessage[];
  chatInput: string;
  chatSubmitting: boolean;
  coachTone: CoachTone;
  onChatInputChange: (value: string) => void;
  onChatSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onQuickAction: (message: string) => Promise<void>;
  onOpenSettings: () => void;
};

export const TabAiChat = ({
  chatMessages,
  chatInput,
  chatSubmitting,
  coachTone,
  onChatInputChange,
  onChatSubmit,
  onQuickAction,
  onOpenSettings,
}: TabAiChatProps) => {
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ block: "end" });
  }, [chatMessages.length, chatSubmitting]);

  return (
    <section className="space-y-6">
      <div className="cream-card">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[24px] bg-[#edf1df] text-[#1e6c46] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Cat className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#18281e]">Chat with AI Cat</h2>
          <p className="mt-2 text-sm leading-7 text-[#617064]">
            Your feline performance strategist is ready for workout tweaks, recovery ideas, and plan changes.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="soft-chip capitalize">Coach tone: {coachTone}</span>
            <button type="button" onClick={onOpenSettings} className="soft-chip">
              <Settings2 className="h-3.5 w-3.5" />
              Coach settings
            </button>
          </div>
        </div>
      </div>

      <section className="chat-card">
        <div className="space-y-4">
          {chatMessages.length > 0 ? (
            chatMessages.map((message, index) => {
              const isUser = isCurrentUserMessage(message);

              return (
                <article
                  key={`${message.role}-${index}-${message.createdAt || "message"}`}
                  className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}
                >
                  <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                    <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
                  </div>
                  <span className="chat-meta">
                    {isUser ? "You" : "AI Cat"}
                    {message.createdAt ? ` · ${formatTime(message.createdAt)}` : ""}
                  </span>
                </article>
              );
            })
          ) : (
            <div className="empty-state">
              Ask something like “What should I do on a low-energy day?” and AI Cat will take it from there.
            </div>
          )}
          <div ref={bottomAnchorRef} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {QUICK_CHAT_ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => onQuickAction(action)}
              disabled={chatSubmitting}
              className="activity-pill"
            >
              {action}
            </button>
          ))}
        </div>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={onChatSubmit}>
          <input
            value={chatInput}
            onChange={(event) => onChatInputChange(event.target.value)}
            className="form-input flex-1"
            placeholder="Type a message to AI Cat..."
          />
          <button type="submit" disabled={chatSubmitting} className="primary-button sm:min-w-[170px]">
            <Send className="h-4 w-4" />
            {chatSubmitting ? "Thinking..." : "Send"}
          </button>
        </form>
      </section>
    </section>
  );
};
