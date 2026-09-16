import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { supabase } from '@/integrations/supabase/client';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
import assistantMark from '@/assets/admin-assistant-mark.png';

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-assistant`;

const TOOL_LABELS: Record<string, string> = {
  'tool-lookup_order': 'Looked up an order',
  'tool-store_metrics': 'Checked store numbers',
  'tool-lookup_product': 'Looked up a product',
};

const SUGGESTIONS = [
  'How do I fulfill an order?',
  'What are our shipping prices right now?',
  'How many orders are awaiting fulfillment?',
  'How do I turn the announcement banner on?',
];

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
}

export function AdminAssistantChat({ className }: AdminAssistantChatProps) {
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status } = useChat({
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

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setErrorMessage(null);
    setInput('');
    sendMessage({ text: trimmed });
  };

  return (
    <div className={`flex h-full min-h-0 flex-col ${className ?? ''}`}>
      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <img
                src={assistantMark}
                alt="Sister Storage admin assistant"
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
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => submit(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent
                  className={message.role === 'assistant' ? 'bg-transparent p-0' : undefined}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return <MessageResponse key={index}>{part.text}</MessageResponse>;
                    }
                    if (part.type.startsWith('tool-')) {
                      const toolPart = part as any;
                      return (
                        <Tool key={index} defaultOpen={false} className="my-2">
                          <ToolHeader
                            type={toolPart.type}
                            title={TOOL_LABELS[part.type] ?? 'Checked the store'}
                            state={toolPart.state}
                          />
                          <ToolContent>
                            <ToolInput input={toolPart.input} />
                            <ToolOutput output={toolPart.output} errorText={toolPart.errorText} />
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
            ))

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

      <div className="mx-auto w-full max-w-3xl shrink-0 px-1 pb-1 pt-2">
        <PromptInput
          onSubmit={(_message, event) => {
            event.preventDefault();
            submit(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask how something works, or about an order..."
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!input.trim() && !isBusy} />
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
