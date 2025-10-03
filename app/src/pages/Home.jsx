import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PLATFORM_REGION_TO_REGIONAL_ROUTE,
  fetchAccountByRiotId,
  fetchSummonerByPuuid,
  fetchMatchIdsByPuuid,
  fetchMatchById,
} from '../utils/network/riot-api-requests';
import { Box, Button, Card, CardContent, Container, Fade, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

function Home() {
  const [platformRegion, setPlatformRegion] = useState('oc1');
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [submitted, setSubmitted] = useState({ gameName: '', tagLine: '' });

  const regionalRoute = PLATFORM_REGION_TO_REGIONAL_ROUTE[platformRegion] || 'americas';
  const showResults = submitted.gameName.length > 0 && submitted.tagLine.length > 0;

  const accountQuery = useQuery({
    queryKey: ['home.accountByRiotId', regionalRoute, submitted.gameName, submitted.tagLine],
    queryFn: () => fetchAccountByRiotId({ regionalRoute, gameName: submitted.gameName, tagLine: submitted.tagLine }),
    enabled: submitted.gameName.length > 0 && submitted.tagLine.length > 0,
    retry: false,
  });

  const summonerQuery = useQuery({
    queryKey: ['home.summonerByPuuid', platformRegion, accountQuery.data?.puuid],
    queryFn: () => fetchSummonerByPuuid({ platformRegion, puuid: accountQuery.data.puuid }),
    enabled: Boolean(accountQuery.data?.puuid),
    retry: false,
  });

  const matchIdsQuery = useQuery({
    queryKey: ['home.matchIdsByPuuid', regionalRoute, accountQuery.data?.puuid],
    queryFn: () => fetchMatchIdsByPuuid({ regionalRoute, puuid: accountQuery.data.puuid, start: 0, count: 3 }),
    enabled: Boolean(accountQuery.data?.puuid),
    retry: false,
  });

  const latestMatchId = matchIdsQuery.data?.[0];

  const matchQuery = useQuery({
    queryKey: ['home.matchById', regionalRoute, latestMatchId],
    queryFn: () => fetchMatchById({ regionalRoute, matchId: latestMatchId }),
    enabled: Boolean(latestMatchId),
    retry: false,
  });

  function onSearch() {
    setSubmitted({ gameName: gameName.trim(), tagLine: tagLine.trim() });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{
        transition: 'margin-top 900ms ease',
        mt: showResults ? 2 : { xs: 8, sm: 12 },
      }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <Select fullWidth value={platformRegion} onChange={(e) => setPlatformRegion(e.target.value)} displayEmpty>
            <MenuItem value="na1">NA1</MenuItem>
            <MenuItem value="euw1">EUW1</MenuItem>
            <MenuItem value="eun1">EUN1</MenuItem>
            <MenuItem value="kr">KR</MenuItem>
            <MenuItem value="oc1">OC1</MenuItem>
            <MenuItem value="br1">BR1</MenuItem>
            <MenuItem value="jp1">JP1</MenuItem>
            <MenuItem value="la1">LA1</MenuItem>
            <MenuItem value="la2">LA2</MenuItem>
            <MenuItem value="tr1">TR1</MenuItem>
            <MenuItem value="ru">RU</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <TextField fullWidth label="Player name" placeholder="gameName (e.g. Faker)" value={gameName} onChange={(e) => setGameName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField fullWidth label="Tag" placeholder="tagLine (e.g. KR1)" value={tagLine} onChange={(e) => setTagLine(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={'auto'}>
          <Button variant="contained" onClick={onSearch} disabled={!gameName.trim() || !tagLine.trim()}>
            Search
          </Button>
        </Grid>
      </Grid>
      </Box>

      <Fade in={showResults} timeout={1000}>
      <Box sx={{ mt: 4 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Player Info</Typography>
            {accountQuery.isFetching && <Typography>Loading account...</Typography>}
            {accountQuery.error && <Typography color="error">{String(accountQuery.error.message || accountQuery.error)}</Typography>}
            {accountQuery.data && (
              <Typography variant="body2">Puuid: {accountQuery.data.puuid}</Typography>
            )}
            {summonerQuery.isFetching && <Typography sx={{ mt: 1 }}>Loading summoner...</Typography>}
            {summonerQuery.error && <Typography color="error">{String(summonerQuery.error.message || summonerQuery.error)}</Typography>}
            {summonerQuery.data && (
              <Typography variant="body2" sx={{ mt: 1 }}>Summoner: {summonerQuery.data.name} · Level {summonerQuery.data.summonerLevel}</Typography>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Top three champ</Typography>
            {matchIdsQuery.isFetching && <Typography>Loading recent matches...</Typography>}
            {matchIdsQuery.error && <Typography color="error">{String(matchIdsQuery.error.message || matchIdsQuery.error)}</Typography>}
            {Array.isArray(matchIdsQuery.data) && matchIdsQuery.data.length === 0 && (
              <Typography variant="body2">No recent matches.</Typography>
            )}
            {Array.isArray(matchIdsQuery.data) && matchIdsQuery.data.length > 0 && (
              <Typography variant="body2">Recent match IDs: {matchIdsQuery.data.slice(0, 3).join(', ')}</Typography>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>Last three matches</Typography>
            {matchQuery.isFetching && <Typography>Loading latest match...</Typography>}
            {matchQuery.error && <Typography color="error">{String(matchQuery.error.message || matchQuery.error)}</Typography>}
            {matchQuery.data && (
              <Typography variant="body2">Latest match ID: {latestMatchId}</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
      </Fade>
    </Container>
  );
}

export default Home;



