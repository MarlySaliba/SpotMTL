import { useCallback, useEffect, useRef, useState } from "react";
import { getAttractions } from "../api/attractions";
import useLanguage from "../i18n/useLanguage";

const categoryData = {
  activity: [
    "Not Specified",
    "Hiking",
    "Skiing",
    "Museum",
    "Escape Room",
    "Eating Out",
    "Dining In",
  ],
  price: ["Not Specified", "Free", "$", "$$", "$$$"],
  location: [
    "Not Specified",
    "Downtown",
    "Nature",
    "Suburbs",
    "Chinatown",
  ],
  effort: ["Not Specified", "Low", "Medium", "High"],
  groupSize: ["Not Specified", "Solo", "Couple", "Family", "Group"],
  season: ["Not Specified", "Summer", "Fall", "Winter", "Spring"],
  time: ["Not Specified", "Morning", "Afternoon", "Evening"],
  dietaryRestrictions: [
    "Not Specified",
    "Vegan",
    "Vegetarian",
    "Halal",
  ],
};

const categoryLabels = {
  fr: {
    activity: "Activité",
    dietaryRestrictions: "Restrictions alimentaires",
    effort: "Effort",
    groupSize: "Taille du groupe",
    location: "Secteur",
    price: "Prix",
    season: "Saison",
    time: "Moment de la journée",
  },
  en: {
    activity: "Activity",
    dietaryRestrictions: "Dietary Restrictions",
    effort: "Effort",
    groupSize: "Group Size",
    location: "Location",
    price: "Price",
    season: "Season",
    time: "Time of Day",
  },
};

const frenchOptionLabels = {
  "Not Specified": "Aucune préférence",
  Hiking: "Randonnée",
  Skiing: "Ski",
  Museum: "Musée",
  "Escape Room": "Jeu d'évasion",
  "Eating Out": "Restaurant",
  "Dining In": "Repas à la maison",
  Free: "Gratuit",
  Downtown: "Centre-ville",
  Nature: "Nature",
  Suburbs: "Banlieue",
  Chinatown: "Quartier chinois",
  Low: "Faible",
  Medium: "Moyen",
  High: "Élevé",
  Solo: "Solo",
  Couple: "Couple",
  Family: "Famille",
  Group: "Groupe",
  Summer: "Été",
  Fall: "Automne",
  Winter: "Hiver",
  Spring: "Printemps",
  Morning: "Matin",
  Afternoon: "Après-midi",
  Evening: "Soir",
  Vegan: "Végane",
  Vegetarian: "Végétarien",
  Halal: "Halal",
};

const searchCopy = {
  fr: {
    error:
      "Impossible de charger les attraits pour le moment. Vérifiez que le serveur est démarré, puis réessayez.",
    loading: "Chargement des attraits...",
    noResults: "Aucun résultat pour les critères sélectionnés.",
    resultCount: (count) =>
      `${count} ${count === 1 ? "attrait trouvé" : "attraits trouvés"}`,
    retry: "Réessayer",
    search: "Rechercher",
    searching: "Recherche...",
    title: "Recherche",
  },
  en: {
    error:
      "Attractions cannot be loaded right now. Check that the server is running, then try again.",
    loading: "Loading attractions...",
    noResults: "No results found for the selected categories.",
    resultCount: (count) =>
      `${count} ${count === 1 ? "attraction found" : "attractions found"}`,
    retry: "Try again",
    search: "Search",
    searching: "Searching...",
    title: "Search",
  },
};

const initialSelection = {
  activity: "Not Specified",
  price: "Not Specified",
  location: "Not Specified",
  effort: "Not Specified",
  groupSize: "Not Specified",
  season: "Not Specified",
  time: "Not Specified",
  dietaryRestrictions: "Not Specified",
};

function getOptionLabel(option, language) {
  return language === "fr" ? frenchOptionLabels[option] || option : option;
}

