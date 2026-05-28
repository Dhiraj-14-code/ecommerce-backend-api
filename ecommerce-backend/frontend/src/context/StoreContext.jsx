/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { categories as seedCategories, announcements, orders as seedOrders, products as seedProducts, testimonials } from "../data/store";

const StoreContext = createContext(null);

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function formatCartItem(product, variant = {}) {
  return {
    key: `${product.id}-${variant.size || "one"}-${variant.color || "default"}`,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    image: product.images[0],
    price: product.price,
    quantity: 1,
    size: variant.size || product.sizes?.[0] || "One size",
    color: variant.color || product.colors?.[0] || "Default",
  };
}

function resolveCategory(categoryId, categoryName) {
  const normalizedId = Number(categoryId);
  if (Number.isFinite(normalizedId)) {
    const byId = seedCategories.find((category) => category.id === normalizedId);
    if (byId) return byId;
  }

  const normalizedName = String(categoryName || "").trim().toLowerCase();
  if (normalizedName) {
    const byName = seedCategories.find((category) => {
      const name = category.name.toLowerCase();
      const slug = category.slug.toLowerCase();
      return name === normalizedName || slug === normalizedName || name.includes(normalizedName);
    });
    if (byName) return byName;
  }

  return seedCategories[0];
}

function normalizeProduct(product, fallbackIndex = 0) {
  const category = resolveCategory(product.categoryId, product.categoryName);
  const images = product.images?.length ? product.images : makeFallbackImages(product.name || `Product ${fallbackIndex + 1}`);
  const slug = product.slug || (product.name || `product-${fallbackIndex + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    ...product,
    categoryId: category.id,
    categoryName: category.name,
    slug,
    images,
  };
}

function buildOrder(cartItems, shipping, user) {
  const items = cartItems.map((item) => ({
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
    size: item.size,
    color: item.color,
  }));

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString(),
    status: "Processing",
    total,
    shipping,
    customer: {
      name: user?.name || shipping.name || "Guest Shopper",
      email: user?.email || shipping.email || "",
    },
    items,
  };
}

function makeFallbackImages(title) {
  return [0, 1, 2].map((index) => {
    const encoded = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
        <defs>
          <linearGradient id="a${index}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#111827" />
            <stop offset="100%" stop-color="#334155" />
          </linearGradient>
          <linearGradient id="b${index}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0ea5e9" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>
        </defs>
        <rect width="1200" height="900" fill="#f8fafc"/>
        <rect x="80" y="80" width="1040" height="740" rx="48" fill="#fff" stroke="#e5e7eb"/>
        <rect x="160" y="180" width="420" height="420" rx="48" fill="url(#a${index})"/>
        <circle cx="${430 + index * 16}" cy="${370 + index * 10}" r="${120 - index * 10}" fill="url(#b${index})" opacity=".18"/>
        <rect x="640" y="220" width="360" height="90" rx="28" fill="#111827"/>
        <text x="676" y="276" fill="#fff" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="700">${title}</text>
        <text x="640" y="390" fill="#6b7280" font-family="Inter, Arial, sans-serif" font-size="26">Auto-generated retail artwork</text>
        <rect x="640" y="440" width="360" height="18" rx="9" fill="#e5e7eb"/>
        <rect x="640" y="440" width="${220 + index * 40}" height="18" rx="9" fill="url(#b${index})"/>
      </svg>
    `);
    return `data:image/svg+xml;charset=UTF-8,${encoded}`;
  });
}

