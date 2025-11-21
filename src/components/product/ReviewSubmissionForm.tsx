import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProductReviews } from '@/hooks/useProductReviews';
import { z } from 'zod';

interface ReviewSubmissionFormProps {
  productId: number;
  productName: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const reviewSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().trim().max(100).optional(),
  review: z.string().trim().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
});

const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  productId,
  productName,
  onCancel,
  onSuccess,
}) => {
  const { submitReview, isSubmitting } = useProductReviews();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    review: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = reviewSchema.parse({
        name: formData.name,
        email: formData.email,
        rating,
        title: formData.title,
        review: formData.review,
      });

      submitReview({
        product_id: productId,
        product_name: productName,
        customer_email: validatedData.email,
        customer_name: validatedData.name,
        rating: validatedData.rating,
        review_title: validatedData.title,
        review_text: validatedData.review,
      });

      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const renderStars = (starRating: number, interactive = true) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
            disabled={!interactive}
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your experience with {productName}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">
              Rating <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-4">
              {renderStars(rating)}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rating === 5 && '⭐ Excellent!'}
                  {rating === 4 && '⭐ Great!'}
                  {rating === 3 && '⭐ Good'}
                  {rating === 2 && '⭐ Fair'}
                  {rating === 1 && '⭐ Poor'}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              maxLength={255}
            />
            <p className="text-xs text-muted-foreground">
              Your email will not be displayed publicly
            </p>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review">
              Your Review <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="Share your thoughts about this product..."
              rows={6}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.review.length}/1000 characters
            </p>
            {errors.review && (
              <p className="text-sm text-destructive">{errors.review}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Your review will be published once it has been approved by our team.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewSubmissionForm;
