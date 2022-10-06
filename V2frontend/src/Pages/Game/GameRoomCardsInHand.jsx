import { Box, Button, Grid, Image, Group, Text, Center, Stack, Loader, Space, MediaQuery } from "@mantine/core";
import { useParams } from "react-router-dom";
import { DropCards, Declare, RestartGame, NextRound } from '../../Providers/Socket/emitters';

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

function GameRoomCardsInHand({ commonData, selected, cardsInHand, selectCards }) {
  let params = useParams()
  let GameCode = params.gameId;

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
      <Image
        onClick={() => selectCards(element)}
        style={{ width: '75px', cursor: 'pointer', margin: '5px', padding: '4px', backgroundColor: (selected.includes(element) ? '#FAB005' : '') }}
        src={`/Cards/${getCardImage(element)}`}
        key={element} />
    )
  })

  let playerEligibleToDeclare = false
  if (commonData.canPlayersDeclare && commonData.currentPlayer && !commonData.isRoundComplete && !commonData.isGameComplete) {
    if (calculateScore() < 15) {
      playerEligibleToDeclare = true
    } else if (cardsInHand.length == 2 && (cardsInHand[0] - cardsInHand[1]) % 13 == 0) {
      playerEligibleToDeclare = true
    }
  }

  let playerCardsInHandGrid = (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        minHeight: '200px'

      })}
    >

      <Stack>
        <Grid>
          <Grid.Col span={4}>
            <Button
              color={'indigo.7'}
              size={'xs'}
              fullWidth={true}
              hidden={commonData.currentPlayer && cardsInHand.length == 6 && !commonData.isRoundComplete && !commonData.isGameComplete ? false : true}
              disabled={selected.length == 0}
              onClick={() => DropCards(GameCode, selected, 'Start')}>
              Drop Cards
            </Button>
            <Button
              color={'blue.7'}
              size={'sm'}
              fullWidth={true}
              hidden={commonData.currentPlayer && cardsInHand.length < 6 && !commonData.isRoundComplete && !commonData.isGameComplete ? false : true}
              disabled={selected.length == 0}
              onClick={() => DropCards(GameCode, selected, 'Table')}>
              Table
            </Button>
          </Grid.Col>
          <Grid.Col span={4}>
            Total: {calculateScore()}
          </Grid.Col>
          <Grid.Col span={4}>
            <Button
              color={'cyan.7'}
              fullWidth={true}
              hidden={commonData.currentPlayer && cardsInHand.length < 6 && !commonData.isRoundComplete && !commonData.isGameComplete ? false : true}
              disabled={selected.length == 0}
              onClick={() => DropCards(GameCode, selected, 'Deck')}>
              Deck
            </Button>
          </Grid.Col>
        </Grid>
        <Group position='center'>
          {cards}
        </Group>
        <Group position='center'>
          <Button
            color={'yellow.7'}
            fullWidth={true}
            hidden={!playerEligibleToDeclare}
            onClick={() => Declare(GameCode)}>
            Declare
          </Button>
          <Center>
          {
            commonData.isGameComplete && !commonData.isAdmin ?
              <><Loader variant="bars" /> <Space w="xs" /> <Text>Admin will start new game</Text></> :
              commonData.isRoundComplete && !commonData.isAdmin ?
                <><Loader variant="bars" /> <Space w="xs" /> <Text>Admin will start next round</Text></> :
                commonData.isGameComplete && commonData.isAdmin ?

                  <Button onClick={() => RestartGame(GameCode)}>Start new game</Button> :
                  commonData.isRoundComplete && commonData.isAdmin ?

                    <Button onClick={() => NextRound(GameCode)}>Start next round</Button> :
                    <></>
          }
        </Center>
        </Group>
      </Stack>

    </Box>
  )

  return (

    <Grid>
      {
        commonData.playerStatus === "PLAYING" ?
          <>
            <MediaQuery largerThan="md" styles={{ display: 'none' }}>
              <Grid.Col span={12}>
                {playerCardsInHandGrid}
              </Grid.Col>
            </MediaQuery>
            <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
              <Grid.Col span={6} offset={3}>
                {playerCardsInHandGrid}
              </Grid.Col>
            </MediaQuery>
          </>
          :
          commonData.playerStatus === "WAITING" ?
            <Grid.Col span={12} padding={'10px'}>
              <Space h="xl" />
              <Center>
                <Loader variant="dots" /> <Space w="xl" /> <Text>Enjoy the current game while you're waiting</Text>
              </Center>
            </Grid.Col> :
            <></>
      }
    </Grid>
  )
}

export default GameRoomCardsInHand;