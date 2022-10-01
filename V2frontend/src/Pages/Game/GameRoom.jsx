import { useState, useEffect } from 'react';
import { Alert, Box, Button, Grid, Image, createStyles, Card, Group, Switch, Text, Center } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates, LeaveGame, NextRound, RestartGame, DropCards, Declare } from '../../Providers/Socket/emitters'
import { CommonGameData, CardsInHand } from '../../Providers/Socket/listeners';
import { IconPlayCard, IconUser, IconRun } from '@tabler/icons';
// sample data
const sampleData =
{
  "lastPlayedUser": "Jayasurya17",
  "lastPlayedAction": "will start the game",
  "discardPile": [1, 14, 27],
  "isRoundComplete": false,
  "playerDeclaredType": "",
  "isGameComplete": false,
  "waitingPlayers": [],
  "players": [
    {
      "userName": "Jayasurya17",
      "isAdmin": true,
      "hasPlayerLeft": false,
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
      "isAdmin": false,
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
      "previousScores": [40, 40, 40],
      "currentPlayer": false,
      "userId": "63255f729512972f5cbb26ab"
    }
  ],
  "canPlayersDeclare": true,
  "playerStatus": "PLAYING",
  "isAdmin": false,
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
  const [commonData, setCommonData] = useState(sampleData);
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
    } else if (status == "SUCCESS") {
      data = sampleData
      setCommonData(data)
      // if (!data.currentPlayer) {
      //   setSelected([])
      // }
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
    let temp = selected
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
    element = parseInt(element)
    return (
      <Grid.Col md={1} key={element}>
        <Image
          onClick={() => selectCards(element)}
          style={{ cursor: 'pointer', }}
          width={selected.includes(element) ? '105px' : '100px'}
          src={`/Cards/${getCardImage(element)}`}
          key={element} />
      </Grid.Col>
    )
    // return <Grid.Col md={1} key={element}><SingleCard element={element} /> </Grid.Col>

    // <Image style={{ cursor: 'pointer', }} width={'100px'} src={`../../../public/Cards/${getCardImage(element)}`}></Image>
  })

  let discardPile = commonData["discardPile"].map((element, i) => {
    return <Grid.Col md={1} key={i} >  <Image key={element} width={'100px'} src={`/Cards/${getCardImage(element)}`}></Image> </Grid.Col>
  })

  return (
    <div style={{ padding: '80px' }}>
      <Grid grow>
        <Grid.Col span={8}>
          {
            // use commonData.playerDeclaredType to do animations
            // Valid values empty string, PAIR, LOWEST, SAME, HIGHEST
          }
          <Alert icon={<IconPlayCard size={'2rem'} />} title={commonData.lastPlayedUser} radius="md">
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
        <Grid.Col span={4} style={{ minHeight: '100px' }}>
          <Grid spacing={'xs'}>{discardPile}</Grid>
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }} >
          <Center>
            <Image width={'100px'} src={'/Cards/1B.svg'}></Image>
          </Center>
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          <PlayersCards data={commonData.players} isRoundComplete={commonData.isRoundComplete} isGameComplete={commonData.isGameComplete} />
        </Grid.Col>

        <Grid.Col span={12}>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              textAlign: 'center',
              padding: theme.spacing.xl,
              borderRadius: theme.radius.md,

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
              },
            })}
          >
            {
              commonData.playerStatus === "PLAYING" ?
                <Grid>
                  <Button
                    hidden={commonData.currentPlayer && cardsInHand.length == 6 ? false : true}
                    // disabled={selected.length == 0}
                    onClick={() => DropCards(GameCode, selected, 'Start')}>
                    Drop Cards
                  </Button>
                  <Button
                    hidden={commonData.currentPlayer && cardsInHand.length < 6 ? false : true}
                    // disabled={selected.length == 0}
                    onClick={() => DropCards(GameCode, selected, 'Table')}>
                    Pick from table
                  </Button>
                  <Button
                    hidden={commonData.currentPlayer && cardsInHand.length < 6 ? false : true}
                    // disabled={selected.length == 0}
                    onClick={() => DropCards(GameCode, selected, 'Deck')}>
                    Pick from deck
                  </Button>
                  {cards}

                  <Button
                    hidden={commonData.canPlayersDeclare && commonData.currentPlayer && calculateScore() < 15 ? false : true}
                    onClick={() => Declare(GameCode)}>
                    Declare
                  </Button>
                </Grid> :
                // Show loading icon (Waiting for next game to start)
                commonData.playerStatus === "WAITING" ?
                  <></> :
                  <></>
            }
          </Box>
        </Grid.Col>
      </Grid>
    </div >
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


export function PlayersCards({ data, isRoundComplete, isGameComplete }) {
  const { classes } = useStyles();

  const items = data.map((item) => {
    let cards = [...Array(item.cardsInHand)].map((e, i) => { return <Image width={'10px'} src='/Cards/1B.svg' /> });
    return <Group position="apart" className={classes.item} noWrap spacing="xl" key={item.userId} style={{ padding: '5px', backgroundColor: item.currentPlayer ? '#06283D' : '' }}>
      <Group>
        <Text size="md" color={item.isEliminated ? "#F66B0E" : "dimmed"} p={5}>
          {item.totalScore}
        </Text>
        <Text>{item.userName}</Text>
      </Group>
      {
        isRoundComplete || isGameComplete ?
          <Text size="md" color="dimmed">
            {item.roundScore}
          </Text> :
          <Group spacing={'xs'}>
            {cards}
          </Group>
      }
      {
        item.isAdmin ?
          <IconUser /> :
          <></>
      }
      {
        item.hasPlayerLeft ?
          <IconRun /> :
          <></>
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


function SingleCard({ element }) {
  const [width, setWidth] = useState(true);
  const getCardImage = (cardNum) => {
    cardNum -= 1
    const cardValue = cardNum % 13
    const cardSuit = parseInt(cardNum / 13)
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"]
    const suits = ["C", "D", "H", "S"]
    let image = values[cardValue] + suits[cardSuit] + ".svg"
    return image
  }

  // if (!cardsInHand) return <></>;
  if (width) return <Image onClick={() => setWidth(false)} style={{ cursor: 'pointer', }} width={'100px'} src={`/Cards/${getCardImage(element)}`}></Image>;
  return <Image onClick={() => setWidth(true)} style={{ cursor: 'pointer', }} width={'105px'} src={`/Cards/${getCardImage(element)}`}></Image>;


}
