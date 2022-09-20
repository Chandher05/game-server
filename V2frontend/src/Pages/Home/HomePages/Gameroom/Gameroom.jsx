import { Button, Center, Group, Input, Stack } from "@mantine/core";

import { IconBrandAppleArcade, IconFriends, IconEye } from '@tabler/icons'

import { useNavigate } from 'react-router-dom';
import { useStoreState } from "easy-peasy";
function Gameroom() {
  const Navigate = useNavigate();
  const authId = useStoreState((state) => state.authId);

  const createGame = () => {
    fetch(import.meta.env.VITE_API + "/game/create", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) Navigate('/waiting');
    });
  }
  const joinGame = () => {
    fetch(import.meta.env.VITE_API + "/game/join", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) Navigate('/waiting');
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


  return (
    <Center styles={{ height: '100vh' }}>
      <Stack >
        <Button color={"green"} size="lg" onClick={createGame}><IconBrandAppleArcade />&nbsp; Create Game</Button>
        <br></br>
        <Input placeholder="Game ID" size="lg"></Input>
        <Group>
          <Button size="lg" onClick={joinGame} ><IconFriends />&nbsp; Join Game</Button>
          <Button size="lg" color={'yellow'} onClick={spectateGame}><IconEye />&nbsp; Spectate Game</Button>
        </Group>
      </Stack>
    </Center>
  )
}

export default Gameroom;