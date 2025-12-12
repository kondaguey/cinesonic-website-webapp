import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 border-b border-gray-800 bg-deep-space/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-white">CineSonic</div>
        <div className="space-x-4">
          <Link href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white">
            Pricing
          </Link>
          {/* This link takes them to the other side of the app! */}
          <Link
            href="/dashboard"
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
