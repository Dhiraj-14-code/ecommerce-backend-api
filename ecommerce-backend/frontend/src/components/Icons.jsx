function IconBase({ children, className = "size-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function MenuIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

export function ChevronDownIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m15 6-6 6 6 6" />
    </IconBase>
  );
}

export function ChevronRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

export function HeartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s-7-4.6-9.3-8.6C.8 8.8 2.8 5.6 6.1 5.1c1.8-.3 3.4.5 4.6 1.9 1.2-1.4 2.8-2.2 4.6-1.9 3.3.5 5.3 3.7 3.4 7.3C19 16.4 12 21 12 21Z" />
    </IconBase>
  );
}

export function HeartFilledIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M12 21s-7-4.6-9.3-8.6C.8 8.8 2.8 5.6 6.1 5.1c1.8-.3 3.4.5 4.6 1.9 1.2-1.4 2.8-2.2 4.6-1.9 3.3.5 5.3 3.7 3.4 7.3C19 16.4 12 21 12 21Z"
        fill="currentColor"
        stroke="currentColor"
      />
    </IconBase>
  );
}

export function ShoppingBagIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </IconBase>
  );
}

export function UserIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c1.6-3.2 4.1-5 7-5s5.4 1.8 7 5" />
    </IconBase>
  );
}

export function MoonIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M18 14.5A7.5 7.5 0 1 1 9.5 6a6.5 6.5 0 0 0 8.5 8.5Z" />
    </IconBase>
  );
}

export function SunIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </IconBase>
  );
}

export function StarIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3Z" />
    </IconBase>
  );
}

export function TruckIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h3l4 4v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </IconBase>
  );
}

export function ShieldIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3 19 6v5c0 4.7-3.2 8.5-7 10-3.8-1.5-7-5.3-7-10V6l7-3Z" />
      <path d="m9.4 12 1.8 1.8L15 10" />
    </IconBase>
  );
}

export function ClockIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" />
    </IconBase>
  );
}

export function PercentIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 17 17 7" />
      <circle cx="8" cy="8" r="1.6" />
      <circle cx="16" cy="16" r="1.6" />
    </IconBase>
  );
}

export function PlusIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}

export function MinusIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
    </IconBase>
  );
}

export function TrashIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7h10l-1 12H8L7 7Z" />
    </IconBase>
  );
}

export function FilterIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </IconBase>
  );
}

export function GridIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </IconBase>
  );
}

export function LayoutIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 5h16v14H4z" />
      <path d="M4 10h16" />
      <path d="M9 5v14" />
    </IconBase>
  );
}

export function CreditCardIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </IconBase>
  );
}

export function MapPinIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </IconBase>
  );
}

export function PackageIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 8.5 12 4l8 4.5-8 4.5L4 8.5Z" />
      <path d="M4 8.5V17l8 4 8-4V8.5" />
      <path d="M12 13v8" />
    </IconBase>
  );
}

export function BarChartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-8" />
    </IconBase>
  );
}

export function UploadIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </IconBase>
  );
}

export function CheckIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4.2 4.2L19 6.4" />
    </IconBase>
  );
}

export function XIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}

export function EyeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </IconBase>
  );
}

export function ShoppingCartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.5L22 8H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
    </IconBase>
  );
}

export function SparklesIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" />
      <path d="M18.5 14l.8 2.4L22 17l-2.7.6-.8 2.4-.8-2.4L15 17l2.7-.6.8-2.4Z" />
    </IconBase>
  );
}

export function BellIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6 17h12c-1-1.2-1.5-2.3-1.5-4.2V10a4.5 4.5 0 1 0-9 0v2.8c0 1.9-.5 3-1.5 4.2Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function InstagramIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function TwitterIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M20 7.5c-.8.4-1.6.6-2.5.8A4.2 4.2 0 0 0 10.5 12v.6A11.7 11.7 0 0 1 4 6.2s4.6 10 14 10c-1.5 1.1-3.3 1.8-5.2 1.8" />
    </IconBase>
  );
}

export function LinkedinIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6 9v10" />
      <path d="M6 5.8v.4" />
      <path d="M10 19V9h4v1.8c.7-1.2 1.8-2 3.5-2 2.5 0 4.5 1.7 4.5 5V19h-4v-4.7c0-1.5-.6-2.5-2-2.5s-2 1-2 2.5V19" />
    </IconBase>
  );
}

export function YoutubeIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="m11 10 4 2-4 2z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
