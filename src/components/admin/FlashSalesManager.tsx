import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Zap } from 'lucide-react';
import { useFlashSales, useDeleteFlashSale, FlashSale } from '@/hooks/useFlashSales';
import { FlashSaleForm } from './FlashSaleForm';
import { FlashSaleStatusBadge } from './FlashSaleStatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

export const FlashSalesManager = () => {
  const { data: sales, isLoading } = useFlashSales();
  const deleteMutation = useDeleteFlashSale();
  const [formOpen, setFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const [deletingSale, setDeletingSale] = useState<FlashSale | null>(null);

  const handleEdit = (sale: FlashSale) => {
    setEditingSale(sale);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (deletingSale) {
      await deleteMutation.mutateAsync(deletingSale.id);
      setDeletingSale(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingSale(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Flash Sales
              </CardTitle>
              <CardDescription>
                Create and manage limited-time sales campaigns
              </CardDescription>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sale
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading sales...</div>
          ) : !sales || sales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No flash sales yet. Create your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Applies To</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <FlashSaleStatusBadge sale={sale} />
                    </TableCell>
                    <TableCell className="font-medium">{sale.name}</TableCell>
                    <TableCell>
                      {sale.discount_type === 'percentage' && `${sale.discount_value}% OFF`}
                      {sale.discount_type === 'fixed_amount' && `$${sale.discount_value} OFF`}
                      {sale.discount_type === 'bogo' && 'BOGO'}
                    </TableCell>
                    <TableCell className="capitalize">{sale.applies_to}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(sale.starts_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(sale.ends_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>{sale.priority}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(sale)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingSale(sale)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <FlashSaleForm
        open={formOpen}
        onOpenChange={handleFormClose}
        sale={editingSale}
      />

      <AlertDialog open={!!deletingSale} onOpenChange={() => setDeletingSale(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flash Sale</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSale?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