export function StoreProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("store-theme") || "dark");
  const [user, setUser] = useState(() => readStorage("store-user", null));
  const [catalog, setCatalog] = useState(() => readStorage("store-catalog", seedProducts));
  const [wishlistIds, setWishlistIds] = useState(() => readStorage("store-wishlist", []));
  const [cartItems, setCartItems] = useState(() => readStorage("store-cart", []));
  const [orders, setOrders] = useState(() => readStorage("store-orders", seedOrders));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("store-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("store-user", JSON.stringify(user));
    localStorage.setItem("store-catalog", JSON.stringify(catalog));
    localStorage.setItem("store-wishlist", JSON.stringify(wishlistIds));
    localStorage.setItem("store-cart", JSON.stringify(cartItems));
    localStorage.setItem("store-orders", JSON.stringify(orders));
  }, [user, catalog, wishlistIds, cartItems, orders]);

  useEffect(() => {
    if (!document.documentElement.dataset.theme) {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const showToast = (message, variant = "default") => {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  };

  const login = ({ name, email, role = "customer" }) => {
    const nextUser = { name, email, role };
    setUser(nextUser);
    showToast(`Signed in as ${name}`);
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    showToast("Signed out");
  };

  const addToWishlist = (productId) => {
    setWishlistIds((current) => {
      if (current.includes(productId)) return current;
      showToast("Saved to wishlist");
      return [...current, productId];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistIds((current) => current.filter((id) => id !== productId));
    showToast("Removed from wishlist");
  };

  const toggleWishlist = (productId) => {
    setWishlistIds((current) => {
      const exists = current.includes(productId);
      showToast(exists ? "Removed from wishlist" : "Saved to wishlist");
      return exists ? current.filter((id) => id !== productId) : [...current, productId];
    });
  };

  const addToCart = (product, variant = {}, quantity = 1) => {
    setCartItems((current) => {
      const next = [...current];
      const key = `${product.id}-${variant.size || "one"}-${variant.color || "default"}`;
      const index = next.findIndex((item) => item.key === key);
      if (index >= 0) {
        next[index] = { ...next[index], quantity: next[index].quantity + quantity };
      } else {
        next.push({ ...formatCartItem(product, variant), quantity });
      }
      showToast("Added to cart");
      return next;
    });
  };

  const updateCartItem = (key, quantity) => {
    setCartItems((current) =>
      current
        .map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (key) => {
    setCartItems((current) => current.filter((item) => item.key !== key));
    showToast("Item removed");
  };

  const clearCart = () => setCartItems([]);

  const checkout = (shipping) => {
    if (!cartItems.length) return null;
    const order = buildOrder(cartItems, shipping, user);
    setOrders((current) => [order, ...current]);
    setCartItems([]);
    showToast("Order placed successfully");
    return order;
  };

  const createProduct = (product) => {
    const nextId = Math.max(0, ...catalog.map((item) => item.id)) + 1;
    const normalized = normalizeProduct(product);
    const nextProduct = {
      ...normalized,
      id: nextId,
      reviews: normalized.reviews || [],
    };
    setCatalog((current) => [nextProduct, ...current]);
    showToast("Product created");
    return nextProduct;
  };

  const updateProduct = (productId, values) => {
    setCatalog((current) =>
      current.map((product) => {
        if (product.id !== productId) return product;
        const normalized = normalizeProduct({ ...product, ...values }, product.id);
        return { ...product, ...normalized };
      })
    );
    showToast("Product updated");
  };

  const deleteProduct = (productId) => {
    setCatalog((current) => current.filter((product) => product.id !== productId));
    setWishlistIds((current) => current.filter((id) => id !== productId));
    setCartItems((current) => current.filter((item) => item.productId !== productId));
    showToast("Product removed");
  };

  const bulkCreateProducts = (items) => {
    const nextItems = items.map((item, index) => ({
      ...normalizeProduct(item, index),
      id: Math.max(0, ...catalog.map((product) => product.id)) + index + 1,
    }));
    setCatalog((current) => [...nextItems, ...current]);
    showToast("Bulk import completed");
  };

  const deleteAllProducts = () => {
    setCatalog([]);
    setWishlistIds([]);
    setCartItems([]);
    showToast("All products removed");
  };

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlist = wishlistIds.length;
    const catalogCount = catalog.length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    return { subtotal, itemCount, wishlist, catalogCount, revenue };
  }, [cartItems, wishlistIds.length, catalog.length, orders]);

  const value = {
    theme,
    setTheme,
    user,
    login,
    logout,
    catalog,
    categories: seedCategories,
    testimonials,
    announcements,
    orders,
    cartItems,
    wishlistIds,
    summary,
    showToast,
    toasts,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    checkout,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkCreateProducts,
    deleteAllProducts,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
