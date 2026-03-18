"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';

// Navigation links configuration
const navLinks: { name: string; path?: string; dropdown?: boolean; dropdownItems?: { name: string; path: string }[] }[] = [
  { name: "Home", path: "/" },
  {
    name: "Speedrun",
    dropdown: true,
    dropdownItems: [
      { name: "Guides", path: "/guides" },
      { name: "Strats", path: "/strats" },
      { name: "Route Builder", path: "/route-builder" },
      // { name: "Tricks", path: "/tricks" },
      // { name: "Levels", path: "/levels" },
      { name: "Glossary", path: "/glossary" },
      // { name: "Resources", path: "/resources" }
    ]
  },
  // { name: "Modding", path: "/modding" },
  // { name: "Contribute", path: "/contribute" }
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  const pathname = usePathname();
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle desktop dropdown
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopDropdownOpen(false);
      }

      // Don't handle mobile dropdown here as we want it to stay open
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close only mobile menu on route changes, not dropdowns
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Intentionally not closing dropdowns
  }, [pathname]);

  // Determine if a nav item is active
  const isActive = (path?: string) => pathname === path;

  // Check if any dropdown item is active
  const isDropdownActive = (items: {name: string, path: string}[]) => {
    return items.some(item => isActive(item.path));
  };

  // Stop event propagation to prevent closing dropdown
  const handleDropdownItemClick = (e: React.MouseEvent) => {
    // This prevents the click from bubbling up, keeping dropdown open
    e.stopPropagation();
  };

  return (
    <nav className="bg-[#010040] shadow-lg relative">
      {/* <div className="max-w-7xl px-2 sm:px-4 lg:px-6 font-bob"> */}
      <div className="px-2 sm:px-4 lg:px-6 font-bob">
        <div className="flex items-center justify-between h-22">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/img/bfbb-community-logo.png"
                alt="BFBB Community Logo"
                width={128}
                height={128}
                className="align-middle max-h-16"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block ml-auto">
            <div className="flex items-baseline space-x-4">
              {navLinks.map((link, index) => {
                if (link.dropdown) {
                  return (
                    <div className="relative" ref={desktopDropdownRef} key={index}>
                      <button
                        onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                        className="px-3 py-2 rounded-md text-lg font-medium text-white"
                      >
                        <span
                          className={`${
                            isActive(link.path) || isDropdownActive(link.dropdownItems!)
                              ? "text-yellow"
                              : "text-white"
                          }`}
                        >
                          {link.name}
                        </span>
                        <svg
                          className={`ml-1 inline-block h-4 w-4 transition-transform ${
                            isDesktopDropdownOpen ? "transform rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Desktop Dropdown Content */}
                      {isDesktopDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#010090] rounded-md shadow-lg py-1 z-50">
                          {link.dropdownItems!.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={item.path}
                              onClick={() => setIsDesktopDropdownOpen(false)}
                              className={`block px-4 py-2 text-sm text-white ${
                                isActive(item.path) ? "text-yellow" : ""
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <Link
                      key={index}
                      href={link.path ?? "/"}
                      className={`px-3 py-2 rounded-md text-lg font-medium ${
                        isActive(link.path) ? "text-yellow" : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                }
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:text-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden font-bob">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => {
              if (link.dropdown) {
                return (
                  <div key={index} ref={mobileDropdownRef} className="relative">
                    <button
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:text-white focus:outline-none"
                    >
                      <span
                        className={`${
                          isActive(link.path) || isDropdownActive(link.dropdownItems!)
                            ? "text-yellow"
                            : "text-white"
                        }`}
                      >
                        {link.name}
                      </span>
                      <svg
                        className={`ml-1 h-5 w-5 transition-transform ${
                          isMobileDropdownOpen ? "transform rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Mobile dropdown content with higher z-index and isolation */}
                    {isMobileDropdownOpen && (
                      <div className="pl-4 py-2 space-y-1 relative z-50">
                        {link.dropdownItems!.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            onClick={handleDropdownItemClick}
                            className="cursor-pointer"
                          >
                            <Link
                              href={item.path}
                              className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive(item.path)
                                  ? "text-yellow"
                                  : "text-white hover:text-white hover:text-white"
                              }`}
                            >
                              {item.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={index}
                    href={link.path ?? "/"}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.path)
                        ? "text-yellow"
                        : "text-white hover:text-white hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
