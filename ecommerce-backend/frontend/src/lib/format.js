export function money(value = 0) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export function dateLabel(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function dateTimeLabel(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ratingLabel(value = 0) {
  return Number(value).toFixed(1);
}

