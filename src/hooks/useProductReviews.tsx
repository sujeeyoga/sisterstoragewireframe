import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductReview {
  id: string;
  product_id: number;
  order_id: string | null;
  customer_email: string;
  customer_name: string;
  rating: number;
  review_title: string | null;
  review_text: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  helpful_count: number;
  verified_purchase: boolean;
}

export const useProductReviews = (productId?: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch approved reviews for a product
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProductReview[];
    },
    enabled: !!productId,
  });

  // Fetch all reviews (admin only)
  const { data: allReviews, isLoading: isLoadingAll } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProductReview[];
    },
  });

  // Submit a new review
  const submitReview = useMutation({
    mutationFn: async (reviewData: {
      product_id: number;
      product_name: string;
      customer_email: string;
      customer_name: string;
      rating: number;
      review_title?: string;
      review_text: string;
      order_id?: string;
    }) => {
      // First, check if customer has a fulfilled order for verification
      let verified_purchase = false;
      
      if (reviewData.customer_email) {
        const { data: orders } = await supabase
          .from('orders')
          .select('id, fulfillment_status, items')
          .eq('customer_email', reviewData.customer_email)
          .eq('fulfillment_status', 'fulfilled');

        if (orders && orders.length > 0) {
          verified_purchase = true;
        }
      }

      // Insert the review
      const { data: review, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: reviewData.product_id,
          order_id: reviewData.order_id || null,
          customer_email: reviewData.customer_email,
          customer_name: reviewData.customer_name,
          rating: reviewData.rating,
          review_title: reviewData.review_title || null,
          review_text: reviewData.review_text,
          verified_purchase,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification emails
      try {
        await supabase.functions.invoke('send-review-notification', {
          body: {
            review_id: review.id,
            customer_email: reviewData.customer_email,
            customer_name: reviewData.customer_name,
            product_name: reviewData.product_name,
            rating: reviewData.rating,
            review_text: reviewData.review_text,
            notification_type: 'submission',
          },
        });
      } catch (emailError) {
        console.error('Failed to send review notification:', emailError);
        // Don't fail the review submission if email fails
      }

      return review;
    },
    onSuccess: () => {
      toast({
        title: 'Review Submitted!',
        description: 'Thank you! Your review will be published once approved.',
      });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Submit Review',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update review status (approve/reject)
  const updateReviewStatus = useMutation({
    mutationFn: async ({
      review_id,
      status,
      product_name,
      customer_email,
      customer_name,
      rating,
      review_text,
    }: {
      review_id: string;
      status: 'approved' | 'rejected';
      product_name: string;
      customer_email: string;
      customer_name: string;
      rating: number;
      review_text: string;
    }) => {
      const { data, error } = await supabase
        .from('product_reviews')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', review_id)
        .select()
        .single();

      if (error) throw error;

      // Send approval email if approved
      if (status === 'approved') {
        try {
          await supabase.functions.invoke('send-review-notification', {
            body: {
              review_id,
              customer_email,
              customer_name,
              product_name,
              rating,
              review_text,
              notification_type: 'approval',
            },
          });
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
        }
      }

      return data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.status === 'approved' ? 'Review Approved' : 'Review Rejected',
        description: `Review has been ${variables.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Update Review',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a review
  const deleteReview = useMutation({
    mutationFn: async (review_id: string) => {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', review_id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Review Deleted',
        description: 'Review has been permanently deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Delete Review',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Calculate average rating
  const averageRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    allReviews,
    isLoading,
    isLoadingAll,
    averageRating,
    totalReviews: reviews?.length || 0,
    submitReview: submitReview.mutate,
    isSubmitting: submitReview.isPending,
    updateReviewStatus: updateReviewStatus.mutate,
    deleteReview: deleteReview.mutate,
  };
};
