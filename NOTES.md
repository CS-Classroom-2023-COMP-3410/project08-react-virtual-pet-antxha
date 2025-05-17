# Virtual Pet React Application

This application allows users to care for a virtual pet, managing its stats, interacting with it, and watching it grow.

## How to Install and Run

1.  **Clone the repository (or create files):**
    Ensure you have all the project files in their respective directories as outlined.

2.  **Install dependencies:**
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```

3.  **Run the application:**
    In the same terminal, run:
    ```bash
    npm run dev
    ```

    This will open the application in your default web browser at `http://localhost:5173` .

## Features Implemented

* **Pet Visualization:**
    * Pet represented by emojis changing based on state (happy, hungry, tired, sick, dirty, sleeping, eating, playing, cleaning).
    * Visual growth stages: Egg → Baby Bird (🐣) → Chick (🐥) → Teen Bird (🐦) → Adult Bird (🕊️).
    * Visual reactions to interactions (e.g., eating animation).
* **Pet Status Management:**
    * Tracks: Hunger, Energy, Happiness, Health, Cleanliness, Bond.
    * Stats decay over time (noticeable within 1-2 minutes).
    * Stats displayed as rounded integers.
    * Pet's mood (Content, Joyful, Sad, Sick, etc.) determined by stats.
    * Health degrades if other stats are critically low.
* **User Interactions:**
    * Feed, Play, Clean, Sleep/Wake Up.
    * Each interaction affects multiple stats.
    * Interactions unavailable in certain states (e.g., can't feed a sleeping pet, disabled buttons for maxed stats).
    * Visual indication and short duration for activities.
* **Time and Aging System:**
    * 1 real-world minute = 1 "pet day".
    * Stat changes and aging calculated for offline time when the app is reopened.
    * Pet progresses through growth stages based on age.
    * Pet's age displayed.
* **Achievements:**
    * 10 achievements implemented (e.g., "New Parent!", "First Meal Served", "Growing Up!").
    * Notifications for new achievements.
    * List of locked/unlocked achievements with descriptions.
    * Progress saved in `localStorage`.
* **Data Persistence:**
    * Entire pet state saved to `localStorage` after significant changes and periodically.
    * Saved data loaded on app start.
    * Handles first-time experience (new pet initialization).
* **Responsive Design:**
    * Works on mobile and desktop screens.
    * Intuitive interface.
    * Color-coded status bars (green for good, yellow for medium, red for bad).
* **Technical Implementation:**
    * Logical directory structure (`components`, `hooks`, `utils`, `constants`).
    * Reusable components (`StatusBar`, `Notification`, etc.).
    * Custom Hooks: `usePet`, `useTimePassage`, `useLocalStorage`, `useAchievements`.
    * Key state managed: stats, activity, growth stage, birth date, last interaction/visited timestamps, sleeping state.
    * `setInterval` for UI updates/decay, `setTimeout` for activity durations.
    * Intervals cleaned up.
* **User Experience:**
    * Clear visual feedback for interactions.
    * Disabled unavailable actions.
    * Notifications for important events (achievements, growth, full stats).

## Screenshots

1.  **Pet Sleeping:**
    ![alt text](image-5.png)
2.  **Achievements List Open:**
    ![alt text](image-2.png)
3.  **Feeding Interaction:**
    ![alt text](image-4.png)
4.  **Low Stat (e.g., Energy) with Red Bar:**
    ![alt text](image-3.png)

## Known Issues / Potential Improvements
* The offline stat calculation in `usePet`'s initial `useEffect` is a direct loop; for very long offline times, this could be optimized.
* More complex personality traits or mini-games are not implemented but could be future additions.
* Day/night cycle affecting decay rates is not implemented.