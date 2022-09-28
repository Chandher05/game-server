import { Offline } from "react-detect-offline";
import { Divider } from '@mantine/core';
import socket from '../../Providers/Socket/index';
import { useState } from 'react';

export default function OfflineDetector() {

  const [socketConnected, setSocketConnected] = useState(true);

  setInterval(() => {
    setSocketConnected(socket.connected)
  }, 1000);

  return (
    <>
      <Offline><Divider my="xs" label="You are offline!" color={'red'} labelPosition="center" /></Offline>
      {socketConnected? "":<Divider my="xs" label="Please refresh to connect to server" color={'red'} labelPosition="center" />}
    </>
  );
}