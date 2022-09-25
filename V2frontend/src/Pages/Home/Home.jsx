
import { AppShell, Header, Title } from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from "./Navbar";
import { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy'; 

function Home() {
  const Navigate = useNavigate();
  const authId = useStoreState((state) => state.authId);
  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/users/userStatus", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        response.json().then(json => {
          if (json.status == "LOBBY") {
            Navigate(`/waiting/${json.gameId}`)
          } else if (json.status == "GAME_ROOM") {
            Navigate(`/game/${json.gameId}`)
          }
        })
      };
    });
  }, [])
  
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
