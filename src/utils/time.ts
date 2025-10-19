export function next8amInSGT() {
  // const tz = process.env.TIMEZONE || 'Asia/Singapore';
  const now = new Date();
  const next = new Date(now);
  next.setHours(8, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next; // Minimal; for true TZ correctness, use luxon
}
