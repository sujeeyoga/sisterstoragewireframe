import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Mail, Users, Search } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface WaitlistSignup {
  id: string;
  name: string;
  email: string;
  collection_name: string;
  created_at: string;
}

const WaitlistSignups = () => {
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: signups, isLoading } = useQuery({
    queryKey: ['waitlist-signups-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WaitlistSignup[];
    },
  });

  const { data: collections } = useQuery({
    queryKey: ['launch-cards-names'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('launch_cards')
        .select('collection_name')
        .order('collection_name');
      
      if (error) throw error;
      return data.map(c => c.collection_name);
    },
  });

  const filteredSignups = signups?.filter(signup => {
    const matchesCollection = selectedCollection === "all" || signup.collection_name === selectedCollection;
    const matchesSearch = searchQuery === "" || 
      signup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signup.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCollection && matchesSearch;
  });

  const exportToCSV = () => {
    if (!filteredSignups || filteredSignups.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Collection", "Date"];
    const rows = filteredSignups.map(signup => [
      signup.name,
      signup.email,
      signup.collection_name,
      format(new Date(signup.created_at), 'MMM d, yyyy h:mm a')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-signups-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("CSV exported successfully");
  };

  const collectionStats = collections?.map(collectionName => {
    const count = signups?.filter(s => s.collection_name === collectionName).length || 0;
    return { name: collectionName, count };
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const totalSignups = signups?.length || 0;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Waitlist</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {totalSignups} {totalSignups === 1 ? 'signup' : 'signups'}
          </p>
        </div>
        <Button 
          onClick={exportToCSV} 
          disabled={!filteredSignups || filteredSignups.length === 0}
          size="sm"
          className="sm:size-default"
        >
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Signups</p>
              <p className="text-3xl font-bold">{totalSignups}</p>
            </div>
            <Mail className="h-10 w-10 text-[hsl(var(--brand-pink))]" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedCollection} onValueChange={setSelectedCollection}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {collections?.map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSignups && filteredSignups.length > 0 ? (
                filteredSignups.map((signup) => (
                  <TableRow key={signup.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{signup.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {signup.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      <div className="hidden sm:block">
                        {format(new Date(signup.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div className="sm:hidden">
                        {format(new Date(signup.created_at), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground font-medium">No signups found</p>
                      {(searchQuery || selectedCollection !== "all") && (
                        <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default WaitlistSignups;
