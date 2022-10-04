import { Table, Button, Center, Space } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useToggle } from '@mantine/hooks';

function GameRoomNotifications({ commonData }) {
  let params = useParams()
  let GameCode = params.gameId;
  const [hideScores, toggleHideAverage] = useToggle([true, false]);

  let scores = []
  scores = commonData["players"].map((element) => (
    element.previousScores
  ));

  let rows = []
  if (scores.length > 0) {
    for (var index = 0; index < scores[0].length; index++) {
      var rowData = [<td>{index + 1}</td>]
      for (var player of scores) {
        rowData.push(<td>{player[index] == -1 ? "" : player[index]}</td>)
      }
      rows.push(<tr>{rowData}</tr>)
    }
  }

  const userNames = commonData["players"].map((element) => (
    <th key={element.userName}>{element.userName}</th>
  ));

  return (
    <>
    <Space h="xl" />
    <Center>
      <Button color='gray.7' onClick={() => toggleHideAverage()} size={'xs'} hidden={rows.length == 0}>{hideScores ? "Show detailed scores" : "Hide detailed scores"}</Button>
    </Center>
      <Table highlightOnHover hidden={hideScores}>
        <thead>
          <tr>
            <th>No.</th>
            {userNames}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

export default GameRoomNotifications;
