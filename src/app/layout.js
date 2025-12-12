// app/layout.js
import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import the new wrapper

// Configure Google Fonts
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
