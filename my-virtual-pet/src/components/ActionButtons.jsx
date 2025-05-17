// src/components/ActionButtons.jsx
import { MAX_STATS } from '../constants'; 

const ActionButtons = ({ onFeed, onPlay, onClean, onToggleSleep, petState }) => {
  const isPetUnavailable = petState?.isSleeping || petState?.activity || petState?.stats.health <= 0;
  const isSleeping = petState?.isSleeping;
  const isDead = petState?.stats.health <= 0;

  if (isDead) {
      return <div className="actions-unavailable">Your pet is no longer with us. 💀</div>;
  }
  return (
    <div className="action-buttons">
      <button 
        onClick={onFeed} 
        disabled={isPetUnavailable || (petState?.stats.hunger !== undefined && MAX_STATS.hunger !== undefined && petState.stats.hunger >= MAX_STATS.hunger)}
      >
        Feed 🍲
      </button>
      <button 
        onClick={onPlay} 
        disabled={isPetUnavailable || (petState?.stats.energy !== undefined && petState.stats.energy < 20)}
      >
        Play 🎾
      </button>
      <button 
        onClick={onClean} 
        disabled={isPetUnavailable || (petState?.stats.cleanliness !== undefined && MAX_STATS.cleanliness !== undefined && petState.stats.cleanliness >= MAX_STATS.cleanliness)}
      >
        Clean 🛁
      </button>
      <button 
        onClick={onToggleSleep} 
        disabled={petState?.activity && !isSleeping}
      >
        {isSleeping ? 'Wake Up ☀️' : 'Sleep 🌙'}
      </button>
    </div>
  );
};
export default ActionButtons;