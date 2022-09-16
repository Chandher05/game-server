import { Button, Center, Input, Stack } from "@mantine/core";

import { IconBrandAppleArcade, IconFriends } from '@tabler/icons'

function Gameroom() {

  return (
    <Center styles={{ height: '100vh' }}>
      <Stack >
        <Button size="lg"><IconBrandAppleArcade />&nbsp; Create Game</Button>
        <br></br>
        <Input placeholder="Game ID" size="lg"></Input>
        <Button size="lg"><IconFriends />&nbsp; Join Game</Button>
      </Stack>
    </Center>
  )
}

export default Gameroom;