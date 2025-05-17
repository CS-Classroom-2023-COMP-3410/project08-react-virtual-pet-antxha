// src/utils/timeUtils.js
import { ONE_MINUTE_MS } from '../constants';

export function calculatePetAgeInDays(birthdate) {
  if (!birthdate) return 0;
  const now = Date.now();
  const elapsedMilliseconds = now - birthdate;
  return Math.floor(elapsedMilliseconds / ONE_MINUTE_MS);
}

export function minutesElapsedSince(timestamp) {
  if (!timestamp) return 0;
  const now = Date.now();
  const elapsed = now - timestamp;
  return elapsed / ONE_MINUTE_MS;
}