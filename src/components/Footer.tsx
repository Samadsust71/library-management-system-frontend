import { BarChart3, Book, Plus } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  const navItems = [
    { href: "/books", label: "All Books", icon: Book },
    { href: "/create-book", label: "Add Book", icon: Plus },
    { href: "/borrow-summary", label: "Borrow Summary", icon: BarChart3 },
  ];
  return (
    <footer className="bg-background/40 border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Link
                to={"/"}
                className="flex items-center justify-center"
              >
                <img
                  src="/src/assets/logo.png"
                  alt="logo"
                  className="h-16 object-cover"
                />
                <h1 className="text-[#3BAA4A] text-xl font-bold">Baatighar</h1>
              </Link>
            </div>
            <p className="text-sm text-accent-foreground/80">
              A modern library management system for efficient book tracking and
              borrowing operations.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-accent-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-accent-foreground/95">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="hover:text-accent-foreground/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-accent-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-accent-foreground/95">
              <li>
                <a
                  href="#"
                  className="hover:text-accent-foreground/80 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-foreground/80 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-foreground/80 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-400 pt-8 mt-8 text-center text-sm text-accent-foreground/80">
          <p>
            &copy; 2024 Baatighar. Built with React, Redux Toolkit Query,
            and TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
