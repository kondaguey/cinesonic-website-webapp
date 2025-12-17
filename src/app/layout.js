import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
// 🟢 CHANGE: Import the Context, not the Wrapper
import { ThemeProvider } from "@/src/components/ui/ThemeContext";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata = {
  title: "CineSonic | See Stories in Sound",
  description: "Audiobook production management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${lato.variable}`}>
      <body
        className="font-sans antialiased overflow-x-hidden bg-[#020010] text-white"
        suppressHydrationWarning={true}
      >
        {/* 🟢 LOGIC ONLY: Provides 'theme', 'setTheme', etc. to the whole app.
            But DOES NOT render a Navbar or Footer. */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
