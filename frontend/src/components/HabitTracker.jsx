// src/components/HabitTracker.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const pastelColors = [
  "bg-cognitune-blue",
  "bg-cognitune-green",
  "bg-cognitune-yellow",
  "bg-cognitune-purple",
  "bg-cognitune-pink",
  "bg-cognitune-teal",
];

function getPastel(index) {
  return pastelColors[index % pastelColors.length];
}

const HabitTracker = () => {
  const [habitData, setHabitData] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month"); // default to month view
  const [anchorDate, setAnchorDate] = useState(new Date());

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/habits/logs", {
        params: {
          period,
          anchor_date: anchorDate.toISOString().slice(0, 10),
        },
      });
      setHabitData(res.data.habits);
      setDates(res.data.dates);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch habit logs", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [period, anchorDate]);

  const changePeriod = (direction) => {
    const date = new Date(anchorDate);
    if (period === "week") date.setDate(date.getDate() + direction * 7);
    if (period === "month") date.setMonth(date.getMonth() + direction);
    if (period === "year") date.setFullYear(date.getFullYear() + direction);
    setAnchorDate(date);
  };

  const toggleHabit = async (habitId, date) => {
    try {
      await axios.post("http://localhost:8000/habits/toggle/", {
        habit_id: habitId,
        date: date
      });
      // Refresh the data to show the updated state
      await fetchLogs();
    } catch (err) {
      console.error("Failed to toggle habit", err);
      alert("Failed to update habit. Please try again.");
    }
  };

  // Calendar header helpers
  const getMonthYearLabel = () => {
    if (period === "month") {
      return anchorDate.toLocaleString("default", { month: "long", year: "numeric" });
    }
    if (period === "year") {
      return anchorDate.getFullYear();
    }
    // Week: show week range
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    return `${start.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("default", { month: "short", day: "numeric" })}`;
  };

  // Render day-of-week header (M, T, W, ...)
  const renderDayHeaders = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    // Align with the first day in dates
    const firstDate = new Date(dates[0]);
    let startIdx = firstDate.getDay();
    return dates.map((d, idx) => (
      <th key={d} className="text-xs font-semibold text-gray-500 text-center px-2 py-1 border-b border-gray-200">
        {days[(startIdx + idx) % 7]}
      </th>
    ));
  };

  // Render day numbers (1, 2, 3, ...)
  const renderDayNumbers = () => (
    dates.map((d) => (
      <th key={d} className="text-xs font-medium text-gray-700 text-center px-2 py-1 border-b border-gray-200">
        {new Date(d).getDate()}
      </th>
    ))
  );

  // Render the calendar grid
  const renderHabitRows = () => (
    habitData.map((habit, hIdx) => (
      <tr key={habit.id}>
        {dates.map((d, idx) => {
          const completed = habit.logs[idx];
          // Color for this habit row
          const pastel = getPastel(hIdx);
          // Highlight today
          const isToday = d === new Date().toISOString().slice(0, 10);
          return (
            <td
              key={d}
              onClick={() => toggleHabit(habit.id, d)}
              className={`relative text-center align-middle px-2 py-2 border border-gray-200 ${pastel} ${isToday ? "border-2 border-gray-700" : ""} cursor-pointer hover:opacity-80 transition-opacity`}
              style={{ minWidth: 32, height: 32 }}
            >
              {completed && (
                <span className="inline-block text-gray-700 text-lg font-bold">&#10003;</span>
              )}
            </td>
          );
        })}
      </tr>
    ))
  );

  if (loading) return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center text-gray-500">Loading habit tracker...</div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Navigation */}
      <div className="flex justify-center items-center py-4 border-b border-gray-200">
        <button
          onClick={() => changePeriod(-1)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-800 mx-4">{getMonthYearLabel()}</span>
        <button
          onClick={() => changePeriod(1)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="ml-6 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      {/* Calendar Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-32 text-xs font-semibold text-gray-500 text-left px-2 py-1 border-b border-gray-200 sticky left-0 bg-white z-10">Habit</th>
              <th className="w-16 text-xs font-semibold text-gray-500 text-center px-2 py-1 border-b border-gray-200">Goal</th>
              <th className="w-20 text-xs font-semibold text-gray-500 text-center px-2 py-1 border-b border-gray-200">Achieved</th>
              {renderDayHeaders()}
            </tr>
            <tr>
              <th className="w-32 text-xs font-medium text-gray-700 text-left px-2 py-1 border-b border-gray-200 sticky left-0 bg-white z-10">&nbsp;</th>
              <th className="w-16 text-xs font-medium text-gray-700 text-center px-2 py-1 border-b border-gray-200">&nbsp;</th>
              <th className="w-20 text-xs font-medium text-gray-700 text-center px-2 py-1 border-b border-gray-200">&nbsp;</th>
              {renderDayNumbers()}
            </tr>
          </thead>
          <tbody>
            {habitData.map((habit, hIdx) => (
              <tr key={habit.id}>
                <td className="text-sm font-semibold text-gray-700 px-2 py-2 border border-gray-200 bg-white sticky left-0 z-10" style={{ background: '#fff' }}>{habit.name}</td>
                <td className="text-sm font-medium text-gray-600 text-center px-2 py-2 border border-gray-200 bg-white">{habit.goal || 0}</td>
                <td className="text-sm font-medium text-gray-600 text-center px-2 py-2 border border-gray-200 bg-white">{habit.achieved || 0}</td>
                {dates.map((d, idx) => {
                  const completed = habit.logs[idx];
                  const pastel = getPastel(hIdx);
                  const isToday = d === new Date().toISOString().slice(0, 10);
                  return (
                    <td
                      key={d}
                      onClick={() => toggleHabit(habit.id, d)}
                      className={`relative text-center align-middle px-2 py-2 border border-gray-200 ${pastel} ${isToday ? "border-2 border-gray-700" : ""} cursor-pointer hover:opacity-80 transition-opacity`}
                      style={{ minWidth: 32, height: 32 }}
                    >
                      {completed && (
                        <span className="inline-block text-gray-700 text-lg font-bold">&#10003;</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTracker;
