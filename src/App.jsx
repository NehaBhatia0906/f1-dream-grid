import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { drivers, races, wildCards } from './data/f1Data';
import './App.css';

function App() {
  const [currentRace, setCurrentRace] = useState(null);
  const [dreamGrid, setDreamGrid] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Find the next upcoming race
  useEffect(() => {
    const today = new Date();
    const nextRace = races.find(race => new Date(race.date) > today);
    setCurrentRace(nextRace || races[0]);
  }, []);

  // Generate initial dream grid
  useEffect(() => {
    generateDreamGrid();
  }, [currentRace]);

  const generateDreamGrid = () => {
    setIsShuffling(true);
    
    // Separate current legends and regular drivers
    const currentLegends = dreamGrid.filter(driver => driver.id > 100);
    const regularDrivers = [...drivers].sort(() => Math.random() - 0.5);
    
    // Calculate how many regular drivers we need
    const regularDriversNeeded = Math.max(5 - currentLegends.length, 0);
    
    // Get the required number of regular drivers
    const selectedRegularDrivers = regularDrivers.slice(0, regularDriversNeeded);
    
    // Combine and shuffle both regular drivers and legends
    const combinedGrid = [...selectedRegularDrivers, ...currentLegends]
      .sort(() => Math.random() - 0.5)
      .map((driver, index) => ({
        ...driver,
        position: index + 1
      }));
    
    setDreamGrid(combinedGrid);
    setTimeout(() => setIsShuffling(false), 500);
  };

  const addWildCard = () => {
    const randomWildCard = wildCards[Math.floor(Math.random() * wildCards.length)];
    const randomPosition = Math.floor(Math.random() * (dreamGrid.length + 1)); // Random position in current grid
    
    // Create new grid with wild card
    const newGrid = [...dreamGrid];
    newGrid.splice(randomPosition, 0, { ...randomWildCard, position: randomPosition + 1 });
    
    // Update positions for all drivers
    const updatedGrid = newGrid.map((driver, index) => ({
      ...driver,
      position: index + 1
    }));
    
    setDreamGrid(updatedGrid);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="app">
      <div className="background-overlay"></div>
      <header className="app-header">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          F1 Dream Grid
        </motion.h1>
        {currentRace && (
          <motion.div 
            className="race-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>{currentRace.name}</h2>
            <p>{format(new Date(currentRace.date), 'MMMM d, yyyy')}</p>
          </motion.div>
        )}
      </header>

      <motion.main 
        className="dream-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {dreamGrid.map((driver) => (
            <motion.div
              key={`${driver.id}-${driver.position}`}
              className={`grid-position ${driver.id > 100 ? 'wildcard' : ''}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              style={{ backgroundColor: driver.color }}
            >
              <div className="position">P{driver.position}</div>
              <div className="driver-info">
                <div className="initials">{driver.initials}</div>
                <div className="team">{driver.team}</div>
                {driver.id > 100 && <div className="wildcard-label">Legend</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.main>

      <div className="controls">
        <motion.button 
          className="shuffle-button"
          onClick={generateDreamGrid}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isShuffling}
        >
          {isShuffling ? 'Shuffling...' : 'Shuffle Grid'}
        </motion.button>
        <motion.button 
          className="wildcard-button"
          onClick={addWildCard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Legend
        </motion.button>
      </div>
    </div>
  );
}

export default App; 