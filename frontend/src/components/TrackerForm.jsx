// src/components/TrackerForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const TrackerForm = () => {
  const [habitList, setHabitList] = useState([]);
  const [selectedHabits, setSelectedHabits] = useState({});
  const [newHabit, setNewHabit] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Load habits from backend
  const fetchHabits = async () => {
    try {
      const response = await axios.get("http://localhost:8000/habits/");
      const habits = response.data.habits || [];
      setHabitList(habits);
      const initialSelection = {};
      habits.forEach((habit) => {
        initialSelection[habit.name] = false;
      });
      setSelectedHabits(initialSelection);
    } catch (err) {
      console.error("Failed to load habits", err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleHabitChange = (e) => {
    setSelectedHabits({ ...selectedHabits, [e.target.name]: e.target.checked });
  };

  const handleNewHabit = async () => {
    if (newHabit.trim()) {
      try {
        const res = await axios.post("http://localhost:8000/habits/", { name: newHabit });
        const habit = res.data.habit;
        
        // Refresh the habit list from backend instead of just adding to local state
        await fetchHabits();
        
        // Set the new habit as selected
        setSelectedHabits(prev => ({ ...prev, [habit.name]: true }));
        setNewHabit("");
      } catch (err) {
        console.error("Failed to add habit", err);
        alert("Could not add new habit.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Log selected habits using the toggle endpoint
      for (const habit of habitList) {
        if (selectedHabits[habit.name]) {
          await axios.post("http://localhost:8000/habits/toggle/", {
            habit_id: habit.id,
            date: new Date().toISOString().split("T")[0]
          });
        }
      }

      // Log mood
      if (mood) {
        const today = new Date().toISOString().split("T")[0];
        await axios.post("http://localhost:8000/moods/", {
          date: today,
          mood,
          note: note || null,
        });
      }

      alert("Logged successfully!");
      setMood("");
      setNote("");
      const resetHabits = {};
      habitList.forEach((habit) => {
        resetHabits[habit.name] = false;
      });
      setSelectedHabits(resetHabits);
    } catch (err) {
      console.error("Submission failed:", err);
      if (err.response) {
        alert(`Failed to log: ${err.response.data.detail || err.response.statusText}`);
      } else {
        alert("Failed to log. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Daily Log</h2>
        <p className="text-sm text-gray-600 mt-1">Track your habits and mood for today</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Habits Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Habits Completed</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {habitList.map((habit) => (
              <label key={habit.id} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name={habit.name}
                  checked={selectedHabits[habit.name] || false}
                  onChange={handleHabitChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{habit.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Add New Habit */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Add new habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleNewHabit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Mood Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select mood</option>
            <option value="Happy">Happy</option>
            <option value="Neutral">Neutral</option>
            <option value="Sad">Sad</option>
          </select>
        </div>

        {/* Optional Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any notes about your day..."
            rows="3"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Daily Log"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrackerForm;
