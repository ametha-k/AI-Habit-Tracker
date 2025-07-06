import { useState } from "react";
import axios from "axios";

const AddHabitForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8000/habits/", { name, goal });
      setName("");
      setGoal(20);
      onClose();
    } catch (err) {
      setError("Failed to add habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Habit</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="e.g. Exercise"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
        <input
          type="number"
          min={1}
          value={goal}
          onChange={e => setGoal(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Number of times to perform habit in a month"
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="pt-2">
        <button
          type="submit"
          className={`w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm; 