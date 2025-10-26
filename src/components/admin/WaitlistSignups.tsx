import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Waitlist Signups</h1>
          <p className="text-muted-foreground">
            {filteredSignups?.length || 0} total signups
          </p>
        </div>
        <Button onClick={exportToCSV} disabled={!filteredSignups || filteredSignups.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Collection Stats Cards */}
      {collectionStats && collectionStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionStats.map(stat => (
            <div key={stat.name} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">{stat.name}</h3>
              </div>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm text-muted-foreground">signups</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCollection} onValueChange={setSelectedCollection}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {collections?.map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Signup Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSignups && filteredSignups.length > 0 ? (
                filteredSignups.map((signup) => (
                  <TableRow key={signup.id}>
                    <TableCell className="font-medium">{signup.name}</TableCell>
                    <TableCell>{signup.email}</TableCell>
                    <TableCell>{signup.collection_name}</TableCell>
                    <TableCell>
                      {format(new Date(signup.created_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No signups found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default WaitlistSignups;
