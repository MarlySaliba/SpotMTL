import React, { useState } from 'react'

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const menuList = [
    { id: 1, title: 'HOME' },
    { id: 2, title: 'ABOUT' },
    { id: 3, title: 'SERVICE' },
    { id: 4, title: 'SEARCH' },
    { id: 5, title: 'ACTIVITY' },
    { id: 6, title: 'CONTACT US' },
  ]

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <h2 className="text-2xl font-bold text-black">
        Spot <span className="text-green-600">MTL</span>
      </h2>

      {/* Desktop Menu*/}
      <div className="hidden md:flex gap-6">
        {menuList.map((item) => (
          <div
            key={item.id}
            className="text-base cursor-pointer hover:border border-gray-400 rounded-full px-3 py-1"
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* Hamburger Button*/}
      <button
        className="md:hidden flex flex-col gap-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="block w-6 h-0.5 bg-black"></span>
        <span className="block w-6 h-0.5 bg-black"></span>
        <span className="block w-6 h-0.5 bg-black"></span>
      </button>

      {/* Mobile Menu*/}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md py-2 px-4 flex flex-col gap-3 md:hidden z-10">
          {menuList.map((item) => (
            <div
              key={item.id}
              className="text-base cursor-pointer hover:text-green-600"
              onClick={() => setIsOpen(false)} 
            >
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Header
