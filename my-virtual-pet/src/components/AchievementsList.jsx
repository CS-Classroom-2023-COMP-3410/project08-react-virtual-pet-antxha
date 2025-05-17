// src/components/AchievementsList.jsx
import React, {useState} from 'react';

const AchievementsList = ({ achievements }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!achievements || achievements.length === 0) return <p>No achievements.</p>;
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements-section">
      <button onClick={() => setIsOpen(!isOpen)} className="achievements-toggle">
        Achievements ({unlockedCount}/{totalCount}) {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <ul className="achievements-list">
          {achievements.map((ach) => (
            <li key={ach.id} className={`achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}`}>
              <span className="achievement-icon">{ach.unlocked ? '🏆' : '🔒'}</span>
              <div className="achievement-details">
                <span className="achievement-name">{ach.name}</span>
                <span className="achievement-description">{ach.description}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AchievementsList;