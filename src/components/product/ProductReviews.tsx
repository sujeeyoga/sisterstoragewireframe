import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useProductReviews } from '@/hooks/useProductReviews';
import { useReviewSettings } from '@/hooks/useReviewSettings';
import ReviewSubmissionForm from './ReviewSubmissionForm';
import { format } from 'date-fns';

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const { reviews, averageRating, totalReviews, isLoading } = useProductReviews(productId);
  const { reviewSettings } = useReviewSettings();
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!reviewSettings?.enabled) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full py-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
    );
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {!showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                size="sm"
                className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
              >
                Write a Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalReviews > 0 ? (
            <>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[hsl(var(--brand-pink))]">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="mt-2">{renderStars(Math.round(averageRating))}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </div>
                </div>

                <Separator orientation="vertical" className="h-24" />

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews?.filter((r) => r.rating === rating).length || 0;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Submission Form */}
      {showReviewForm && (
        <ReviewSubmissionForm
          productId={productId}
          productName={productName}
          onCancel={() => setShowReviewForm(false)}
          onSuccess={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      {totalReviews > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Customer Feedback</h3>
          {reviews?.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          {review.verified_purchase && (
                            <Badge variant="secondary" className="text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">{review.customer_name}</span>
                        <span>•</span>
                        <span>{format(new Date(review.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  {review.review_title && (
                    <h4 className="font-semibold text-foreground">{review.review_title}</h4>
                  )}

                  <p className="text-muted-foreground leading-relaxed">
                    {review.review_text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
