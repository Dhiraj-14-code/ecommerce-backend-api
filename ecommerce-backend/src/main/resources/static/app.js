const state = {
  token: localStorage.getItem("token") || "",
  role: localStorage.getItem("role") || "",
  products: [],
  cart: null,
  categories: []
};

const $ = (id) => document.getElementById(id);
const apiBase = "";

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => (t.style.display = "none"), 2200);
}

function authHeaders() {
  return state.token ? { Authorization: `Bearer ${state.token}` } : {};
}

function parseJwtRole(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = (payload.role || "").toUpperCase();
    return role;
  } catch {
    return "";
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

async function register() {
  const body = {
    name: $("regName").value.trim(),
    email: $("regEmail").value.trim(),
    password: $("regPassword").value
  };
  await request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  toast("Registered. Please login.");
}

async function login() {
  const body = {
    email: $("loginEmail").value.trim(),
    password: $("loginPassword").value
  };
  const data = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  state.token = data.token;
  state.role = parseJwtRole(data.token);
  localStorage.setItem("token", state.token);
  localStorage.setItem("role", state.role);
  $("authPanel").classList.add("hidden");
  toggleAdmin();
  await loadProducts();
  await loadCategories();
  toast("Login successful");
}

function logout() {
  state.token = "";
  state.role = "";
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  $("authPanel").classList.remove("hidden");
  $("adminBlock").classList.add("hidden");
  $("cartPanel").classList.add("hidden");
  $("ordersPanel").classList.add("hidden");
  toast("Logged out");
}

function toggleAdmin() {
  if (state.role === "ADMIN") $("adminBlock").classList.remove("hidden");
  else $("adminBlock").classList.add("hidden");
}

async function loadProducts(query = "") {
  const path = query
    ? `/api/products/search?name=${encodeURIComponent(query)}`
    : "/api/products?page=0&size=20&sortBy=id&sortDir=asc";
  state.products = await request(path, { headers: { ...authHeaders() } });
  renderProducts();
}

function renderCategoryOptions() {
  const select = $("pCategoryId");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = '<option value="">Select category</option>';
  state.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = `${category.name} (ID: ${category.id})`;
    select.appendChild(option);
  });
  if (currentValue && state.categories.some((category) => String(category.id) === currentValue)) {
    select.value = currentValue;
  } else if (!select.value && state.categories.length) {
    select.value = String(state.categories[0].id);
  }
}

async function loadCategories() {
  if (!state.token) return;
  state.categories = await request("/api/categories", { headers: { ...authHeaders() } });
  renderCategoryOptions();
}

function renderProducts() {
  const grid = $("productsGrid");
  grid.innerHTML = "";
  if (!state.products.length) {
    grid.innerHTML = "<div class='card'><h4>No products found</h4><div class='meta'>Try different search text.</div></div>";
    return;
  }
  state.products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${p.name}</h4>
      <div class="meta"><strong>₹${p.price}</strong> | Stock: ${p.stock}</div>
      <div class="meta">${p.description || ""}</div>
      <div class="inline">
        <input id="qty-${p.id}" type="number" min="1" value="1" style="max-width:80px">
        <button class="btn primary" data-add="${p.id}">Add To Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
  grid.querySelectorAll("[data-add]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!state.token) return toast("Login first");
      const productId = Number(btn.getAttribute("data-add"));
      const qty = Number($(`qty-${productId}`).value || 1);
      try {
        await request("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ productId, quantity: qty })
        });
        toast("Added to cart");
      } catch (e) {
        toast(e.message);
      }
    })
  );
}

async function createProduct() {
  const categoryId = Number($("pCategoryId").value);
  if (!categoryId) {
    toast("Select a category");
    return;
  }
  const body = {
    name: $("pName").value.trim(),
    description: $("pDescription").value.trim(),
    price: Number($("pPrice").value),
    stock: Number($("pStock").value),
    categoryId
  };
  await request("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body)
  });
  toast("Product created");
  await loadProducts();
}

function normalizeBulkProduct(product) {
  return {
    name: String(product.name || "").trim(),
    description: String(product.description || "").trim(),
    price: Number(product.price),
    stock: Number(product.stock ?? 0),
    imageUrl: String(product.imageUrl || "").trim() || undefined,
    categoryId: Number(product.categoryId)
  };
}

async function importProductsBulkJson() {
  const raw = $("bulkJsonInput").value.trim();
  if (!raw) {
    toast("Paste a JSON array first");
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    toast("Invalid JSON");
    return;
  }

  if (!Array.isArray(payload) || !payload.length) {
    toast("Provide a non-empty JSON array");
    return;
  }

  const products = payload.map(normalizeBulkProduct);
  if (products.some((product) => !product.name || !product.categoryId || Number.isNaN(product.price))) {
    toast("Each product needs name, price, stock, and categoryId");
    return;
  }

  await request("/api/products/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(products)
  });
  toast(`Imported ${products.length} products`);
  await loadProducts();
}

