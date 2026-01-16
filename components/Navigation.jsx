"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function Navigation() {
  const pathname = usePathname();
  const processedPathname = pathname.substring(1);

  const navItems = [
    { id: "/", label: "Home" },
    { id: "about", label: "About" },
    { id: "portfolio", label: "Portfolio" },
    { id: "reviews", label: "Reviews" },
    // { id: 'contact', label: 'My Apps' },
    { id: "certificates", label: "Certificates" },
  ];

  return (
    <nav className="glassmorphism backdrop-blur-lg sticky top-4 z-20 rounded-2xl mb-8 p-3 mx-4">
      <div className="flex flex-wrap justify-center gap-1">
        {navItems.map((item, index) => {
          const isActive =
            (item.id === "/" && pathname === "/") ||
            (item.id !== "/" && item.id === processedPathname);
          return (
            <Link
              key={item.id}
              href={item.id}
              className={`nav-item px-4 py-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-white/30 dark:bg-gray-800/30 text-gray-800 font-medium scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/20"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
