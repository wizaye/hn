import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hyderabad Networks. All rights reserved.</p>
          <div className="flex gap-6 justify-center sm:justify-start">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="/#custom-work" className="hover:text-foreground transition-colors">
              Custom Work
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

