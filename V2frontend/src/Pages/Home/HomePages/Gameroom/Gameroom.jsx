import { Button, Center, Group, Input, Stack, Select, Modal, SegmentedControl } from "@mantine/core";
import { useState, useEffect } from 'react';
import { IconBrandAppleArcade, IconFriends, IconEye } from '@tabler/icons'
import { useNavigate } from 'react-router-dom';
import { useStoreState } from "easy-peasy";

function Gameroom() {
  const Navigate = useNavigate();
  const [gameCode, setGameCode] = useState([]);
  const [opened, setOpened] = useState(false);
  const [maxScore, setMaxScore] = useState(100);
  const [scoreWhenEndWithPair, setScoreWhenEndWithPair] = useState(-25);
  const [scoreWhenWrongCall, setScoreWhenWrongCall] = useState(50);
  const [canDeclareFirstRound, setCanDeclareFirstRound] = useState(true);
  const [autoplayTimer, setAutoplayTimer] = useState(60);
  const [isPublicGame, setIsPublicGame] = useState(false);
  const authId = useStoreState((state) => state.authId);

  const createGame = () => {
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
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Game settings"
      >
        <Group position="apart" p={3}>
          Max score
          <SegmentedControl
            data={[
              { label: 100, value: 100 },
              { label: 200, value: 200 },
              { label: 250, value: 250 }
            ]}
            transitionDuration={250}
            value={maxScore}
            onChange={setMaxScore}
          />
        </Group>

        <Group position="apart" p={3}>
          Ending with a pair
          <SegmentedControl
            data={[
              { label: -15, value: -15 },
              { label: -25, value: -25 },
              { label: -40, value: -40 }
            ]}
            transitionDuration={250}
            value={scoreWhenEndWithPair}
            onChange={setScoreWhenEndWithPair}
          />
        </Group>

        <Group position="apart" p={4}>
          Score for wrong call
          <SegmentedControl
            data={[
              { label: 25, value: 25 },
              { label: 50, value: 50 },
              { label: 75, value: 75 }
            ]}
            transitionDuration={250}
            value={scoreWhenWrongCall}
            onChange={setScoreWhenWrongCall}
          /></Group>

        <Group position="apart" p={4}>
          Can declare first round
          <SegmentedControl
            data={[
              { label: "YES", value: true },
              { label: "NO", value: false }
            ]}
            transitionDuration={250}
            value={canDeclareFirstRound}
            onChange={setCanDeclareFirstRound}
          /></Group>


        <Group position="apart" p={4}>
          Autoplay timer
          <SegmentedControl
            color={'red'}
            data={[
              { label: '45s', value: 45 },
              { label: '60s', value: 60 },
              { label: '90s', value: 90 }
            ]}
            transitionDuration={250}
            value={autoplayTimer}
            onChange={setAutoplayTimer}
          /></Group>

        <Group position="apart" p={4}>
          Public game
          <SegmentedControl
            data={[
              { label: "YES", value: true },
              { label: "NO", value: false }
            ]}
            transitionDuration={250}
            value={isPublicGame}
            onChange={setIsPublicGame}
          />
        </Group>
        <Group position="right" p={6}>
          <Button onClick={createGame}>Create Game</Button>
        </Group>
      </Modal>
      <Center styles={{ height: '100vh' }}>
        <Stack >
          <Button color={"green"} size="lg" onClick={() => setOpened(true)}><IconBrandAppleArcade />&nbsp; Create Game</Button>
          <br></br>
          <Input placeholder="Game ID" size="lg" onChange={changeGameCode}></Input>
          <Group>
            <Button size="lg" onClick={joinGame} ><IconFriends />&nbsp; Join Game</Button>
            <Button size="lg" color={'yellow'} onClick={spectateGame}><IconEye />&nbsp; Spectate Game</Button>
          </Group>
        </Stack>
      </Center>
    </>
  )
}

export default Gameroom;