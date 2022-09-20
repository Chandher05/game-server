import { Center, CopyButton, Stack, Tooltip, ActionIcon, Group, Title, Text } from "@mantine/core";
import { IconCheck, IconCopy } from '@tabler/icons'


function WaitingScreen() {
  let GameCode = "000000";
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