import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomerList } from '@/hooks/useCustomerList';
import { Search, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const CustomerListView = () => {
  const { customers, isLoading } = useCustomerList();
  const [search, setSearch] = useState('');

  const filteredCustomers = customers?.filter(customer =>
    customer.customer_email.toLowerCase().includes(search.toLowerCase()) ||
    customer.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading customers...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
        <CardDescription>
          {customers?.length || 0} unique customers from all orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers?.map((customer) => (
                <TableRow key={customer.customer_email}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.customer_name || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.customer_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{customer.order_count}</TableCell>
                  <TableCell className="font-medium">
                    ${customer.total_spent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(customer.last_order_date), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
