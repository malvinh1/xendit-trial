import { NavigationContainer } from '@react-navigation/native';
import { DownloadedContextProvider } from './contexts/DownloadedContext';
import { DownloadingContextProvider } from './contexts/DownloadingContext';

import RootStack from './screens';

export default function App() {
  return (
    <DownloadingContextProvider>
      <DownloadedContextProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </DownloadedContextProvider>
    </DownloadingContextProvider>
  );
}
