import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  function reset(){
    localStorage.removeItem("searchState");
    localStorage.removeItem("searchQuery");
  }
  
  const menuList = [
    { id: 1, title: "HOME", path: "../Pages/Home"},
    { id: 2, title: "LOGIN / SIGNUP", path: "../Pages/Login"},
    { id: 3, title: "SERVICE", path: "../Pages/Service"},
    { id: 4, title: "SEARCH", path: "../Pages/Search"},
    { id: 5, title: "ACTIVITY", path: "../Pages/Activity" },
    { id: 6, title: "MY LIST", path: "../Pages/MyList" },
    { id: 7, title: "MENU", path: "../Pages/Menu"},
  ];
  
  const handleNavigate = (path) => {
    navigate(path);        // change page
    setIsOpen(false);      // close mobile menu
    window.location.reload(); // force refresh to reset state
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="relative flex items-center justify-between p-4">
        {/* Logo */}
        <Link 
          to="/"
          onClick={reset}
          className="text-2xl font-bold text-black"
          aria-label="Reset filters and go to the Home page" >
          Spot <span className="text-green-600">MTL</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden gap-6 md:flex">
          {menuList.map((item) => (
            <button
              key={item.id}
              className="px-3 py-1 text-base border-gray-400 rounded-full hover:border"
              onClick={() => handleNavigate(item.path)}
            >
              {item.title}
            </button>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="absolute z-10 flex flex-col gap-3 px-4 py-2 bg-white rounded-md shadow-lg top-16 right-4 md:hidden">
            {menuList.map((item) => (
              <button
                key={item.id}
                className="text-base text-left hover:text-green-600"
                onClick={() => handleNavigate(item.path)}
              >
                {item.title}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
