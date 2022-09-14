
import { AppShell, Header, Title } from '@mantine/core';
import { Outlet } from 'react-router-dom'
import Navbar from "./Navbar"

function Home() {
  return (
    <AppShell
      padding="md"
      navbar={<Navbar ></Navbar>
      }
      header={<Header height={60} p="md" >
        <Title order={4}>DeclareGame.in</Title>
      </Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Outlet />
    </AppShell>
  )
}

export default Home;
