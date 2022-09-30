import { useState, useEffect } from 'react';
import { Alert, Box, Button, Grid, Image, createStyles, Card, Group, Switch, Text } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates, LeaveGame, NextRound, RestartGame } from '../../Providers/Socket/emitters'
import { CommonGameData, CardsInHand } from '../../Providers/Socket/listeners';
import { IconAlertCircle } from '@tabler/icons';


// Sample game data
// {
//   "lastPlayedUser": "Jayasurya17",
//   "lastPlayedAction": "will start the game",
//   "discardPile": [],
//   "isRoundComplete": false,
//   "playerDeclaredType": "",
//   "isGameComplete": false,
//   "waitingPlayers": [],
//   "players": [
//       {
//           "userName": "Jayasurya17",
//           "isAdmin": true,
//           "hasPlayerLeft": false,
//           "isEliminated": false,
//           "cardsInHand": 6,
//           "roundScore": null,
//           "totalScore": 75,
//           "previousScores": [12, 30, 25, 0, 13],
//           "userId": "63176f6e7cef672348864eeb"
//       },
//       {
//           "userName": "Under The Lamp Club",
//           "isAdmin": false,
//           "hasPlayerLeft": false,
//           "isEliminated": false,
//           "cardsInHand": 5,
//           "roundScore": null,
//           "totalScore": 20,
//           "previousScores": [0, 0, 0, 20, 0],
//           "userId": "63255f7295b9972f5cbb26ab"
//       },
//       {
//           "userName": "User left game",
//           "isAdmin": false,
//           "hasPlayerLeft": true,
//           "isEliminated": false,
//           "cardsInHand": 5,
//           "roundScore": null,
//           "totalScore": 80,
//           "previousScores": [10, 20, 30, 10, 10],
//           "userId": "63255f7295b9972f5cb956ab"
//       },
//       {
//           "userName": "User eliminated",
//           "isAdmin": false,
//           "hasPlayerLeft": false,
//           "isEliminated": true,
//           "cardsInHand": 5,
//           "roundScore": null,
//           "totalScore": 120,
//           "previousScores": [40, 40, 40],
//           "userId": "63255f729512972f5cbb26ab"
//       }
//   ],
//   "canPlayersDeclare": true,
//   "playerStatus": "PLAYING",
//   "isAdmin": false,
//   "currentPlayer": false"
// }


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
  const authId = useStoreState((state) => state.authId);

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
    } else if (status == "SUCCESS") {``
      setCommonData(data)
    }
  })

  CardsInHand((status, data) => {
    if (status == "SUCCESS") {
      setCardsInHand(data)
    }
  })

  const getCardImage = (cardNum) => {
    cardNum -= 1
    const cardValue = cardNum % 13
    const cardSuit = parseInt(cardNum / 13)
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"]
    const suits = ["C", "D", "H", "S"]
    let image = values[cardValue] + suits[cardSuit] + ".svg"
    return image
  }

  // if commonData.canPlayersDeclare == true, commonData.currentPlayer == true and function returns < 15, enable declare button
  const calculateScore = () => {
    var total = 0
    for (var card of cardsInHand) {
      var value = card % 13
      if (value === 0 || value > 10) {
        value = 10
      }
      total += value
    }
    return total
  }

  let cards = cardsInHand.map((element) => {
    return <Grid.Col md={1} key={element}>  <Image width={'100px'} src={`../../../public/Cards/${getCardImage(element)}`}></Image></Grid.Col>
  })

  let discardPile = commonData["discardPile"].map((element) => {
    return <Image key={element} width={'200px'} src={`../../../public/Cards/${getCardImage(element)}`}></Image>
  })

  return (
    <div style={{ padding: '80px' }}>
      <Grid grow>
        <Grid.Col span={8}>
          {
            // use commonData.playerDeclaredType to do animations
            // Valid values empty string, PAIR, LOWEST, SAME, HIGHEST
          }
          <Alert icon={<IconAlertCircle size={16} />} title={commonData.lastPlayedUser} radius="md">
            {commonData.lastPlayedAction}
          </Alert>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button onClick={() => LeaveGame(GameCode)}>Leave game</Button>
          {
            commonData.isGameComplete && commonData.isAdmin ?
              <Button onClick={() => RestartGame(GameCode)}>Start new game</Button> :
              commonData.isRoundComplete && commonData.isAdmin ?
                <Button onClick={() => NextRound(GameCode)}>Start next round</Button> :
                <></>
          }
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          {discardPile}
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          <Image width={'200px'} src={'../../../public/Cards/1B.svg'}></Image>
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          <PlayersCards data={commonData.players} currentPlayer={commonData.currentPlayer} isRoundComplete={commonData.isRoundComplete} isGameComplete={commonData.isGameComplete} />
        </Grid.Col>

        <Grid.Col span={12}>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              textAlign: 'center',
              padding: theme.spacing.xl,
              borderRadius: theme.radius.md,
              cursor: 'pointer',

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
              },
            })}
          >
            {
              commonData.playerStatus === "PLAYING" ?
              <Grid>
                  {cards}
                </Grid> :
              // Show loading icon (Waiting for next game to start)
                commonData.playerStatus === "WAITING"?
                <></>:
                <></>
            }
          </Box>
        </Grid.Col>
      </Grid>
    </div>
  )
}

export default GameRoom;


// SubComponents for GameRoom - 


const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  item: {
    '& + &': {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },
  },

  switch: {
    '& *': {
      cursor: 'pointer',
    },
  },

  title: {
    lineHeight: 1,
  },
}));


export function PlayersCards({ data, currentPlayer, isRoundComplete, isGameComplete }) {
  const { classes } = useStyles();

  const items = data.map((item) => {
    let cards = Array(item.cardsInHand).fill(<Image width={'10px'} src={'../../../public/Cards/1B.svg'}></Image>)
    // if data.currentPlayer == true highlight player
    return <Group position="apart" className={classes.item} noWrap spacing="xl" key={item.userId}>
      <Text size="md" color={item.isEliminated ? "red" : "dimmed"}>
        {item.totalScore}
      </Text>
      <Text>{item.userName}</Text>
      {
        isRoundComplete || isGameComplete ?
          <Text size="md" color="dimmed">
            {item.roundScore}
          </Text> :
          <Text size="xs" color="dimmed">
            {cards}
          </Text>
        // Add admin icon if item.isAdmin == true
        // Add left icon if item.hasPlayerLeft == true
      }
    </Group>
  });

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Text size="lg" className={classes.title} weight={500}>
        Players
      </Text>
      {items}
    </Card>
  );
}