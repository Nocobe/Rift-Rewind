import React from 'react';
import { useParams } from 'react-router-dom';

function PlayerDetails() {
  const { id } = useParams();

  return (
    <section>
      <h1>Player Details</h1>
      <p>Player ID: {id}</p>
      {/* TODO: Fetch player details from API using the ID */}
      {/* TODO: Display stats and history with Material UI components later */}
    </section>
  );
}

export default PlayerDetails;



