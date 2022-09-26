import { useState, useEffect } from 'react';
import { Center, CopyButton, Stack, Tooltip, ActionIcon, Group, Title, Text, Button } from "@mantine/core";
import { IconCheck, IconCopy } from '@tabler/icons'
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetLobbyUpdates } from '../../Providers/Socket/emitters'
import { LobbyListener } from '../../Providers/Socket/listeners'
import socket from '../../Providers/Socket/index'

function WaitingScreen() {
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
          } else if (json.status == "LOBBY" && GameCode != json.gameId) {
            Navigate(`/waiting/${json.gameId}`)
          } else if (json.status == "GAME_ROOM") {
            Navigate(`/game/${json.gameId}`)
          }
        })
      };
    });
  }, [])
  GetLobbyUpdates(GameCode)

  return <DisplayData></DisplayData>
}

function DisplayData() {
  let params = useParams()
  let GameCode = params.gameId;
  const Navigate = useNavigate();
  const [data, setData] = useState([]);
  const authId = useStoreState((state) => state.authId);



  const leaveGame = async () => {

    const data = {
      gameId: GameCode
    }
    fetch(import.meta.env.VITE_API + "/game/quitFromLobby", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) Navigate(`/`)
      // TODO: Error response
    });

  };


  LobbyListener((status, data, err) => {
    if (status === "WAITING") {
      setData(data)
    }
  })

  return (
    <Center p={"10px"} style={{ height: '100vh' }}>
      <Stack justify={'center'}>
        <Title order={1}><Group>
          Code: <Text color={'blue'}>
            {GameCode}
          </Text>
          <CopyGameCode GameCode={GameCode} />
        </Group>
        </Title>
        <Title order={5} color="grey">share this with friends for them to join</Title>
        <Title order={3}>Friends who have joined</Title>
        {data.players ? <ListPlayers data={data}></ListPlayers> : ""}


        <p>Max score: {data.maxScore}</p>
        <p>End with pair: {data.endWithPair}</p>
        <p>Wrong call: {data.wrongCall}</p>
        <p>First round declare: {data.canDeclareFirstRound ? "TRUE" : "FALSE"}</p>
        <Button onClick={leaveGame}>Leave</Button>
        {data.isAdmin && data.players && data.players.length > 1 ? <Button>Start Game</Button> : ""}
      </Stack>
    </Center>
  )
}

export default WaitingScreen;


function CopyGameCode({ GameCode }) {
  return (
    <CopyButton value={GameCode} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
          <ActionIcon style={{ border: '1px solid grey' }} size={"3rem"} color={copied ? 'blue' : 'gray'} onClick={copy}>
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  )
}

function ListPlayers({ data }) {
  const players = data.players.map(obj => {
    if (obj.isAdmin) {
      return <p key={obj.id}><b>{obj.userName}</b></p>
    }
    return <p key={obj.id}>{obj.userName}</p>
  })
  return players
}