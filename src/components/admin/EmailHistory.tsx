import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Search, Mail, CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface EmailLog {
  id: string;
  created_at: string;
  order_id: string | null;
  recipient_email: string;
  email_type: string;
  subject: string | null;
  sent_successfully: boolean;
  error_message: string | null;
  email_data: any;
  sent_by: string | null;
}

export const EmailHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: emailLogs, isLoading, refetch } = useQuery({
    queryKey: ["emailLogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_logs")
        .select(`
          *,
          orders(order_number)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  const filteredLogs = emailLogs?.filter((log) =>
    log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.subject && log.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (log: EmailLog) => {
    setSelectedEmail(log);
    setDetailsOpen(true);
  };

  const handleResend = async (log: EmailLog) => {
    if (!log.order_id) {
      toast.error("Cannot resend: No order ID associated with this email");
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("resend-order-confirmation", {
        body: { orderId: log.order_id },
      });

      if (error) throw error;

      toast.success("Email resent successfully");
      refetch();
    } catch (error: any) {
      console.error("Failed to resend email:", error);
      toast.error(error.message || "Failed to resend email");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading email history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, type, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        {filteredLogs && filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {log.sent_successfully ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium truncate">{log.recipient_email}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.email_type}
                      </Badge>
                    </div>
                    {log.subject && (
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {log.subject}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{format(new Date(log.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
                      {(log as any).orders?.order_number && (
                        <span>Order #{(log as any).orders.order_number}</span>
                      )}
                    </div>
                    {log.error_message && (
                      <p className="text-xs text-destructive mt-1">
                        Error: {log.error_message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(log)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {log.order_id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResend(log)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Resend
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No email history found</p>
          </Card>
        )}
      </div>

      {/* Email Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>
              Complete information about this sent email
            </DialogDescription>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recipient</p>
                  <p className="text-sm">{selectedEmail.recipient_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <Badge variant="outline">{selectedEmail.email_type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent At</p>
                  <p className="text-sm">
                    {format(new Date(selectedEmail.created_at), "MMM d, yyyy 'at' h:mm:ss a")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedEmail.sent_successfully ? "default" : "destructive"}>
                    {selectedEmail.sent_successfully ? "Success" : "Failed"}
                  </Badge>
                </div>
              </div>

              {selectedEmail.subject && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Subject</p>
                  <p className="text-sm">{selectedEmail.subject}</p>
                </div>
              )}

              {selectedEmail.error_message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Error Message</p>
                  <Card className="p-3 bg-destructive/10">
                    <p className="text-sm text-destructive">{selectedEmail.error_message}</p>
                  </Card>
                </div>
              )}

              {selectedEmail.email_data && Object.keys(selectedEmail.email_data).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email Data</p>
                  <Card className="p-3 bg-muted/50">
                    <pre className="text-xs overflow-auto max-h-60">
                      {JSON.stringify(selectedEmail.email_data, null, 2)}
                    </pre>
                  </Card>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
