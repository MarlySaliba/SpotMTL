import React, { useState } from 'react'

export default function Header() {
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
    <Header>
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Logo */}
        <h2 className="text-2xl font-bold text-black">
          Spot <span className="text-green-600">MTL</span>
        </h2>

        {/* Desktop Menu*/}
        <div className="hidden gap-6 md:flex">
          {menuList.map((item) => (
            <div
              key={item.id}
              className="px-3 py-1 text-base border-gray-400 rounded-full cursor-pointer hover:border"
            >
              {item.title}
            </div>
          ))}
        </div>

        {/* Hamburger Button*/}
        <button
          className="flex flex-col gap-1 cursor-pointer md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>

        {/* Mobile Menu*/}
        {isOpen && (
          <div className="absolute z-10 flex flex-col gap-3 px-4 py-2 bg-white rounded-md shadow-lg top-16 right-4 md:hidden">
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
    </Header>
  )
}

