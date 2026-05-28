import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/Skeletons";
import { PageCard, SectionHeading } from "../components/Layout";
import { BarChartIcon, PackageIcon, PlusIcon, UploadIcon } from "../components/Icons";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";

const initialForm = {
  name: "",
  brand: "",
  categoryId: 1,
  price: "",
  mrp: "",
  stock: "",
  rating: "4.5",
  discount: "20",
  badge: "New",
  shortTag: "Premium pick",
  description: "",
  colors: "Black, White",
  sizes: "Standard",
  features: "Premium finish, Fast dispatch, Easy returns",
  imageUrl: "",
};

export default function AdminDashboardPage() {
  const { user, catalog, categories, orders, summary, createProduct, updateProduct, deleteProduct, bulkCreateProducts, deleteAllProducts, showToast } = useStore();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [bulkJson, setBulkJson] = useState(`[{"name":"Trail Jacket","brand":"Northline","categoryId":2,"price":8990,"mrp":10990,"stock":28,"rating":4.7,"discount":18,"badge":"New","shortTag":"Outdoor","description":"Weather-ready outerwear with a clean retail presentation.","colors":["Black","Olive"],"sizes":["S","M","L"],"features":["Water resistant","Lightweight shell","Packable hood"]}]`);
  const [datasetFile, setDatasetFile] = useState(null);

  const isAdmin = user?.role === "admin";

  const stats = useMemo(
    () => [
      ["Revenue", money(summary.revenue)],
      ["Catalog", catalog.length],
      ["Orders", orders.length],
      ["Wishlist", summary.wishlist],
    ],
    [catalog.length, orders.length, summary.revenue, summary.wishlist]
  );

  if (!isAdmin) {
    return (
      <EmptyState
        title="Admin access required"
        description="Use the auth page with an email containing 'admin' to enter the dashboard UI."
        action={<Link to="/auth" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Sign in as admin</Link>}
      />
    );
  }

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
      discount: Number(form.discount),
      colors: form.colors.split(",").map((value) => value.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((value) => value.trim()).filter(Boolean),
      features: form.features.split(",").map((value) => value.trim()).filter(Boolean),
      images: form.imageUrl ? [form.imageUrl] : undefined,
    };

    if (editingId) {
      updateProduct(editingId, payload);
      setEditingId(null);
    } else {
      createProduct(payload);
    }
    setForm(initialForm);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand || "",
      categoryId: product.categoryId,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      rating: product.rating,
      discount: product.discount,
      badge: product.badge,
      shortTag: product.shortTag,
      description: product.description,
      colors: product.colors.join(", "),
      sizes: product.sizes.join(", "),
      features: product.features.join(", "),
      imageUrl: product.images?.[0] || "",
    });
  };

  const runBulk = () => {
    try {
      const parsed = JSON.parse(bulkJson);
      const payload = parsed.map((item) => ({
        ...item,
        colors: Array.isArray(item.colors) ? item.colors : String(item.colors || "").split(",").map((value) => value.trim()).filter(Boolean),
        sizes: Array.isArray(item.sizes) ? item.sizes : String(item.sizes || "").split(",").map((value) => value.trim()).filter(Boolean),
        features: Array.isArray(item.features) ? item.features : String(item.features || "").split(",").map((value) => value.trim()).filter(Boolean),
      }));
      bulkCreateProducts(payload);
    } catch {
      // ignore malformed UI input for now
    }
  };

  const clearAllProducts = () => {
    const confirmed = window.confirm("Delete all products? This will clear the catalog, wishlist, and cart items.");
    if (!confirmed) return;
    deleteAllProducts();
  };

  const normalizeHeader = (value) => String(value || "").trim().toLowerCase().replace(/[\s_-]+/g, "");

  const splitList = (value) =>
    String(value || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

  const parseCsv = (text) => {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (quoted && next === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
        continue;
      }

      if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
        continue;
      }

      if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") {
          i += 1;
        }
        row.push(cell);
        if (row.some((value) => String(value).trim() !== "")) {
          rows.push(row);
        }
        row = [];
        cell = "";
        continue;
      }

      cell += char;
    }

    row.push(cell);
    if (row.some((value) => String(value).trim() !== "")) {
      rows.push(row);
    }

    return rows;
  };

  const getHeaderValue = (headers, values, keys) => {
    for (const key of keys) {
      const index = headers[normalizeHeader(key)];
      if (index !== undefined && values[index] !== undefined && String(values[index]).trim() !== "") {
        return String(values[index]).trim();
      }
    }
    return "";
  };

  const resolveCategory = (rawCategory, rawCategoryId) => {
    const normalizedId = Number(rawCategoryId);
    if (Number.isFinite(normalizedId) && categories.some((category) => category.id === normalizedId)) {
      const category = categories.find((entry) => entry.id === normalizedId);
      return { categoryId: category.id, categoryName: category.name };
    }

    const normalizedCategory = String(rawCategory || "").trim().toLowerCase();
    const matched = categories.find((category) => {
      const name = category.name.toLowerCase();
      const slug = category.slug.toLowerCase();
      return name === normalizedCategory || slug === normalizedCategory || name.includes(normalizedCategory);
    });

    const fallback = categories[0];
    const selected = matched || fallback;
    return { categoryId: selected.id, categoryName: selected.name };
  };

  const importDatasetFile = async () => {
    if (!datasetFile) {
      showToast("Choose a CSV file first", "warning");
      return;
    }

    const text = await datasetFile.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      showToast("CSV file has no data rows", "warning");
      return;
    }

    const headers = rows[0].map((header, index) => [normalizeHeader(header), index]).reduce((acc, [key, index]) => ({ ...acc, [key]: index }), {});

    const payload = rows.slice(1).map((values) => {
      const name = getHeaderValue(headers, values, ["name", "productname", "product_name", "title", "producttitle"]);
      const description = getHeaderValue(headers, values, ["description", "about_product", "productdescription", "details", "summary"]);
      const brand = getHeaderValue(headers, values, ["brand", "manufacturer", "seller"]);
      const shortTag = getHeaderValue(headers, values, ["shorttag", "tag", "subtitle", "label"]) || "Premium pick";
      const imageUrl = getHeaderValue(headers, values, ["imageurl", "image_url", "thumbnail", "image", "imageurl1"]);
      const price = Number(getHeaderValue(headers, values, ["price", "discounted_price", "actual_price", "sale_price", "selling_price", "mrp"]) || 0);
      const mrpValue = Number(getHeaderValue(headers, values, ["mrp", "list_price", "original_price"]) || price || 0);
      const stock = Number(getHeaderValue(headers, values, ["stock", "quantity", "qty", "inventory"]) || 0);
      const rating = Number(getHeaderValue(headers, values, ["rating", "reviewrating"]) || 4.5);
      const discount = Number(getHeaderValue(headers, values, ["discount", "discountpercent"]) || 0);
      const badge = getHeaderValue(headers, values, ["badge", "label", "tag"]) || "New";
      const colors = splitList(getHeaderValue(headers, values, ["colors", "color", "variantscolor"]));
      const sizes = splitList(getHeaderValue(headers, values, ["sizes", "size", "variantsize"]));
      const features = splitList(getHeaderValue(headers, values, ["features", "highlights", "bullets"]));
      const reviewHighlight = getHeaderValue(headers, values, ["reviewhighlight", "review", "summary", "highlight"]) || description;
      const { categoryId, categoryName } = resolveCategory(
        getHeaderValue(headers, values, ["category", "categoryname", "main_category", "subcategory"]),
        getHeaderValue(headers, values, ["categoryid", "category_id"])
      );

      return {
        name,
        brand,
        categoryId,
        categoryName,
        shortTag,
        price,
        mrp: mrpValue || price,
        stock,
        rating,
        discount,
        badge,
        description,
        reviewHighlight,
        colors: colors.length ? colors : ["Default"],
        sizes: sizes.length ? sizes : ["One size"],
        features: features.length ? features : ["Imported from dataset"],
        images: imageUrl ? [imageUrl] : undefined,
      };
    }).filter((item) => item.name && Number.isFinite(item.price));

    if (!payload.length) {
      showToast("No valid products found in CSV", "warning");
      return;
    }

    bulkCreateProducts(payload);
    setDatasetFile(null);
    showToast(`Imported ${payload.length} products`);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Admin dashboard"
        title="Operate the catalog"
        description="This screen gives product, order, and merchandising controls without losing the polished public-facing style."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <PageCard key={label} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{value}</div>
              </div>
              <div className="grid size-11 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                <BarChartIcon className="size-5 text-[color:var(--accent)]" />
              </div>
            </div>
          </PageCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
        <PageCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[color:var(--foreground)]">{editingId ? "Edit product" : "Create product"}</div>
              <div className="text-sm text-[color:var(--muted)]">Keep inputs tidy and concise.</div>
            </div>
            <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
              <PlusIcon className="size-5 text-[color:var(--accent)]" />
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <Field label="Brand" value={form.brand} onChange={(value) => setForm((current) => ({ ...current, brand: value }))} />
            <Field label="Price" type="number" value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: value }))} />
            <Field label="MRP" type="number" value={form.mrp} onChange={(value) => setForm((current) => ({ ...current, mrp: value }))} />
            <Field label="Stock" type="number" value={form.stock} onChange={(value) => setForm((current) => ({ ...current, stock: value }))} />
            <Field label="Rating" type="number" value={form.rating} onChange={(value) => setForm((current) => ({ ...current, rating: value }))} />
            <Field label="Discount" type="number" value={form.discount} onChange={(value) => setForm((current) => ({ ...current, discount: value }))} />
            <Field label="Badge" value={form.badge} onChange={(value) => setForm((current) => ({ ...current, badge: value }))} />
            <div className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium text-[color:var(--foreground)]">Category</span>
              <select value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm outline-none">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <Field className="md:col-span-2" label="Short tag" value={form.shortTag} onChange={(value) => setForm((current) => ({ ...current, shortTag: value }))} />
            <Field className="md:col-span-2" label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
            <Field className="md:col-span-2" label="Colors, comma separated" value={form.colors} onChange={(value) => setForm((current) => ({ ...current, colors: value }))} />
            <Field className="md:col-span-2" label="Sizes, comma separated" value={form.sizes} onChange={(value) => setForm((current) => ({ ...current, sizes: value }))} />
            <Field className="md:col-span-2" label="Features, comma separated" value={form.features} onChange={(value) => setForm((current) => ({ ...current, features: value }))} />
            <Field className="md:col-span-2" label="Image URL" value={form.imageUrl} onChange={(value) => setForm((current) => ({ ...current, imageUrl: value }))} />
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">
                {editingId ? "Update product" : "Create product"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                  className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </PageCard>

        <div className="grid gap-6">
          <PageCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[color:var(--foreground)]">Inventory</div>
                <div className="text-sm text-[color:var(--muted)]">Edit, delete, and review the catalog surface.</div>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
                <PackageIcon className="size-5 text-[color:var(--accent)]" />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-[color:var(--border)]">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="sticky top-0 bg-[color:var(--surface)]">
                    <tr className="border-b border-[color:var(--border)] text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.map((product) => (
                      <tr key={product.id} className="border-b border-[color:var(--border)] bg-[color:var(--surface-soft)]">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[color:var(--foreground)]">{product.name}</div>
                          <div className="text-xs text-[color:var(--muted)]">{product.categoryName}</div>
                        </td>
                        <td className="px-4 py-3 text-[color:var(--foreground)]">{money(product.price)}</td>
                        <td className="px-4 py-3 text-[color:var(--foreground)]">{product.stock}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(product)} className="rounded-full border border-[color:var(--border)] px-3 py-2 text-xs font-semibold">
                              Edit
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="rounded-full border border-[color:var(--border)] px-3 py-2 text-xs font-semibold text-rose-600">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageCard>

          <PageCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[color:var(--foreground)]">Bulk import</div>
                <div className="text-sm text-[color:var(--muted)]">Paste an array of product objects.</div>
              </div>
            <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--surface-soft)]">
              <UploadIcon className="size-5 text-[color:var(--accent)]" />
            </div>
          </div>
          <textarea value={bulkJson} onChange={(event) => setBulkJson(event.target.value)} className="mt-4 min-h-40 w-full rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 text-sm outline-none" />
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={runBulk} className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">
              Import JSON
            </button>
            <button
              type="button"
              onClick={clearAllProducts}
              className="rounded-full border border-rose-500/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-600"
            >
              Delete all products
            </button>
          </div>

            <div className="mt-6 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">CSV dataset upload</div>
                  <div className="text-sm text-[color:var(--muted)]">Auto-maps common ecommerce columns.</div>
                </div>
                <UploadIcon className="size-5 text-[color:var(--accent)]" />
              </div>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => setDatasetFile(event.target.files?.[0] || null)}
                className="mt-4 block w-full text-sm text-[color:var(--muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--surface)]"
              />
              <button
                type="button"
                onClick={() => importDatasetFile().catch(() => showToast("CSV import failed", "warning"))}
                className="mt-4 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]"
              >
                Upload CSV dataset
              </button>
            </div>
          </PageCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_.95fr]">
        <PageCard className="p-6">
          <div className="text-sm font-semibold text-[color:var(--foreground)]">Recent orders</div>
          <div className="mt-4 grid gap-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-[color:var(--foreground)]">{order.id}</div>
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">{money(order.total)}</div>
                </div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">{order.status}</div>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard className="p-6">
          <div className="text-sm font-semibold text-[color:var(--foreground)]">Operational notes</div>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">Use the editor to tune title hierarchy, pricing, and merchandising without changing the route structure.</div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">The store updates immediately so product cards, wishlists, and search all stay in sync.</div>
          </div>
        </PageCard>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", className = "" }) {
  return (
    <label className={`grid gap-2 ${className}`}>
      <span className="text-sm font-medium text-[color:var(--foreground)]">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm outline-none" />
    </label>
  );
}
