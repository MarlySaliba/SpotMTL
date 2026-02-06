// src/Pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/Dome_expo.jpg";
import img2 from "../assets/downtown_night.jpg";
import img3 from "../assets/LaRonde.webp";
import img4 from "../assets/Oratoire_St_Joseph.jpg";
import img5 from "../assets/Canal_Lachine.avif";

export default function Home() {
  const slides = [img1, img2, img3, img4, img5];
  const [index, setIndex] = useState(0);

  // Change slide every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO with slideshow background */}
      <section className="relative flex-1">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== index}
            />
          ))}

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 flex items-center justify-center h-full p-6">
            <div className="max-w-2xl text-center">
              <h1 className="mb-4 text-4xl font-bold text-white">
                Welcome to <span className="text-green-300">SpotMTL</span>
              </h1>
              <p className="mb-6 text-lg text-white/90">
                Discover the best attractions, activities, and restaurants in
                Montreal — all in one place.
              </p>
              <Link
                to="../Pages/Search"
                className="inline-block px-6 py-3 font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
                aria-label="Start exploring Montreal on the search page"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="px-6 py-12 bg-white">
        <h2 className="mb-8 text-2xl font-semibold text-center">
          Popular Categories
        </h2>

        <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
          {/* Attractions */}
          <Link
            to="/search?category=Attractions"
            className="p-6 text-center transition-colors bg-gray-100 rounded-lg shadow hover:bg-green-100"
            aria-label="Browse Attractions"
          >
            <h3 className="mb-2 font-bold">Attractions</h3>
            <p className="text-gray-600">Museums, parks, and must-see spots.</p>
          </Link>

          {/* Restaurants */}
          <Link
            to="/search?category=Restaurants"
            className="p-6 text-center transition-colors bg-gray-100 rounded-lg shadow hover:bg-green-100"
            aria-label="Browse Restaurants"
          >
            <h3 className="mb-2 font-bold">Restaurants</h3>
            <p className="text-gray-600">
              The best dining experiences in Montreal.
            </p>
          </Link>

          {/* Activities */}
          <Link
            to="/search?category=Activities"
            className="p-6 text-center transition-colors bg-gray-100 rounded-lg shadow hover:bg-green-100"
            aria-label="Browse Activities"
          >
            <h3 className="mb-2 font-bold">Activities</h3>
            <p className="text-gray-600">Fun things to do all year round.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
