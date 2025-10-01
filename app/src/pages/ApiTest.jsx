import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAccountByRiotId, fetchSummonerByPuuid } from '../utils/network/riot-api-requests';
import { PLATFORM_REGION_TO_REGIONAL_ROUTE } from '../utils/network/riot-api-requests';

const RIOT_API_KEY = process.env.REACT_APP_RIOT_API_KEY;

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



