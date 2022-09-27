import { Button, Center, Group, Input, Stack, Select, Modal, SegmentedControl, Container } from "@mantine/core";
import { useState, useEffect } from 'react';
import { IconBrandAppleArcade, IconFriends, IconEye } from '@tabler/icons'
import { useNavigate } from 'react-router-dom';
import { useStoreState } from "easy-peasy";
import CreateGameModal from "./CreateGameModal";
import PublicGameRoom from "./PublicGameRoom";

function Gameroom() {
  const Navigate = useNavigate();
  const [gameCode, setGameCode] = useState([]);
  const [opened, setOpened] = useState(false);
  const authId = useStoreState((state) => state.authId);

  const createGame = (maxScore, scoreWhenEndWithPair, scoreWhenWrongCall, canDeclareFirstRound, autoplayTimer, isPublicGame) => {
    const data = {
      'maxScore': maxScore,
      'scoreWhenEndWithPair': scoreWhenEndWithPair,
      'scoreWhenWrongCall': scoreWhenWrongCall,
      'canDeclareFirstRound': canDeclareFirstRound,
      'autoplayTimer': autoplayTimer,
      'isPublicGame': isPublicGame,
    }
    // return
    fetch(import.meta.env.VITE_API + "/game/create", {
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
      };
    });
  }
  const joinGame = (gameId) => {
    if (gameId.length == 0) {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Error',
        message: 'Please enter a game code to join game'
      })
    } else {
      const data = {
        gameId: gameId
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
            // if (json.isStarted) {
              // Navigate(`/game/${gameId}`)
              // } else {
                Navigate(`/waiting/${gameId}`)
            // }
          })
        }
      });
    }
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
    <>
      <CreateGameModal opened={opened} setOpened={setOpened} createGame={createGame} />
      <Center styles={{ height: '100vh' }}>
        <Stack >
          <Button color={"green"} size="lg" onClick={() => setOpened(true)}><IconBrandAppleArcade />&nbsp; Create Game</Button>
          <br></br>
          <Input placeholder="Game ID" size="lg" onChange={changeGameCode}></Input>
          <Group>
            <Button size="lg" onClick={() => joinGame(gameCode)} ><IconFriends />&nbsp; Join Game</Button>
            <Button size="lg" color={'yellow'} onClick={spectateGame}><IconEye />&nbsp; Spectate Game</Button>
          </Group>
        </Stack>
      </Center>
      <Container>
        <PublicGameRoom joinGame={joinGame}></PublicGameRoom>
      </Container>
    </>
  )
}

export default Gameroom;