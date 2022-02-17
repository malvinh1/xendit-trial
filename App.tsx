import { NavigationContainer } from '@react-navigation/native';
import { DownloadedContextProvider } from './contexts/DownloadedContext';
import { DownloadingContextProvider } from './contexts/DownloadingContext';

import RootStack from './screens';

const App = () => {
  return (
    <DownloadingContextProvider>
      <DownloadedContextProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </DownloadedContextProvider>
    </DownloadingContextProvider>
  );
};

export default App;
