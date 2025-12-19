import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
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
    // 🟢 REQUIRED: html tag with font variables
    <html lang="en" className={`${cinzel.variable} ${lato.variable}`}>
      {/* 🟢 REQUIRED: body tag with your theme background */}
      <body
        className="font-sans antialiased overflow-x-hidden bg-[#020010] text-white"
        suppressHydrationWarning={true}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
