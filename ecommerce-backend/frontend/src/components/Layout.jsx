import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { announcements, categories as seedCategories } from "../data/store";
import { useStore } from "../context/StoreContext";
import {
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HeartIcon,
  MenuIcon,
  MoonIcon,
  InstagramIcon,
  SearchIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SunIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
  UserIcon,
  XIcon,
} from "./Icons";

function initials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
            <SparklesIcon className="size-4" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl">
          {title}
        </h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="border-b border-[color:var(--border)] bg-[color:var(--surface-soft)]/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs text-[color:var(--muted)] sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <BellIcon className="size-4 text-[color:var(--accent)]" />
          <span>Premium delivery experience built for conversion.</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {announcements.map((item) => (
            <span key={item} className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchDropdown({ open, results, onSelect }) {
  if (!open || !results.length) return null;
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
      <div className="max-h-96 overflow-auto p-2">
        {results.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[color:var(--surface-soft)]"
          >
            <img src={product.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-[color:var(--foreground)]">{product.name}</div>
              <div className="truncate text-xs text-[color:var(--muted)]">{product.categoryName}</div>
            </div>
            <ChevronRightIcon className="size-4 text-[color:var(--muted)]" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const { catalog, summary, theme, setTheme, user } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return catalog.filter((product) => {
      const haystack = `${product.name} ${product.categoryName} ${product.brand}`.toLowerCase();
      return haystack.includes(q);
    }).slice(0, 6);
  }, [catalog, query]);

  const goToProduct = (product) => {
    setQuery("");
    setSearchOpen(false);
    navigate(`/products/${product.slug}`);
  };

  const navItemClass = "rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--foreground)]";

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--surface)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[color:var(--foreground)] text-sm font-semibold text-[color:var(--surface)]">
              NC
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold tracking-tight text-[color:var(--foreground)]">NovaCart</div>
              <div className="text-xs text-[color:var(--muted)]">Premium shopping</div>
            </div>
          </Link>

          <div className="relative hidden flex-1 lg:block">
            <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3">
              <SearchIcon className="size-4 text-[color:var(--muted)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => window.setTimeout(() => setSearchOpen(false), 160)}
                placeholder="Search products, brands, categories"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-[color:var(--muted)]"
              />
              <button onClick={() => navigate(`/products?query=${encodeURIComponent(query)}`)} className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-[color:var(--surface)]">
                Search
              </button>
            </div>
            <SearchDropdown open={searchOpen} results={results} onSelect={goToProduct} />
          </div>

          <nav className="hidden items-center gap-1 xl:flex">
            <button onClick={() => setCategoryOpen((value) => !value)} className={navItemClass}>
              Categories <ChevronDownIcon className="ml-1 inline size-4" />
            </button>
            <Link to="/products" className={navItemClass}>Shop</Link>
            <Link to="/wishlist" className={navItemClass}>Wishlist</Link>
            <Link to="/orders" className={navItemClass}>Orders</Link>
            <Link to="/admin" className={navItemClass}>Admin</Link>
          </nav>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--foreground)] transition hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
            </button>
            <Link to="/wishlist" className="relative inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)]">
              <HeartIcon className="size-4" />
              {summary.wishlist ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--accent)] px-1 text-[10px] font-semibold text-white">{summary.wishlist}</span> : null}
            </Link>
            <Link to="/cart" className="relative inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)]">
              <ShoppingBagIcon className="size-4" />
              {summary.itemCount ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--accent)] px-1 text-[10px] font-semibold text-white">{summary.itemCount}</span> : null}
            </Link>
            {user ? (
              <Link to="/profile" className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2">
                <div className="grid size-8 place-items-center rounded-full bg-[color:var(--foreground)] text-xs font-semibold text-[color:var(--surface)]">
                  {initials(user.name)}
                </div>
                <div className="hidden text-left lg:block">
                  <div className="text-xs font-semibold text-[color:var(--foreground)]">{user.name}</div>
                  <div className="text-[11px] text-[color:var(--muted)]">{user.role}</div>
                </div>
              </Link>
            ) : (
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-[color:var(--surface)]">
                <UserIcon className="size-4" />
                Sign in
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="ml-auto inline-flex size-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--foreground)] sm:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>

        {categoryOpen ? (
          <div className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
            <div className="mx-auto grid max-w-7xl gap-2 px-4 py-3 sm:px-6 lg:grid-cols-6 lg:px-8">
              {seedCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]"
                >
                  <div>{category.name}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted)]">Browse curated picks</div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {menuOpen ? (
          <div className="border-t border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 sm:hidden">
            <div className="grid gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3">
                <SearchIcon className="size-4 text-[color:var(--muted)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-[color:var(--muted)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/products" className="rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm font-medium">Shop</Link>
                <Link to="/wishlist" className="rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm font-medium">Wishlist</Link>
                <Link to="/orders" className="rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm font-medium">Orders</Link>
                <Link to="/admin" className="rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm font-medium">Admin</Link>
                <Link to="/cart" className="rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm font-medium">Cart</Link>
                <Link to="/auth" className="rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm font-medium">Account</Link>
              </div>
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--border)] px-4 py-3 text-sm font-medium">
                {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                Toggle theme
              </button>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface-soft)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_.7fr_.7fr_.7fr] lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[color:var(--foreground)] text-sm font-semibold text-[color:var(--surface)]">
              NC
            </div>
            <div>
              <div className="text-base font-semibold text-[color:var(--foreground)]">NovaCart</div>
              <div className="text-sm text-[color:var(--muted)]">Modern retail UI system</div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-[color:var(--muted)]">
            A premium storefront interface with conversion-focused flows, responsive layouts, and a reusable component model.
          </p>
          <div className="flex gap-2">
            {[
              [InstagramIcon, "Instagram"],
              [TwitterIcon, "X"],
              [LinkedinIcon, "LinkedIn"],
              [YoutubeIcon, "YouTube"],
            ].map(([Icon, label]) => (
              <a
                key={label}
                href="/"
                aria-label={label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterGroup title="Shop" links={["New arrivals", "Best sellers", "Flash sale", "Gift cards"]} />
        <FooterGroup title="Support" links={["Help center", "Shipping", "Returns", "Payments"]} />
        <FooterGroup title="Company" links={["About", "Careers", "Privacy", "Terms"]} />
      </div>
      <div className="border-t border-[color:var(--border)] px-4 py-4 text-center text-xs text-[color:var(--muted)] sm:px-6 lg:px-8">
        Designed for premium ecommerce experiences. Built with React and Tailwind CSS.
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)]">{title}</h3>
      <div className="grid gap-3 text-sm text-[color:var(--muted)]">
        {links.map((link) => (
          <a key={link} href="/" className="transition hover:text-[color:var(--foreground)]">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}

export function SiteShell({ children }) {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--foreground)] transition-colors">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
      <ToastStack />
    </div>
  );
}

export function AuthShell({ children, aside }) {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <aside className="hidden border-r border-[color:var(--border)] bg-[color:var(--surface-soft)] p-6 lg:flex lg:flex-col lg:justify-between">
          {aside}
        </aside>
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-10">{children}</div>
      </div>
      <ToastStack />
    </div>
  );
}

export function PageCard({ children, className = "" }) {
  return <section className={`rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_24px_72px_rgba(15,23,42,0.08)] ${className}`}>{children}</section>;
}

function ToastStack() {
  const { toasts } = useStore();
  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div className="grid gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto flex min-w-[280px] items-center justify-between gap-4 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
            <span className="text-[color:var(--foreground)]">{toast.message}</span>
            <XIcon className="size-4 text-[color:var(--muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
