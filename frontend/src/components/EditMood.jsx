import { useState, useEffect } from "react";
import axios from "axios";

const EditHabits = () => {
  const [habits, setHabits] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await axios.get("http://localhost:8000/habits/");
        setHabits(res.data.habits);
      } catch (err) {
        console.error("Failed to load habits", err);
      }
    };
    fetchHabits();
  }, []);

  const handleSelect = (e) => {
    const habitId = e.target.value;
    setSelectedId(habitId);

    const selected = habits.find((h) => h.id === parseInt(habitId));
    if (selected) {
      setForm({ name: selected.name, description: selected.description || "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/habits/${selectedId}`, form);
      setMessage("Habit updated successfully!");
      
      // Refresh habit list
      const res = await axios.get("http://localhost:8000/habits/");
      setHabits(res.data.habits);
    } catch (err) {
      console.error("Update failed", err);
      setMessage("Update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this habit? This will also delete all associated logs.");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/habits/${selectedId}`);
      setMessage("Habit deleted successfully!");

      // Refresh habit list
      const res = await axios.get("http://localhost:8000/habits/");
      setHabits(res.data.habits);

      // Reset selection
      setSelectedId("");
      setForm({ name: "", description: "" });
    } catch (err) {
      console.error("Delete failed", err);
      setMessage("Delete failed. Try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Manage Habits</h2>
        <p className="text-sm text-gray-600 mt-1">Edit or delete your habits</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select a habit to edit</label>
          <select
            onChange={handleSelect}
            value={selectedId}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a habit...</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {selectedId && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter habit name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description"
                rows="3"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Update Habit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Delete Habit
              </button>
            </div>

            {message && (
              <div className={`text-sm p-3 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default EditHabits;
