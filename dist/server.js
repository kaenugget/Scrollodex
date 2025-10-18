import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { dailyDigest } from './workflows/dailyDigest';
import { sendApproved } from './workflows/sendApproved';
import { scheduleDaily } from './utils/cron';
const app = express();
app.use(cors());
app.use(express.json());
// Manual trigger to run the daily digest once (for demo)
app.post('/api/run/daily-now', async (_req, res) => {
    try {
        await dailyDigest.run({ vars: {}, input: {} });
        res.json({ ok: true });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, error: String(e) });
    }
});
// Telegram webhook to handle approve button (set this URL in BotFather)
app.post('/api/telegram/webhook', async (req, res) => {
    const body = req.body;
    try {
        if (body?.callback_query?.data === 'approve_all') {
            // In a full impl, map from stored draft cache → ids
            await sendApproved.run({ input: { draftIds: ['DUMMY_ID_1', 'DUMMY_ID_2'] } });
        }
    }
    catch (e) {
        console.error(e);
    }
    res.json({ ok: true });
});
// Schedule daily runs
scheduleDaily();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on :${port}`));
//# sourceMappingURL=server.js.map