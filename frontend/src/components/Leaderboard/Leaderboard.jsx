// src/components/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import './Leaderboard.css'; // optional for extra styling

export default function Leaderboard() {

  const [scores, setScores] = useState([]);
  const topScores = scores.slice(0, 10); // Only top 10
  useEffect(() => {
    fetch('https://newsite-production-bdad.up.railway.app/api/scores')
      .then(res => res.json())
      .then(data => setScores(data));
  }, []);

  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {topScores.map((entry, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{entry.username}</td>
            <td>{entry.score}</td>
          </tr>
        ))}
        {topScores.length === 0 && (
          <tr>
            <td colSpan="3" style={{ textAlign: 'center' }}>No scores yet!</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
