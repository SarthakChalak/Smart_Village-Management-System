exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: { Allow: 'GET' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: 'Mandi API key is not configured on the Netlify site' }) };
  }

  const url = new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1000');
  url.searchParams.set('filters[state]', 'Maharashtra');

  try {
    const upstream = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!upstream.ok) {
      console.error('data.gov.in mandi request failed:', upstream.status);
      return { statusCode: 502, body: JSON.stringify({ error: 'The mandi price service is unavailable' }) };
    }

    const payload = await upstream.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600',
      },
      body: JSON.stringify({ source: 'data.gov.in / AGMARKNET', records: payload.records || [] }),
    };
  } catch (error) {
    console.error('Mandi price proxy error:', error);
    return { statusCode: 502, body: JSON.stringify({ error: 'Could not load mandi prices' }) };
  }
};
