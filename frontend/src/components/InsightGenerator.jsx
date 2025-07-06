import { useEffect, useState } from "react";
import axios from "axios";

const InsightGenerator = () => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const res = await axios.get("http://localhost:8000/insights/weekly");
        setInsight(res.data);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, []);

  if (loading) return <div className="text-center">Loading insights...</div>;
  if (!insight) return <div className="text-center text-red-600">Failed to load insight.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-cognitune-yellow shadow rounded-lg p-6 mt-8 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Weekly Insight</h2>

      <p className="text-gray-700 mb-2">
        <strong>Summary:</strong> {insight.summary || "No summary available"}
      </p>

      <p className="text-gray-700 mb-2">
        <strong>Mood entries analyzed:</strong> {insight.mood_entries_analyzed || 0}
      </p>

      <p className="text-gray-700">
        <strong>Habits tracked:</strong>{" "}
        {Array.isArray(insight.habits_tracked) && insight.habits_tracked.length > 0
          ? insight.habits_tracked.join(", ")
          : "None"}
      </p>
    </div>
  );
};

export default InsightGenerator;
