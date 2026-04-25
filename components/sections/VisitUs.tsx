"use client";

import { MapPin, Phone, Clock, Share2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Social Media Icon Components
const WhatsAppIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}><g clipPath="url(#clip0_2041_25)"><path d="M6.34345 20.555L6.7358 20.749C8.37079 21.7185 10.2018 22.171 12.033 22.171C17.7878 22.171 22.4963 17.517 22.4963 11.8288C22.4963 9.11406 21.3845 6.46387 19.4227 4.52469C17.4608 2.5855 14.8449 1.48669 12.033 1.48669C6.27811 1.48669 1.56951 6.14066 1.63495 11.8935C1.63495 13.8326 2.22351 15.7072 3.20442 17.3231L3.46598 17.711L2.41973 21.5247L6.34345 20.555Z" fill="#00E676" /><path d="M20.5343 3.49047C18.3109 1.22817 15.2373 0 12.0983 0C5.42794 0 0.0654375 5.36497 0.130781 11.8934C0.130781 13.9619 0.719344 15.9657 1.70034 17.7756L0 23.9162L6.34341 22.3003C8.10909 23.2699 10.0709 23.7224 12.0329 23.7224C18.6379 23.7224 24.0004 18.3573 24.0004 11.8289C24.0004 8.66159 22.7577 5.68819 20.5343 3.49047ZM12.0983 21.7186C10.3326 21.7186 8.56687 21.2662 7.06275 20.3613L6.67041 20.1673L2.87747 21.1369L3.85837 17.4525L3.59681 17.0646C0.719344 12.4754 2.09269 6.3992 6.80119 3.55506C11.5097 0.711012 17.5915 2.06845 20.469 6.72241C23.3464 11.3764 21.973 17.3878 17.2646 20.2319C15.7604 21.2015 13.9294 21.7185 12.0983 21.7185V21.7186ZM17.8531 14.5438L17.1337 14.2206C17.1337 14.2206 16.0875 13.7681 15.4335 13.4449C15.3681 13.4449 15.3027 13.3802 15.2373 13.3802C15.0411 13.3802 14.9103 13.4449 14.7795 13.5096C14.7795 13.5096 14.7142 13.5742 13.7986 14.6084C13.7332 14.7377 13.6024 14.8023 13.4716 14.8023H13.4062C13.3408 14.8023 13.21 14.7377 13.1446 14.6731L12.8176 14.5438C12.0982 14.2206 11.4443 13.8327 10.9211 13.3156C10.7903 13.1864 10.5941 13.0571 10.4633 12.9278C10.0056 12.4754 9.54778 11.9582 9.22087 11.3765L9.15544 11.2472C9.09009 11.1825 9.09009 11.1179 9.02466 10.9887C9.02466 10.8594 9.02466 10.7301 9.09009 10.6655C9.09009 10.6655 9.35166 10.3422 9.54778 10.1484C9.67866 10.019 9.744 9.82517 9.87478 9.69591C10.0056 9.50196 10.071 9.24343 10.0056 9.04948C9.94022 8.72627 9.15544 6.98103 8.95931 6.59324C8.82844 6.39929 8.69775 6.3347 8.50153 6.27002H7.78219C7.65131 6.27002 7.52062 6.3347 7.38975 6.3347L7.32431 6.39929C7.19353 6.46397 7.06275 6.59324 6.93197 6.65782C6.80119 6.78718 6.73575 6.91636 6.60497 7.04571C6.14719 7.62746 5.88562 8.33847 5.88562 9.04948C5.88562 9.56655 6.01641 10.0837 6.21262 10.5362L6.27806 10.7301C6.86663 11.9582 7.65131 13.0571 8.69775 14.0267L8.95931 14.2852C9.15544 14.4791 9.35166 14.6084 9.48244 14.8023C10.8558 15.9658 12.4252 16.8061 14.1909 17.2586C14.3872 17.3232 14.6487 17.3232 14.8449 17.3879H15.4988C15.8258 17.3879 16.2182 17.2586 16.4798 17.1293C16.676 17.0001 16.8068 17.0001 16.9375 16.8708L17.0684 16.7414C17.1992 16.6122 17.33 16.5476 17.4608 16.4183C17.5915 16.2891 17.7223 16.1598 17.7878 16.0304C17.9185 15.7719 17.9839 15.4487 18.0493 15.1256V14.6731C18.0493 14.6731 17.9839 14.6084 17.8531 14.5438Z" fill="currentColor" /></g><defs><clipPath id="clip0_2041_25"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
);
 
const InstagramIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}><g clipPath="url(#clip0_2041_10)"><path d="M12 2.16225C15.2041 2.16225 15.5836 2.17444 16.8489 2.23209C18.0189 2.28553 18.6544 2.481 19.0773 2.64534C19.6373 2.86303 20.0371 3.12309 20.457 3.543C20.877 3.96291 21.137 4.36266 21.3547 4.92272C21.519 5.34562 21.7145 5.98106 21.7679 7.15097C21.8256 8.41641 21.8377 8.79591 21.8377 12C21.8377 15.2042 21.8256 15.5837 21.7679 16.849C21.7145 18.019 21.519 18.6544 21.3547 19.0773C21.137 19.6373 20.8769 20.0372 20.457 20.4571C20.0371 20.877 19.6373 21.1371 19.0773 21.3547C18.6544 21.519 18.0189 21.7146 16.8489 21.7679C15.5838 21.8257 15.2043 21.8378 12 21.8378C8.79562 21.8378 8.41613 21.8257 7.15097 21.7679C5.98097 21.7145 5.34562 21.519 4.92272 21.3547C4.36266 21.1371 3.96281 20.877 3.54291 20.4571C3.123 20.0371 2.86294 19.6373 2.64534 19.0773C2.481 18.6545 2.28544 18.019 2.23209 16.849C2.17434 15.5837 2.16216 15.2042 2.16216 12C2.16216 8.79591 2.17434 8.41641 2.23209 7.15106C2.28553 5.98106 2.481 5.34562 2.64534 4.92272C2.86294 4.36266 3.123 3.96291 3.54291 3.543C3.96291 3.123 4.36266 2.86303 4.92272 2.64534C5.34553 2.481 5.98097 2.28553 7.15097 2.23209C8.41631 2.17444 8.79581 2.16225 12 2.16225ZM12 0C8.74097 0 8.33231 0.0137812 7.05244 0.0721875C5.77509 0.1305 4.90275 0.333375 4.13953 0.63C3.35034 0.936656 2.68116 1.347 2.01403 2.01412C1.34691 2.68125 0.936656 3.35044 0.63 4.13953C0.333281 4.90284 0.1305 5.77519 0.0721875 7.05244C0.0137812 8.33231 0 8.74097 0 12C0 15.259 0.0137812 15.6677 0.0721875 16.9476C0.1305 18.2249 0.333281 19.0972 0.63 19.8605C0.936562 20.6496 1.34691 21.3188 2.01403 21.986C2.68116 22.6531 3.35034 23.0633 4.13953 23.37C4.90284 23.6667 5.77509 23.8695 7.05234 23.9278C8.33231 23.9862 8.74097 24 12 24C15.259 24 15.6677 23.9862 16.9476 23.9278C18.2248 23.8695 19.0972 23.6667 19.8604 23.37C20.6496 23.0634 21.3188 22.6531 21.9859 21.986C22.653 21.3188 23.0633 20.6497 23.37 19.8605C23.6666 19.0972 23.8695 18.2249 23.9278 16.9477C23.9862 15.6677 24 15.259 24 12C24 8.74097 23.9862 8.33231 23.9278 7.05244C23.8695 5.77519 23.6666 4.90284 23.37 4.13962C23.0633 3.35044 22.653 2.68125 21.9859 2.01412C21.3188 1.347 20.6496 0.936562 19.8605 0.63C19.0972 0.333375 18.2248 0.1305 16.9476 0.0721875C15.6677 0.0137812 15.259 0 12 0ZM12 5.83781C8.59669 5.83781 5.83781 8.59688 5.83781 12C5.83781 15.4033 8.59669 18.1622 12 18.1622C15.4032 18.1622 18.1622 15.4033 18.1622 12C18.1622 8.59678 15.4032 5.83781 12 5.83781ZM12 16C9.79088 16 7.99997 14.2091 7.99997 12C7.99997 9.79088 9.79088 7.99997 12 7.99997C14.2091 7.99997 16 9.79088 16 12C16 14.2091 14.2091 16 12 16ZM19.8456 5.59434C19.8456 6.38972 19.2009 7.03434 18.4056 7.03434C17.6103 7.03434 16.9656 6.38972 16.9656 5.59434C16.9656 4.79906 17.6103 4.15434 18.4056 4.15434C19.2009 4.15434 19.8456 4.79906 19.8456 5.59434Z" fill="currentColor" /></g><defs><clipPath id="clip0_2041_10"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
);


