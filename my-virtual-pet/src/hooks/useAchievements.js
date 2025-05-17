// src/hooks/useAchievements.js
import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { ACHIEVEMENTS as ALL_ACHIEVEMENTS_DEFINITIONS, GROWTH_STAGES, MAX_STATS } from '../constants';
import { determineGrowthStage } from '../utils/petUtils';

const INITIAL_UNLOCKED_ACHIEVEMENTS = {};

const useAchievements = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage(
    'unlockedAchievements',
    INITIAL_UNLOCKED_ACHIEVEMENTS
  );
  const [achievementNotification, setAchievementNotification] = useState(null);

  const unlockAchievement = useCallback((achievementId) => {
    if (!unlockedAchievements[achievementId]) {
      const achievement = ALL_ACHIEVEMENTS_DEFINITIONS[achievementId];
      if (achievement) {
        setUnlockedAchievements(prev => ({ ...prev, [achievementId]: true }));
        setAchievementNotification(`Achievement Unlocked: ${achievement.name}`); // Uses setAchievementNotification
        return true;
      }
    }
    return false;
  }, [unlockedAchievements, setUnlockedAchievements]);

  const checkAndUnlockAchievement = useCallback((petState, interactionsCount = {}) => {
    let newUnlock = false; // Ensure newUnlock is defined
    if (!petState) return false;

    if (!unlockedAchievements[ALL_ACHIEVEMENTS_DEFINITIONS.WELCOME_PARENT.id]) {
        if (unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.WELCOME_PARENT.id)) newUnlock = true;
    }

    if (interactionsCount.feed > 0 && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.FIRST_MEAL.id)) newUnlock = true;
    if (interactionsCount.play > 0 && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.PLAYTIME_FUN.id)) newUnlock = true;
    if (interactionsCount.clean > 0 && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.SQUEAKY_CLEAN.id)) newUnlock = true;
    if (interactionsCount.sleep > 0 && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.GOOD_NIGHT.id)) newUnlock = true;
    
    if (petState.age >= 1 && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.BABY_STEPS.id)) newUnlock = true;
    
    const currentGrowthStageDetails = determineGrowthStage(petState.age);
    const currentGrowthStageName = currentGrowthStageDetails?.name;

    if (currentGrowthStageName === GROWTH_STAGES.CHILD.name && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.GROWING_UP.id)) newUnlock = true;
    if (currentGrowthStageName === GROWTH_STAGES.TEEN.name && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.TEEN_SPIRIT.id)) newUnlock = true;
    if (currentGrowthStageName === GROWTH_STAGES.ADULT.name && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.ALL_GROWN_UP.id)) newUnlock = true;
    
    if (petState.stats && petState.stats.happiness >= MAX_STATS.happiness && unlockAchievement(ALL_ACHIEVEMENTS_DEFINITIONS.MAX_HAPPINESS.id)) newUnlock = true;

    return newUnlock;
  }, [unlockAchievement, unlockedAchievements]);

  const getAchievementsStatus = () => {
    return Object.values(ALL_ACHIEVEMENTS_DEFINITIONS).map(ach => ({
        ...ach,
        unlocked: !!unlockedAchievements[ach.id]
    }));
  };

  const clearAchievementNotification = useCallback(() => setAchievementNotification(null), []); // Uses setAchievementNotification

  return {
    unlockedAchievements,
    achievementNotification,
    checkAndUnlockAchievement,
    getAchievementsStatus,
    clearAchievementNotification
  };
};

export default useAchievements;