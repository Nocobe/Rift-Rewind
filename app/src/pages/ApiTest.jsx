import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  PLATFORM_REGION_TO_REGIONAL_ROUTE,
  fetchAccountByRiotId, 
  fetchSummonerByPuuid,
  fetchMatchIdsByPuuid,
  fetchMatchById,
  fetchMatchTimelineById,
} from '../utils/network/riot-api-requests';

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

  const matchIdsQuery = useQuery({
    queryKey: ['matchIdsByPuuid', regionalRoute, accountQuery.data?.puuid],
    queryFn: () => fetchMatchIdsByPuuid({ regionalRoute, puuid: accountQuery.data.puuid, start: 0, count: 5 }),
    enabled: Boolean(accountQuery.data?.puuid),
    retry: false,
  });

  const latestMatchId = matchIdsQuery.data?.[0];

  const matchQuery = useQuery({
    queryKey: ['matchById', regionalRoute, latestMatchId],
    queryFn: () => fetchMatchById({ regionalRoute, matchId: latestMatchId }),
    enabled: Boolean(latestMatchId),
    retry: false,
  });

  const timelineQuery = useQuery({
    queryKey: ['matchTimelineById', regionalRoute, latestMatchId],
    queryFn: () => fetchMatchTimelineById({ regionalRoute, matchId: latestMatchId }),
    enabled: Boolean(latestMatchId),
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

      {(accountQuery.isFetching || summonerQuery.isFetching || matchIdsQuery.isFetching || matchQuery.isFetching || timelineQuery.isFetching) && <p>Loading...</p>}
      {accountQuery.error && <p style={{ color: 'crimson' }}>{String(accountQuery.error.message || accountQuery.error)}</p>}
      {summonerQuery.error && <p style={{ color: 'crimson' }}>{String(summonerQuery.error.message || summonerQuery.error)}</p>}
      {matchIdsQuery.error && <p style={{ color: 'crimson' }}>{String(matchIdsQuery.error.message || matchIdsQuery.error)}</p>}
      {matchQuery.error && <p style={{ color: 'crimson' }}>{String(matchQuery.error.message || matchQuery.error)}</p>}
      {timelineQuery.error && <p style={{ color: 'crimson' }}>{String(timelineQuery.error.message || timelineQuery.error)}</p>}

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

      {Array.isArray(matchIdsQuery.data) && matchIdsQuery.data.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h2>Recent Match IDs</h2>
          <pre style={{ background: '#111', color: '#eee', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(matchIdsQuery.data, null, 2)}
          </pre>
        </div>
      )}

      {matchQuery.data && (
        <div style={{ marginTop: 16 }}>
          <h2>Latest Match</h2>
          <pre style={{ background: '#111', color: '#eee', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(matchQuery.data, null, 2)}
          </pre>
        </div>
      )}

      {timelineQuery.data && (
        <div style={{ marginTop: 16 }}>
          <h2>Latest Match Timeline</h2>
          <pre style={{ background: '#111', color: '#eee', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(timelineQuery.data, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}



