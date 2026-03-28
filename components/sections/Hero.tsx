import { ArrowRight } from 'lucide-react';
import Link from "next/link";
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-muted-foreground">
              Corporate <span className="text-foreground block mt-1">Clocks for Gifting</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground lg:text-xl leading-relaxed">
              Elevate your corporate gifting with our exquisite collection of custom-branded clocks. Competitive bulk pricing available.
            </p>

            <div className="flex w-full flex-col justify-start gap-3 sm:flex-row pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto px-8">
                <Link href="/enquire">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8">
                <Link href="/products">
                  Browse Catalog
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>

            {/* Metrics removed as per user request */}
          </div>

          <div className="relative w-full h-full min-h-[400px] lg:min-h-full">
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="col-span-1 row-span-2">
                <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl xl:rounded-3xl shadow-lg">
                  <img
                    alt="Elegant wall clock"
                    className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    src="/hero/gf-left.jpeg"
                  />
                </div>
              </div>
              <div className="col-span-1 row-span-1">
                <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl xl:rounded-3xl shadow-lg">
                  <img
                    alt="Modern desk setup"
                    className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    src="/hero/designer-right.jpeg"
                  />
                </div>
              </div>
              <div className="col-span-1 row-span-1">
                <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl xl:rounded-3xl shadow-lg">
                  <img
                    alt="Luxury timepiece"
                    className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    src="/hero/fancy-right.jpeg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

