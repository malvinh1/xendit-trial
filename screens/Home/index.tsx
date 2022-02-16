import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';

import { NavigationProp } from '../../types/navigation';

import styles from './styles';

const Home = ({ navigation }: NavigationProp<'Home'>) => {
  const handleNavigateToDownloadScreen = () => {
    navigation.navigate('Download');
  };

  return (
    <View style={styles.container}>
      <Text>This is Home Screen</Text>

      <Button
        title="Download Screen"
        onPress={handleNavigateToDownloadScreen}
      />
    </View>
  );
};

export default Home;
