import { AdminAssistantChat } from '@/components/admin/AdminAssistantChat';

const AdminAssistant = () => {
  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-[1400px] flex-col px-4 py-4 md:px-6">
      <div className="min-h-0 flex-1">
        <AdminAssistantChat />
      </div>
    </div>
  );
};

export default AdminAssistant;