async function importProductsCsv() {
  const input = $("bulkCsvInput");
  const file = input.files?.[0];
  if (!file) {
    toast("Choose a CSV file first");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/products/upload-csv", {
    method: "POST",
    headers: authHeaders(),
    body: formData
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);

  input.value = "";
  toast(`Imported ${Array.isArray(data) ? data.length : 0} products`);
  await loadProducts();
}

async function importProductsDataset() {
  const input = $("bulkDatasetInput");
  const file = input.files?.[0];
  if (!file) {
    toast("Choose a CSV or JSON file first");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/products/upload-dataset", {
    method: "POST",
    headers: authHeaders(),
    body: formData
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);

  input.value = "";
  toast(`Imported ${Array.isArray(data) ? data.length : 0} products`);
  await loadProducts();
}

async function openCart() {
  if (!state.token) return toast("Login first");
  $("ordersPanel").classList.add("hidden");
  $("cartPanel").classList.remove("hidden");
  state.cart = await request("/api/cart", { headers: { ...authHeaders() } });
  renderCart();
}

function renderCart() {
  const holder = $("cartItems");
  holder.innerHTML = "";
  if (!state.cart?.items?.length) {
    holder.innerHTML = "<div class='card'><h4>Your cart is empty</h4><div class='meta'>Add products from catalog to continue.</div></div>";
    $("cartTotal").textContent = "";
    return;
  }
  state.cart.items.forEach((it) => {
    const row = document.createElement("div");
    row.className = "card";
    row.innerHTML = `
      <h4>${it.productName}</h4>
      <div class="meta">₹${it.price} x ${it.quantity} = ₹${it.lineTotal}</div>
      <div class="inline">
        <input id="up-${it.itemId}" type="number" min="1" value="${it.quantity}" style="max-width:90px">
        <button class="btn" data-up="${it.itemId}">Update</button>
        <button class="btn danger" data-del="${it.itemId}">Remove</button>
      </div>
    `;
    holder.appendChild(row);
  });
  $("cartTotal").textContent = `Total: ₹${state.cart.totalAmount}`;

  holder.querySelectorAll("[data-up]").forEach((b) =>
    b.addEventListener("click", async () => {
      const itemId = b.getAttribute("data-up");
      const quantity = Number($(`up-${itemId}`).value);
      await request(`/api/cart/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ quantity })
      });
      await openCart();
      toast("Updated");
    })
  );
  holder.querySelectorAll("[data-del]").forEach((b) =>
    b.addEventListener("click", async () => {
      const itemId = b.getAttribute("data-del");
      await request(`/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: { ...authHeaders() }
      });
      await openCart();
      toast("Removed");
    })
  );
}

async function placeOrder() {
  await request("/api/orders", { method: "POST", headers: { ...authHeaders() } });
  toast("Order placed");
  await openCart();
}

async function openOrders() {
  if (!state.token) return toast("Login first");
  $("cartPanel").classList.add("hidden");
  $("ordersPanel").classList.remove("hidden");
  const orders = await request("/api/orders", { headers: { ...authHeaders() } });
  const holder = $("ordersList");
  holder.innerHTML = "";
  if (!orders.length) return (holder.innerHTML = "<div class='card'><h4>No orders yet</h4><div class='meta'>Place your first order from cart.</div></div>");
  orders.forEach((o) => {
    const el = document.createElement("div");
    el.className = "order";
    el.innerHTML = `
      <h4>Order #${o.orderId} - ${o.status}</h4>
      <div class="meta">${new Date(o.createdAt).toLocaleString()}</div>
      <div class="meta"><strong>Total: ₹${o.totalAmount}</strong></div>
      <ul>${o.items.map((i) => `<li>${i.productName} x ${i.quantity}</li>`).join("")}</ul>
    `;
    holder.appendChild(el);
  });
}

$("registerBtn").addEventListener("click", () => register().catch((e) => toast(e.message)));
$("loginBtn").addEventListener("click", () => login().catch((e) => toast(e.message)));
$("logoutBtn").addEventListener("click", logout);
$("refreshBtn").addEventListener("click", () => loadProducts().catch((e) => toast(e.message)));
$("searchBtn").addEventListener("click", () => loadProducts($("searchInput").value.trim()).catch((e) => toast(e.message)));
$("createProductBtn").addEventListener("click", () => createProduct().catch((e) => toast(e.message)));
$("bulkJsonBtn").addEventListener("click", () => importProductsBulkJson().catch((e) => toast(e.message)));
$("bulkCsvBtn").addEventListener("click", () => importProductsCsv().catch((e) => toast(e.message)));
$("bulkDatasetBtn").addEventListener("click", () => importProductsDataset().catch((e) => toast(e.message)));
$("cartBtn").addEventListener("click", () => openCart().catch((e) => toast(e.message)));
$("ordersBtn").addEventListener("click", () => openOrders().catch((e) => toast(e.message)));
$("placeOrderBtn").addEventListener("click", () => placeOrder().catch((e) => toast(e.message)));

(async function init() {
  toggleAdmin();
  if (state.token) $("authPanel").classList.add("hidden");
  try {
    if (state.token) await loadProducts();
    if (state.token) await loadCategories();
  } catch {
    logout();
  }
})();
