// src/components/StatusBar.jsx
const StatusBar = ({ label, value, maxValue = 100 }) => {
  const roundedValue = Math.round(value);
  const percentage = Math.max(0, Math.min(100, (roundedValue / maxValue) * 100));
  let barColorClass = 'good';
  if (percentage < 30) barColorClass = 'bad';
  else if (percentage < 60) barColorClass = 'medium';

  return (
    <div className="status-bar-container">
      <div className="status-label">
        {label}: {roundedValue}/{maxValue}
      </div>
      <div className="status-bar-track">
        <div
          className={`status-bar-fill ${barColorClass}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={roundedValue}
          aria-valuemin="0"
          aria-valuemax={maxValue}
          aria-label={`${label} status`}
        ></div>
      </div>
    </div>
  );
};
export default StatusBar;