const contactInfo = [
  {
    icon: Phone,
    title: "CONTACT US",
    content: (
      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-sm">Phone: +91-7893002716</p>
        <p className="font-medium text-sm">Email: info@hyderabadnetwork.com</p>
      </div>
    ),
    href: "tel:+917893002716",
  },
  {
    icon: MapPin,
    title: "OUR SHOWROOM",
    content: (
      <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
        <p>Shop No. 4-1, Old Big Bazar Car Parking</p>
        <p>Back Side SMART Bazar, 834/A, Lane</p>
        <p>Abids, Hyderabad, Telangana 500001</p>
        <p className="text-xs mt-1 text-muted-foreground/80">Authorised Distributor for Ajanta & Orpat Group</p>
      </div>
    ),
    href: "https://maps.google.com/maps?q=Hyderabad+Network+(Authorised+Distributor+for+Ajanta+%26+Orpat+Group)",
  },
  {
    icon: Clock,
    title: "BUSINESS HOURS",
    content: (
      <div className="flex flex-col gap-1 text-sm font-medium w-full max-w-[300px]">
        <div className="grid grid-cols-[80px_1fr]">
          <span>Mon - Sat:</span>
          <span>11:00 AM - 9:00 PM</span>
        </div>
        <div className="grid grid-cols-[80px_1fr]">
          <span>Sunday:</span>
          <span>Closed</span>
        </div>
      </div>
    ),
  },
];

const socialLinks = [
  {
    icon: WhatsAppIcon,
    href: "https://wa.me/917893002716",
    label: "WhatsApp",
  },
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/hyderabad_network?igsh=eDlnbzlmNmN4Y3Fw",
    label: "Instagram",
  },
];

type ContactBoxProps = {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
  href?: string;
  className?: string;
};

function Box({ title, content, className, href, icon: Icon }: ContactBoxProps) {
  const innerContent = (
    <div className="flex gap-4 p-6 h-full items-start">
      <div className="flex-shrink-0 mt-1">
        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <h3 className="font-bold text-sm tracking-wide uppercase text-foreground/80">{title}</h3>
        <div className="text-foreground">
          {content}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={cn(
          "bg-background rounded-sm border hover:border-foreground/20 transition-colors",
          className
        )}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <div className={cn("bg-background rounded-sm border", className)}>
      {innerContent}
    </div>
  );
}

export function VisitUs() {
  return (
    <section id="visit-us" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight">
            Visit Us
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Get in touch with us or visit our showroom to explore our collection.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-start">
          {/* Left side - Information Cards */}
          <div className="flex flex-col gap-4">
            {contactInfo.map((item, idx) => (
              <Box
                key={idx}
                icon={item.icon}
                title={item.title}
                content={item.content}
                href={item.href}
              />
            ))}

            {/* Social Links Card */}
            <Box
              icon={Share2}
              title="CONNECT WITH US"
              content={
                <div className="flex flex-wrap gap-2 mt-1">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center size-[36px] rounded-full bg-muted text-muted-foreground transition-colors"
                      title={link.label}
                    >
                      <link.icon className="size-5" />
                      <span className="sr-only">{link.label}</span>
                    </a>
                  ))}
                </div>
              }
            />
          </div>

          {/* Right side - Map */}
          <div className="rounded-sm overflow-hidden border bg-muted h-[400px] lg:h-full lg:min-h-[600px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60903.118215580835!2d78.44015556953127!3d17.438407935443735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb977d612c6e45%3A0xc314db2fe6da506f!2sHyderabad%20Network%20(Authorised%20Distributor%20for%20Ajanta%20%26%20Orpat%20Group)!5e0!3m2!1sen!2sin!4v1769278199509!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hyderabad Network Location"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
