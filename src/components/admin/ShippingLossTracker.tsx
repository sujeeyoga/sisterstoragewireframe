import { useState, useEffect } from "react";
import { useShippingLossDetails } from "@/hooks/useShippingLossDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderDrawer } from "./OrderDrawer";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, TrendingDown, TrendingUp, Package, DollarSign, Info, Gift } from "lucide-react";
import { format } from "date-fns";

interface ShippingLossTrackerProps {
  startDate: Date;
  endDate: Date;
}

const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const ShippingLossTracker = ({ startDate, endDate }: ShippingLossTrackerProps) => {
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [lossFilter, setLossFilter] = useState<"all" | "loss" | "gain">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isLoading, error } = useShippingLossDetails({
    startDate,
    endDate,
    zoneFilter,
    lossFilter,
    searchQuery,
  });

  // Fetch full order details when an order is selected
  useEffect(() => {
    if (!selectedOrderId) {
      setSelectedOrder(null);
      return;
    }

    const fetchOrder = async () => {
      // Check if it's a WooCommerce order (numeric ID)
      const isWooOrder = !isNaN(Number(selectedOrderId));

      if (isWooOrder) {
        const { data: order } = await supabase
          .from("woocommerce_orders")
          .select("*")
          .eq("id", Number(selectedOrderId))
          .single();
        setSelectedOrder(order);
      } else {
        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("id", selectedOrderId)
          .single();
        setSelectedOrder(order);
      }
    };

    fetchOrder();
  }, [selectedOrderId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load shipping loss data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const { orders, stats } = data;
  const hasData = orders.length > 0;

  // Get unique zones for filter
  const uniqueZones = Array.from(new Set(orders.map((o) => o.zone).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loss
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -${stats.totalLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {stats.ordersWithLoss} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Loss
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.averageLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per loss order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Biggest Loss
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.biggestLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Single order maximum
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toronto/GTA Loss
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              -${stats.torontoGTALoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.torontoGTAOrders} orders in free zone
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Free Shipping Given
            </CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalDiscountsGiven.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.freeShippingOrders} orders · Avg ${stats.avgDiscount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {!hasData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No orders found in the selected date range.
          </AlertDescription>
        </Alert>
      )}

      {hasData && stats.ordersWithLoss === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Stallion costs will be tracked automatically when you fulfill orders through the Stallion integration. Orders shown below are missing actual shipping cost data.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="col-span-2">
              <Input
                placeholder="Search by order #, email, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {uniqueZones.map((zone) => (
                  <SelectItem key={zone} value={zone || "unknown"}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={lossFilter} onValueChange={(v) => setLossFilter(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="loss">Only Losses</SelectItem>
                <SelectItem value="gain">Only Gains</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details ({orders.length} orders)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actual Cost</TableHead>
                  <TableHead className="text-right">Charged</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No orders found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  <TooltipProvider>
                    {orders.map((order) => {
                      const isLoss = order.difference > 0;
                      const isGain = order.difference < 0;
                      const missingCost = !order.hasStallionCost;
                      const highLoss = order.difference > 20;
                      
                      return (
                        <TableRow 
                          key={order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                          className={`cursor-pointer ${
                            order.wasFreeShipping 
                              ? "bg-green-50/50 hover:bg-green-50" 
                              : highLoss 
                              ? "bg-red-50/50 hover:bg-red-50"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {order.orderNumber}
                              {order.wasFreeShipping && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                                  🎉 Free
                                </Badge>
                              )}
                              {missingCost && (
                                <Badge variant="outline" className="text-xs">
                                  No Cost Data
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{order.customerName}</span>
                              <span className="text-xs text-muted-foreground">
                                {order.customerEmail}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">
                                {getCountryFlag(order.country)}
                              </span>
                              <span className="text-sm">{order.city}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{order.zone}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={order.fulfillmentStatus === "fulfilled" ? "default" : "outline"}
                              className={order.fulfillmentStatus === "fulfilled" ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              {order.fulfillmentStatus === "fulfilled" ? "Fulfilled" : "Unfulfilled"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {missingCost ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className="text-red-600">${order.actualCost.toFixed(2)}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {order.wasFreeShipping ? (
                              <div className="flex flex-col items-end gap-0.5">
                                <span className="line-through text-muted-foreground text-xs">
                                  ${order.originalRate.toFixed(2)}
                                </span>
                                <span className="text-green-600 font-bold text-sm">FREE</span>
                              </div>
                            ) : (
                              <span className="text-green-600">${order.charged.toFixed(2)}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {order.wasFreeShipping ? (
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                💰 ${order.discountApplied.toFixed(2)}
                              </Badge>
                            ) : order.meetsThreshold ? (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                Qualified
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {missingCost ? (
                              <span className="text-muted-foreground text-sm">No data</span>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center justify-end gap-1 cursor-help">
                                    {isLoss && (
                                      <TrendingDown className="h-4 w-4 text-red-600" />
                                    )}
                                    {isGain && (
                                      <TrendingUp className="h-4 w-4 text-green-600" />
                                    )}
                                    <span
                                      className={`font-bold ${
                                        isLoss
                                          ? "text-red-600"
                                          : isGain
                                          ? "text-green-600"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {isLoss ? "-" : isGain ? "+" : ""}$
                                      {Math.abs(order.difference).toFixed(2)}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs max-w-[250px]">
                                  <div className="space-y-1">
                                    <p className="font-semibold">Loss Breakdown:</p>
                                    <p>• You paid Stallion: ${order.actualCost.toFixed(2)}</p>
                                    <p>• Customer paid: ${order.charged.toFixed(2)}{order.wasFreeShipping ? " (free shipping)" : ""}</p>
                                    <p>• Your {isLoss ? "loss" : "gain"}: ${Math.abs(order.difference).toFixed(2)}</p>
                                    {order.wasFreeShipping && (
                                      <p className="pt-1 border-t mt-1">• Discount given: ${order.discountApplied.toFixed(2)}</p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TooltipProvider>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          open={!!selectedOrderId}
          onClose={() => {
            setSelectedOrderId(null);
            setSelectedOrder(null);
          }}
          onStatusUpdate={() => {
            // Refresh data when order status changes
            setSelectedOrderId(null);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};
