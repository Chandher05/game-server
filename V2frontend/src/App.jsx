import { MantineProvider, Text } from '@mantine/core';

import PageRoutes from "./Providers/Routes";
import { useStoreRehydrated, StoreProvider } from "easy-peasy";
import { store } from './Providers/Store';
import { Loader } from "@mantine/core";
import socket from './Providers/Socket/index'

function WaitForStateRehydration({ children }) {
  const isRehydrated = useStoreRehydrated();
  return isRehydrated
    ? children
    : (
      <Loader variant='bars' ></Loader>
    );
}

function App() {
  return (
    <div >
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        <StoreProvider store={store}>
          <WaitForStateRehydration>
            <PageRoutes></PageRoutes>
          </WaitForStateRehydration>
        </StoreProvider>
      </MantineProvider>
    </div>
  );
}

export default App;
