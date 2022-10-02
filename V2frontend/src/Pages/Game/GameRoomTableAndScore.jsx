import { useState, useEffect } from 'react';
import { Alert, Box, Button, Grid, Image, createStyles, Card, Group, Modal, Text, Center, Menu, ActionIcon, Stack, Loader, Space, Title, MediaQuery } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates, LeaveGame, NextRound, RestartGame, DropCards, Declare } from '../../Providers/Socket/emitters'
import { CommonGameData, CardsInHand } from '../../Providers/Socket/listeners';
import { IconPlayCard, IconUser, IconRun, IconSettings, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconLogout } from '@tabler/icons';

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

  let discardPile = commonData["discardPile"].map((element, i) => {
    return <Image key={element} width={'100px'} src={`/Cards/${getCardImage(element)}`}></Image>
  })

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
        <PlayersCards data={commonData.players} isRoundComplete={commonData.isRoundComplete} isGameComplete={commonData.isGameComplete} />
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
