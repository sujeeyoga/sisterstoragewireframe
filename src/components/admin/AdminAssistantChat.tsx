import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { supabase } from '@/integrations/supabase/client';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { isApprovedAdminRoute, labelForAdminRoute } from '@/config/adminAssistantRoutes';
import assistantMark from '@/assets/admin-assistant-mark.png';
import { AssistantHeader } from './assistant/AssistantHeader';
import { AssistantAnswerCard, type AnswerCardData } from './assistant/AssistantAnswerCard';
import { QuickReplies } from './assistant/QuickReplies';
import { MessageMeta } from './assistant/MessageMeta';

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-assistant`;

const TOOL_LABELS: Record<string, string> = {
  'tool-lookup_order': 'Looked up an order',
  'tool-store_metrics': 'Checked store numbers',
  'tool-lookup_product': 'Looked up a product',
  'tool-find_admin_page': 'Found the right admin page',
};

const STARTER_SUGGESTIONS = [
  'How do I fulfill an order?',
  'What are our shipping prices right now?',
  'Where do I change the homepage banner?',
  'How do I turn the announcement banner on?',
];

const FOLLOW_UP_SUGGESTIONS = [
  'Check recent orders',
  'Update shipping',
  'View product stock',
];

/** Collect approved internal admin links from this message's tool results only. */
function collectActions(parts: any[]): string[] {
  const hrefs: string[] = [];
  const walk = (value: any, depth = 0) => {
    if (!value || depth > 6) return;
    if (Array.isArray(value)) {
      value.forEach((v) => walk(v, depth + 1));
      return;
    }
    if (typeof value !== 'object') return;
    for (const key of ['adminUrl', 'route']) {
      const candidate = (value as any)[key];
      if (isApprovedAdminRoute(candidate)) hrefs.push(candidate);
    }
    Object.values(value).forEach((v) => walk(v, depth + 1));
  };

  for (const part of parts) {
    if (typeof part?.type === 'string' && part.type.startsWith('tool-') && part.type !== 'tool-answer_card') {
      walk(part.output);
    }
  }
  return Array.from(new Set(hrefs)).slice(0, 3);
}

function AssistantActions({
  parts,
  onNavigate,
}: {
  parts: any[];
  onNavigate?: () => void;
}) {
  const actions = collectActions(parts);
  if (actions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((href, i) => (
        <Button
          key={href}
          asChild
          size="sm"
          variant={i === 0 ? 'default' : 'outline'}
          className="gap-1"
        >
          <Link to={href} onClick={onNavigate}>
            {labelForAdminRoute(href).replace(/\s*→$/, '')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      ))}
    </div>
  );
}

const authedFetch: typeof fetch = async (input, init) => {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init?.headers);
  if (data.session?.access_token) {
    headers.set('Authorization', `Bearer ${data.session.access_token}`);
  }
  return fetch(input, { ...init, headers });
};

interface AdminAssistantChatProps {
  className?: string;
  /** Called when the admin clicks a navigation button (used to close the bubble). */
  onNavigate?: () => void;
  /** Close button in the header (bubble only). */
  onClose?: () => void;
  /** Show "Open full page" in the header menu (bubble only). */
  fullPageLink?: boolean;
}

export function AdminAssistantChat({
  className,
  onNavigate,
  onClose,
  fullPageLink,
}: AdminAssistantChatProps) {
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const timesRef = useRef<Map<string, Date>>(new Map());

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: ENDPOINT, fetch: authedFetch }),
    onError: (error) => {
      const raw = error?.message || '';
      if (raw.includes('401')) setErrorMessage('Please sign in to the admin again.');
      else if (raw.includes('403')) setErrorMessage('You need admin access to use the assistant.');
      else if (raw.includes('429')) setErrorMessage('Too many questions at once — try again in a moment.');
      else if (raw.includes('402')) setErrorMessage('The AI allowance has run out. Add credits to keep using the assistant.');
      else setErrorMessage('The assistant could not answer just now. Please try again.');
    },
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (!isBusy) textareaRef.current?.focus();
  }, [isBusy]);

  const timeFor = (id: string) => {
    let t = timesRef.current.get(id);
    if (!t) {
      t = new Date();
      timesRef.current.set(id, t);
    }
    return t;
  };

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setErrorMessage(null);
    setInput('');
    sendMessage({ text: trimmed });
  };

  const clearConversation = () => {
    timesRef.current.clear();
    setErrorMessage(null);
    setMessages([]);
    setInput('');
  };

  const quickReplies = messages.length === 0 ? STARTER_SUGGESTIONS : FOLLOW_UP_SUGGESTIONS;

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-assistant-surface ${className ?? ''}`}
    >
      <AssistantHeader
        onClear={messages.length > 0 ? clearConversation : undefined}
        onClose={onClose}
        fullPageLink={fullPageLink}
        onNavigate={onNavigate}
      />

      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <img
                src={assistantMark}
                alt="Sister Storage store assistant"
                width={64}
                height={64}
                loading="lazy"
                className="h-16 w-16"
              />
              <div>
                <h2 className="text-lg font-semibold">Ask me about the back end</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  How things work, where to click, and live order or product info.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const hasCard = message.parts.some((p: any) => p.type === 'tool-answer_card');
              return (
                <div key={message.id}>
                  <Message from={message.role}>
                    {message.role === 'assistant' && (
                      <img
                        src={assistantMark}
                        alt=""
                        width={28}
                        height={28}
                        className="mt-1 h-7 w-7 shrink-0 rounded-full"
                      />
                    )}
                    <MessageContent
                      className={message.role === 'assistant' ? 'bg-transparent p-0' : undefined}
                    >
                      {message.parts.map((part: any, index: number) => {
                        if (part.type === 'text') {
                          if (hasCard && message.role === 'assistant') return null;
                          return <MessageResponse key={index}>{part.text}</MessageResponse>;
                        }
                        if (part.type === 'tool-answer_card') {
                          const card = (part.output ?? part.input) as AnswerCardData | undefined;
                          if (!card || !card.title) return null;
                          return (
                            <AssistantAnswerCard
                              key={index}
                              card={card}
                              onNavigate={onNavigate}
                            />
                          );
                        }
                        if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
                          return (
                            <Tool key={index} defaultOpen={false} className="my-2">
                              <ToolHeader
                                type={part.type}
                                title={TOOL_LABELS[part.type] ?? 'Checked the store'}
                                state={part.state}
                              />
                              <ToolContent>
                                <ToolInput input={part.input} />
                                <ToolOutput output={part.output} errorText={part.errorText} />
                              </ToolContent>
                            </Tool>
                          );
                        }
                        return null;
                      })}

                      {message.role === 'assistant' && (
                        <AssistantActions parts={message.parts} onNavigate={onNavigate} />
                      )}
                    </MessageContent>
                  </Message>
                  <MessageMeta
                    time={timeFor(message.id)}
                    align={message.role === 'user' ? 'right' : 'left'}
                  />
                </div>
              );
            })
          )}

          {status === 'submitted' && (
            <div className="px-1 py-2">
              <Shimmer>Thinking...</Shimmer>
            </div>
          )}

          {errorMessage && (
            <div className="mx-1 my-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 pt-2">
        <QuickReplies
          items={quickReplies}
          onPick={submit}
          disabled={isBusy}
          className="mb-2 justify-start"
        />
        <PromptInput
          className="rounded-2xl"
          onSubmit={(_message, event) => {
            event.preventDefault();
            submit(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about an order or store setting..."
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              className="rounded-full"
              status={status}
              disabled={!input.trim() && !isBusy}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Read-only helper. It never changes orders, prices or settings.
        </p>
      </div>
    </div>
  );
}

export default AdminAssistantChat;
