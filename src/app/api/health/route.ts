export async function GET() {
  return Response.json({ 
    message: 'Scrollodex API Server is running!', 
    status: 'ok',
    port: process.env.PORT || 3001,
    endpoints: [
      'POST /api/run/daily-now',
      'POST /api/telegram/webhook'
    ]
  });
}
