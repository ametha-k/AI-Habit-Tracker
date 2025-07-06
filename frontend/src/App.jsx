import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HabitTracker from './components/HabitTracker';
import TrackerForm from './components/TrackerForm';
import MoodChart from './components/MoodChart';
import InsightGenerator from './components/InsightGenerator';
import AddHabitForm from './components/AddHabitForm';
import AddNoteForm from './components/AddNoteForm';
import Modal from './components/Modal';

import Login from './pages/Login';     // new login page
import Signup from './pages/Signup';   // new signup page

import './App.css';

function Dashboard() {
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  return (
    <div className="min-h-screen bg-cognitune-gray flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cognitune</h1>
        <span className="text-sm text-gray-400 font-medium">Habit & Mood Tracker</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
        <HabitTracker />
        <TrackerForm />
        <MoodChart />
        <InsightGenerator />
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-50">
        <button
          onClick={() => setShowHabitModal(true)}
          className="w-16 h-16 rounded-full shadow-lg bg-cognitune-blue hover:bg-cognitune-green transition-colors flex items-center justify-center text-3xl font-bold text-gray-700 border-4 border-white focus:outline-none"
          aria-label="Add Habit"
        >
          +
        </button>
        <button
          onClick={() => setShowNoteModal(true)}
          className="w-16 h-16 rounded-full shadow-lg bg-cognitune-pink hover:bg-cognitune-purple transition-colors flex items-center justify-center text-3xl font-bold text-gray-700 border-4 border-white focus:outline-none"
          aria-label="Add Note"
        >
          &#9998;
        </button>
      </div>

      {/* Modals */}
      <Modal open={showHabitModal} onClose={() => setShowHabitModal(false)}>
        <AddHabitForm onClose={() => setShowHabitModal(false)} />
      </Modal>
      <Modal open={showNoteModal} onClose={() => setShowNoteModal(false)}>
        <AddNoteForm onClose={() => setShowNoteModal(false)} />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;