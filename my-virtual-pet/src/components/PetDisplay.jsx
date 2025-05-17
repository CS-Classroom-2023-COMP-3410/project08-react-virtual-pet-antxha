// src/components/PetDisplay.jsx
import React from 'react';
import { getPetCurrentEmoji } from '../utils/petUtils';

const PetDisplay = ({ petState }) => {
  if (!petState) {
    return <div className="pet-display loading">Loading Pet...</div>;
  }
  const emoji = getPetCurrentEmoji(petState);
  return (
    <div className={`pet-display ${petState.activity || ''} ${petState.isSleeping ? 'sleeping-animation' : ''}`}>
      <span className="pet-emoji" role="img" aria-label="Virtual Pet">
        {emoji}
      </span>
      {petState.activity && petState.activity !== 'sleeping' && (
        <span className="activity-indicator">({petState.activity})</span>
      )}
    </div>
  );
};
export default PetDisplay;