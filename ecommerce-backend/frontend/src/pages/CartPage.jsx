import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../components/Skeletons";
import { PageCard, SectionHeading } from "../components/Layout";
import { MinusIcon, PlusIcon, ShoppingCartIcon, TrashIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, catalog, updateCartItem, removeCartItem, summary, addToCart } = useStore();
  const recommendations = catalog.filter((product) => !cartItems.some((item) => item.productId === product.id)).slice(0, 4);

  if (!cartItems.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add products from the catalog and keep the checkout path visible when the user is ready."
        action={<Link to="/products" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Browse products</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Cart"
        title="Review items before checkout"
        description="The cart makes quantity changes and item removal obvious without overwhelming the layout."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <PageCard className="p-5">
          <div className="grid gap-4">
            {cartItems.map((item) => (
              <div key={item.key} className="flex flex-col gap-4 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 sm:flex-row sm:items-center">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">{item.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    {item.size} · {item.color}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">{money(item.price)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]">
                    <button onClick={() => updateCartItem(item.key, item.quantity - 1)} className="px-3 py-2">
                      <MinusIcon className="size-4" />
                    </button>
                    <div className="min-w-12 px-3 text-center text-sm font-semibold">{item.quantity}</div>
                    <button onClick={() => updateCartItem(item.key, item.quantity + 1)} className="px-3 py-2">
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                  <button onClick={() => removeCartItem(item.key)} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
                    <TrashIcon className="size-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                <ShoppingCartIcon className="size-5 text-[color:var(--accent)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[color:var(--foreground)]">Order summary</div>
                <div className="text-sm text-[color:var(--muted)]">Clear totals and conversion-first CTA placement.</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-[color:var(--muted)]">
              <SummaryRow label="Items" value={summary.itemCount} />
              <SummaryRow label="Subtotal" value={money(summary.subtotal)} />
              <SummaryRow label="Shipping" value="Free" />
              <SummaryRow label="Estimated total" value={money(summary.subtotal)} strong />
            </div>

            <div className="mt-5 grid gap-3">
              <button onClick={() => navigate("/checkout")} className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">
                Proceed to checkout
              </button>
              <Link to="/products" className="rounded-full border border-[color:var(--border)] px-5 py-3 text-center text-sm font-semibold">
                Continue shopping
              </Link>
            </div>
          </PageCard>

          <PageCard className="p-5">
            <SectionHeading eyebrow="Continue browsing" title="Recommended picks" />
            <div className="mt-4 grid gap-3">
              {recommendations.map((product) => (
                <button key={product.id} onClick={() => addToCart(product)} className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3 text-left">
                  <img src={product.images[0]} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[color:var(--foreground)]">{product.name}</div>
                    <div className="text-sm text-[color:var(--muted)]">{money(product.price)}</div>
                  </div>
                </button>
              ))}
            </div>
          </PageCard>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl border border-[color:var(--border)] px-4 py-3 ${strong ? "bg-[color:var(--surface-soft)] text-[color:var(--foreground)]" : "bg-[color:var(--surface-soft)]"}`}>
      <span className={strong ? "font-semibold text-[color:var(--foreground)]" : ""}>{label}</span>
      <span className={strong ? "font-semibold text-[color:var(--foreground)]" : ""}>{value}</span>
    </div>
  );
}

