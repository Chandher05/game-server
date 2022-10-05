import { useState, useEffect } from 'react';
import { Stack, Title, Text, Button } from "@mantine/core";
import { useNavigate } from 'react-router-dom';

function Login({ handleAuth }) {
  const [adminPassword, setAdminPassword] = useState("");
  const Navigate = useNavigate();

  const loginAdminConsole = () => {
    if (adminPassword === import.meta.env.VITE_ADMIN_PASSWORD) {
      handleAuth(true);
      Navigate(`/admin/users`)
    }
  };


  return (
    <>
      <Stack>
      <Title order={1}><Text>Admin Login</Text></Title>
        <input onChange={(e) => setAdminPassword(e.target.value)} placeholder="*******" />
            <Button
              variant="solid"
              size="lg"
              w="full"
              colorScheme="teal"
              onClick={loginAdminConsole}
            >
              Login
            </Button>
      </Stack>
    </>
  );
}

export default Login;
