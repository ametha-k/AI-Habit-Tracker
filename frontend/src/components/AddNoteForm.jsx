import { useState } from "react";

const AddNoteForm = ({ onClose }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Here you would send the note to the backend or save it in state
    setTimeout(() => {
      setNote("");
      setLoading(false);
      onClose();
    }, 500); // Simulate network delay
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Note</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Write down milestones or reflections"
          rows={5}
          required
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AddNoteForm; 