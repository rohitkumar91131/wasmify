"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState, useEffect } from "react"
// Ensure this path is correct based on your folder structure
import { navItems } from "@/data/navItems" 
import gsap from "gsap"

// Helper to match the URL structure
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

// Helper to get theme color based on category
const getThemeColor = (categoryName) => {
  switch(categoryName) {
    case "Videos": return "text-green-400";
    case "Images": return "text-blue-400";
    case "Audio": return "text-violet-400";
    case "PDF": return "text-rose-400";
    default: return "text-green-400";
  }
}

// Helper to get hover color class
const getHoverClass = (categoryName) => {
  switch(categoryName) {
    case "Videos": return "hover:text-green-400";
    case "Images": return "hover:text-blue-400";
    case "Audio": return "hover:text-violet-400";
    case "PDF": return "hover:text-rose-400";
    default: return "hover:text-green-400";
  }
}

export default function Navbar() {
  const pathname = usePathname()
  
  const dropdownWrapperRef = useRef(null)
  const dropdownContentRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileExpandedItem, setMobileExpandedItem] = useState(null)

  const tlRef = useRef(null);

  // --- DESKTOP ANIMATION (Apple Slide Down) ---
  useEffect(() => {
    if (!tlRef.current) {
      tlRef.current = gsap.timeline({ paused: true });
    }

    if (activeDropdown && dropdownWrapperRef.current && dropdownContentRef.current) {
      gsap.killTweensOf([dropdownWrapperRef.current, dropdownContentRef.current]);

      // Initial State
      gsap.set(dropdownWrapperRef.current, { yPercent: -100, display: "block" });
      gsap.set(dropdownContentRef.current, { opacity: 0, y: -10 });

      // Wrapper Slide Down
      gsap.to(dropdownWrapperRef.current, {
        yPercent: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      // Content Fade In
      gsap.to(dropdownContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.15,
        ease: "power2.out",
      });

    } else if (!activeDropdown && dropdownWrapperRef.current) {
        // Close Animation
        gsap.killTweensOf([dropdownWrapperRef.current, dropdownContentRef.current]);

        gsap.to(dropdownContentRef.current, {
          opacity: 0,
          duration: 0.15
        });

        gsap.to(dropdownWrapperRef.current, {
          yPercent: -100,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => {
             if (dropdownWrapperRef.current) {
               gsap.set(dropdownWrapperRef.current, { display: "none" });
             }
             setActiveDropdown(null)
          },
        });
    }
  }, [activeDropdown])

  // --- MOBILE ANIMATION ---
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const items = mobileMenuRef.current.querySelectorAll(".mobile-stagger-item");
      gsap.fromTo(
        items,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (name) => {
    if (activeDropdown !== name) setActiveDropdown(name)
  }

  const closeDropdown = () => setActiveDropdown(null)

  const currentActiveItem = navItems.find((item) => item.name === activeDropdown);

  // Check if main path is active
  const isActivePath = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }

  return (
    <>
      <header className="sticky top-0 z-[60] bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
          <Link href="/" className="text-white font-bold text-xl tracking-wider">
            Wasmify
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex gap-8 h-full items-center">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(item.name)}
              >
                <Link
                  href={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item.path) || activeDropdown === item.name
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-xl p-2 z-[70] relative"
          >
             <div className="w-6 h-6 flex items-center justify-center relative">
               <span className={`absolute transition-all duration-300 ${isMobileMenuOpen ? "rotate-45" : "rotate-0 -translate-y-1.5"}`}>
                 <span className="block w-6 h-0.5 bg-white"></span>
               </span>
               <span className={`absolute transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}>
                 <span className="block w-6 h-0.5 bg-white"></span>
               </span>
               <span className={`absolute transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45" : "rotate-0 translate-y-1.5"}`}>
                 <span className="block w-6 h-0.5 bg-white"></span>
               </span>
             </div>
          </button>
        </div>
      </header>

      {/* --- Desktop Dropdown Panel --- */}
      <div
        ref={dropdownWrapperRef}
        className="fixed top-16 left-0 w-full bg-neutral-900/95 backdrop-blur-xl border-b border-white/10 z-[50] hidden"
        onMouseLeave={closeDropdown}
      >
        <div ref={dropdownContentRef} className="max-w-7xl mx-auto px-6 py-8 opacity-0">
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
            {currentActiveItem?.features.map((feature, idx) => {
                const href = `${currentActiveItem.path}/${slugify(feature)}`;
                const themeColorClass = getThemeColor(currentActiveItem.name);
                
                return (
                  <Link
                    key={idx}
                    href={href} 
                    onClick={closeDropdown}
                    className="group flex items-center justify-between text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    <span>{feature}</span>
                    
                    {/* Animated Arrow Icon with Dynamic Theme Color */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2} 
                      stroke="currentColor" 
                      className={`w-4 h-4 ${themeColorClass} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                )
            })}
          </div>

        </div>
      </div>

      {/* --- Mobile Menu --- */}
      {isMobileMenuOpen && (
        <div
            ref={mobileMenuRef}
            className="md:hidden fixed top-16 left-0 w-full bg-black/95 h-[calc(100vh-64px)] overflow-y-auto z-[50] pt-8 px-6"
        >
          {navItems.map((item) => (
            <div key={item.name} className="mobile-stagger-item mb-4 border-b border-white/10 pb-4">
              <button
                onClick={() =>
                  setMobileExpandedItem(mobileExpandedItem === item.name ? null : item.name)
                }
                className="text-white text-lg font-semibold w-full text-left flex justify-between items-center"
              >
                {item.name}
                <span className={`text-xs text-gray-500 transition-transform duration-300 ${mobileExpandedItem === item.name ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              <div className={`mt-2 flex flex-col gap-3 pl-2 overflow-hidden transition-all duration-300 ${mobileExpandedItem === item.name ? "max-h-[500px] opacity-100 py-3" : "max-h-0 opacity-0"}`}>
                  {item.features.map((feature) => {
                    const href = `${item.path}/${slugify(feature)}`;
                    const hoverClass = getHoverClass(item.name);
                    
                    return (
                      <Link
                        key={feature}
                        href={href}
                        className={`text-gray-400 ${hoverClass} text-sm block py-1 transition-colors`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {feature}
                      </Link>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}