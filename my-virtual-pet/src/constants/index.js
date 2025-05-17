// src/constants/index.js
export const INITIAL_STATS = {
  hunger: 80,
  energy: 75,
  happiness: 90,
  health: 85,
  cleanliness: 70,
  bond: 50,
};

export const MAX_STATS = {
  hunger: 100,
  energy: 100,
  happiness: 100,
  health: 100,
  cleanliness: 100,
  bond: 100,
};

export const STAT_DECAY_RATES = {
  hunger: 5,
  energy: 4,
  happiness: 3,
  health: 2, 
  cleanliness: 4,
};

export const STAT_DECAY_INTERVAL = 5000;

export const GROWTH_STAGES = {
  EGG: { name: 'Egg', minAge: 0, maxAge: 0, emoji: '🥚' },
  BABY: { name: 'Baby Bird', minAge: 1, maxAge: 5, emoji: '🐣' },
  CHILD: { name: 'Chick', minAge: 6, maxAge: 10, emoji: '🐥' },
  TEEN: { name: 'Teen Bird', minAge: 11, maxAge: 20, emoji: '🐦' },
  ADULT: { name: 'Adult Bird', minAge: 21, maxAge: Infinity, emoji: '🕊️' }
};

export const PET_EMOJIS = {
  HAPPY: '😊',
  HUNGRY: '😫',
  TIRED: '😩',
  SICK: '🤢',
  DIRTY: '💩',
  SLEEPING: '😴',
  EATING: '😋',
  PLAYING: '🥳',
  CLEANING: '🧼',
  DEAD: '💀',
};

export const ACTIVITY_DURATION = 3000; // ms
export const ONE_MINUTE_MS = 1000 * 60;

export const ACHIEVEMENTS = {
  WELCOME_PARENT: { id: 'WELCOME_PARENT', name: 'New Parent!', description: 'Started caring for your first pet.', unlocked: false },
  FIRST_MEAL: { id: 'FIRST_MEAL', name: 'First Meal Served', description: 'Fed your pet for the first time.', unlocked: false },
  PLAYTIME_FUN: { id: 'PLAYTIME_FUN', name: 'Playtime Fun', description: 'Played with your pet.', unlocked: false },
  SQUEAKY_CLEAN: { id: 'SQUEAKY_CLEAN', name: 'Squeaky Clean', description: 'Cleaned your pet.', unlocked: false },
  GOOD_NIGHT: { id: 'GOOD_NIGHT', name: 'Good Night', description: 'Put your pet to sleep for the first time.', unlocked: false },
  BABY_STEPS: { id: 'BABY_STEPS', name: 'Baby Steps', description: 'Your pet survived its first day.', unlocked: false },
  GROWING_UP: { id: 'GROWING_UP', name: 'Growing Up!', description: 'Your pet reached the Child stage.', unlocked: false },
  TEEN_SPIRIT: { id: 'TEEN_SPIRIT', name: 'Teen Spirit', description: 'Your pet reached the Teen stage.', unlocked: false },
  ALL_GROWN_UP: { id: 'ALL_GROWN_UP', name: 'All Grown Up!', description: 'Your pet reached the Adult stage.', unlocked: false },
  MAX_HAPPINESS: { id: 'MAX_HAPPINESS', name: 'Pure Bliss', description: 'Reached maximum happiness.', unlocked: false },
};