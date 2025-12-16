import { Cinzel, Lato } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"], // Added 600 for H3s
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
        className="font-sans antialiased overflow-x-hidden"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
