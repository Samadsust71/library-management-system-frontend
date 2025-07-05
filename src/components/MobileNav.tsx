import { Link } from "react-router";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { BarChart3, Book, Plus } from "lucide-react";
import logo from "../assets/logo3.png";
const MobileNav = () => {
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
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="flex justify-center items-center ">
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
        </SheetTrigger>
        <SheetContent className="flex flex-col ">
          {/* add this to hide dialog console error */}
          <SheetTitle>
            <SheetClose asChild>
              <Link
                to={"/"}
                className="border border-[#3FCEB4] flex items-center justify-center rounded-full  h-10 w-10 ml-4 mt-2"
              >
                <img
                  src={logo}
                  alt="Library Logo"
                  className="w-full h-full object-contain"
                />
              </Link>
            </SheetClose>
          </SheetTitle>
          <SheetDescription>
            <span></span>
          </SheetDescription>

          {/* nav links */}
          <ul className="flex flex-col items-center justify-center gap-8 mt-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex flex-col items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary "
                        : "text-primary/60 hover:text-primary"
                    }`}
                  >
                    <Icon  className={`${isActive(item.href)?"text-[#3FCEB4]":"text-primary/60"}`} size={16} />
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
