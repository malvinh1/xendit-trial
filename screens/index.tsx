import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import Download from './Download';

import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: 'Images',
          headerRight: () => <Text onPress={() => {}}>TEST</Text>,
        }}
      />
      <Stack.Screen name="Download" component={Download} />
    </Stack.Navigator>
  );
};

export default RootStack;
