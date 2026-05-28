import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell, PageCard } from "../components/Layout";
import { CheckIcon, ShieldIcon, SparklesIcon, UserIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const initialMode = location.pathname === "/signup" || params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useStore();

  const headline = useMemo(() => (mode === "login" ? "Welcome back" : "Create your account"), [mode]);

  const submit = (event) => {
    event.preventDefault();
    const role = form.email.toLowerCase().includes("admin") ? "admin" : "customer";
    login({
      name: form.name || (role === "admin" ? "Admin User" : "Alex Morgan"),
      email: form.email,
      role,
    });
    navigate(role === "admin" ? "/admin" : "/profile");
  };

  return (
    <AuthShell
      aside={
        <div className="flex h-full flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
              <SparklesIcon className="size-4" />
              Secure account experience
            </div>
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-[color:var(--foreground)]">
              A sign-in flow that feels premium and fast.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[color:var(--muted)]">
              The account experience keeps the primary action obvious, surfaces trust cues, and works cleanly on narrow screens.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              ["Protected profiles", "Role-aware access to customer and admin UI."],
              ["Order continuity", "Saved cart, wishlists, and order history."],
              ["Responsive forms", "The layout collapses gracefully on mobile."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--foreground)]">
                  <CheckIcon className="size-4 text-emerald-600" />
                  {title}
                </div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{copy}</div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <PageCard className="w-full max-w-xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">Account</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">{headline}</h2>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
            <UserIcon className="size-5 text-[color:var(--accent)]" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-1">
          <button onClick={() => setMode("login")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-[color:var(--surface)] text-[color:var(--foreground)] shadow-sm" : "text-[color:var(--muted)]"}`}>
            Login
          </button>
          <button onClick={() => setMode("signup")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-[color:var(--surface)] text-[color:var(--foreground)] shadow-sm" : "text-[color:var(--muted)]"}`}>
            Signup
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          {mode === "signup" ? (
            <Field label="Full name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          ) : null}
          <Field label="Email address" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
          <Field label="Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} />

          <button type="submit" className="mt-2 rounded-full bg-[color:var(--foreground)] px-5 py-4 text-sm font-semibold text-[color:var(--surface)]">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-5 grid gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
          <div className="flex items-center gap-2 text-[color:var(--foreground)]">
            <ShieldIcon className="size-4 text-[color:var(--accent)]" />
            Demo access
          </div>
          <div>Use an email containing <span className="font-semibold text-[color:var(--foreground)]">admin</span> to enter the admin dashboard.</div>
          <div>
            Already have an account? <Link to={mode === "login" ? "/signup" : "/login"} className="font-semibold text-[color:var(--foreground)] underline decoration-[color:var(--accent)]">Switch modes</Link>
          </div>
        </div>
      </PageCard>
    </AuthShell>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[color:var(--foreground)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm outline-none placeholder:text-[color:var(--muted)]"
      />
    </label>
  );
}
