"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Career", href: "/career" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blogs", href: "/blogs" },
  { name: "Testimonials", href: "/testimonials" },
];

export default function Header({ logoUrl, contactPhone }: { logoUrl?: string; contactPhone?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const phone = contactPhone || "1234567890";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">TrueCare Health At Home</span>
            {logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoUrl} alt="TrueCare Logo" className="h-10 w-auto object-contain" />
            ) : (
              <div className="text-2xl font-bold text-primary flex items-center">
                <span className="text-accent text-3xl mr-1">+</span> TrueCare
              </div>
            )}
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "text-sm font-semibold leading-6 transition-colors hover:text-primary",
                pathname === item.href ? "text-primary border-b-2 border-primary" : "text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center">
          <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:text-primary transition-colors">
            <PhoneCall className="w-4 h-4" />
            <span>Call Now</span>
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark transition-all hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Book Assessment
          </Link>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-6 flex flex-col gap-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
             <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 w-full justify-center rounded-md border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900">
               <PhoneCall className="w-4 h-4" /> Call Now
             </a>
             <Link
              href="/contact"
              className="w-full rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-accent-dark"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
