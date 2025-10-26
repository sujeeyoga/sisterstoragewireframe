import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Mail, Users, Search, Calendar, Filter } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  const totalSignups = signups?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waitlist Signups</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Users className="h-4 w-4" />
            {totalSignups} total {totalSignups === 1 ? 'signup' : 'signups'}
          </p>
        </div>
        <Button 
          onClick={exportToCSV} 
          disabled={!filteredSignups || filteredSignups.length === 0}
          variant="default"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Collection Stats Cards */}
      {collectionStats && collectionStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionStats.map(stat => (
            <Card key={stat.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{stat.name}</CardTitle>
                  <Mail className="h-5 w-5 text-[hsl(var(--brand-pink))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">
                    {stat.count === 1 ? 'signup' : 'signups'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No collections have signups yet</p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter and search through {filteredSignups?.length || 0} signups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[250px]">
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      All Collections
                    </div>
                  </SelectItem>
                  {collections?.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Calendar className="h-4 w-4" />
                  Signup Date
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSignups && filteredSignups.length > 0 ? (
              filteredSignups.map((signup) => (
                <TableRow key={signup.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[hsl(var(--brand-pink))]/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-[hsl(var(--brand-pink))]" />
                      </div>
                      {signup.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {signup.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{signup.collection_name}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(signup.created_at), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">No signups found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || selectedCollection !== "all" 
                        ? "Try adjusting your filters" 
                        : "Waiting for signups to come in"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default WaitlistSignups;
