import buildFetch from './build-fetch';

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
    const encodedGameName = encodeURIComponent(gameName.trim());
    const encodedTag = encodeURIComponent(tagLine.trim());
    const url = `https://${regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTag}`;
    const res = await buildFetch(url, {});
    return res;
}
  
async function fetchSummonerByPuuid({ platformRegion, puuid }) {
    const url = `https://${platformRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
    const res = await buildFetch(url, {});
    return res;
}

async function fetchMatchIdsByPuuid({ regionalRoute, puuid, start = 0, count = 1, queue, type }) {
    const params = new URLSearchParams({ start: String(start), count: String(count) });
    if (queue !== undefined) params.set('queue', String(queue));
    if (type !== undefined) params.set('type', String(type));
    const url = `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?${params.toString()}`;
    const res = await buildFetch(url, {});
    return res; // array of matchIds
}

async function fetchMatchById({ regionalRoute, matchId }) {
    const url = `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
    const res = await buildFetch(url, {});
    return res; // match DTO
}

async function fetchMatchTimelineById({ regionalRoute, matchId }) {
    const url = `https://${regionalRoute}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}/timeline`;
    const res = await buildFetch(url, {});
    return res; // timeline DTO
}

export { 
  PLATFORM_REGION_TO_REGIONAL_ROUTE,
  fetchAccountByRiotId, 
  fetchSummonerByPuuid,
  fetchMatchIdsByPuuid,
  fetchMatchById,
  fetchMatchTimelineById,
};