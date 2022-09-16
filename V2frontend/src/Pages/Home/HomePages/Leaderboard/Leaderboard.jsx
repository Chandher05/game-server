
import { useState, useEffect } from 'react';
import client from '../../../../Providers/API/get';
import { Table } from "@mantine/core"

function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    client.get("/users/leaderboard").then((response) => {
      console.log("Response", response)
      setData(response.data);
    })

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