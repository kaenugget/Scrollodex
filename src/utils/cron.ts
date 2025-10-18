import cron from 'node-cron';
import { runDailyDigest } from '../workflows/dailyDigest';

export function scheduleDaily() {
  // 0 8 * * * in Asia/Singapore (rely on server TZ set to SGT or convert time)
  cron.schedule('0 8 * * *', async () => {
    await runDailyDigest();
  });
}
