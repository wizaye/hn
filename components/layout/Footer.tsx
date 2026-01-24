import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 max-w-7xl w-full">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hyderabad Networks</h3>
            <p className="text-sm text-muted-foreground">
              Premium corporate clock solutions for bulk gifting and custom branding.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#custom-work" className="text-muted-foreground hover:text-foreground transition-colors">
                  Custom Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: enquiries@hyderabadnetworks.com</li>
              <li>Phone: +91 (040) 1234-5678</li>
              <li>Corporate Enquiries: corporate@hyderabadnetworks.com</li>
            </ul>
          </div>

          {/* Corporate Enquiry */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Corporate Enquiry</h3>
            <p className="text-sm text-muted-foreground">
              For bulk orders and custom branding solutions, please contact our corporate sales team.
            </p>
            <Link
              href="/#enquiry-section"
              className="inline-block text-sm font-medium text-primary hover:underline"
            >
              Submit Enquiry →
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Hyderabad Networks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

