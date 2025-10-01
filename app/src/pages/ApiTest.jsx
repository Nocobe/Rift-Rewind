import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const RIOT_API_KEY = process.env.REACT_APP_RIOT_API_KEY;

const PLATFORM_REGION_TO_REGIONAL_ROUTE = {
  na1: 'americas',
  la1: 'americas',
  la2: 'americas',
  br1: 'americas',
  oce: 'americas',
  oc1: 'americas',
  euw1: 'europe',
  eun1: 'europe',
  tr1: 'europe',
  ru: 'europe',
  kr: 'asia',
  jp1: 'asia',
};

async function fetchAccountByRiotId({ regionalRoute, gameName, tagLine }) {
  if (!RIOT_API_KEY) {
    throw new Error('Missing REACT_APP_RIOT_API_KEY environment variable.');
  }
  const encodedGameName = encodeURIComponent(gameName.trim());
  const encodedTag = encodeURIComponent(tagLine.trim());
  const url = `https://${regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTag}`;
  const res = await fetch(url, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Account API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

async function fetchSummonerByPuuid({ platformRegion, puuid }) {
  if (!RIOT_API_KEY) {
    throw new Error('Missing REACT_APP_RIOT_API_KEY environment variable.');
  }
  const url = `https://${platformRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  const res = await fetch(url, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Summoner API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export default function ApiTest() {
  const [platformRegion, setPlatformRegion] = useState('oc1');
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [submitted, setSubmitted] = useState({ gameName: '', tagLine: '' });

  const regionalRoute = PLATFORM_REGION_TO_REGIONAL_ROUTE[platformRegion] || 'americas';

  const accountQuery = useQuery({
    queryKey: ['accountByRiotId', regionalRoute, submitted.gameName, submitted.tagLine],
    queryFn: () => fetchAccountByRiotId({ regionalRoute, gameName: submitted.gameName, tagLine: submitted.tagLine }),
    enabled: submitted.gameName.length > 0 && submitted.tagLine.length > 0,
    retry: false,
  });

  const summonerQuery = useQuery({
    queryKey: ['summonerByPuuid', platformRegion, accountQuery.data?.puuid],
    queryFn: () => fetchSummonerByPuuid({ platformRegion, puuid: accountQuery.data.puuid }),
    enabled: Boolean(accountQuery.data?.puuid),
    retry: false,
  });

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted({ gameName: gameName.trim(), tagLine: tagLine.trim() });
  }

  return (
    <section>
      <h1>Riot API Test</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Platform
          <select value={platformRegion} onChange={(e) => setPlatformRegion(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="na1">NA1</option>
            <option value="euw1">EUW1</option>
            <option value="eun1">EUN1</option>
            <option value="kr">KR</option>
            <option value="oc1">OC1</option>
            <option value="br1">BR1</option>
            <option value="jp1">JP1</option>
            <option value="la1">LA1</option>
            <option value="la2">LA2</option>
            <option value="tr1">TR1</option>
            <option value="ru">RU</option>
          </select>
        </label>
        <input type="text" placeholder="gameName (e.g. Faker)" value={gameName} onChange={(e) => setGameName(e.target.value)} />
        <input type="text" placeholder="tagLine (e.g. KR1)" value={tagLine} onChange={(e) => setTagLine(e.target.value)} />
        <button type="submit">Search</button>
        {submitted.gameName && submitted.tagLine && (
          <button type="button" onClick={() => { accountQuery.refetch(); }} disabled={accountQuery.isFetching}>
            Refresh
          </button>
        )}
      </form>

      {!RIOT_API_KEY && (
        <p style={{ color: 'crimson' }}>
          Set <code>REACT_APP_RIOT_API_KEY</code> in your environment to make requests.
        </p>
      )}

      {(accountQuery.isFetching || summonerQuery.isFetching) && <p>Loading...</p>}
      {accountQuery.error && <p style={{ color: 'crimson' }}>{String(accountQuery.error.message || accountQuery.error)}</p>}
      {summonerQuery.error && <p style={{ color: 'crimson' }}>{String(summonerQuery.error.message || summonerQuery.error)}</p>}

      {accountQuery.data && (
        <div style={{ marginTop: 16 }}>
          <h2>Account</h2>
          <pre style={{ background: '#111', color: '#eee', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(accountQuery.data, null, 2)}
          </pre>
        </div>
      )}

      {summonerQuery.data && (
        <div style={{ marginTop: 16 }}>
          <h2>Summoner</h2>
          <pre style={{ background: '#111', color: '#eee', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify({
  id: summonerQuery.data.id,
  accountId: summonerQuery.data.accountId,
  puuid: summonerQuery.data.puuid,
  name: summonerQuery.data.name,
  profileIconId: summonerQuery.data.profileIconId,
  summonerLevel: summonerQuery.data.summonerLevel,
}, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}



