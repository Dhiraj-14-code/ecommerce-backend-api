import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../components/Skeletons";
import { PageCard, SectionHeading } from "../components/Layout";
import { HeartFilledIcon, ShoppingBagIcon, TrashIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/ProductCard";
import { money } from "../lib/format";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { catalog, wishlistIds, removeFromWishlist, toggleWishlist, addToCart } = useStore();
  const items = catalog.filter((product) => wishlistIds.includes(product.id));

  if (!items.length) {
    return (
      <EmptyState
        title="Wishlist is empty"
        description="Saved products should stay easy to scan and one tap away from the cart."
        action={<Link to="/products" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Discover products</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Wishlist"
        title="Saved for later"
        description="A compact wishlist keeps intent visible while still enabling quick add-to-cart actions."
      />

      <PageCard className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
            <HeartFilledIcon className="size-5 text-rose-500" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[color:var(--foreground)]">{items.length} saved items</div>
            <div className="text-sm text-[color:var(--muted)]">Everything stays close to the purchase flow.</div>
          </div>
        </div>
      </PageCard>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <div key={product.id} className="space-y-3">
            <ProductCard
              product={product}
              wishlisted
              onToggleWishlist={toggleWishlist}
              onAddToCart={(item) => addToCart(item)}
              onQuickView={(item) => navigate(`/products/${item.slug}`)}
            />
            <div className="flex gap-2">
              <button onClick={() => addToCart(product)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-semibold text-[color:var(--surface)]">
                <ShoppingBagIcon className="size-4" />
                Add to cart
              </button>
              <button onClick={() => removeFromWishlist(product.id)} className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)]">
                <TrashIcon className="size-4" />
              </button>
            </div>
            <div className="text-sm text-[color:var(--muted)]">
              Starting at <span className="font-semibold text-[color:var(--foreground)]">{money(product.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
