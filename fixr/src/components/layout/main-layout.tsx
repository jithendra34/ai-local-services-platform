import { Link, useLocation } from "wouter";
import { Wrench } from "lucide-react";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/book", label: "Book Service" },
    { href: "/bookings", label: "My Bookings" },
    { href: "/workers", label: "Workers" },
    { href: "/store", label: "Materials Store" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Wrench className="h-5 w-5" />
            </div>
            Fixr
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <Wrench className="h-5 w-5" />
                </div>
                Fixr
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Your home fixed. Without the anxiety. Fast, clear, no-nonsense.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Services</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li><Link href="/book" className="hover:text-primary transition-colors">AC Service</Link></li>
                <li><Link href="/book" className="hover:text-primary transition-colors">Carpentry</Link></li>
                <li><Link href="/book" className="hover:text-primary transition-colors">Cleaning</Link></li>
                <li><Link href="/book" className="hover:text-primary transition-colors">Electrical</Link></li>
                <li><Link href="/book" className="hover:text-primary transition-colors">Plumbing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">For Workers</h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Join Fixr</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Worker App</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fixr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
