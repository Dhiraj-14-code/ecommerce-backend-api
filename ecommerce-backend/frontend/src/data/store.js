const accentSets = [
  ["#0ea5e9", "#1d4ed8"],
  ["#111827", "#6b7280"],
  ["#8b5cf6", "#4f46e5"],
  ["#14b8a6", "#0f766e"],
  ["#f97316", "#ea580c"],
  ["#e11d48", "#be123c"],
];

const categories = [
  { id: 1, name: "New In", slug: "new-in" },
  { id: 2, name: "Footwear", slug: "footwear" },
  { id: 3, name: "Bags", slug: "bags" },
  { id: 4, name: "Electronics", slug: "electronics" },
  { id: 5, name: "Home", slug: "home" },
  { id: 6, name: "Beauty", slug: "beauty" },
];

const testimonials = [
  {
    id: 1,
    name: "Ananya R.",
    role: "Fashion Buyer",
    quote: "The shopping flow feels deliberate. Search, filters, and checkout all stay out of the way.",
  },
  {
    id: 2,
    name: "Karan M.",
    role: "Product Manager",
    quote: "The UI reads premium without getting decorative. It works on a small phone as well as a big desktop.",
  },
  {
    id: 3,
    name: "Sara T.",
    role: "Operations Lead",
    quote: "Admin controls are clear and fast. The catalog editing surface is exactly what a live store needs.",
  },
];

