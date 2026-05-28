import { Link } from "react-router-dom";
import { EmptyState } from "../components/Skeletons";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The route does not exist in this storefront shell."
      action={<Link to="/" className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-[color:var(--surface)]">Go home</Link>}
    />
  );
}

