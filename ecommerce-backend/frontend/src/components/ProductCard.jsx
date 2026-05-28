import { Link } from "react-router-dom";
import { HeartFilledIcon, HeartIcon, ShoppingBagIcon, StarIcon, EyeIcon } from "./Icons";

function Rating({ rating = 0, reviews = 0 }) {
  const value = Math.round(rating * 10) / 10;
  return (
    <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 font-medium text-amber-600">
        <StarIcon className="size-3.5 fill-current" />
        {value}
      </span>
      <span>{reviews.toLocaleString()} reviews</span>
    </div>
  );
}

export function ProductCard({ product, wishlisted, onToggleWishlist, onAddToCart, onQuickView }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        {product.discount ? (
          <span className="absolute left-4 top-4 rounded-full bg-[color:var(--foreground)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--surface)]">
            {product.discount}% off
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/85 text-[color:var(--foreground)] backdrop-blur transition hover:scale-105"
          aria-label="Toggle wishlist"
        >
          {wishlisted ? <HeartFilledIcon className="size-4 text-rose-500" /> : <HeartIcon className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-3 py-2 text-xs font-semibold text-[color:var(--surface)] opacity-0 transition group-hover:opacity-100"
        >
          <EyeIcon className="size-4" />
          Quick view
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">{product.categoryName}</p>
            <Link to={`/products/${product.slug}`} className="mt-1 block text-lg font-semibold tracking-tight text-[color:var(--foreground)] transition hover:text-[color:var(--accent)]">
              {product.name}
            </Link>
          </div>
        </div>

        <Rating rating={product.rating} reviews={product.reviewsCount} />

        <p className="line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">{product.description}</p>

        <div className="flex items-end gap-3">
          <div className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">₹{product.price.toLocaleString("en-IN")}</div>
          <div className="pb-0.5 text-sm text-[color:var(--muted)] line-through">₹{product.mrp.toLocaleString("en-IN")}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.colors.slice(0, 3).map((color) => (
            <span key={color} className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]">
              {color}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-semibold text-[color:var(--surface)] transition hover:opacity-90"
          >
            <ShoppingBagIcon className="size-4" />
            Add to cart
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

