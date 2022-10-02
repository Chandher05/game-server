import { useState, useEffect } from 'react';
import { Alert, Box, Button, Grid, Image, createStyles, Card, Group, Modal, Text, Center, Menu, ActionIcon, Stack, Loader, Space, Title, MediaQuery } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates, LeaveGame, NextRound, RestartGame, DropCards, Declare } from '../../Providers/Socket/emitters'
import { CommonGameData, CardsInHand } from '../../Providers/Socket/listeners';
import { IconPlayCard, IconUser, IconRun, IconSettings, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconLogout } from '@tabler/icons';

function GameRoomNotifications({ commonData }) {
  let params = useParams()
  let GameCode = params.gameId;
  const [leaveGameModalOpened, setLeaveGameModalOpened] = useState(false);

  let userActionTitle = ""
  let userActionColor = ""
  if (commonData.playerDeclaredType == "LOWEST") {
    userActionTitle = commonData.lastPlayedUser
    userActionColor = "teal.1"
  } else if (commonData.playerDeclaredType == "PAIR") {
    userActionTitle = commonData.lastPlayedUser + " had wicked wango cards"
    userActionColor = "lime.1"
  } else if (commonData.playerDeclaredType == "SAME") {
    userActionTitle = "GG " + commonData.lastPlayedUser
    userActionColor = "yellow.1"
  } else if (commonData.playerDeclaredType == "PAIR") {
    userActionTitle = commonData.lastPlayedUser + " got banboozled"
    userActionColor = "red.1"
  } else {
    userActionTitle = commonData.lastPlayedUser
    userActionColor = "blue.1"
  }

  return (
      <Grid>
        <Grid.Col span={6}>
          <Alert  color={userActionColor} icon={<IconPlayCard size={'2rem'} />} title={userActionTitle} radius="md">
            {commonData.lastPlayedAction}
          </Alert>
        </Grid.Col>
        <Grid.Col span={5}>
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
        </Grid.Col>
        <Grid.Col span={1}>
          <Center>
            <ActionIcon onClick={() => setLeaveGameModalOpened(true)} style={{ padding: '4px' }} color={'red.7'} variant='filled' size={'lg'}><IconLogout size={34}></IconLogout></ActionIcon>
            <LeaveGameModal leaveGameModalOpened={leaveGameModalOpened} setLeaveGameModalOpened={setLeaveGameModalOpened} />
          </Center>
          {/* <MenuActions LeaveGame={LeaveGame} GameCode={GameCode}></MenuActions> */}
        </Grid.Col>
      </Grid>
  )
}

export default GameRoomNotifications;


// SubComponents for GameRoomNotifications


function LeaveGameModal({ leaveGameModalOpened, setLeaveGameModalOpened }) {
  let params = useParams()
  let GameCode = params.gameId;

  return (
    <Modal
      opened={leaveGameModalOpened}
      onClose={() => setLeaveGameModalOpened(false)}
    >
      <Center><Title>Are you sure?</Title></Center>
      <Space h="xl" />
      <Group position="apart" p={6}>
        <Button onClick={() => setLeaveGameModalOpened(false)} color={'gray.7'}>Cancel</Button>
        <Button onClick={() => LeaveGame(GameCode)} color={'red.7'}>Leave</Button>
      </Group>
    </Modal>
  )
}