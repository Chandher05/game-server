import { IconHeart } from '@tabler/icons';
import { useState, useEffect } from 'react';
import { useStoreState } from "easy-peasy";
import { Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles, Grid } from '@mantine/core';
import { IconSortAscending2, IconLayersLinked, IconX } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));




export function PublicGameRoom({ joinGame, spectateGame }) {
  const [games, setGames] = useState([]);
  const authId = useStoreState((state) => state.authId);

  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/game/public", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        response.json().then(json => {
          setGames(json);
        })
      }
    });
  }, [])

  let gameCards = games.map((element) => (
    <Grid.Col lg={4} md={6} sm={12} key={element.gameId}><BadgeCard data={element} description='Public game' joinGame={joinGame} spectateGame={spectateGame}></BadgeCard></Grid.Col>
  ));

  return (
    <Grid style={{ margin: '10px' }}>
      {gameCards}
    </Grid>
  )
}


function BadgeCard({ data, description, joinGame, spectateGame }) {
  const { classes, theme } = useStyles();


  return (
    <Card withBorder radius="md" p="md" className={classes.card}>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text size="lg" weight={500}>
            {data.gameId}
          </Text>
        </Group>
        <Text size="sm" mt="xs">
          {description} ({data.numOfPlayersInGame} players active)
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} color="dimmed">
          Winning Condition
        </Text>
        <Text>Max score: {data.maxScore}</Text>
        <Text>End with pair: {data.endWithPair}</Text>
        <Text>Wrong call: {data.wrongCall}</Text>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }} onClick={() => joinGame(data.gameId)}>
          Join Game
        </Button>
        <Button radius="md" color={'yellow'} style={{ flex: 1 }} onClick={() => spectateGame(data.gameId)}>
          Spectate Game
        </Button>
        {/* <ActionIcon variant="default" radius="md" size={36}>
          <IconHeart size={18} className={classes.like} stroke={1.5} />
        </ActionIcon> */}
      </Group>
    </Card>
  );
}

export default PublicGameRoom;