
import React, { useState } from "react";
import ComedyStandup from "./ComedyStandup";
import MusicConcerts from "./MusicConcerts";
import OngoingMovies from "../pages/OngoingMovies";
const PlanMyWeekend = () => {
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState("");
  const [showPlan, setShowPlan] = useState(false);

  const generatePlan = () => {
    if (mood) {
      setShowPlan(true);
    } else {
      alert("Please select a mood first!");
    }
  };

  // helper → only pick some with high rating
  const renderWithFilter = (Component, props = {}) => (
    <div className="mt-4">
      <Component {...props} limit={5} minRating={7} />
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🎉 Weekend Planner</h2>

      {/* Mood Selection */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Select Mood:</label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">-- Select Mood --</option>
          <option value="Happy">Happy</option>
          <option value="Chill">Chill</option>
          <option value="Excited">Excited</option>
          <option value="Romantic">Romantic</option>
        </select>
      </div>

      {/* Budget */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Enter Budget (₹):</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter your budget"
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <button
        onClick={generatePlan}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate My Plan
      </button>

      {/* Conditional results */}
      {showPlan && (
        <div className="mt-6">
          {mood === "Happy" && renderWithFilter(ComedyStandup, { budget })}
          {mood === "Chill" && renderWithFilter(OngoingMovies, { budget })}
          {mood === "Excited" && renderWithFilter(MusicConcerts, { budget })}
          {mood === "Romantic" && (
            <>
              {renderWithFilter(OngoingMovies, { budget })}
              {renderWithFilter(MusicConcerts, { budget })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanMyWeekend