import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const moodToValue = {
  sad: 1,
  neutral: 2,
  happy: 3,
};

const valueToMood = {
  1: "😢 Sad",
  2: "😐 Neutral",
  3: "😊 Happy",
};

const moodColor = {
  1: "#ff6b6b",
  2: "#feca57",
  3: "#1dd1a1",
};

const MoodChart = () => {
  const [moodData, setMoodData] = useState([]);
  const [allMoods, setAllMoods] = useState([]);
  const [mostFrequentMood, setMostFrequentMood] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moodRes = await axios.get("http://localhost:8000/moods/");
        const moods = moodRes.data.moods;

        const validMoods = moods.filter((m) =>
          ["happy", "neutral", "sad"].includes(m.mood?.toLowerCase())
        );

        const recent = validMoods.slice(-7).map((entry) => {
          const moodVal = moodToValue[entry.mood.toLowerCase()];
          return {
            date: entry.date,
            moodLevel: moodVal,
            mood: valueToMood[moodVal],
          };
        });

        setMoodData(recent);
        setAllMoods(validMoods);

        // Calculate mood frequency for bar chart
        const freqMap = { sad: 0, neutral: 0, happy: 0 };
        validMoods.forEach((m) => {
          const mood = m.mood.toLowerCase();
          if (freqMap[mood] !== undefined) freqMap[mood]++;
        });

        const maxMood = Object.entries(freqMap).reduce((a, b) => (a[1] > b[1] ? a : b));
        setMostFrequentMood({ mood: valueToMood[moodToValue[maxMood[0]]], count: maxMood[1] });
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    {
      name: "😊 Happy",
      value: allMoods.filter((m) => m.mood.toLowerCase() === "happy").length,
    },
    {
      name: "😐 Neutral",
      value: allMoods.filter((m) => m.mood.toLowerCase() === "neutral").length,
    },
    {
      name: "😢 Sad",
      value: allMoods.filter((m) => m.mood.toLowerCase() === "sad").length,
    },
  ];

  const barData = [
    {
      name: "😊 Happy",
      value: pieData[0].value,
      fill: moodColor[3],
    },
    {
      name: "😐 Neutral",
      value: pieData[1].value,
      fill: moodColor[2],
    },
    {
      name: "😢 Sad",
      value: pieData[2].value,
      fill: moodColor[1],
    },
  ];

  return (
    <div className="py-12 px-4 bg-gray-50">
      {/* Mood Over Time */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto mb-10 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Mood Over the Last 7 Days</h2>
        {moodData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={moodData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0072ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 3]} ticks={[1, 2, 3]} tickFormatter={(v) => valueToMood[v]} />
              <Tooltip formatter={(val) => valueToMood[val]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="moodLevel"
                stroke="#4b7bec"
                fill="url(#moodGradient)"
                strokeWidth={3}
              >
                <LabelList dataKey="mood" position="top" />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No recent mood data available.</p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Mood Distribution Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                <Cell fill="#1dd1a1" />
                <Cell fill="#feca57" />
                <Cell fill="#ff6b6b" />
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Most Frequent Mood */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Mood Frequency Insight</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" label={{ position: "right" }}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {mostFrequentMood && (
            <p className="text-center text-gray-600 mt-4">
              Most frequent mood is <strong>{mostFrequentMood.mood}</strong> ({mostFrequentMood.count} times)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodChart;