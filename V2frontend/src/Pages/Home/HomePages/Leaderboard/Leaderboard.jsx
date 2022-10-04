
import { useState, useEffect, useCallback } from 'react';
import { Button, Table } from "@mantine/core";
import { IconArrowsSort } from '@tabler/icons';
import { useToggle } from '@mantine/hooks';
import { getIdTokenOfUser } from '../../../../Providers/Firebase/config'


function Leaderboard() {
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortTypeDecrease, setSortTypeDecrease] = useState(true);
  const [showAverage, toggleAverage] = useToggle([false, true]);

  const getLeaderboardData = useCallback(
    async () => {
      const authId = await getIdTokenOfUser();
      console.log(authId, 'authid from eladerboard function async')
      fetch(import.meta.env.VITE_API + "/users/leaderboard", {
        headers: {
          Authorization: `Bearer ${authId}`,
        },
      }).then(async (response) => {
        if (response.ok) {
          response.json().then(json => {
            for (var obj of json) {
              obj["avgTotalWins"] = getAverage(obj, "totalWins")
              obj["avgTotalDeclares"] = getAverage(obj, "totalDeclares")
              obj["avgTotalFifties"] = getAverage(obj, "totalFifties")
              obj["avgTotalPairs"] = getAverage(obj, "totalPairs")
            }
            setData(json);
          })
        }
      });
    },
    [],
  );



  useEffect(() => {
    getLeaderboardData()
  }, [])


  const getAverage = (obj, col) => {
    var totalGames = obj.gamesCount
    let average
    if (totalGames == 0) {
      average = 0
    } else {
      average = obj[col] / totalGames
    }
    return average.toFixed(2)
  }

  const sortValues = (e) => {
    var key = e.target.id
    var varSortTypeDecrease
    var allUserData = data
    if (sortColumn === key) {
      setSortTypeDecrease(!sortTypeDecrease)
      varSortTypeDecrease = !sortTypeDecrease
    } else {
      varSortTypeDecrease = true
      setSortTypeDecrease(true)
      setSortColumn(key)
    }
    allUserData.sort(function (a, b) {
      var val1 = a[key]
      var val2 = b[key]
      return varSortTypeDecrease ? val2 - val1 : val1 - val2
    })

    setData(allUserData)
  }


  const rows = data.map((element) => (
    <tr key={element.userId} style={{ backgroundColor: element.requestedUser ? '#373A40' : '' }}>
      <td>{element.userName}</td>
      <td>{element.gamesCount}</td>
      <td>{showAverage ? element.avgTotalWins : element.totalWins}</td>
      <td>{showAverage ? element.avgTotalDeclares : element.totalDeclares}</td>
      <td>{showAverage ? element.avgTotalFifties : element.totalFifties}</td>
      <td>{showAverage ? element.avgTotalPairs : element.totalPairs}</td>
    </tr>
  ));

  return (
    <>
      <Button color={showAverage ? 'blue' : 'orange'} onClick={() => toggleAverage()}>{showAverage ? "Hide Average" : "Show Average"}</Button>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>
              Total Games
              <IconArrowsSort size={15} id="gamesCount" onClick={sortValues} />
            </th>
            <th>
              Wins
              <IconArrowsSort size={15} id={showAverage ? "avgTotalWins" : "totalWins"} onClick={sortValues} />
            </th>
            <th>
              Total Declares
              <IconArrowsSort size={15} id={showAverage ? "avgTotalDeclares" : "totalDeclares"} onClick={sortValues} />
            </th>
            <th>
              +50
              <IconArrowsSort size={15} id={showAverage ? "avgTotalFifties" : "totalFifties"} onClick={sortValues} />
            </th>
            <th>
              -25
              <IconArrowsSort size={15} id={showAverage ? "avgTotalPairs" : "totalPairs"} onClick={sortValues} />
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

export default Leaderboard;
