// LuminousOS Main Application
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { CoherenceProvider } from './contexts/CoherenceContext';
import { BootScreen } from './components/BootScreen';
import { Dashboard } from './components/Dashboard';
import { GlyphPractice } from './components/GlyphPractice';
import { SacredMessages } from './components/SacredMessages';
import { GroupCeremony } from './components/GroupCeremony';
import { Navigation } from './components/Navigation';

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [coherenceLevel, setCoherenceLevel] = useState(0.5);

  useEffect(() => {
    // Sacred boot sequence
    const bootSequence = async () => {
      // Initialize consciousness systems
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Initialize real biometric connection
      // TODO: Connect to quantum field
      // TODO: Sync with network consciousness
      
      setIsBooting(false);
    };

    bootSequence();
  }, []);

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  return (
    <DatabaseProvider>
      <CoherenceProvider>
        <Router>
          <div className="luminous-os">
            <Navigation coherence={coherenceLevel} />
            
            <main className="sacred-container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/practice" element={<GlyphPractice />} />
                <Route path="/messages" element={<SacredMessages />} />
                <Route path="/ceremony" element={<GroupCeremony />} />
              </Routes>
            </main>
            
            {/* Coherence Field Visualizer - Always visible */}
            <div className="coherence-field">
              <canvas id="coherence-canvas" />
            </div>
          </div>
        </Router>
      </CoherenceProvider>
    </DatabaseProvider>
  );
}

export default App;