import { useState } from "react";

export default function Search(){
    const categoryData = {
        activity: ["Not Specified", "Hiking", "Skiing", "Museum", "Escape Room", "Eating Out", "Dining In"],
        price: ["Not Specified", "Free", "$", "$$", "$$$"],
        location: ["Not Specified", "Downtown", "Nature", "Suburbs"],
        effort: ["Not Specified", "Low", "Medium", "High"],
        groupSize: ["Not Specified", "Solo", "Couple", "Family", "Group"],
        season: ["Not Specified", "Summer", "Fall", "Winter", "Spring"],
        time: ["Not Specified", "Morning", "Afternoon", "Evening"]
    };

    const [selected, setSelected] = useState({
        activity: "Not Specified",
        price: "Not Specified",
        location: "Not Specified",
        effort: "Not Specified",
        groupsize: "Not Specified",
        season: "Not Specified",
        time: "Not Specified"
    })

    

    return (<div className="flex flex-col items-center justify-center min-h-screen">
        {}
    </div>);
}