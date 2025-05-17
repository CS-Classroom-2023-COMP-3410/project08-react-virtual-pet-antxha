// src/utils/petUtils.js
import { GROWTH_STAGES, PET_EMOJIS, MAX_STATS } from '../constants';

export function determineGrowthStage(ageInDays) {
  if (ageInDays === 0 && GROWTH_STAGES.EGG && GROWTH_STAGES.EGG.maxAge === 0) {
      return GROWTH_STAGES.EGG;
  }
  for (const stageKey in GROWTH_STAGES) {
    const stage = GROWTH_STAGES[stageKey];
    if (stageKey === 'EGG' && ageInDays > stage.maxAge) continue;

    if (ageInDays >= stage.minAge && ageInDays <= stage.maxAge) {
      return stage;
    }
  }
  return GROWTH_STAGES.ADULT;
}

export function getPetCurrentEmoji(petState) {
  if (!petState) return PET_EMOJIS.HAPPY || '😊'; 

  const growthStageDetails = determineGrowthStage(petState.age);
  let baseEmoji = growthStageDetails.emoji;

  let stateEmoji = null;

  if (petState.stats.health <= 0) {
    stateEmoji = PET_EMOJIS.DEAD;
  } else if (petState.activity === 'sleeping' || petState.isSleeping) {
    stateEmoji = PET_EMOJIS.SLEEPING;
  } else if (petState.activity === 'eating') {
    stateEmoji = PET_EMOJIS.EATING;
  } else if (petState.activity === 'playing') {
    stateEmoji = PET_EMOJIS.PLAYING;
  } else if (petState.activity === 'cleaning') {
    stateEmoji = PET_EMOJIS.CLEANING;
  } else {
    if (petState.stats.health < 30) {
      stateEmoji = PET_EMOJIS.SICK;
    } else if (petState.stats.hunger < 30) {
      stateEmoji = PET_EMOJIS.HUNGRY;
    } else if (petState.stats.energy < 30) {
      stateEmoji = PET_EMOJIS.TIRED;
    } else if (petState.stats.cleanliness < 30) {
      stateEmoji = PET_EMOJIS.DIRTY;
    }
  }


  if (stateEmoji) {
    return `${baseEmoji} ${stateEmoji}`; 
  } else {
    return baseEmoji; 
  }
}

export function calculateOverallMood(stats) {
  if (stats.health <= 0) return 'Dead';
  if (stats.health < 30) return 'Sick';
  if (stats.hunger < 30) return 'Hungry';
  if (stats.energy < 30) return 'Tired';
  if (stats.cleanliness < 30) return 'Dirty';
  if (stats.happiness < 40) return 'Sad';
  if (stats.happiness > 80 && stats.energy > 70 && stats.hunger > 70) return 'Joyful';
  return 'Content';
}

export function applyStatChanges(currentStats, changes) {
  const newStats = { ...currentStats };
  for (const stat in changes) {
    newStats[stat] = Math.max(0, Math.min(MAX_STATS[stat] || 100, (currentStats[stat] || 0) + changes[stat]));
  }
  return newStats;
}