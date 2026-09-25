import { BadgeCheck, Quote } from 'lucide-react';
import StarRating from '@/components/storefront/StarRating';

function ReviewCard({ review }) {
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card p-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]">
      <span
        aria-hidden
        className="absolute -left-px top-0 h-px w-0 bg-[#C7D400] transition-all duration-500 group-hover:w-full"
      />
      <span
        aria-hidden
        className="absolute -top-px left-0 h-0 w-px bg-[#C7D400] transition-all duration-500 group-hover:h-full"
      />
      <Quote className="h-6 w-6 text-accent" />
      <blockquote className="mt-4 flex-1">
        <p className="line-clamp-3 font-heading text-lg italic leading-snug">
          {review.comment}
        </p>
      </blockquote>
      <div className="mt-4 flex items-center justify-between">
        <StarRating value={review.rating} size={14} />
        {review.verified && (
          <BadgeCheck
            className="h-5 w-5 text-accent"
            aria-label="Avis vérifié"
          />
        )}
      </div>
      <figcaption className="mt-4 border-t border-border pt-3">
        <span className="font-semibold">{review.name}</span>
        <span className="text-muted-foreground"> · {review.city || 'Maroc'}</span>
      </figcaption>
    </figure>
  );
}

export default ReviewCard;