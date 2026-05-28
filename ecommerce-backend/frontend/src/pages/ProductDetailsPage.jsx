import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageCard, SectionHeading } from "../components/Layout";
import { EmptyState } from "../components/Skeletons";
import {
  ChevronLeftIcon,
  HeartFilledIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ClockIcon,
} from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { money, dateLabel } from "../lib/format";

function Stars({ value }) {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} className={`size-4 ${index < Math.round(value) ? "fill-current" : ""}`} />
      ))}
    </div>
  );
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { catalog, wishlistIds, addToCart, toggleWishlist } = useStore();
  const product = useMemo(() => catalog.find((item) => item.slug === slug), [catalog, slug]);
  const related = useMemo(() => catalog.filter((item) => item.categoryId === product?.categoryId && item.id !== product?.id).slice(0, 4), [catalog, product]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="The requested item is unavailable or has been removed from the catalog."
        action={<Link to="/products" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Back to products</Link>}
      />
    );
  }

  const handleAdd = () => addToCart(product, { size: selectedSize, color: selectedColor }, quantity);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-[color:var(--foreground)]">
          <ChevronLeftIcon className="size-4" />
          Back
        </button>
        <span>/</span>
        <Link to="/products" className="hover:text-[color:var(--foreground)]">Products</Link>
        <span>/</span>
        <span className="truncate text-[color:var(--foreground)]">{product.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <PageCard className="p-4">
          <div className="grid gap-4 lg:grid-cols-[90px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-2xl border transition ${selectedImage === index ? "border-[color:var(--accent)] ring-2 ring-[color:var(--accent-soft)]" : "border-[color:var(--border)]"}`}
                >
                  <img src={image} alt="" className="h-20 w-20 object-cover" />
                </button>
              ))}
            </div>
            <div className="order-1 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] lg:order-2">
              <div className="group relative aspect-[4/3] overflow-hidden">
                <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-[color:var(--foreground)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--surface)]">
                  {product.badge}
                </div>
              </div>
              <div className="grid gap-3 border-t border-[color:var(--border)] p-4 sm:grid-cols-3">
                <FeatureTag icon={<TruckIcon className="size-4" />} title="Fast shipping" copy="Dispatch within 24 hours" />
                <FeatureTag icon={<ShieldIcon className="size-4" />} title="Protected checkout" copy="Secure and clear payment flow" />
                <FeatureTag icon={<ClockIcon className="size-4" />} title="Easy returns" copy="Simple order management" />
              </div>
            </div>
          </div>
        </PageCard>

        <PageCard className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">{product.categoryName}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">{product.name}</h1>
            </div>
            <button onClick={() => toggleWishlist(product.id)} className="inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)]">
              {wishlistIds.includes(product.id) ? <HeartFilledIcon className="size-4 text-rose-500" /> : <HeartIcon className="size-4" />}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Stars value={product.rating} />
            <span className="text-sm text-[color:var(--muted)]">{product.rating.toFixed(1)} rating</span>
            <span className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--foreground)]">{product.reviewsCount} reviews</span>
          </div>

          <div className="mt-5 flex items-end gap-4">
            <div className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">{money(product.price)}</div>
            <div className="pb-1 text-sm text-[color:var(--muted)] line-through">{money(product.mrp)}</div>
            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">{product.discount}% off</div>
          </div>

          <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">{product.description}</p>

          <div className="mt-6 space-y-4">
            <OptionGroup label="Colour">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedColor === color ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--foreground)]" : "border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--muted)]"}`}
                >
                  {color}
                </button>
              ))}
            </OptionGroup>

            <OptionGroup label="Size">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedSize === size ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--foreground)]" : "border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--muted)]"}`}
                >
                  {size}
                </button>
              ))}
            </OptionGroup>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)]">
                <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-3">
                  <MinusIcon className="size-4" />
                </button>
                <div className="min-w-12 px-4 text-center text-sm font-semibold">{quantity}</div>
                <button onClick={() => setQuantity((value) => value + 1)} className="px-4 py-3">
                  <PlusIcon className="size-4" />
                </button>
              </div>
              <button onClick={handleAdd} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">
                <ShoppingBagIcon className="size-4" />
                Add to cart
              </button>
              <button
                onClick={() => {
                  handleAdd();
                  navigate("/checkout");
                }}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)]"
              >
                Buy now
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 sm:grid-cols-3">
            {[
              "Free shipping on eligible orders",
              "Protected payments and order tracking",
              "Premium support response times",
            ].map((item) => (
              <div key={item} className="text-sm leading-6 text-[color:var(--muted)]">
                {item}
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_.95fr]">
        <PageCard className="p-6">
          <SectionHeading eyebrow="Highlights" title="Why this product sells" description="The feature list is written to scan quickly and reinforce the value proposition." />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--foreground)]">
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SpecRow label="Brand" value={product.brand} />
            <SpecRow label="Category" value={product.categoryName} />
            <SpecRow label="Availability" value={product.stock > 0 ? "In stock" : "Out of stock"} />
            <SpecRow label="Added" value={dateLabel(new Date().toISOString())} />
          </div>
        </PageCard>

        <PageCard className="p-6">
          <SectionHeading eyebrow="Reviews" title="Social proof that feels believable" description="A review stack with ratings, names, and dates keeps the page grounded." />
          <div className="mt-5 grid gap-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--foreground)]">{review.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">{review.title}</div>
                  </div>
                  <div className="text-xs text-[color:var(--muted)]">{dateLabel(review.date)}</div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Stars value={review.rating} />
                  <span className="text-xs text-[color:var(--muted)]">{review.rating.toFixed(1)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{review.text}</p>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <PageCard className="p-6">
        <SectionHeading eyebrow="Related products" title="Keep the discovery flow moving" description="Products from the same category to support comparison and add-on purchases." />
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/products/${item.slug}`)}
              className="overflow-hidden rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-left transition hover:-translate-y-1"
            >
              <img src={item.images[0]} alt={item.name} className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-2 p-4">
                <div className="text-sm font-semibold text-[color:var(--foreground)]">{item.name}</div>
                <div className="text-sm text-[color:var(--muted)]">{money(item.price)}</div>
              </div>
            </button>
          ))}
        </div>
      </PageCard>
    </div>
  );
}

function OptionGroup({ label, children }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-[color:var(--foreground)]">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FeatureTag({ icon, title, copy }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[color:var(--surface)] p-4">
      <div className="grid size-10 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[color:var(--foreground)]">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-[color:var(--foreground)]">{title}</div>
        <div className="text-xs text-[color:var(--muted)]">{copy}</div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</div>
      <div className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">{value}</div>
    </div>
  );
}

