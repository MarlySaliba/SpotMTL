import { useState } from "react"; // Import React's useState hook

// Define and export the Search component
export default function Search() {
  // Define all the dropdown category options
  const categoryData = {
    activity: ["Not Specified", "Hiking", "Skiing", "Museum", "Escape Room", "Eating Out", "Dining In"],
    price: ["Not Specified", "Free", "$", "$$", "$$$"],
    location: ["Not Specified", "Downtown", "Nature", "Suburbs"],
    effort: ["Not Specified", "Low", "Medium", "High"],
    groupSize: ["Not Specified", "Solo", "Couple", "Family", "Group"],
    season: ["Not Specified", "Summer", "Fall", "Winter", "Spring"],
    time: ["Not Specified", "Morning", "Afternoon", "Evening"]
  };

  // Track the selected option for each category
  const [selected, setSelected] = useState({
    activity: "Not Specified",
    price: "Not Specified",
    location: "Not Specified",
    effort: "Not Specified",
    groupSize: "Not Specified",
    season: "Not Specified",
    time: "Not Specified"
  });

  // Placeholder for future results (currently unused)
  const [results, setResults] = useState([]);

  // Track if the user has clicked search
  const [hasSearched, setHasSearched] = useState(false);

  // Function that simulates searching this section will have to change when i actually add options to  the search menu.
  const handleSearch = () => {
    setHasSearched(true); // Mark that the search has been performed
    const fakeData = [];  // Simulate no results
    setResults(fakeData); // Update the results (empty for now)
  };

  return (
    <>
            {/* Outer container to center everything */}
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        
        {/* Inner container with white background */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[1100px]">

            {/* Top row of 4 dropdowns */}
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

            {/* Second row: 3 dropdowns centered */}
            <div className="flex justify-center gap-4 mt-4">
            
            {/* Group Size dropdown */}
            <div className="w-[200px]">
                <label className="block mb-1 font-medium">Group Size</label>
                <select
                className="w-full p-2 border rounded"
                value={selected.groupSize}
                onChange={(e) =>
                    setSelected((prev) => ({ ...prev, groupSize: e.target.value }))
                }
                >
                {categoryData.groupSize.map((option) => (
                    <option key={option} value={option}>
                    {option}
                    </option>
                ))}
                </select>
            </div>

            {/* Season dropdown */}
            <div className="w-[200px]">
                <label className="block mb-1 font-medium">Season</label>
                <select
                className="w-full p-2 border rounded"
                value={selected.season}
                onChange={(e) =>
                    setSelected((prev) => ({ ...prev, season: e.target.value }))
                }
                >
                {categoryData.season.map((option) => (
                    <option key={option} value={option}>
                    {option}
                    </option>
                ))}
                </select>
            </div>

            {/* Time dropdown */}
            <div className="w-[200px]">
                <label className="block mb-1 font-medium">Time</label>
                <select
                className="w-full p-2 border rounded"
                value={selected.time}
                onChange={(e) =>
                    setSelected((prev) => ({ ...prev, time: e.target.value }))
                }
                >
                {categoryData.time.map((option) => (
                    <option key={option} value={option}>
                    {option}
                    </option>
                ))}
                </select>
            </div>
            </div>

            {/* Search Button */}
            <button
            onClick={handleSearch}
            className="block px-6 py-2 mx-auto mt-6 text-white bg-green-600 rounded hover:bg-yellow-500"
            >
            Search
            </button>
        </div>

        {/* Results area below */}
        {hasSearched && (
            <div className="w-full max-w-3xl mt-6">
            {results.length === 0 ? (
                <p className="text-center text-gray-500">
                No results found for the selected categories.
                </p>
            ) : (
                <ul>
                {results.map((r, idx) => (
                    <li key={idx}>{r.name}</li>
                ))}
                </ul>
            )}
            </div>
        )}
        </div>
    </>
  );
}
