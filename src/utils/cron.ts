import cron from 'node-cron';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function scheduleDaily() {
  // 0 8 * * * in Asia/Singapore (rely on server TZ set to SGT or convert time)
  cron.schedule('0 8 * * *', async () => {
    try {
      await convex.action(api.workflows.runDailyDigest, {});
    } catch (error) {
      console.error('Daily digest cron job failed:', error);
    }
  });
}
