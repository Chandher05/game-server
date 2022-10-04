import { Button, Center, Group, Input, Stack, Container } from "@mantine/core";
import { useState, useEffect } from 'react';
import { IconBrandAppleArcade, IconFriends, IconEye } from '@tabler/icons'
import { useNavigate } from 'react-router-dom';
import CreateGameModal from "./CreateGameModal";
import PublicGameRoom from "./PublicGameRoom";
import { showNotification } from '@mantine/notifications';
import { getIdTokenOfUser } from "../../../../Providers/Firebase/config";

function Gameroom() {
  const Navigate = useNavigate();
  const [gameCode, setGameCode] = useState("");
  const [opened, setOpened] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryGamecode = params.get('gamecode');
    setGameCode(queryGamecode)
  }, [])

  const createGame = async (maxScore, scoreWhenEndWithPair, scoreWhenWrongCall, canDeclareFirstRound, autoplayTimer, isPublicGame) => {
    const authId = await getIdTokenOfUser();
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
      } else {
        throw new Error(response)
      }
    }).catch((err) => {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Something went wrong!',
        message: 'Check game code and try again'
      })
    })
  }
  const joinGame = async (gameId) => {
    const authId = await getIdTokenOfUser();
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
            if (json.isStarted) {
              Navigate(`/game/${gameId}`)
            } else {
              Navigate(`/waiting/${gameId}`)
            }
          })
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
      })
    }
  }
  const spectateGame = (gameId) => {
    if (gameId.length == 0) {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Error',
        message: 'Please enter a game code to spectate game'
      })
    } else {
      const data = {
        gameId: gameId
      }
      fetch(import.meta.env.VITE_API + "/game/spectate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authId}`,
        },
        body: JSON.stringify(data)
      }).then(async (response) => {
        if (response.ok) {
          Navigate(`/game/${gameId}`)
        } else {
          throw new Error()
        }
      }).catch((error) => {
        showNotification({
          variant: 'outline',
          color: 'red',
          title: 'Something went wrong!',
          message: "Check game code and try again"
        })
      })
    }
  }

  const changeGameCode = (e) => {
    setGameCode(e.target.value)
  }


  // console.log(window.location.origin)
  return (
    <>
      <CreateGameModal opened={opened} setOpened={setOpened} createGame={createGame} />
      <Center styles={{ height: '100vh' }}>
        <Stack >
          <Button color={"green"} size="lg" onClick={() => setOpened(true)}><IconBrandAppleArcade />&nbsp; Create Game</Button>
          <br></br>
          <Input placeholder="Game ID" size="lg" onChange={changeGameCode} value={gameCode}></Input>
          <Group>
            <Button size="lg" onClick={() => joinGame(gameCode)} ><IconFriends />&nbsp; Join Game</Button>
            <Button size="lg" color={'yellow'} onClick={() => spectateGame(gameCode)}><IconEye />&nbsp; Spectate Game</Button>
          </Group>
        </Stack>
      </Center>
      <Container>
        <PublicGameRoom joinGame={joinGame} spectateGame={spectateGame}></PublicGameRoom>
      </Container>
    </>
  )
}

export default Gameroom;