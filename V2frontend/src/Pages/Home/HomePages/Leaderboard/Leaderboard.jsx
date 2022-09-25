
import { useState, useEffect } from 'react';
import { Table } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { IconArrowsSort } from '@tabler/icons';

function Leaderboard() {
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortTypeDecrease, setSortTypeDecrease] = useState(true);
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


  const sortValues = (e) => {

    var columnNumber = parseInt(e.target.id, 10)
    var varSortTypeDecrease
    if (sortColumn === columnNumber) {
      setSortTypeDecrease(!sortTypeDecrease)
      varSortTypeDecrease = !sortTypeDecrease
    } else {
      varSortTypeDecrease = true
      setSortTypeDecrease(true)
      setSortColumn(columnNumber)
    }
    console.log(e.target.id, columnNumber, sortColumn, varSortTypeDecrease, sortTypeDecrease)

    var allUserData = data

    var scores = new Set()
    var scoresUsers = {}

    for (var userId in allUserData) {
      var user = allUserData[userId]

      switch (columnNumber) {

        case 1:
          scores.add(parseInt(user.gamesCount, 10))
          if (scoresUsers[user.gamesCount]) {
            scoresUsers[user.gamesCount].push(user)
          } else {
            scoresUsers[user.gamesCount] = [user]
          }
          break;

        case 2:
          scores.add(parseInt(user.totalWins, 10))
          if (scoresUsers[user.totalWins]) {
            scoresUsers[user.totalWins].push(user)
          } else {
            scoresUsers[user.totalWins] = [user]
          }
          break;

        case 3:
          scores.add(parseInt(user.totalDeclares, 10))
          if (scoresUsers[user.totalDeclares]) {
            scoresUsers[user.totalDeclares].push(user)
          } else {
            scoresUsers[user.totalDeclares] = [user]
          }
          break;

        case 4:
          scores.add(parseInt(user.totalFifties, 10))
          if (scoresUsers[user.totalFifties]) {
            scoresUsers[user.totalFifties].push(user)
          } else {
            scoresUsers[user.totalFifties] = [user]
          }
          break;

        case 5:
          scores.add(parseInt(user.totalPairs, 10))
          if (scoresUsers[user.totalPairs]) {
            scoresUsers[user.totalPairs].push(user)
          } else {
            scoresUsers[user.totalPairs] = [user]
          }
          break;

        default:

      }
    }

    var sortedScores
    if (varSortTypeDecrease === true) {
      sortedScores = Array.from(scores).sort(function (a, b) { return b - a })
    } else {
      sortedScores = Array.from(scores).sort(function (a, b) { return a - b })
    }

    var sortedUsers = []
    for (var value of sortedScores) {
      if (columnNumber === 4) {
        sortedUsers = sortedUsers.concat(scoresUsers[value.toFixed(2)])
      } else {
        sortedUsers = sortedUsers.concat(scoresUsers[value])
      }
    }

    setData(sortedUsers)

  }


  const rows = data.map((element) => (
    <tr key={element.userId}>
      <td>{element.userName}</td>
      <td>{element.gamesCount}</td>
      <td>{element.totalWins}</td>
      <td>{element.totalDeclares}</td>
      <td>{element.totalFifties}</td>
      <td>{element.totalPairs}</td>
    </tr>
  ));

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Total Games <IconArrowsSort size={15} id="1" onClick={sortValues} /></th>
          <th>Wins <IconArrowsSort size={15} id="2" onClick={sortValues} /></th>
          <th>Total Declares <IconArrowsSort size={15} id="3" onClick={sortValues} /></th>
          <th>+50 <IconArrowsSort size={15} id="4" onClick={sortValues} /></th>
          <th>-25 <IconArrowsSort size={15} id="5" onClick={sortValues} /></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default Leaderboard;
