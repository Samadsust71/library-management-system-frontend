import { BarChart3, Book, Plus } from "lucide-react";
import { Link, useLocation } from "react-router";
import ModeToggle from "./ModeToggle";
import MobileNav from "./MobileNav";
import logo from "../assets/logo3.png";

const Header = () => {
  const location = useLocation();
  const navItems = [
    { href: "/books", label: "All Books", icon: Book },
    { href: "/create-book", label: "Add Book", icon: Plus },
    { href: "/borrow-summary", label: "Borrow Summary", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    const path = location.pathname;
    if (href === "/books") return path === "/books";
    return path.startsWith(href);
  };
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to={"/"}
          className="border border-[#3FCEB4] flex items-center justify-center rounded-full  h-10 w-10"
        >
          <img
            src={logo}
            alt="Library Logo"
            className="w-full h-full object-contain"
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
                    ? "text-primary "
                    : "text-primary/60 hover:text-primary"
                }`}
              >
                <Icon className={`${isActive(item.href)?"text-[#3FCEB4]":"text-primary/60"}`} size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
};

export default Header;
