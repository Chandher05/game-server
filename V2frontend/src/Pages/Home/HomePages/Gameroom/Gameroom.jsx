import { Button, Center, Group, Input, Stack } from "@mantine/core";
import { useState, useEffect } from 'react';
import { IconBrandAppleArcade, IconFriends, IconEye } from '@tabler/icons'
import { useNavigate } from 'react-router-dom';
import { useStoreState } from "easy-peasy";

function Gameroom() {
  const Navigate = useNavigate();
  const [gameCode, setGameCode] = useState([]);
  const authId = useStoreState((state) => state.authId);

  const createGame = () => {
    fetch(import.meta.env.VITE_API + "/game/create", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        response.json().then(json => {
          let gameId = json.gameId
          Navigate(`/waiting/${gameId}`)
        })
      };
    });
  }
  const joinGame = () => {
    const data = {
      gameId: gameCode
    }
    fetch(import.meta.env.VITE_API + "/game/join", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) {
        response.json().then(json => {
          let gameId = json.gameId
          Navigate(`/waiting/${gameId}`)
        })
      }
    });
  }
  const spectateGame = () => {
    fetch(import.meta.env.VITE_API + "/game/spectate", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) Navigate('/waiting');
    });
  }

  const changeGameCode = (e) => {
    setGameCode(e.target.value)
  }


  return (
    <Center styles={{ height: '100vh' }}>
      <Stack >
        <Button color={"green"} size="lg" onClick={createGame}><IconBrandAppleArcade />&nbsp; Create Game</Button>
        <br></br>
        <Input placeholder="Game ID" size="lg" onChange={changeGameCode}></Input>
        <Group>
          <Button size="lg" onClick={joinGame} ><IconFriends />&nbsp; Join Game</Button>
          <Button size="lg" color={'yellow'} onClick={spectateGame}><IconEye />&nbsp; Spectate Game</Button>
        </Group>
      </Stack>
    </Center>
  )
}

export default Gameroom;