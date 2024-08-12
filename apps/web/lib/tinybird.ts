import { cookies } from 'next/headers';
import { NextRequest, userAgent } from 'next/server';

export async function recordClick({
  req,
  workspaceId,
  feedbackId,
  changelogId,
}: {
  req: NextRequest;
  workspaceId: string;
  feedbackId?: string;
  changelogId?: string;
}) {
  const cookieStore = cookies();
  const geo = process.env.VERCEL === '1' ? req.geo : null;
  const ua = userAgent(req);
  const referer = req.headers.get('referer');

  // Get session id
  const sessionId = cookieStore.get('fb_session_id');

  // If no session id, create one
  if (!sessionId) {
    cookieStore.set('fb_session_id', Math.random().toString(36).substring(2), {
      path: '/',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours in milliseconds
      secure: true,
    });
  }

  const response = await fetch(`${process.env.TINYBIRD_API_URL}/v0/events?name=click_events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
    },
    body: JSON.stringify({
      timestamp: new Date(Date.now()).toISOString(),
      workspace: workspaceId,
      sessionId: sessionId?.value || 'Unknown',
      changelogId: changelogId || '_root',
      feedbackId: feedbackId || '_root',
      country: geo?.country || 'Unknown',
      city: geo?.city || 'Unknown',
      region: geo?.region || 'Unknown',
      latitude: geo?.latitude || 'Unknown',
      longitude: geo?.longitude || 'Unknown',
      ua: ua.ua || 'Unknown',
      browser: ua.browser.name || 'Unknown',
      browser_version: ua.browser.version || 'Unknown',
      engine: ua.engine.name || 'Unknown',
      engine_version: ua.engine.version || 'Unknown',
      os: ua.os.name || 'Unknown',
      os_version: ua.os.version || 'Unknown',
      device: ua.device.type || 'Unknown',
      device_vendor: ua.device.vendor || 'Unknown',
      device_model: ua.device.model || 'Unknown',
      cpu_architecture: ua.cpu?.architecture || 'Unknown',
      bot: ua.isBot,
      referer: referer ? new URL(referer).hostname : '(direct)',
      referer_url: referer || '(direct)',
    }),
  });

  const data = await response.json();

  return [data];
}
