import {
  Text,
  Paper,
  Group,
  Center
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import { useNavigate } from "react-router";

import { signInWithGoogle } from "../../Providers/Firebase/config";

export default function GoogleLogin() {
  const navigate = useNavigate();
  // const location = useLocation();

  const signIn = async () => {
    let user = await signInWithGoogle()
    if(user != null) {
      navigate("/");
    }
  };

  return (

    <Center style={{ width: '100%', height: '100vh' }}>
      <Paper radius="md" p="xl" withBorder >
        <Text size="lg" weight={500}>
          Welcome to DeclareGames.in
        </Text>
        <Group grow mb="md" mt="md">
          <GoogleButton onClick={signIn} radius="xl">Google</GoogleButton>
        </Group>
      </Paper>
    </Center>

  );
}



