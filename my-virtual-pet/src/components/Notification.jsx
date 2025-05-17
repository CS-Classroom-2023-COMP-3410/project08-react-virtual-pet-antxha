// src/components/Notification.jsx
import React, { useEffect, useState } from 'react';

const Notification = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!visible || !message) {
    return null;
  }

  return (
    <div className="notification-banner">
      <p>{message}</p>
    </div>
  );
};
export default Notification;