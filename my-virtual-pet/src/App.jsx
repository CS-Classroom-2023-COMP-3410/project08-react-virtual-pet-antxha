// src/App.jsx
import usePet from './hooks/usePet';
import PetDisplay from './components/PetDisplay';
import StatusBar from './components/StatusBar';
import ActionButtons from './components/ActionButtons';
import AchievementsList from './components/AchievementsList';
import Notification from './components/Notification';
import { MAX_STATS } from './constants'; // Import if needed for ActionButtons directly, or pass from usePet
import './App.css';

function App() {
  const {
    petState,
    mood,
    isLoading,
    notification,
    feedPet,
    playWithPet,
    cleanPet,
    toggleSleep,
    achievements,
  } = usePet();

  if (isLoading) {
    return <div className="app-loading">Initializing your Pet... <span role="img" aria-label="hour glass">⏳</span></div>;
  }
  if (!petState) {
    return <div className="app-error">Error loading pet data. Please refresh.</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Virtual Pet</h1>
        {petState.birthdate && <p className="pet-age">Age: {petState.age} days</p>}
        <p className="pet-mood">Mood: {mood}</p>
      </header>

      <Notification message={notification} />

      <main className="app-main">
        <section className="pet-viewer">
          <PetDisplay petState={petState} />
        </section>

        <section className="pet-status-bars">
          {Object.entries(petState.stats).map(([statName, statValue]) => (
            <StatusBar
              key={statName}
              label={statName}
              value={statValue}
              maxValue={MAX_STATS[statName]}
            />
          ))}
        </section>

        <section className="pet-actions">
          <ActionButtons
            onFeed={feedPet}
            onPlay={playWithPet}
            onClean={cleanPet}
            onToggleSleep={toggleSleep}
            petState={petState} 
          />
        </section>
        
        <section className="pet-achievements">
            <AchievementsList achievements={achievements} />
        </section>
      </main>

    </div>
  );
}
export default App;