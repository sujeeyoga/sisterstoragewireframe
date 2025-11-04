import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Download, RefreshCw, ShoppingCart, DollarSign, Clock, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ActiveCart {
  id: string;
  session_id: string;
  visitor_id: string | null;
  email: string | null;
  cart_items: CartItem[];
  subtotal: number;
  last_updated: string;
  created_at: string;
  country?: string;
  city?: string;
}

const AdminActiveCarts = () => {
  const navigate = useNavigate();
  const [selectedCart, setSelectedCart] = useState<ActiveCart | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [valueFilter, setValueFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<string>("last_updated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch active carts with visitor location data
  const { data: activeCarts = [], isLoading, refetch } = useQuery({
    queryKey: ["active-carts", valueFilter, timeFilter],
    queryFn: async () => {
      let query = supabase
        .from("active_carts")
        .select("*")
        .is("converted_at", null)
        .order("last_updated", { ascending: false });

      // Apply filters
      if (valueFilter === "high") {
        query = query.gte("subtotal", 50);
      } else if (valueFilter === "medium") {
        query = query.gte("subtotal", 20).lt("subtotal", 50);
      } else if (valueFilter === "low") {
        query = query.lt("subtotal", 20);
      }

      if (timeFilter === "recent") {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        query = query.gte("last_updated", fiveMinutesAgo);
      } else if (timeFilter === "active") {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        query = query.gte("last_updated", thirtyMinutesAgo);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Enrich with visitor location data
      const enrichedData = await Promise.all(
        (data || []).map(async (cart) => {
          const { data: visitorData } = await supabase
            .from("visitor_analytics")
            .select("country, city")
            .eq("session_id", cart.session_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...cart,
            cart_items: (Array.isArray(cart.cart_items) ? cart.cart_items : []) as unknown as CartItem[],
            country: visitorData?.country,
            city: visitorData?.city,
          } as ActiveCart;
        })
      );

      return enrichedData;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Sort carts
  const sortedCarts = [...activeCarts].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case "email":
        aValue = a.email || "";
        bValue = b.email || "";
        break;
      case "items":
        aValue = a.cart_items.length;
        bValue = b.cart_items.length;
        break;
      case "subtotal":
        aValue = Number(a.subtotal);
        bValue = Number(b.subtotal);
        break;
      case "location":
        aValue = a.city && a.country ? `${a.city}, ${a.country}` : a.country || "";
        bValue = b.city && b.country ? `${b.city}, ${b.country}` : b.country || "";
        break;
      case "last_updated":
        aValue = new Date(a.last_updated).getTime();
        bValue = new Date(b.last_updated).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalValue = activeCarts.reduce((sum, cart) => sum + Number(cart.subtotal), 0);
  const activeCount = activeCarts.length;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleExportCSV = () => {
    const headers = ["Email", "Items Count", "Subtotal", "Location", "Last Updated", "Created"];
    const rows = activeCarts.map((cart) => [
      cart.email || "Guest",
      cart.cart_items.length,
      `$${Number(cart.subtotal).toFixed(2)}`,
      cart.city && cart.country ? `${cart.city}, ${cart.country}` : cart.country || "Unknown",
      new Date(cart.last_updated).toLocaleString(),
      new Date(cart.created_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `active-carts-${new Date().toISOString()}.csv`;
    a.click();
  };

  const openCartDetails = (cart: ActiveCart) => {
    setSelectedCart(cart);
    setDrawerOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/analytics")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Active Carts</h1>
              <p className="text-muted-foreground">Real-time shoppers with items in cart</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shoppers</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">With items in cart right now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cart Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Combined value of all active carts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Cart Value</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${activeCount > 0 ? (totalValue / activeCount).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">Per active shopper</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter active carts by value and activity time</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Cart Value</label>
              <Select value={valueFilter} onValueChange={setValueFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Values</SelectItem>
                  <SelectItem value="high">High (&gt;$50)</SelectItem>
                  <SelectItem value="medium">Medium ($20-$50)</SelectItem>
                  <SelectItem value="low">Low (&lt;$20)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Activity Time</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="recent">Last 5 minutes</SelectItem>
                  <SelectItem value="active">Last 30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Active Carts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Carts ({activeCount})</CardTitle>
            <CardDescription>Shoppers currently browsing with items in cart</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading active carts...</div>
            ) : activeCarts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active carts at the moment
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        Shopper
                        <SortIcon column="email" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort("items")}
                    >
                      <div className="flex items-center">
                        Items
                        <SortIcon column="items" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort("subtotal")}
                    >
                      <div className="flex items-center">
                        Cart Value
                        <SortIcon column="subtotal" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center">
                        Location
                        <SortIcon column="location" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort("last_updated")}
                    >
                      <div className="flex items-center">
                        Last Activity
                        <SortIcon column="last_updated" />
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCarts.map((cart) => (
                    <TableRow key={cart.id}>
                      <TableCell>
                        {cart.email || (
                          <span className="text-muted-foreground italic">Guest</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{cart.cart_items.length} items</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(cart.subtotal).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {cart.city && cart.country
                          ? `${cart.city}, ${cart.country}`
                          : cart.country || (
                              <span className="text-muted-foreground">Unknown</span>
                            )}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(cart.last_updated), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCartDetails(cart)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cart Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCart && (
            <>
              <SheetHeader>
                <SheetTitle>Cart Details</SheetTitle>
                <SheetDescription>
                  Last updated {formatDistanceToNow(new Date(selectedCart.last_updated), { addSuffix: true })}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Shopper Info */}
                <div>
                  <h3 className="font-semibold mb-2">Shopper Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedCart.email || "Guest"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>
                        {selectedCart.city && selectedCart.country
                          ? `${selectedCart.city}, ${selectedCart.country}`
                          : selectedCart.country || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session Started:</span>
                      <span>{new Date(selectedCart.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div>
                  <h3 className="font-semibold mb-2">Cart Items</h3>
                  <div className="space-y-3">
                    {selectedCart.cart_items.map((item, index: number) => (
                      <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          ${(item.quantity * Number(item.price)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Subtotal</span>
                    <span className="text-xl font-bold">
                      ${Number(selectedCart.subtotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminActiveCarts;
