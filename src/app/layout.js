import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "@/src/components/ui/ThemeWrapper"; // Import the Controller

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
        // Added base bg/text colors here to prevent white flash before theme loads
        className="font-sans antialiased overflow-x-hidden bg-[#020010] text-white"
        suppressHydrationWarning={true}
      >
        {/* ThemeWrapper is a Client Component. 
            It checks the URL (usePathname) and injects the correct 
            Navbar/Footer Theme (Gold, Pink, Cyan, System) automatically.
        */}
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
