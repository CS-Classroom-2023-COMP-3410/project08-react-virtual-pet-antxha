// src/hooks/useTimePassage.js
import { STAT_DECAY_RATES, STAT_DECAY_INTERVAL, MAX_STATS, ONE_MINUTE_MS } from '../constants';
import { applyStatChanges } from '../utils/petUtils';

const useTimePassage = () => {
  const calculateOfflineDecay = (currentStats, minutesPassed) => {
    if (!currentStats || minutesPassed <= 0) return currentStats;

    let newStats = { ...currentStats };

    for (const stat in STAT_DECAY_RATES) {
      const totalDecayForStat = STAT_DECAY_RATES[stat] * minutesPassed;
      newStats[stat] = (newStats[stat] || 0) - totalDecayForStat;
    }


    let healthPenaltyMultiplier = 0;
    if (newStats.hunger < 20) healthPenaltyMultiplier += 0.3; 
    if (newStats.happiness < 20) healthPenaltyMultiplier += 0.2;
    if (newStats.cleanliness < 10) healthPenaltyMultiplier += 0.2;

    if (healthPenaltyMultiplier > 0) {
      const additionalHealthDecay = (STAT_DECAY_RATES.health + 2) * healthPenaltyMultiplier * minutesPassed; // Make health penalty more significant
      newStats.health -= additionalHealthDecay;
    }
    
    for (const statName in newStats) {
      newStats[statName] = Math.max(0, Math.min(MAX_STATS[statName] || 100, newStats[statName]));
    }
    
    if (newStats.health <= 0) {
        newStats.health = 0; 
    }
    return newStats;
  };

  const handlePeriodicLiveDecay = (currentStats) => {
    if (!currentStats || currentStats.health <= 0) return currentStats;

    const decayChanges = {};
    for (const stat in STAT_DECAY_RATES) {
      const decayPerTick = STAT_DECAY_RATES[stat] / (ONE_MINUTE_MS / STAT_DECAY_INTERVAL);
      decayChanges[stat] = -decayPerTick;
    }

    let healthPenalty = 0;
    if (currentStats.hunger < 20) healthPenalty += 0.25; 
    if (currentStats.happiness < 20) healthPenalty += 0.15;
    if (currentStats.cleanliness < 10) healthPenalty += 0.15;
    if (healthPenalty > 0) {
      decayChanges.health = (decayChanges.health || 0) - healthPenalty;
    }
    
    return applyStatChanges(currentStats, decayChanges);
  };

  return { calculateOfflineDecay, handlePeriodicLiveDecay };
};
export default useTimePassage;