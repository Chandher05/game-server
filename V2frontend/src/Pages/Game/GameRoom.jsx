import { useState, useEffect } from 'react';
import { Center, CopyButton, Stack, Tooltip, ActionIcon, Group, Title, Text, Button, Table, Menu, Grid } from "@mantine/core";
import { IconCheck, IconCopy, IconMessageCircle, IconClockHour4, IconBrandGoogleOne, IconWorld, IconSortAscending2, IconLayersLinked, IconX } from '@tabler/icons'
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { GetGameUpdates, LeaveGame } from '../../Providers/Socket/emitters'
import { CommonGameData } from '../../Providers/Socket/listeners'

function GameRoom() {
  let params = useParams()
  let GameCode = params.gameId;
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
          if (json.status == "NOT_PLAYING") {
            Navigate(`/`)
          } else if (json.status == "LOBBY") {
            Navigate(`/waiting/${json.gameId}`)
          } else if (json.status == "GAME_ROOM" && GameCode != json.gameId) {
            Navigate(`/game/${json.gameId}`)
          }
        })
      };
    });
    GetGameUpdates(GameCode)
  }, [])


  CommonGameData((status, data) => {
    if (status == "LEAVE_GAME") {
      Navigate(`/`)
    }
  })

  return (
    <div style={{ padding: '80px' }}>
      <Grid grow>
        <Grid.Col span={8}>
          <Text>This is game room</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button onClick={() => LeaveGame(GameCode)}>Leave game</Button>
        </Grid.Col>

        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          Table
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          Deck
        </Grid.Col>
        <Grid.Col span={4} style={{ minHeight: '200px' }}>
          Players
        </Grid.Col>

        <Grid.Col span={12}>
          Your Cards and Buttons
        </Grid.Col>
      </Grid>
    </div>
  )
}

export default GameRoom;