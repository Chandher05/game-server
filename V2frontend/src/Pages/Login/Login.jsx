import { Container, Title, Stack, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router";

import { signInWithGoogle } from "../../Providers/Firebase/config";

export default function GoogleLogin() {
  const navigate = useNavigate();
  // const location = useLocation();

  const signIn = async () => {
    await signInWithGoogle();

    navigate("/");
  };

  return (
    <Container size={"md"}>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 8 }}
        py={{ base: 20, md: 20 }}
      >
        <Title
          order={3}
        >
          Declaregame.in
        </Title>
        <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={signIn}>Google Login</Button>
      </Stack>
    </Container>
  );
}
