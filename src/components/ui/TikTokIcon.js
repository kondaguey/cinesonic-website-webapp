export default function TikTokIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      className={className} // <--- vital for positioning!
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}
