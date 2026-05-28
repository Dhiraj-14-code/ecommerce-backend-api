import { Link } from "react-router-dom";
import { EmptyState } from "../components/Skeletons";
import { PageCard, SectionHeading } from "../components/Layout";
import { PackageIcon, TruckIcon, ShieldIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { dateTimeLabel, money } from "../lib/format";

export default function OrdersPage() {
  const { orders } = useStore();

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="A clean order history surface helps users confirm purchases and track delivery status."
        action={<Link to="/products" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Shop now</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Orders"
        title="Order history"
        description="Cards carry dates, statuses, and item summaries so the history reads quickly on any screen."
      />

      <div className="grid gap-5">
        {orders.map((order) => (
          <PageCard key={order.id} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                    <PackageIcon className="size-5 text-[color:var(--accent)]" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]">{order.id}</div>
                    <div className="text-sm text-[color:var(--muted)]">{dateTimeLabel(order.date)}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Pill icon={<ShieldIcon className="size-4" />} label={order.status} />
                  <Pill icon={<TruckIcon className="size-4" />} label={`${order.items.length} items`} />
                </div>
              </div>

              <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Total</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{money(order.total)}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.productId}`} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">{item.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    Qty {item.quantity} · {money(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </PageCard>
        ))}
      </div>
    </div>
  );
}

function Pill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--foreground)]">
      {icon}
      {label}
    </span>
  );
}

