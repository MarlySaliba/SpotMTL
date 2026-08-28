import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLanguage from "../i18n/useLanguage";

import img1 from "../assets/Dome_expo.jpg";
import img2 from "../assets/downtown_night.jpg";
import img3 from "../assets/LaRonde.webp";
import img4 from "../assets/Oratoire_St_Joseph.jpg";
import img5 from "../assets/Canal_Lachine.avif";

const homeCopy = {
  fr: {
    activities: "Activités",
    activitiesAria: "Parcourir les activités",
    activitiesDescription: "Des idées amusantes à découvrir en toute saison.",
    attractions: "Attractions",
    attractionsAria: "Parcourir les attractions",
    attractionsDescription: "Musées, parcs et lieux incontournables.",
    explore: "Explorer Montréal",
    exploreAria: "Explorer Montréal dans la page de recherche",
    intro:
      "Découvrez les meilleures attractions, activités et restaurants de Montréal, réunis au même endroit.",
    popular: "Catégories populaires",
    restaurants: "Restaurants",
    restaurantsAria: "Parcourir les restaurants",
    restaurantsDescription:
      "Découvrez quelques-unes des meilleures expériences culinaires de Montréal.",
    welcome: "Bienvenue sur",
  },
  en: {
    activities: "Activities",
    activitiesAria: "Browse activities",
    activitiesDescription: "Fun things to discover all year round.",
    attractions: "Attractions",
    attractionsAria: "Browse attractions",
    attractionsDescription: "Museums, parks, and must-see spots.",
    explore: "Explore Montréal",
    exploreAria: "Explore Montréal on the search page",
    intro:
      "Discover the best attractions, activities, and restaurants in Montréal, all in one place.",
    popular: "Popular Categories",
    restaurants: "Restaurants",
    restaurantsAria: "Browse restaurants",
    restaurantsDescription:
      "Discover some of the best dining experiences in Montréal.",
    welcome: "Welcome to",
  },
};

export default function Home() {
  const slides = [img1, img2, img3, img4, img5];
  const [index, setIndex] = useState(0);
  const { language } = useLanguage();
  const copy = homeCopy[language];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="home-page">
      <section className="home-page__hero">
        <div className="home-page__slideshow">
          {slides.map((src, slideIndex) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`home-page__slide ${
                slideIndex === index ? "home-page__slide--active" : ""
              }`}
              aria-hidden={slideIndex !== index}
            />
          ))}

          <div className="home-page__overlay" />

          <div className="home-page__hero-content">
            <div className="home-page__hero-copy">
              <h1 className="home-page__title">
                {copy.welcome}{" "}
                <span className="home-page__brand">SpotMTL</span>
              </h1>
              <p className="home-page__intro">{copy.intro}</p>
              <Link
                to="../Pages/Search"
                className="home-page__explore-link"
                aria-label={copy.exploreAria}
              >
                {copy.explore}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-page__categories">
        <h2 className="home-page__categories-title">
          {copy.popular}
        </h2>

        <div className="home-page__category-grid">
          <Link
            to="/Pages/Search"
            className="home-page__category-card"
            aria-label={copy.attractionsAria}
          >
            <h3 className="home-page__category-title">{copy.attractions}</h3>
            <p className="home-page__category-description">
              {copy.attractionsDescription}
            </p>
          </Link>

          <Link
            to="/Pages/Search"
            className="home-page__category-card"
            aria-label={copy.restaurantsAria}
          >
            <h3 className="home-page__category-title">{copy.restaurants}</h3>
            <p className="home-page__category-description">
              {copy.restaurantsDescription}
            </p>
          </Link>

          <Link
            to="/Pages/Search"
            className="home-page__category-card"
            aria-label={copy.activitiesAria}
          >
            <h3 className="home-page__category-title">{copy.activities}</h3>
            <p className="home-page__category-description">
              {copy.activitiesDescription}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
