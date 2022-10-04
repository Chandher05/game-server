import { useState, useEffect } from 'react';
import { Alert, Box, Button, Grid, Image, createStyles, Card, Group, Modal, Text, Center, Menu, ActionIcon, Stack, Loader, Space, Title, MediaQuery } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates, LeaveGame, NextRound, RestartGame, DropCards, Declare } from '../../Providers/Socket/emitters'
import { CommonGameData, CardsInHand } from '../../Providers/Socket/listeners';
import { IconPlayCard, IconUser, IconRun, IconSettings, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconLogout } from '@tabler/icons';
import GameRoomNotifications from './GameRoomNotifications';
import GameRoomTableAndScore from './GameRoomTableAndScore';
import GameRoomCardsInHand from './GameRoomCardsInHand';
import GameRoomDetailedScore from './GameRoomDetailedScore';

// sample data

const getCardImage = (cardNum) => {
  cardNum -= 1
  const cardValue = cardNum % 13
  const cardSuit = parseInt(cardNum / 13)
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"]
  const suits = ["C", "D", "H", "S"]
  let image = values[cardValue] + suits[cardSuit] + ".svg"
  return image
}


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
  const authId = sessionStorage.getItem('access_token');

  useEffect(() => {
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
          }
        })
      };
    });
    GetGameUpdates(GameCode)
  }, [])


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
      <GameRoomNotifications commonData={commonData} />
      <GameRoomTableAndScore commonData={commonData} />
      <GameRoomCardsInHand commonData={commonData} selected={selected} cardsInHand={cardsInHand} selectCards={selectCards} />
      <GameRoomDetailedScore commonData={commonData} />
    </div >
  )
}

export default GameRoom;
