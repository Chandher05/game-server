
import { AppShell, Header, Title, MediaQuery, Burger, useMantineTheme } from '@mantine/core';
import { Outlet } from 'react-router-dom'
import Navbar from "./Navbar"
import { useState } from 'react';

function Home() {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar opened={opened} setOpened={setOpened}></Navbar>
      }
      header={
        <Header height={60} p="md" >
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Title order={4}>DeclareGame.in Admin</Title>
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Outlet />
    </AppShell>
  )
}

export default Home;
