export default function MarketingLayout({ children }) {
  return (
    // We just wrap the children.
    // Navbar & Footer are now handled globally in the Root Layout.
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full">{children}</main>
    </div>
  );
}
