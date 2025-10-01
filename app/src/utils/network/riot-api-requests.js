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
    const res = await buildFetch(url, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
    return res;
}
  
async function fetchSummonerByPuuid({ platformRegion, puuid }) {
    const url = `https://${platformRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
    const res = await buildFetch(url, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
    return res;
}

export { fetchAccountByRiotId, fetchSummonerByPuuid };