const RIOT_API_KEY = process.env.REACT_APP_RIOT_API_KEY;
export default async function buildFetch(url, options) {
	if (!RIOT_API_KEY) {
    throw new Error('Missing REACT_APP_RIOT_API_KEY environment variable.');
  }
	const res = await fetch(url, { ...options, headers: { 'X-Riot-Token': RIOT_API_KEY } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Account API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}
