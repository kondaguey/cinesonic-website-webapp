import Navbar from "@/src/components/marketing/Navbar";
import Footer from "@/src/components/marketing/Footer";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full">{children}</main>

      <Footer />
    </div>
  );
}
