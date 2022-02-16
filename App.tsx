import { NavigationContainer } from '@react-navigation/native';
import { DownloadContextProvider } from './contexts/DownloadContext';

import RootStack from './screens';

export default function App() {
  return (
    <DownloadContextProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </DownloadContextProvider>
  );
}
