import { useState, useEffect } from 'react';
import { Alert, Box, Button, Grid, Image, createStyles, Card, Group, Switch, Text } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates, LeaveGame } from '../../Providers/Socket/emitters'
import { CommonGameData } from '../../Providers/Socket/listeners';
import { IconAlertCircle } from '@tabler/icons';



//MockData for Players 
const playerData = [
  {
    "username": "Sujith",
    "description": <Image width={'10px'} src={'../../../public/Cards/1B.svg'}></Image>,
    "score": 34
  },
  {
    "username": "Jayasurya",
    "description": <Image width={'10px'} src={'../../../public/Cards/1B.svg'}></Image>,
    "score": 34
  },
  {
    "username": "Lipi",
    "description": <Image width={'10px'} src={'../../../public/Cards/1B.svg'}></Image>,
    "score": 34
  },
  {
    "username": "Anjali",
    "description": <Image width={'10px'} src={'../../../public/Cards/1B.svg'}></Image>,
    "score": 34
  },
  {
    "username": "Sravanth",
    "description": <Image width={'10px'} src={'../../../public/Cards/1B.svg'}></Image>,
    "score": 34
  }
];



function GameRoom() {
  let params = useParams()
  let GameCode = params.gameId;
  const Navigate = useNavigate();
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
    }
  })

  return (
    <div style={{ padding: '80px' }}>
      <Grid grow>
        <Grid.Col span={8}>
          <Alert icon={<IconAlertCircle size={16} />} title="Sujith's Turn" radius="md">
            Picked from the table
          </Alert>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button onClick={() => LeaveGame(GameCode)}>Leave game</Button>
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          <Image width={'200px'} src={'../../../public/Cards/2H.svg'}></Image>
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          <Image width={'200px'} src={'../../../public/Cards/1B.svg'}></Image>
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          <PlayersCards data={playerData} />
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
            <Grid>
              <Grid.Col md={1}>  <Image width={'100px'} src={'../../../public/Cards/2H.svg'}></Image></Grid.Col>
              <Grid.Col md={1}>  <Image width={'100px'} src={'../../../public/Cards/2S.svg'}></Image></Grid.Col>
              <Grid.Col md={1}>  <Image width={'100px'} src={'../../../public/Cards/TH.svg'}></Image></Grid.Col>
              <Grid.Col md={1}>  <Image width={'100px'} src={'../../../public/Cards/4C.svg'}></Image></Grid.Col>
              <Grid.Col md={1}>  <Image width={'100px'} src={'../../../public/Cards/KS.svg'}></Image></Grid.Col>

            </Grid>
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


export function PlayersCards({ data }) {
  const { classes } = useStyles();

  const items = data.map((item) => (
    <Group position="apart" className={classes.item} noWrap spacing="xl">
      <div>
        <Text>{item.username}</Text>
        <Text size="xs" color="dimmed">
          {item.description}
        </Text>
      </div>
      <Text size="md" color="dimmed">
        {item.score}
      </Text>
    </Group>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Text size="lg" className={classes.title} weight={500}>
        Players
      </Text>
      {items}
    </Card>
  );
}