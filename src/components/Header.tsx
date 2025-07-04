import { BarChart3, Book, Plus } from "lucide-react";
import { Link, useLocation } from "react-router";
import ModeToggle from "./ModeToggle";
import MobileNav from "./MobileNav";

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
        <div className="flex items-center h-32">
          <Link to={"/"} className="flex items-center justify-center">
            <img
              src="/src/assets/logo2.png"
              alt="logo"
              className="h-32 w-full object-cover"
            />
            {/* <h1 className="text-[#589770] text-xl font-bold">Baatighar</h1> */}
          </Link>
        </div>
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
          <ModeToggle />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
};

export default Header;
