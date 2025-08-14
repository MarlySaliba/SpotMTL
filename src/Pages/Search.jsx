import { useEffect, useState } from "react";

export default function Search() {
  const categoryData = {
    activity: ["Not Specified", "Hiking", "Skiing", "Museum", "Escape Room", "Eating Out", "Dining In"],
    price: ["Not Specified", "Free", "$", "$$", "$$$"],
    location: ["Not Specified", "Downtown", "Nature", "Suburbs"],
    effort: ["Not Specified", "Low", "Medium", "High"],
    groupSize: ["Not Specified", "Solo", "Couple", "Family", "Group"],
    season: ["Not Specified", "Summer", "Fall", "Winter", "Spring"],
    time: ["Not Specified", "Morning", "Afternoon", "Evening"],
  };

  const [selected, setSelected] = useState({
    activity: "Not Specified",
    price: "Not Specified",
    location: "Not Specified",
    effort: "Not Specified",
    groupSize: "Not Specified",
    season: "Not Specified",
    time: "Not Specified",
  });

  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock/unlock scroll based on search state
  useEffect(() => {
    if (!hasSearched) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hasSearched]);

  const handleSearch = () => {
    setHasSearched(true);
    const fakeData = []; // replace with real results later
    setResults(fakeData);
  };

  const scale = Math.max(0.8, 1 - scrollY * 0.001);
  const translateY = hasSearched ? "-translate-y-10" : "";

  return (
    <div className="min-h-screen pt-24 bg-gray-100">
      {/* Centering wrapper */}
      <div className="flex items-center justify-center h-[80vh] pointer-events-none">
        {/* Animated Search Box */}
        <div
          className={`transition-all duration-300 ease-in-out transform ${translateY} pointer-events-auto`}
          style={{ scale }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[1100px] mx-auto">
            {/* Top row: 4 dropdowns */}
            <div className="grid grid-cols-4 gap-4">
              {["activity", "price", "location", "effort"].map((key) => (
                <div key={key} className="col-span-1">
                  <label className="block mb-1 font-medium capitalize">{key}</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selected[key]}
                    onChange={(e) =>
                      setSelected((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                  >
                    {categoryData[key].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Bottom row: 3 dropdowns */}
            <div className="flex justify-center gap-4 mt-4">
              {["groupSize", "season", "time"].map((key) => (
                <div key={key} className="w-[200px]">
                  <label className="block mb-1 font-medium capitalize">{key}</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selected[key]}
                    onChange={(e) =>
                      setSelected((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                  >
                    {categoryData[key].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="block px-6 py-2 mx-auto mt-6 text-white bg-green-600 rounded hover:bg-yellow-500"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Section BELOW search box */}
      {hasSearched && (
        <div className="w-full max-w-3xl px-4 mx-auto mt-2">
          {results.length === 0 ? (
            <p className="text-center text-gray-500">
              No results found for the selected categories.
            </p>
          ) : (
            <ul className="p-4 bg-white rounded-lg shadow-md">
              {results.map((r, idx) => (
                <li key={idx}>{r.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