const reviews = [
  {
    id: 1,
    name: "Priya S.",
    title: "Verified buyer",
    rating: 5,
    date: "2026-04-11",
    text: "Premium finish, clean packaging, and the product matched the images exactly.",
  },
  {
    id: 2,
    name: "Rahul D.",
    title: "Frequent shopper",
    rating: 4,
    date: "2026-04-22",
    text: "Fast delivery and the UI made comparison easy. The wishlist and cart flow are well separated.",
  },
  {
    id: 3,
    name: "Meera J.",
    title: "Loyal customer",
    rating: 5,
    date: "2026-05-02",
    text: "The product details page feels like a high-end retail site. Reviews and variants are easy to scan.",
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function svgArt({ title, subtitle, accent, accent2, variant = 0 }) {
  const shadowX = [14, 20, 8][variant % 3];
  const shadowY = [22, 12, 28][variant % 3];
  const overlay = variant % 3 === 0 ? "circle" : variant % 3 === 1 ? "rounded" : "bar";
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e5e7eb"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="${accent2}"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="28" flood-color="#0f172a" flood-opacity=".18"/>
        </filter>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <rect x="72" y="72" width="1056" height="756" rx="48" fill="#fff" stroke="#d1d5db"/>
      <circle cx="${shadowX * 20 + 520}" cy="${shadowY * 14 + 240}" r="210" fill="url(#accent)" opacity=".10"/>
      <circle cx="920" cy="180" r="140" fill="url(#accent)" opacity=".08"/>
      <rect x="118" y="112" width="210" height="56" rx="28" fill="#0f172a"/>
      <rect x="118" y="112" width="210" height="56" rx="28" fill="none" stroke="#111827" opacity=".12"/>
      <text x="146" y="148" fill="#fff" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">${subtitle}</text>
      <rect x="126" y="232" width="420" height="280" rx="36" fill="url(#accent)" opacity=".96" filter="url(#shadow)"/>
      ${
        overlay === "circle"
          ? `<circle cx="416" cy="368" r="128" fill="#fff" opacity=".16"/><circle cx="312" cy="286" r="68" fill="#fff" opacity=".12"/>`
          : overlay === "rounded"
            ? `<rect x="250" y="298" width="260" height="140" rx="70" fill="#fff" opacity=".14"/><rect x="290" y="334" width="180" height="68" rx="34" fill="#fff" opacity=".18"/>`
            : `<rect x="184" y="292" width="320" height="34" rx="17" fill="#fff" opacity=".16"/><rect x="184" y="360" width="250" height="34" rx="17" fill="#fff" opacity=".14"/>`
      }
      <rect x="580" y="220" width="500" height="92" rx="28" fill="#0f172a"/>
      <text x="612" y="276" fill="#fff" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="800">${title}</text>
      <text x="580" y="370" fill="#111827" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="500">Premium retail art direction</text>
      <text x="580" y="418" fill="#4b5563" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="400">Responsive product imagery for polished commerce UI.</text>
      <rect x="580" y="496" width="520" height="18" rx="9" fill="#e5e7eb"/>
      <rect x="580" y="496" width="280" height="18" rx="9" fill="url(#accent)"/>
      <rect x="580" y="550" width="310" height="110" rx="26" fill="#f9fafb" stroke="#e5e7eb"/>
      <rect x="916" y="550" width="184" height="110" rx="26" fill="#f9fafb" stroke="#e5e7eb"/>
      <text x="612" y="605" fill="#111827" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">Conversion focused</text>
      <text x="612" y="640" fill="#6b7280" font-family="Inter, Arial, sans-serif" font-size="18">Strong hierarchy and clear CTAs.</text>
      <text x="948" y="605" fill="#111827" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">Mobile first</text>
      <text x="948" y="640" fill="#6b7280" font-family="Inter, Arial, sans-serif" font-size="18">Scales cleanly across breakpoints.</text>
    </svg>
  `)}`;
}

function createProduct(product, index) {
  const [accent, accent2] = accentSets[index % accentSets.length];
  const slug = slugify(product.name);
  const hero = svgArt({ title: product.name, subtitle: product.shortTag, accent, accent2, variant: 0 });
  const gallery = [
    hero,
    svgArt({ title: product.name, subtitle: "Detail view", accent: accent2, accent2: accent, variant: 1 }),
    svgArt({ title: product.name, subtitle: "Alternate angle", accent, accent2, variant: 2 }),
  ];

  return {
    id: index + 1,
    slug,
    accent,
    accent2,
    images: gallery,
    ...product,
    reviews: reviews.map((item, reviewIndex) => ({
      ...item,
      id: `${slug}-${reviewIndex + 1}`,
      text: reviewIndex === 0 ? product.reviewHighlight : item.text,
    })),
  };
}

const baseProducts = [
  {
    name: "Aero Knit Runner",
    categoryId: 2,
    categoryName: "Footwear",
    shortTag: "New season",
    price: 8490,
    mrp: 10990,
    rating: 4.8,
    reviewsCount: 248,
    stock: 42,
    badge: "Best seller",
    discount: 23,
    brand: "Northline",
    description: "Lightweight performance runner with a clean, minimal upper and responsive cushioning.",
    reviewHighlight: "The knit upper holds shape well and the cushioning feels premium throughout the day.",
    colors: ["Black", "Cloud", "Volt"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    features: ["Breathable knit upper", "Responsive foam midsole", "Rubber traction outsole"],
  },
  {
    name: "Studio Carry Tote",
    categoryId: 3,
    categoryName: "Bags",
    shortTag: "Limited drop",
    price: 5990,
    mrp: 7490,
    rating: 4.7,
    reviewsCount: 136,
    stock: 18,
    badge: "New",
    discount: 20,
    brand: "Atelier",
    description: "Structured tote with premium hardware, internal compartments, and a confident silhouette.",
    reviewHighlight: "The internal layout is genuinely usable, not just decorative, and the finish feels refined.",
    colors: ["Sand", "Black", "Cocoa"],
    sizes: ["Small", "Medium", "Large"],
    features: ["Structured body", "Magnetic top closure", "Laptop sleeve pocket"],
  },
  {
    name: "Frame Noise Buds Pro",
    categoryId: 4,
    categoryName: "Electronics",
    shortTag: "Top rated",
    price: 12990,
    mrp: 15990,
    rating: 4.9,
    reviewsCount: 411,
    stock: 60,
    badge: "Trending",
    discount: 19,
    brand: "Frame",
    description: "Adaptive noise cancelling earbuds tuned for crisp calls, deep bass, and all-day comfort.",
    reviewHighlight: "The ANC is strong without sounding harsh, and the case feels compact enough for daily carry.",
    colors: ["Graphite", "Silver", "Midnight"],
    sizes: ["One size"],
    features: ["Adaptive ANC", "Fast charge case", "Spatial audio tuning"],
  },
  {
    name: "Orbit Smartwatch 2",
    categoryId: 4,
    categoryName: "Electronics",
    shortTag: "Lifestyle tech",
    price: 16990,
    mrp: 21990,
    rating: 4.6,
    reviewsCount: 198,
    stock: 26,
    badge: "Flash sale",
    discount: 23,
    brand: "Orbit",
    description: "Clean smartwatch with health tracking, call support, and a premium aluminium case.",
    reviewHighlight: "The interface is snappy, the display is bright, and the strap feels far better than expected.",
    colors: ["Charcoal", "Starlight", "Blue"],
    sizes: ["40 mm", "44 mm"],
    features: ["Heart rate tracking", "Notification sync", "2-day battery"],
  },
  {
    name: "Contour Laptop Sleeve",
    categoryId: 3,
    categoryName: "Bags",
    shortTag: "Work essentials",
    price: 2790,
    mrp: 3490,
    rating: 4.5,
    reviewsCount: 92,
    stock: 80,
    badge: "Essential",
    discount: 20,
    brand: "Contour",
    description: "Slim protective sleeve with a matte shell and a soft microfiber interior.",
    reviewHighlight: "Protective without feeling bulky. It slides into a backpack cleanly and keeps its shape.",
    colors: ["Graphite", "Oat", "Navy"],
    sizes: ["13 inch", "14 inch", "16 inch"],
    features: ["Water resistant finish", "Microfiber lining", "Hidden accessory pocket"],
  },
  {
    name: "North Star Bottle",
    categoryId: 5,
    categoryName: "Home",
    shortTag: "Desk and gym",
    price: 1690,
    mrp: 2190,
    rating: 4.8,
    reviewsCount: 311,
    stock: 110,
    badge: "Popular",
    discount: 23,
    brand: "North Star",
    description: "Double-wall bottle with a matte powder coat and a minimal silhouette.",
    reviewHighlight: "Keeps water cold for a long stretch and the cap seals tightly in a bag.",
    colors: ["Black", "Stone", "Forest"],
    sizes: ["750 ml", "1 L"],
    features: ["Vacuum insulated", "Leakproof cap", "Powder coated finish"],
  },
  {
    name: "Aura Desk Lamp",
    categoryId: 5,
    categoryName: "Home",
    shortTag: "Ambient lighting",
    price: 4590,
    mrp: 5990,
    rating: 4.4,
    reviewsCount: 84,
    stock: 34,
    badge: "Editor pick",
    discount: 23,
    brand: "Aura",
    description: "Adjustable desk lamp with warm and cool modes, built for focused work sessions.",
    reviewHighlight: "The base is compact, the light is even, and the dimming range is excellent for late-night work.",
    colors: ["White", "Graphite"],
    sizes: ["Standard"],
    features: ["Three color temperatures", "Touch control", "USB-C powered"],
  },
  {
    name: "Glow Balance Serum",
    categoryId: 6,
    categoryName: "Beauty",
    shortTag: "Daily routine",
    price: 1890,
    mrp: 2490,
    rating: 4.7,
    reviewsCount: 207,
    stock: 96,
    badge: "New launch",
    discount: 24,
    brand: "Glow Lab",
    description: "Lightweight serum designed for a clean routine with a polished retail presentation.",
    reviewHighlight: "Absorbs quickly, layers well, and the minimalist packaging looks premium on a shelf.",
    colors: ["Clear"],
    sizes: ["30 ml", "50 ml"],
    features: ["Fast absorbing", "Fragrance light", "Clean formula"],
  },
  {
    name: "Pulse Power Bank",
    categoryId: 4,
    categoryName: "Electronics",
    shortTag: "Travel ready",
    price: 3490,
    mrp: 4390,
    rating: 4.8,
    reviewsCount: 165,
    stock: 64,
    badge: "High demand",
    discount: 21,
    brand: "Pulse",
    description: "Compact fast-charging power bank with dual outputs and a refined matte body.",
    reviewHighlight: "Charges a phone quickly and sits flat in a sling bag or backpack pocket.",
    colors: ["Charcoal", "Silver"],
    sizes: ["10,000 mAh", "20,000 mAh"],
    features: ["Dual USB-C output", "Fast charge support", "Travel friendly"],
  },
  {
    name: "Mono Everyday Sneaker",
    categoryId: 2,
    categoryName: "Footwear",
    shortTag: "Signature shape",
    price: 7490,
    mrp: 9490,
    rating: 4.6,
    reviewsCount: 122,
    stock: 54,
    badge: "Top rated",
    discount: 21,
    brand: "Mono",
    description: "Clean monochrome sneaker with a sculpted sole and a premium streetwear profile.",
    reviewHighlight: "Runs true to size and the silhouette looks expensive without any unnecessary detail.",
    colors: ["Black", "White", "Taupe"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    features: ["Cushioned footbed", "Sculpted sole", "Easy slip-on liner"],
  },
  {
    name: "Flux Desk Mat",
    categoryId: 5,
    categoryName: "Home",
    shortTag: "Workspace detail",
    price: 1190,
    mrp: 1490,
    rating: 4.5,
    reviewsCount: 71,
    stock: 140,
    badge: "Value",
    discount: 20,
    brand: "Flux",
    description: "Oversized desk mat with a soft-touch surface and a stable non-slip backing.",
    reviewHighlight: "Makes a desk feel finished and the material has a noticeably better hand feel than cheap mats.",
    colors: ["Black", "Ash", "Olive"],
    sizes: ["Small", "Large", "XL"],
    features: ["Non-slip base", "Stitch edge finish", "Soft touch surface"],
  },
  {
    name: "Luxe Fragrance Mist",
    categoryId: 6,
    categoryName: "Beauty",
    shortTag: "Signature scent",
    price: 1590,
    mrp: 2090,
    rating: 4.3,
    reviewsCount: 104,
    stock: 88,
    badge: "Giftable",
    discount: 24,
    brand: "Luxe",
    description: "Elegant fragrance mist with a clean, balanced profile and premium shelf presence.",
    reviewHighlight: "Feels refined for the price and the bottle design looks far more premium than expected.",
    colors: ["Pearl", "Smoke"],
    sizes: ["100 ml"],
    features: ["Long lasting mist", "Layering friendly", "Gift ready packaging"],
  },
];

const products = baseProducts.map(createProduct);

const orders = [
  {
    id: "ORD-2048",
    date: "2026-05-03T10:24:00.000Z",
    status: "Delivered",
    total: 13480,
    items: [
      { productId: 1, name: "Aero Knit Runner", quantity: 1, price: 8490 },
      { productId: 5, name: "Contour Laptop Sleeve", quantity: 1, price: 2790 },
    ],
  },
  {
    id: "ORD-2191",
    date: "2026-05-19T14:12:00.000Z",
    status: "In Transit",
    total: 18470,
    items: [
      { productId: 3, name: "Frame Noise Buds Pro", quantity: 1, price: 12990 },
      { productId: 6, name: "North Star Bottle", quantity: 2, price: 1690 },
    ],
  },
];

const announcements = [
  "Free delivery above INR 999",
  "10% off on first order",
  "Same-day dispatch in metro cities",
];

function getProductById(productId) {
  return products.find((product) => product.id === Number(productId));
}

function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

function getCategoryById(categoryId) {
  return categories.find((category) => category.id === Number(categoryId));
}

export {
  announcements,
  categories,
  getCategoryById,
  getProductById,
  getProductBySlug,
  orders,
  products,
  testimonials,
  slugify,
};
