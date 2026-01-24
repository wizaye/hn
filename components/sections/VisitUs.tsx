"use client";

import { MapPin, Phone, Clock } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Social Media Icon Components
const FacebookIcon = (props: React.ComponentProps<"svg">) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = (props: React.ComponentProps<"svg">) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TwitterIcon = (props: React.ComponentProps<"svg">) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="m18.9,1.153h3.682l-8.042,9.189,9.46,12.506h-7.405l-5.804-7.583-6.634,7.583H.469l8.6-9.831L0,1.153h7.593l5.241,6.931,6.065-6.931Zm-1.293,19.494h2.039L6.482,3.239h-2.19l13.314,17.408Z" />
  </svg>
);

const LinkedInIcon = (props: React.ComponentProps<"svg">) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const contactInfo = [
  {
    icon: Phone,
    title: "Contact Us",
    details: [
      { label: "Phone", value: "+91 40 1234 5678" },
      { label: "Email", value: "sales@hyderabadnetworks.com" },
    ],
    description: "We're available Mon-Sat, 9am-7pm. Email responses within 24hrs.",
    href: "tel:+914012345678",
  },
  {
    icon: MapPin,
    title: "Visit Our Showroom",
    details: [
      { label: null, value: "Hyderabad Network, Secunderabad" },
      { label: null, value: "Hyderabad, Telangana" },
    ],
    description: "Authorised Distributor for Ajanta & Orpat Group",
    href: "https://maps.google.com/maps?q=Hyderabad+Network+(Authorised+Distributor+for+Ajanta+%26+Orpat+Group)",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: [
      { label: null, value: "Mon-Sat: 9:00 AM - 7:00 PM" },
      { label: null, value: "Sunday: Closed" },
    ],
    description: "Visit us during these hours for the best service.",
  },
];

const socialLinks = [
  {
    icon: FacebookIcon,
    href: "#",
    label: "Facebook",
  },
  {
    icon: InstagramIcon,
    href: "#",
    label: "Instagram",
  },
  {
    icon: TwitterIcon,
    href: "#",
    label: "Twitter",
  },
  {
    icon: LinkedInIcon,
    href: "#",
    label: "LinkedIn",
  },
];

type ContactBox = {
  icon: LucideIcon;
  title: string;
  description: string;
  details: { label: string | null; value: string }[];
  href?: string;
  className?: string;
};

function Box({ title, description, className, details, href, icon: Icon }: ContactBox) {
  const content = (
    <>
      <div className="flex items-center gap-x-3 border-b bg-secondary/50 p-3 dark:bg-secondary/20">
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.5} />
        <h2 className="font-medium text-base tracking-wide">{title}</h2>
      </div>
      <div className="flex flex-col gap-y-1.5 p-3 py-4">
        {details.map((detail, i) => (
          <div key={i} className="flex items-center gap-x-2">
            {detail.label && (
              <span className="text-xs text-muted-foreground min-w-[50px]">{detail.label}:</span>
            )}
            <span className="font-medium font-mono text-xs tracking-wide">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t p-3">
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={cn(
          "flex flex-col justify-between border rounded-lg overflow-hidden hover:shadow-md transition-shadow",
          className
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col justify-between border rounded-lg overflow-hidden",
        className
      )}
    >
      {content}
    </div>
  );
}

export function VisitUs() {
  return (
    <section id="visit-us" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground tracking-tight">
            Visit <span className="text-foreground">Us</span>
          </h2>
          <p className="mx-auto max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            Get in touch with us or visit our showroom to explore our collection
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left side - Contact boxes in 2 columns */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contactInfo.map((item, idx) => (
              <Box
                key={idx}
                icon={item.icon}
                title={item.title}
                description={item.description}
                details={item.details}
                href={item.href}
                className={idx === 0 ? "sm:col-span-2" : ""}
              />
            ))}
          </div>

          {/* Right side - Map */}
          <div className="rounded-lg overflow-hidden border bg-muted min-h-[400px] lg:min-h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60903.118215580835!2d78.44015556953127!3d17.438407935443735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb977d612c6e45%3A0xc314db2fe6da506f!2sHyderabad%20Network%20(Authorised%20Distributor%20for%20Ajanta%20%26%20Orpat%20Group)!5e0!3m2!1sen!2sin!4v1769278199509!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hyderabad Network Location"
            />
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4">
          <h3 className="text-center font-medium text-xl text-muted-foreground tracking-tight">
            Find us <span className="text-foreground">online</span>
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {socialLinks.map((link) => (
              <a
                className="flex items-center gap-x-2 rounded-full border bg-card px-3 py-1.5 shadow hover:bg-accent transition-colors"
                href={link.href}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <link.icon className="size-3.5 text-muted-foreground" />
                <span className="font-medium font-mono text-xs tracking-wide">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
