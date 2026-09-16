import { AdminAssistantChat } from '@/components/admin/AdminAssistantChat';

const AdminAssistant = () => {
  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-[1400px] flex-col px-4 py-4 md:px-6">
      <header className="shrink-0 pb-2">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask how to use the back end, or look up live orders, products and numbers.
        </p>
      </header>
      <div className="min-h-0 flex-1 rounded-lg border bg-background p-2 md:p-4">
        <AdminAssistantChat />
      </div>
    </div>
  );
};

export default AdminAssistant;
