import { useMemo, useState, useTransition } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { EmptyState, ListingSkeleton } from "../components/Skeletons";
import { PageCard, SectionHeading } from "../components/Layout";
import { ChevronDownIcon, FilterIcon, SearchIcon, StarIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";

const PAGE_SIZE = 8;

export default function ListingPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { catalog, categories, addToCart, toggleWishlist, wishlistIds } = useStore();
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const search = params.get("query") || "";
  const category = params.get("category") || "all";
  const upperBound = useMemo(() => Math.max(...catalog.map((product) => product.price), 0), [catalog]);
  const effectiveMaxPrice = Math.min(maxPrice, upperBound || maxPrice);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return catalog.filter((product) => `${product.name} ${product.brand} ${product.categoryName}`.toLowerCase().includes(q)).slice(0, 5);
  }, [catalog, search]);

  const filtered = useMemo(() => {
    let items = [...catalog];
    const selectedCategory = categories.find((item) => item.slug === category);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((product) => `${product.name} ${product.brand} ${product.categoryName} ${product.description}`.toLowerCase().includes(q));
    }

    if (selectedCategory) {
      items = items.filter((product) => product.categoryId === selectedCategory.id);
    }

    if (rating) {
      items = items.filter((product) => product.rating >= rating);
    }

    items = items.filter((product) => product.price <= effectiveMaxPrice);

    if (sort === "price-low") items.sort((a, b) => a.price - b.price);
    if (sort === "price-high") items.sort((a, b) => b.price - a.price);
    if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") items.sort((a, b) => b.id - a.id);

    return items;
  }, [catalog, categories, category, effectiveMaxPrice, rating, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

    const items = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) items.push("ellipsis-start");
    for (let index = start; index <= end; index += 1) items.push(index);
    if (end < totalPages - 1) items.push("ellipsis-end");
    items.push(totalPages);
    return items;
  }, [currentPage, totalPages]);

  const syncParams = (next) => {
    const nextParams = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") nextParams.delete(key);
      else nextParams.set(key, value);
    });
    startTransition(() => {
      setParams(nextParams, { replace: true });
      setPage(1);
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Product listing"
        title="Browse the full catalog"
        description="A responsive listing surface with a persistent filter rail, search suggestions, pagination, and clear pricing hierarchy."
      />

      <PageCard className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <div className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3">
              <SearchIcon className="size-4 text-[color:var(--muted)]" />
              <input
                value={search}
                onChange={(event) => syncParams({ query: event.target.value })}
                placeholder="Search products, brands, categories"
                className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-[color:var(--muted)]"
              />
              <button onClick={() => syncParams({ query: search })} className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-[color:var(--surface)]">
                Search
              </button>
            </div>
            {suggestions.length ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[color:var(--surface-soft)]"
                  >
                    <img src={product.images[0]} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-[color:var(--foreground)]">{product.name}</div>
                      <div className="truncate text-xs text-[color:var(--muted)]">{product.categoryName}</div>
                    </div>
                    <div className="text-sm font-semibold text-[color:var(--foreground)]">{money(product.price)}</div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
              <FilterIcon className="size-4" />
              {filtered.length} results
            </div>
            <label className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm">
              Sort
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="border-0 bg-transparent p-0 text-sm outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDownIcon className="size-4" />
            </label>
          </div>
        </div>
      </PageCard>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <PageCard className="p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Filters</div>
            <div className="mt-4 grid gap-5">
              <div>
                <div className="mb-2 text-sm font-semibold text-[color:var(--foreground)]">Category</div>
                <div className="grid gap-2">
                  <button
                    onClick={() => syncParams({ category: "all" })}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${category === "all" ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]" : "border-[color:var(--border)] bg-[color:var(--surface-soft)]"}`}
                  >
                    All categories
                  </button>
                  {categories.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => syncParams({ category: item.slug })}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${category === item.slug ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]" : "border-[color:var(--border)] bg-[color:var(--surface-soft)]"}`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-[color:var(--foreground)]">Minimum rating</div>
                <div className="grid gap-2">
                  {[0, 4, 4.5].map((value) => (
                    <button
                      key={value}
                      onClick={() => {
                        setRating(value);
                        setPage(1);
                      }}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${rating === value ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]" : "border-[color:var(--border)] bg-[color:var(--surface-soft)]"}`}
                    >
                      <span>{value === 0 ? "Any rating" : `${value}+ stars`}</span>
                      {value > 0 ? <StarIcon className="size-4 fill-current text-amber-500" /> : null}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[color:var(--foreground)]">
                  <span>Max price</span>
                  <span>{money(effectiveMaxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={upperBound}
                  value={effectiveMaxPrice}
                  onChange={(event) => {
                    setMaxPrice(Number(event.target.value));
                    setPage(1);
                  }}
                  className="w-full accent-[color:var(--accent)]"
                />
              </div>

              <button
                onClick={() => {
                  setRating(0);
                  setSort("featured");
                  setMaxPrice(upperBound);
                  setParams(new URLSearchParams(), { replace: true });
                  setPage(1);
                }}
                className="rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-semibold text-[color:var(--surface)]"
              >
                Reset filters
              </button>
            </div>
          </PageCard>

          <PageCard className="p-5">
            <div className="text-sm font-semibold text-[color:var(--foreground)]">Search hints</div>
            <div className="mt-3 grid gap-2 text-sm text-[color:var(--muted)]">
              {["Running shoe", "Smartwatch", "Desk lamp", "Beauty serum"].map((term) => (
                <button
                  key={term}
                  onClick={() => syncParams({ query: term })}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-left transition hover:border-[color:var(--accent)]"
                >
                  {term}
                </button>
              ))}
            </div>
          </PageCard>
        </aside>

        <div className="space-y-5">
          {isPending ? (
            <ListingSkeleton />
          ) : visible.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={(item) => addToCart(item)}
                    onQuickView={(item) => navigate(`/products/${item.slug}`)}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-[color:var(--muted)]">
                  Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} products
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold disabled:opacity-40">
                    Prev
                  </button>
                  {paginationItems.map((item) =>
                    typeof item === "number" ? (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`size-10 rounded-full text-sm font-semibold transition ${currentPage === item ? "bg-[color:var(--foreground)] text-[color:var(--surface)]" : "border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--foreground)]"}`}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={item} className="px-1 text-sm text-[color:var(--muted)]">
                        ...
                      </span>
                    )
                  )}
                  <button disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold disabled:opacity-40">
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="No products match your filters"
              description="Try widening the price range, changing the category, or clearing the search query."
              action={<button onClick={() => navigate("/products")} className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Reset view</button>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
