import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
// NOTE: We REMOVED the Navbar import from here.
// It belongs in your MarketingLayout, not here.

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata = {
  title: "CineSonic Production Intelligence",
  description: "Audiobook production management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${lato.variable}`}>
      <body className="font-sans antialiased bg-deep-space text-white">
        {/* Render children directly. The MarketingLayout will wrap the Navbar around them. */}
        {children}
      </body>
    </html>
  );
}
