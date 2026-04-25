import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="px-6 md:px-10 lg:px-16 py-8">
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-[11px] font-medium uppercase tracking-widest text-foreground/40 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hyderabad Networks. All rights reserved.</p>
          <div className="flex gap-8 justify-center sm:justify-start">
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

