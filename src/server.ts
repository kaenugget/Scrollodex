import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Scrollodex API Server is running!', 
    status: 'ok',
    port: process.env.PORT || 3001,
    endpoints: [
      'POST /api/run/daily-now',
      'POST /api/telegram/webhook'
    ]
  });
});

// Manual trigger to run the daily digest once (for demo)
app.post('/api/run/daily-now', async (_req, res) => {
  try {
    res.json({ ok: true, message: 'Endpoint ready - workflows not yet loaded' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Telegram webhook to handle approve button (set this URL in BotFather)
app.post('/api/telegram/webhook', async (req, res) => {
  const body = req.body;
  try {
    if (body?.callback_query?.data === 'approve_all') {
      res.json({ ok: true, message: 'Webhook ready - workflows not yet loaded' });
    }
  } catch (e) {
    console.error(e);
  }
  res.json({ ok: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server on :${port}`));