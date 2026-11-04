const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export async function notifyNextCrashMultiplier(multiplier: number): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return;
  const text = `Next round crash multiplier: ${multiplier.toFixed(2)}x`;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
  } catch {
    // Network errors are non-critical
  }
}
