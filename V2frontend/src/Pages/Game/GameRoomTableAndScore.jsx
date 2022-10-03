import { useState, useEffect } from 'react';
import { Alert, Box, Button, Grid, Image, createStyles, Card, Group, Modal, Text, Center, Menu, ActionIcon, Stack, Loader, Space, Title, MediaQuery } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { RemovePlayer } from '../../Providers/Socket/emitters'
import { CommonGameData, CardsInHand } from '../../Providers/Socket/listeners';
import { IconPlayCard, IconUser, IconRun, IconSettings, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconLogout } from '@tabler/icons';
import { StatsControls } from '../Home/HomePages/Account/Stats'
import { showNotification } from '@mantine/notifications';

const getCardImage = (cardNum) => {
  cardNum -= 1
  const cardValue = cardNum % 13
  const cardSuit = parseInt(cardNum / 13)
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"]
  const suits = ["C", "D", "H", "S"]
  let image = values[cardValue] + suits[cardSuit] + ".svg"
  return image
}

function GameRoomTableAndScore({ commonData }) {

  const [userStats, setUserStats] = useState({});
  const [opened, setOpened] = useState(false);
  const [userId, setUserId] = useState("");
  const authId = sessionStorage.getItem('access_token');

  let discardPile = commonData["discardPile"].map((element, i) => {
    return <Image key={element} width={'100px'} src={`/Cards/${getCardImage(element)}`}></Image>
  })

  let hasPlayerLeft = {}
  commonData["players"].map((element) => {
    hasPlayerLeft[element.userId] = element.hasPlayerLeft
  })

  const showUserStats = (userId) => {
    fetch(import.meta.env.VITE_API + "/users/stats/" + userId, {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        response.json().then(json => {
          setUserStats(json)
          setOpened(true)
          setUserId(userId)
        })
      };
    });
  }

  return (
    <Grid>
      <Grid.Col span={6} >
        <Group>
          {discardPile}
          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <Image width={'100px'} src={'/Cards/1B.svg'}></Image>
          </MediaQuery>

        </Group>
      </Grid.Col>

      <Grid.Col span={6} style={{ minHeight: '200px' }}>
        <PlayersCards data={commonData.players} isRoundComplete={commonData.isRoundComplete} isGameComplete={commonData.isGameComplete} showUserStats={showUserStats} />
        <PlayerStatsModel userId={userId} userStats={userStats} opened={opened} setOpened={setOpened} isAdmin={commonData.isAdmin} currentUserId={commonData.userId} hasPlayerLeft={hasPlayerLeft[userId]} />
      </Grid.Col>
    </Grid>
  )
}

export default GameRoomTableAndScore;


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


export function PlayersCards({ data, isRoundComplete, isGameComplete, showUserStats }) {
  const { classes } = useStyles();

  const items = data.map((item) => {
    let cards = [...Array(item.cardsInHand)].map((e, i) => { return <Image width={'10px'} src='/Cards/1B.svg' /> });
    return <Group position="apart" className={classes.item} noWrap spacing="xl" key={item.userId} style={{ padding: '5px', backgroundColor: item.currentPlayer ? '#06283D' : '' }}>
      <Group>
        <Text size="md" color={item.isEliminated ? "#F66B0E" : "dimmed"} p={5}>
          {item.totalScore}
        </Text>
        <Text onClick={() => showUserStats(item.userId)}>{item.userName}</Text>
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
      {
        isRoundComplete || isGameComplete ?
          <Text size="md" color="dimmed">
            {item.roundScore}
          </Text> :
          <Group spacing={'xs'}>
            {cards}
          </Group>
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


function PlayerStatsModel({ userId, userStats, opened, setOpened, isAdmin, currentUserId, hasPlayerLeft }) {

  let params = useParams()
  let GameCode = params.gameId;
  const authId = sessionStorage.getItem('access_token');

  const reportPlayer = () => {
    fetch(import.meta.env.VITE_API + "/users/report/" + userId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      }
    }).then(async (response) => {
      if (response.ok) {
        showNotification({
          variant: 'outline',
          color: 'green',
          title: 'User reported'
        })
        setOpened(false)
      } else {
        throw new Error(response)
      }
    }).catch((error) => {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Something went wrong!',
        message: 'Please refresh the page and try again'
      })
      setOpened(false)
    })
  }

  const removePlayerFromGame = () => {
    RemovePlayer(GameCode, userId)
    setOpened(false)
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={userStats.userName + " stats"}
      size={400}
    >
      <StatsControls statValues={userStats} />
      <Space h="xl" />
      <Group position="apart">
        <Button color={'red.7'} onClick={reportPlayer} hidden={currentUserId === userId}>Report</Button>
        <Button color={'yellow.7'} onClick={removePlayerFromGame} hidden={!isAdmin || currentUserId === userId || hasPlayerLeft }>Remove player</Button>
      </Group>
    </Modal>
  )
}
