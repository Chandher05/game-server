
import { AppShell, Navbar, Header, Title } from '@mantine/core';

function Home() {
  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 300 }} height={"100%"} p="xs">{/* Navbar content */}</Navbar>}
      header={<Header height={60} p="md" >
        <Title order={4}>DeclareGame.in</Title>
      </Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {/* Your application here */}
    </AppShell>
  )
}

export default Home;
