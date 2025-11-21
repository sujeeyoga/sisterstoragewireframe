import React, { useState } from 'react';
import { Star, Check, X, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useProductReviews } from '@/hooks/useProductReviews';
import { format } from 'date-fns';
import { products } from '@/data/products';

const ReviewsManager: React.FC = () => {
  const { allReviews, isLoadingAll, updateReviewStatus, deleteReview } = useProductReviews();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const filteredReviews = allReviews?.filter((review) => {
    const statusMatch = selectedStatus === 'all' || review.status === selectedStatus;
    const ratingMatch = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    return statusMatch && ratingMatch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getProductName = (productId: number) => {
    const product = products.find((p) => Number(p.id) === productId);
    return product?.name || `Product #${productId}`;
  };

  const handleApprove = (review: any) => {
    updateReviewStatus({
      review_id: review.id,
      status: 'approved',
      product_name: getProductName(review.product_id),
      customer_email: review.customer_email,
      customer_name: review.customer_name,
      rating: review.rating,
      review_text: review.review_text,
    });
  };

  const handleReject = (review: any) => {
    updateReviewStatus({
      review_id: review.id,
      status: 'rejected',
      product_name: getProductName(review.product_id),
      customer_email: review.customer_email,
      customer_name: review.customer_name,
      rating: review.rating,
      review_text: review.review_text,
    });
  };

  const pendingCount = allReviews?.filter((r) => r.status === 'pending').length || 0;
  const approvedCount = allReviews?.filter((r) => r.status === 'approved').length || 0;
  const rejectedCount = allReviews?.filter((r) => r.status === 'rejected').length || 0;

  if (isLoadingAll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews Management</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-sm">
              <Badge variant="outline">{pendingCount} Pending</Badge>
              <Badge variant="outline">{approvedCount} Approved</Badge>
              <Badge variant="outline">{rejectedCount} Rejected</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedStatus} onValueChange={(v: any) => setSelectedStatus(v)}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="pending">
                Pending {pendingCount > 0 && `(${pendingCount})`}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
            </TabsList>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value={selectedStatus} className="space-y-4">
            {!filteredReviews || filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No reviews found</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge
                              variant={
                                review.status === 'approved'
                                  ? 'default'
                                  : review.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {review.status}
                            </Badge>
                            {review.verified_purchase && (
                              <Badge variant="outline">
                                <Check className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                            {renderStars(review.rating)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {review.customer_name}
                            </span>{' '}
                            ({review.customer_email}) •{' '}
                            {format(new Date(review.created_at), 'MMM d, yyyy HH:mm')}
                          </div>
                          <div className="text-sm font-medium">
                            Product: {getProductName(review.product_id)}
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="space-y-2">
                        {review.review_title && (
                          <h4 className="font-semibold text-foreground">
                            {review.review_title}
                          </h4>
                        )}
                        <p className="text-muted-foreground leading-relaxed">
                          {review.review_text}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {review.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(review)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(review)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {review.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(review)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Unpublish
                          </Button>
                        )}
                        {review.status === 'rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(review)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this review. This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteReview(review.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReviewsManager;