function FilterSelect({ filterKey, language, selected, setSelected }) {
  const id = `filter-${filterKey}`;

  return (
    <div className="search-page__filter">
      <label className="search-page__filter-label" htmlFor={id}>
        {categoryLabels[language][filterKey]}
      </label>
      <select
        id={id}
        className="search-page__filter-select"
        value={selected[filterKey]}
        onChange={(event) =>
          setSelected((current) => ({
            ...current,
            [filterKey]: event.target.value,
          }))
        }
      >
        {categoryData[filterKey].map((option) => (
          <option key={option} value={option}>
            {getOptionLabel(option, language)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Search() {
  const [selected, setSelected] = useState(initialSelection);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [requestStatus, setRequestStatus] = useState("idle");
  const [scrollY, setScrollY] = useState(0);
  const activeRequest = useRef(null);
  const { language } = useLanguage();
  const copy = searchCopy[language];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const runSearch = useCallback(async (filters) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;

    setHasSearched(true);
    setRequestStatus("loading");

    try {
      const attractions = await getAttractions(filters, {
        signal: controller.signal,
      });

      if (activeRequest.current === controller) {
        setResults(attractions);
        setRequestStatus("success");
      }
    } catch (error) {
      if (error?.name !== "AbortError" && activeRequest.current === controller) {
        setResults([]);
        setRequestStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    void runSearch(initialSelection);

    return () => activeRequest.current?.abort();
  }, [runSearch]);

  const handleSearch = () => {
    void runSearch(selected);
  };

  const scaleStep = Math.min(20, Math.max(0, Math.floor(scrollY / 10)));

  return (
    <div className="search-page">
      <h1 className="search-page__title">{copy.title}</h1>
      <div className="search-page__stage">
        <div
          className={`search-page__panel search-page__panel--scale-${scaleStep}${
            hasSearched ? " search-page__panel--searched" : ""
          }`}
        >
          <div className="search-page__filters">
            <div className="search-page__filter-grid">
              {["activity", "price", "location", "effort"].map((filterKey) => (
                <FilterSelect
                  key={filterKey}
                  filterKey={filterKey}
                  language={language}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </div>

            <div className="search-page__filter-grid search-page__filter-grid--secondary">
              {["groupSize", "season", "time", "dietaryRestrictions"].map(
                (filterKey) => (
                  <FilterSelect
                    key={filterKey}
                    filterKey={filterKey}
                    language={language}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ),
              )}
            </div>

            <button
              onClick={handleSearch}
              className="search-page__submit"
              disabled={requestStatus === "loading"}
            >
              {requestStatus === "loading" ? copy.searching : copy.search}
            </button>
          </div>
        </div>
      </div>

      {hasSearched && (
        <section
          className="search-page__results"
          aria-busy={requestStatus === "loading"}
          aria-live="polite"
        >
          {requestStatus === "loading" && (
            <p className="search-page__status">{copy.loading}</p>
          )}

          {requestStatus === "error" && (
            <div className="search-page__error">
              <p>{copy.error}</p>
              <button
                className="search-page__retry"
                onClick={handleSearch}
              >
                {copy.retry}
              </button>
            </div>
          )}

          {requestStatus === "success" && results.length === 0 && (
            <p className="search-page__status">{copy.noResults}</p>
          )}

          {requestStatus === "success" && results.length > 0 && (
            <>
              <p className="search-page__result-count">
                {copy.resultCount(results.length)}
              </p>
              <ul className="search-page__result-list">
                {results.map((result) => (
                  <li
                    key={result.id}
                    className="search-page__result-card"
                  >
                    <h2 className="search-page__result-title">
                      {result.name}
                    </h2>
                    <p className="search-page__result-meta">
                      {getOptionLabel(result.activity, language)} · {" "}
                      {getOptionLabel(result.location, language)} · {" "}
                      {getOptionLabel(result.price, language)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
}
