const https = require('https');

// ── Helper: fetch simple con promesa ─────────────────────────
const fetchJSON = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
};

// ── Twitch ────────────────────────────────────────────────────
const checkTwitch = async () => {
  try {
    const clientId     = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const channel      = process.env.TWITCH_CHANNEL;

    if (!clientId || !clientSecret || !channel) return { platform: 'twitch', live: false };

    // Obtener token de app
    const tokenRes = await fetchJSON(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: 'POST' }
    );
    const token = tokenRes.body?.access_token;
    if (!token) return { platform: 'twitch', live: false };

    // Consultar stream
    const streamRes = await fetchJSON(
      `https://api.twitch.tv/helix/streams?user_login=${channel}`,
      { headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` } }
    );

    const isLive = streamRes.body?.data?.length > 0;
    return {
      platform: 'twitch',
      live: isLive,
      url: `https://twitch.tv/${channel}`,
      ...(isLive && { title: streamRes.body.data[0].title })
    };
  } catch {
    return { platform: 'twitch', live: false };
  }
};

// ── YouTube ───────────────────────────────────────────────────
const checkYouTube = async () => {
  try {
    const apiKey    = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) return { platform: 'youtube', live: false };

    const res = await fetchJSON(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`
    );

    const isLive = res.body?.items?.length > 0;
    return {
      platform: 'youtube',
      live: isLive,
      url: `https://youtube.com/channel/${channelId}`,
      ...(isLive && { title: res.body.items[0].snippet.title })
    };
  } catch {
    return { platform: 'youtube', live: false };
  }
};

// ── Kick ──────────────────────────────────────────────────────
const checkKick = async () => {
  try {
    const channel = process.env.KICK_CHANNEL;
    if (!channel) return { platform: 'kick', live: false };

    const res = await fetchJSON(`https://kick.com/api/v1/channels/${channel}`);
    const isLive = res.body?.livestream !== null && res.body?.livestream !== undefined;

    return {
      platform: 'kick',
      live: isLive,
      url: `https://kick.com/${channel}`,
      ...(isLive && { title: res.body.livestream?.session_title })
    };
  } catch {
    return { platform: 'kick', live: false };
  }
};

// ── TikTok ────────────────────────────────────────────────────
// TikTok no tiene API pública oficial de live — se verifica por scraping básico
const checkTikTok = async () => {
  try {
    const username = process.env.TIKTOK_USERNAME;
    if (!username) return { platform: 'tiktok', live: false };

    // Nota: TikTok bloquea scraping agresivo. Esta verificación es básica.
    // Para producción se recomienda un servicio intermediario o puppeteer.
    return {
      platform: 'tiktok',
      live: false, // deshabilitado hasta integración avanzada
      url: `https://tiktok.com/@${username}`,
      note: 'Verificación manual requerida para TikTok'
    };
  } catch {
    return { platform: 'tiktok', live: false };
  }
};

// ── Estado general de todas las plataformas ───────────────────
const getAllStreamingStatus = async () => {
  const results = await Promise.allSettled([
    checkTwitch(),
    checkYouTube(),
    checkKick(),
    checkTikTok()
  ]);

  return results.map(r => r.status === 'fulfilled' ? r.value : { live: false });
};

module.exports = { getAllStreamingStatus, checkTwitch, checkYouTube, checkKick, checkTikTok };
