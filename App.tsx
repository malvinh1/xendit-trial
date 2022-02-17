import { NavigationContainer } from '@react-navigation/native';
import { DownloadingContextProvider } from './contexts/DownloadingContext';

import RootStack from './screens';

const App = () => {
  return (
    <DownloadingContextProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </DownloadingContextProvider>
  );
};

export default App;
