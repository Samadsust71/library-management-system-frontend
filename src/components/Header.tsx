import { BarChart3, Book, Plus } from "lucide-react";
import { Button } from "./ui/button";

import { Link, useLocation } from "react-router";
import ModeToggle from "./ModeToggle";

const Header = () => {
  
  const location = useLocation();
  const navItems = [
    { href: "/books", label: "All Books", icon: Book },
    { href: "/create-book", label: "Add Book", icon: Plus },
    { href: "/borrow-summary", label: "Borrow Summary", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    const path = location.pathname;
    if (href === "/books") return  path === "/books";
    return path.startsWith(href);
  };
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={"/"} className=" w-fit flex items-center justify-center h-16">
          <img
            src="/src/assets/logo.png"
            alt="logo"
            className="w-fit h-full"
          />
        </Link>
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary hover:text-primary/70"
                    : "text-primary/70"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="md:hidden text-primary border border-primary"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>

          <ModeToggle/>
        </div>
      </nav>
    </header>
  );
};

export default Header;
