import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MenuNavbar from "./header/MenuNavbar";
import Navbar from "./header/Navbar";
import SearchNavbar from "./header/SearchNavbar";
import IconNavbar from "./header/IconNavbar";

export default function ShoppingHeader() {
  const [showMenu, setShowMenu] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`md:px-4 lg:px-6 px-4 fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between font-medium shadow-sm h-18 transition-transform duration-300
        ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <Navbar showMenu={setShowMenu} />
        
      <div className="flex items-center gap-2 justify-between ">
        <SearchNavbar/>
        <IconNavbar/> 
      </div>

      {showMenu &&
        createPortal(
          <MenuNavbar showMenu={setShowMenu} />,
          document.body
        )}
    </header>
  );
}
