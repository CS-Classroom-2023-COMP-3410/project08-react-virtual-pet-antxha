// src/hooks/usePet.js
import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import useTimePassage from './useTimePassage';
import useAchievements from './useAchievements';
import {
  INITIAL_STATS, MAX_STATS, STAT_DECAY_INTERVAL, ACTIVITY_DURATION, GROWTH_STAGES, ONE_MINUTE_MS
} from '../constants';
import { calculatePetAgeInDays, minutesElapsedSince } from '../utils/timeUtils';
import { determineGrowthStage, calculateOverallMood, applyStatChanges } from '../utils/petUtils';

const PET_STATE_KEY = 'virtualPetState';

const INITIAL_INTERACTIONS_COUNT = {
  feed: 0,
  play: 0,
  clean: 0,
  sleep: 0
};

const usePet = () => {
  const [petState, setPetStateInternal] = useLocalStorage(PET_STATE_KEY, null);
  const [uiNotification, setUiNotification] = useState(null);
  const [interactionsCount, setInteractionsCount] = useLocalStorage(
    'petInteractionsCount',
    INITIAL_INTERACTIONS_COUNT // Use the stable reference
  );

  const { 
    achievementNotification, 
    checkAndUnlockAchievement, 
    getAchievementsStatus,
    clearAchievementNotification
  } = useAchievements();
  
  const { calculateOfflineDecay, handlePeriodicLiveDecay } = useTimePassage();

  const setPetState = useCallback((updater) => {
    setPetStateInternal(prev => {
      const newState = typeof updater === 'function' ? updater(prev) : updater;
      return { ...newState, lastVisitedTimestamp: Date.now() };
    });
  }, [setPetStateInternal]);

  // Initialize pet and handle offline progress
  useEffect(() => {
    if (!petState) { // First time load or no saved data
      console.log("Initializing new pet.");
      const birthdate = Date.now();
      const initialPet = {
        stats: { ...INITIAL_STATS },
        activity: null,
        growthStage: GROWTH_STAGES.EGG.name,
        birthdate: birthdate,
        age: 0,
        lastInteractionTimestamp: birthdate,
        lastVisitedTimestamp: birthdate,
        isSleeping: false,
      };
      setPetState(initialPet);

      const freshInteractionsCount = { ...INITIAL_INTERACTIONS_COUNT };
      setInteractionsCount(freshInteractionsCount);
      checkAndUnlockAchievement(initialPet, interactionsCount); // Welcome achievement
      setUiNotification("Welcome! Your new pet egg has arrived!");
    } else { // Existing pet, calculate offline progress
      const timeSinceLastVisitMinutes = minutesElapsedSince(petState.lastVisitedTimestamp);
      
      if (timeSinceLastVisitMinutes > 0.1) { // Process if more than ~6 seconds passed
        setUiNotification(`Welcome back! Updating your pet for the ${timeSinceLastVisitMinutes.toFixed(1)} minutes you were away.`);
        
        setPetState(prev => {
          if (!prev) return null;

          const newAge = calculatePetAgeInDays(prev.birthdate);
          const statsAfterOffline = calculateOfflineDecay(prev.stats, timeSinceLastVisitMinutes);
          const newGrowthStageDetails = determineGrowthStage(newAge);

          let growthMessage = null;
          if (newGrowthStageDetails.name !== prev.growthStage && statsAfterOffline.health > 0) {
            growthMessage = `Your pet grew into a ${newGrowthStageDetails.name}!`;
          }
          
          // Set UI notification after state update if there's a growth message
          if (growthMessage) {
            setTimeout(() => setUiNotification(growthMessage), 100); 
          }

          const updatedStateForAchievements = { 
            ...prev, stats: statsAfterOffline, age: newAge, growthStage: newGrowthStageDetails.name 
          };
          checkAndUnlockAchievement(updatedStateForAchievements, interactionsCount);

          return {
            ...prev,
            stats: statsAfterOffline,
            age: newAge,
            growthStage: statsAfterOffline.health > 0 ? newGrowthStageDetails.name : prev.growthStage, // Don't change stage if dead
            lastVisitedTimestamp: Date.now(),
          };
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount


  // Periodic stat decay, aging, and growth checks
  useEffect(() => {
    if (!petState || petState.stats.health <= 0) return;

    const gameTickInterval = setInterval(() => {
      if (petState.isSleeping) return; // No decay or aging while sleeping

      setPetState(prev => {
        if (!prev || prev.isSleeping || prev.stats.health <= 0) return prev;

        const newStats = handlePeriodicLiveDecay(prev.stats);
        const newAge = calculatePetAgeInDays(prev.birthdate);
        const newGrowthStageDetails = determineGrowthStage(newAge);
        
        let growthMessage = null;
        if (newGrowthStageDetails.name !== prev.growthStage && newStats.health > 0) {
            growthMessage = `Your pet has grown into a ${newGrowthStageDetails.name}!`;
        }
        if (growthMessage && !achievementNotification) { // Don't overwrite achievement notification
            setUiNotification(growthMessage);
        }

        const updatedStateForAchievements = { ...prev, stats: newStats, age: newAge, growthStage: newGrowthStageDetails.name };
        checkAndUnlockAchievement(updatedStateForAchievements, interactionsCount);

        return {
          ...prev,
          stats: newStats,
          age: newAge,
          growthStage: newStats.health > 0 ? newGrowthStageDetails.name : prev.growthStage,
        };
      });
    }, STAT_DECAY_INTERVAL);

    return () => clearInterval(gameTickInterval);
  }, [petState, setPetState, handlePeriodicLiveDecay, checkAndUnlockAchievement, interactionsCount, achievementNotification]);

  // Clear UI notification after a delay
  useEffect(() => {
    if (uiNotification || achievementNotification) {
      const timer = setTimeout(() => {
        setUiNotification(null);
        if (achievementNotification) clearAchievementNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [uiNotification, achievementNotification, clearAchievementNotification]);


  const updateStatsAndActivity = useCallback((statChanges, activityType, interactionName = '') => {
    if (!petState || petState.isSleeping || petState.stats.health <= 0) {
      if (!achievementNotification) setUiNotification("Pet is sleeping or unwell.");
      return;
    }

    setPetState(prev => {
      const newStats = applyStatChanges(prev.stats, statChanges);
      const updatedInteractions = interactionName ? 
        {...interactionsCount, [interactionName]: (interactionsCount[interactionName] || 0) + 1} 
        : interactionsCount;
      
      if (interactionName) setInteractionsCount(updatedInteractions);

      checkAndUnlockAchievement({...prev, stats: newStats}, updatedInteractions);
      return {
        ...prev,
        stats: newStats,
        activity: activityType,
        lastInteractionTimestamp: Date.now(),
      };
    });

    if (activityType) {
      setTimeout(() => {
        setPetState(prev => ({ ...prev, activity: null }));
      }, ACTIVITY_DURATION);
    }
  }, [petState, setPetState, checkAndUnlockAchievement, interactionsCount, setInteractionsCount, achievementNotification]);

  const feedPet = useCallback(() => {
    if (petState?.stats.hunger >= MAX_STATS.hunger) {
      if(!achievementNotification) setUiNotification("Pet is not hungry!"); return;
    }
    updateStatsAndActivity({ hunger: 25, energy: 5, happiness: 5, bond: 2 }, 'eating', 'feed');
  }, [updateStatsAndActivity, petState, achievementNotification]);

  const playWithPet = useCallback(() => {
    if (petState?.stats.energy < 20) {
      if(!achievementNotification) setUiNotification("Pet is too tired to play."); return;
    }
    updateStatsAndActivity({ happiness: 20, energy: -15, hunger: -5, bond: 3 }, 'playing', 'play');
  }, [updateStatsAndActivity, petState, achievementNotification]);

  const cleanPet = useCallback(() => {
     if (petState?.stats.cleanliness >= MAX_STATS.cleanliness) {
      if(!achievementNotification) setUiNotification("Pet is already clean!"); return;
    }
    updateStatsAndActivity({ cleanliness: MAX_STATS.cleanliness, happiness: -5, bond: 1 }, 'cleaning', 'clean');
  }, [updateStatsAndActivity, petState, achievementNotification]);

  const toggleSleep = useCallback(() => {
    if (petState?.stats.health <= 0) {
      if(!achievementNotification) setUiNotification("Your pet cannot sleep now."); return;
    }
    setPetState(prev => {
      const currentlySleeping = !prev.isSleeping;
      if (currentlySleeping && !achievementNotification) setUiNotification("Pet is now sleeping. Zzz...");
      else if (!currentlySleeping && !achievementNotification) setUiNotification("Pet woke up!");
      
      const updatedInteractions = currentlySleeping ? 
        {...interactionsCount, sleep: (interactionsCount.sleep || 0) + 1}
        : interactionsCount;

      if (currentlySleeping) setInteractionsCount(updatedInteractions);
      checkAndUnlockAchievement(prev, updatedInteractions);

      return {
        ...prev,
        isSleeping: currentlySleeping,
        activity: currentlySleeping ? 'sleeping' : null,
        lastInteractionTimestamp: Date.now(),
      };
    });
  }, [petState, setPetState, interactionsCount, setInteractionsCount, checkAndUnlockAchievement, achievementNotification]);

  useEffect(() => {
    let sleepInterval;
    if (petState?.isSleeping && petState.stats.health > 0) {
      sleepInterval = setInterval(() => {
        setPetState(prev => {
          if (!prev.isSleeping || prev.stats.energy >= MAX_STATS.energy) {
            if (prev.stats.energy >= MAX_STATS.energy && prev.isSleeping && !achievementNotification) {
                setUiNotification("Pet is fully rested!");
            }
            return prev;
          }
          return {
            ...prev,
            stats: applyStatChanges(prev.stats, { energy: 5, health: 0.5 }),
          };
        });
      }, 2000);
    }
    return () => clearInterval(sleepInterval);
  }, [petState?.isSleeping, petState?.stats.health, petState?.stats.energy, setPetState, achievementNotification]);

  const mood = petState ? calculateOverallMood(petState.stats) : 'Loading...';
  const isLoading = !petState;

  return {
    petState,
    mood,
    isLoading,
    notification: achievementNotification || uiNotification,
    feedPet,
    playWithPet,
    cleanPet,
    toggleSleep,
    achievements: getAchievementsStatus(),
  };
};
export default usePet;