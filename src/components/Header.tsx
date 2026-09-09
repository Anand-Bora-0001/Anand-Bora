import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/#skills", label: "Stack" },
  { href: "/#experience", label: "Experience" },
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const active = (href: string) => location.pathname + location.hash === href;
  return (
    <header className="site-header">
      <div className="section-container header-inner">
        <Link to="/" aria-label="Anand Bora, home" className="brand">
          <span className="brand-monogram">
            ab<span>_</span>
          </span>
          <span className="brand-name">
            ANAND BORA<small>AI / SYSTEMS / DATA</small>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              className={`nav-item ${active(item.href) ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/#contact">
              Let's talk <ArrowUpRight size={16} />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[min(85vw,360px)]">
              <SheetTitle>Explore</SheetTitle>
              <SheetDescription>Anand Bora / AI Engineer</SheetDescription>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-3 mt-8"
              >
                {[...navItems, { href: "/#contact", label: "Contact" }].map(
                  (item) => (
                    <Link
                      to={item.href}
                      key={item.href}
                      onClick={() => setOpen(false)}
                      className="nav-item py-3"
                      aria-current={active(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
