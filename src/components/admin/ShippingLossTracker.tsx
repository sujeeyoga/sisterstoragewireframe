import { useState } from "react";
import { useShippingLossDetails } from "@/hooks/useShippingLossDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { AlertCircle, TrendingDown, TrendingUp, Package, DollarSign } from "lucide-react";
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

  const { data, isLoading, error } = useShippingLossDetails({
    startDate,
    endDate,
    zoneFilter,
    lossFilter,
    searchQuery,
  });

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

      {!hasData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No shipping cost data available yet. Stallion costs will be tracked automatically when you fulfill orders through the Stallion integration.
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
                  <TableHead className="text-right">Actual Cost</TableHead>
                  <TableHead className="text-right">Charged</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No orders found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const isLoss = order.difference > 0;
                    const isGain = order.difference < 0;
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
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
                        <TableCell className="text-right font-medium text-red-600">
                          ${order.actualCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ${order.charged.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
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
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
