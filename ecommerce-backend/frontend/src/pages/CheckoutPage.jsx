import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../components/Skeletons";
import { PageCard, SectionHeading } from "../components/Layout";
import { CreditCardIcon, MapPinIcon, ShieldIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pin: "",
  payment: "card",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, summary, checkout, user } = useStore();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: user?.name || "",
    email: user?.email || "",
  }));

  const shipping = useMemo(() => ({ ...form }), [form]);

  if (!cartItems.length) {
    return (
      <EmptyState
        title="Nothing to checkout"
        description="The checkout page should only carry active intent. Add items to continue."
        action={<Link to="/products" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Browse products</Link>}
      />
    );
  }

  const submit = (event) => {
    event.preventDefault();
    const order = checkout(shipping);
    if (order) navigate("/orders");
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Checkout"
        title="Complete the order"
        description="The layout keeps address capture, shipping cues, and order summary in a stable two-column rhythm."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="grid gap-6">
          <PageCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                <MapPinIcon className="size-5 text-[color:var(--accent)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[color:var(--foreground)]">Shipping details</div>
                <div className="text-sm text-[color:var(--muted)]">Keep the form short and predictable.</div>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Full name", "name"],
                ["Email", "email"],
                ["Phone", "phone"],
                ["Pin code", "pin"],
              ].map(([label, key]) => (
                <Field key={key} label={label} value={form[key]} onChange={(value) => setForm((current) => ({ ...current, [key]: value }))} />
              ))}
              <Field className="md:col-span-2" label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
              <Field label="City" value={form.city} onChange={(value) => setForm((current) => ({ ...current, city: value }))} />
              <Field label="State" value={form.state} onChange={(value) => setForm((current) => ({ ...current, state: value }))} />
            </div>
          </PageCard>

          <PageCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                <CreditCardIcon className="size-5 text-[color:var(--accent)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[color:var(--foreground)]">Payment method</div>
                <div className="text-sm text-[color:var(--muted)]">A focused selection widget keeps checkout fast.</div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["card", "Card"],
                ["upi", "UPI"],
                ["cod", "Cash on delivery"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, payment: value }))}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${form.payment === value ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]" : "border-[color:var(--border)] bg-[color:var(--surface-soft)]"}`}
                >
                  <div className="font-semibold text-[color:var(--foreground)]">{label}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">{value === "card" ? "Visa, Mastercard, Amex" : value === "upi" ? "Instant approval" : "Pay at delivery"}</div>
                </button>
              ))}
            </div>
          </PageCard>

          <button type="submit" className="rounded-full bg-[color:var(--foreground)] px-6 py-4 text-sm font-semibold text-[color:var(--surface)]">
            Place order
          </button>
        </form>

        <div className="grid gap-6">
          <PageCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                <ShieldIcon className="size-5 text-[color:var(--accent)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[color:var(--foreground)]">Order summary</div>
                <div className="text-sm text-[color:var(--muted)]">Transparent pricing and delivery confidence.</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <SummaryRow label="Subtotal" value={money(summary.subtotal)} />
              <SummaryRow label="Shipping" value="Free" />
              <SummaryRow label="Tax" value="Included" />
              <SummaryRow label="Total" value={money(summary.subtotal)} strong />
            </div>
          </PageCard>

          <PageCard className="p-5">
            <div className="text-sm font-semibold text-[color:var(--foreground)]">Items</div>
            <div className="mt-4 grid gap-3">
              {cartItems.map((item) => (
                <div key={item.key} className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
                  <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[color:var(--foreground)]">{item.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">
                      {item.quantity} x {money(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageCard>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-medium text-[color:var(--foreground)]">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm outline-none placeholder:text-[color:var(--muted)]" />
    </label>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl border border-[color:var(--border)] px-4 py-3 ${strong ? "bg-[color:var(--foreground)] text-[color:var(--surface)]" : "bg-[color:var(--surface-soft)]"}`}>
      <span className={strong ? "font-semibold" : ""}>{label}</span>
      <span className={strong ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}

