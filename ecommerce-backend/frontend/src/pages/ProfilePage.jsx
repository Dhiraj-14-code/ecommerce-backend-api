import { Link } from "react-router-dom";
import { EmptyState } from "../components/Skeletons";
import { PageCard, SectionHeading } from "../components/Layout";
import { PackageIcon, HeartIcon, CreditCardIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { dateTimeLabel } from "../lib/format";

export default function ProfilePage() {
  const { user, summary, orders, wishlistIds } = useStore();

  if (!user) {
    return (
      <EmptyState
        title="Sign in to view your profile"
        description="Account data, saved items, and order history live behind a lightweight authenticated surface."
        action={<Link to="/auth" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Sign in</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Profile"
        title="Account overview"
        description="A dense but readable user surface with quick access to orders, wishlist, and key account metrics."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <PageCard className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-[24px] bg-[color:var(--foreground)] text-lg font-semibold text-[color:var(--surface)]">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{user.name}</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">{user.email}</div>
                <div className="mt-2 inline-flex rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground)]">
                  {user.role}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Metric value={summary.itemCount} label="Cart" icon={<PackageIcon className="size-4" />} />
              <Metric value={wishlistIds.length} label="Saved" icon={<HeartIcon className="size-4" />} />
              <Metric value={orders.length} label="Orders" icon={<CreditCardIcon className="size-4" />} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoCard title="Account details" value={user.email} hint="Primary login and notifications" />
            <InfoCard title="Membership" value={user.role === "admin" ? "Administrator" : "Customer"} hint="Role-based access control" />
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard className="p-6">
            <div className="text-sm font-semibold text-[color:var(--foreground)]">Quick links</div>
            <div className="mt-4 grid gap-3">
              {[
                ["/orders", "Order history"],
                ["/wishlist", "Wishlist"],
                ["/checkout", "Checkout"],
                ["/products", "Continue shopping"],
              ].map(([to, label]) => (
                <Link key={to} to={to} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)]">
                  {label}
                </Link>
              ))}
            </div>
          </PageCard>

          <PageCard className="p-6">
            <div className="text-sm font-semibold text-[color:var(--foreground)]">Recent activity</div>
            <div className="mt-4 grid gap-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[color:var(--foreground)]">{order.id}</div>
                    <div className="text-xs text-[color:var(--muted)]">{dateTimeLabel(order.date)}</div>
                  </div>
                  <div className="mt-2 text-sm text-[color:var(--muted)]">{order.status}</div>
                </div>
              ))}
            </div>
          </PageCard>
        </div>
      </div>
    </div>
  );
}

function Metric({ value, label, icon }) {
  return (
    <div className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 text-center">
      <div className="mx-auto grid size-10 place-items-center rounded-full bg-[color:var(--surface)] text-[color:var(--foreground)]">{icon}</div>
      <div className="mt-3 text-lg font-semibold text-[color:var(--foreground)]">{value}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</div>
    </div>
  );
}

function InfoCard({ title, value, hint }) {
  return (
    <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{title}</div>
      <div className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">{value}</div>
      <div className="mt-1 text-sm text-[color:var(--muted)]">{hint}</div>
    </div>
  );
}
