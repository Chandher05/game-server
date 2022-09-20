
import { useState, useEffect } from 'react';
import { Table } from "@mantine/core";
import { useStoreState } from 'easy-peasy';

function Leaderboard() {
  const [data, setData] = useState([]);
  const authId = useStoreState((state) => state.authId);

  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/users/leaderboard", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setData(await response.json());
    });
  }, [])
  return <Demo data={data}></Demo>
}

export default Leaderboard;

function Demo({ data }) {
  const rows = data.map((element) => (
    <tr key={element.userId}>
      <td>{element.userName}</td>
      <td>{element.gamesCount}</td>
      <td>{element.totalDeclares}</td>
      <td>{element.totalFifties}</td>
      <td>{element.totalPairs}</td>
      <td>{element.totalWins}</td>
    </tr>
  ));

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Total Games</th>
          <th>Total Declares</th>
          <th>+50</th>
          <th>-25</th>
          <th>Wins</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}