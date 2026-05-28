import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroArt from "../assets/hero.png";
import { ProductCard } from "../components/ProductCard";
import { PageCard, SectionHeading } from "../components/Layout";
import {
  ClockIcon,
  ChevronRightIcon,
  HeartIcon,
  PackageIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
} from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";

function useCountdown(targetDate) {
  const [state, setState] = useState(() => targetDate - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setState(targetDate - Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return Math.max(state, 0);
}

function Countdown({ targetDate }) {
  const delta = useCountdown(targetDate);
  const totalSeconds = Math.floor(delta / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const blocks = [
    ["Days", String(days).padStart(2, "0")],
    ["Hours", String(hours).padStart(2, "0")],
    ["Minutes", String(minutes).padStart(2, "0")],
    ["Seconds", String(seconds).padStart(2, "0")],
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {blocks.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-center">
          <div className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]">{value}</div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--muted)]">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { catalog, categories, testimonials, addToCart, toggleWishlist, wishlistIds } = useStore();

  const featuredCategories = categories.map((category) => ({
    ...category,
    products: catalog.filter((product) => product.categoryId === category.id).length,
  }));
  const trending = useMemo(() => catalog.filter((product) => product.badge || product.rating >= 4.7).slice(0, 8), [catalog]);
  const bestSellers = useMemo(() => [...catalog].sort((a, b) => (b.reviewsCount + b.rating * 10) - (a.reviewsCount + a.rating * 10)).slice(0, 6), [catalog]);
  const flashSaleEnds = useMemo(() => {
    const target = new Date();
    target.setDate(target.getDate() + 2);
    target.setHours(23, 59, 59, 0);
    return target.getTime();
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_24px_72px_rgba(15,23,42,0.08)] lg:grid-cols-[1.05fr_.95fr] lg:p-6">
        <div className="flex flex-col justify-center gap-6 rounded-[28px] bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.92),rgba(14,165,233,0.2))] p-6 text-white lg:p-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
            <SparklesIcon className="size-4" />
            Premium ecommerce UI
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl xl:text-6xl">
              Modern shopping built for premium conversion.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/78 sm:text-lg">
              A polished storefront with fast browse flows, clear product hierarchy, and a checkout path designed to convert on every screen size.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:translate-y-[-1px]"
            >
              Shop collection
              <ChevronRightIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Fast checkout
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Ships fast", "Same-day dispatch in metro areas"],
              ["Premium support", "High-trust conversion surface"],
              ["Secure checkout", "Clear payment and address flows"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-white/12 bg-white/8 p-4">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="mt-1 text-sm leading-6 text-white/72">{copy}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 rounded-[28px] bg-[color:var(--surface-soft)] p-4">
          <div className="relative overflow-hidden rounded-[26px] border border-[color:var(--border)] bg-[color:var(--surface)]">
            <img src={heroArt} alt="Premium storefront" className="h-full min-h-[280px] w-full object-cover" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/55 p-4 text-white backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">Featured experience</div>
              <div className="mt-1 text-lg font-semibold">Minimal, premium, and fully responsive.</div>
              <div className="mt-1 text-sm text-white/70">Designed to feel calm while still driving action.</div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={<PackageIcon className="size-5" />} value={catalog.length} label="Products" />
            <StatCard icon={<HeartIcon className="size-5" />} value={wishlistIds.length} label="Wishlist" />
            <StatCard icon={<TruckIcon className="size-5" />} value="24h" label="Dispatch" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {featuredCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(`/products?category=${category.slug}`)}
            className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Category</div>
            <div className="mt-3 text-lg font-semibold tracking-tight text-[color:var(--foreground)]">{category.name}</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">{category.products} products</div>
          </button>
        ))}
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Trending products"
          title="Products that feel premium at first glance"
          description="The card system keeps images, pricing, and action affordances visible without crowding the page."
          action={
            <button onClick={() => navigate("/products")} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
              View all
              <ChevronRightIcon className="size-4" />
            </button>
          }
        />
        <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trending.map((product) => (
            <div key={product.id} className="min-w-[300px] max-w-[320px]">
              <ProductCard
                product={product}
                wishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={(item) => addToCart(item)}
                onQuickView={(item) => navigate(`/products/${item.slug}`)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <PageCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                <ClockIcon className="size-4" />
                Flash sale
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">Limited-time pricing</h3>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-right">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Ends in</div>
              <div className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">2 days</div>
            </div>
          </div>
          <div className="mt-6">
            <Countdown targetDate={flashSaleEnds} />
          </div>
          <div className="mt-6 grid gap-3">
            {catalog.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
                <img src={product.images[1]} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[color:var(--foreground)]">{product.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">From {money(product.price)}</div>
                </div>
                <button onClick={() => addToCart(product)} className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-[color:var(--surface)]">
                  Add
                </button>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard className="p-6">
          <SectionHeading eyebrow="Best sellers" title="Commercially strong assortment" description="A grid of high-confidence products to keep the visual rhythm dense without feeling packed." />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {bestSellers.map((product) => (
              <button
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="group overflow-hidden rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-left transition hover:-translate-y-1"
              >
                <img src={product.images[0]} alt={product.name} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="space-y-2 p-4">
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">{product.name}</div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[color:var(--foreground)]">{money(product.price)}</span>
                    <span className="inline-flex items-center gap-1 text-[color:var(--muted)]">
                      <StarIcon className="size-4 fill-current text-amber-500" />
                      {product.rating}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </PageCard>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <PageCard className="p-6">
          <SectionHeading eyebrow="Testimonials" title="Built to reassure before checkout" description="Trust cues stay visible and consistent across the shopping journey." />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{item.quote}</p>
                <div className="mt-5 text-sm font-semibold text-[color:var(--foreground)]">{item.name}</div>
                <div className="text-xs text-[color:var(--muted)]">{item.role}</div>
              </div>
            ))}
          </div>
        </PageCard>

        <div className="grid gap-5">
          <PageCard className="p-6">
            <SectionHeading eyebrow="Newsletter" title="Keep the campaign slot warm" description="A minimal capture form that can sit quietly without killing the composition." />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input placeholder="Email address" className="min-w-0 flex-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm outline-none placeholder:text-[color:var(--muted)]" />
              <button className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Subscribe</button>
            </div>
            <div className="mt-4 text-xs text-[color:var(--muted)]">One premium accent color, clear contrast, and no clutter.</div>
          </PageCard>

          <PageCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                <TruckIcon className="size-5 text-[color:var(--accent)]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[color:var(--foreground)]">Delivery confidence</div>
                <div className="text-sm text-[color:var(--muted)]">Free shipping over threshold, clear order tracking, and structured status updates.</div>
              </div>
            </div>
          </PageCard>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <div className="grid size-11 place-items-center rounded-2xl bg-[color:var(--surface-soft)] text-[color:var(--foreground)]">{icon}</div>
      <div>
        <div className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]">{value}</div>
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</div>
      </div>
    </div>
  );
}
