import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

import { DownloadingContextProvider } from './contexts/DownloadingContext';

import RootStack from './screens';

const App = () => {
  return (
    <DownloadingContextProvider>
      <NavigationContainer>
        <MenuProvider>
          <RootStack />
        </MenuProvider>
      </NavigationContainer>
    </DownloadingContextProvider>
  );
};

export default App;
