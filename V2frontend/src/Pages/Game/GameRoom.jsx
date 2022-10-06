import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates } from '../../Providers/Socket/emitters'
import { CommonGameData, CardsInHand } from '../../Providers/Socket/listeners';
import GameRoomNotifications from './GameRoomNotifications';
import GameRoomTableAndScore from './GameRoomTableAndScore';
import GameRoomCardsInHand from './GameRoomCardsInHand';
import GameRoomDetailedScore from './GameRoomDetailedScore';
import { useCallback } from 'react';
import { getIdTokenOfUser, logout } from '../../Providers/Firebase/config';
import { showNotification } from '@mantine/notifications';
import Emoji from './Emoji';

// sample data
const sampleData =
{
  "lastPlayedUser": "Jayasurya17",
  "lastPlayedAction": "will start the game",
  "discardPile": [1, 14, 27],
  "isRoundComplete": false,
  "playerDeclaredType": "",
  "isGameComplete": false,
  "waitingPlayers": ["Jayasurya17", "Jayasurya17"],
  "players": [
    {
      "userName": "Jayasurya17",
      "isAdmin": false,
      "hasPlayerLeft": true,
      "isEliminated": false,
      "cardsInHand": 6,
      "roundScore": null,
      "totalScore": 75,
      "previousScores": [12, 30, 25, 0, 13],
      "currentPlayer": true,
      "userId": "63176f6e7cef672348864eeb"
    },
    {
      "userName": "Under The Lamp Club",
      "isAdmin": true,
      "hasPlayerLeft": false,
      "isEliminated": false,
      "cardsInHand": 5,
      "roundScore": null,
      "totalScore": 20,
      "previousScores": [0, 0, 0, 20, 0],
      "currentPlayer": false,
      "userId": "63255f7295b9972f5cbb26ab"
    },
    {
      "userName": "User left game",
      "isAdmin": false,
      "hasPlayerLeft": true,
      "isEliminated": false,
      "cardsInHand": 5,
      "roundScore": null,
      "totalScore": 80,
      "previousScores": [10, 20, 30, 10, 10],
      "currentPlayer": false,
      "userId": "63255f7295b9972f5cb956ab"
    },
    {
      "userName": "User eliminated",
      "isAdmin": false,
      "hasPlayerLeft": false,
      "isEliminated": true,
      "cardsInHand": 0,
      "roundScore": null,
      "totalScore": 120,
      "previousScores": [40, 40, 40, -1, -1],
      "currentPlayer": false,
      "userId": "63255f729512972f5cbb26ab"
    },
    {
      "userName": "User eliminated",
      "isAdmin": false,
      "hasPlayerLeft": false,
      "isEliminated": true,
      "cardsInHand": 0,
      "roundScore": null,
      "totalScore": 120,
      "previousScores": [40, 40, 40, -1, -1],
      "currentPlayer": false,
      "userId": "63255f729512972f5cbb26ab"
    }
  ],
  "canPlayersDeclare": true,
  "playerStatus": "PLAYING",
  "isAdmin": true,
  "currentPlayer": true
}

// Valid values
// {
//   "lastPlayedUser": String,
//   "lastPlayedAction": String,
//   "discardPile": Empty array or array of numbers,
//   "isRoundComplete": true/false,
//   "playerDeclaredType": Empty string, PAIR, LOWEST, SAME, HIGHEST
//   "isGameComplete": true/false,
//   "waitingPlayers": Empty array or array of user names,
//   "players": [
//       {
//           "userName": String,
//           "isAdmin": true/false,
//           "hasPlayerLeft": true/false,
//           "isEliminated": true/false,
//           "cardsInHand": Integer,
//           "roundScore": null or Integer,
//           "totalScore": Integer,
//           "previousScores": Empty array or array of numbers,
//           "userId": mongo id
//       }
//   ],
//   "canPlayersDeclare": true/false,
//   "playerStatus": PLAYING, WAITING, SPECTATING,
//   "isAdmin": true/false,
//   "currentPlayer": true/false
// }

function GameRoom() {
  let params = useParams()
  let GameCode = params.gameId;
  const Navigate = useNavigate();
  const [cardsInHand, setCardsInHand] = useState([]);
  const [selected, setSelected] = useState([]);
  const [commonData, setCommonData] = useState({
    "lastPlayedUser": "",
    "lastPlayedAction": "",
    "discardPile": [],
    "isRoundComplete": false,
    "playerDeclaredType": null,
    "isGameComplete": false,
    "waitingPlayers": [],
    "currentPlayer": "",
    "players": [],
    "playerStatus": "SPECTATING",
    "isAdmin": false
  });



  const getUserStatus = useCallback(async () => {
    const authId = await getIdTokenOfUser();
    fetch(import.meta.env.VITE_API + "/users/userStatus", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        response.json().then(json => {
          if (json.status == "NOT_PLAYING") {
            Navigate(`/`)
          } else if (json.status == "LOBBY") {
            Navigate(`/waiting/${json.gameId}`)
          } else if (json.status == "GAME_ROOM" && GameCode != json.gameId) {
            Navigate(`/game/${json.gameId}`)
          } else if (json.status == "INACTIVE") {
            showNotification({
              variant: 'outline',
              color: 'red',
              title: 'Something went wrong!',
              message: "User inactive"
            })
            logout()
          }
        })
      } else {
        throw await response.json()
      }
    }).catch((error) => {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Something went wrong!',
        message: error.msg
      })
      Navigate(`/`)
    })
    GetGameUpdates(GameCode)
  }, [])

  useEffect(() => {
    getUserStatus()
  }, [getUserStatus])


  CommonGameData((status, data) => {
    if (status == "LEAVE_GAME") {
      Navigate(`/`)
    } else if (status == "SUCCESS") {
      // data = sampleData
      setCommonData(data)
      if (!data.currentPlayer) {
        setSelected([])
      }
    }
  })

  CardsInHand((status, data) => {
    if (status == "SUCCESS") {
      setCardsInHand(data)
    }
  })

  const selectCards = (cardValue) => {
    if (!commonData.currentPlayer) {
      return
    }
    let temp = JSON.parse(JSON.stringify(selected))
    if (selected.length == 0) {
      temp.push(cardValue)
    } else if (selected.includes(cardValue)) {
      temp.pop(cardValue)
    } else if ((selected[0] - cardValue) % 13 == 0) {
      temp.push(cardValue)
    } else {
      temp = [cardValue]
    }
    setSelected(temp)
  }


  return (
    <div style={{ padding: '20px' }}>
      <Emoji></Emoji>
      <GameRoomNotifications commonData={commonData} />
      <GameRoomTableAndScore commonData={commonData} />
      <GameRoomCardsInHand commonData={commonData} selected={selected} cardsInHand={cardsInHand} selectCards={selectCards} />
      <GameRoomDetailedScore commonData={commonData} />
    </div >
  )
}

export default GameRoom;
