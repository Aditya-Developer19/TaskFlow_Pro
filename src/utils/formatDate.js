/**
 * Formats a timestamp or date string into a readable format
 * @param {Date|number|string} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Checks if a date is overdue
 * @param {Date|number|string} date 
 * @returns {boolean}
 */
export function isOverdue(date) {
  if (!date) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(date);
  return d < now;
}
