import { MantineProvider, Text } from '@mantine/core';

import PageRoutes from "./Providers/Routes";
import { useStoreRehydrated, StoreProvider } from "easy-peasy";
import { store } from './Providers/Store';
import { Loader } from "@mantine/core";
import { NotificationsProvider } from '@mantine/notifications';
import OfflineDetector from '../src/Pages/Login/OfflineDetector'

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
        <NotificationsProvider>
          <StoreProvider store={store}>
            <WaitForStateRehydration>
              <OfflineDetector />
              <PageRoutes></PageRoutes>
            </WaitForStateRehydration>
          </StoreProvider>
        </NotificationsProvider>
      </MantineProvider>
    </div>
  );
}

export default App;
