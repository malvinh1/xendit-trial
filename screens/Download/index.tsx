import React from 'react';
import { Text, View } from 'react-native';
import { NavigationProp } from '../../types/navigation';

import styles from './styles';

const Download = ({ route }: NavigationProp<'Download'>) => {
  return (
    <View style={styles.container}>
      <Text>This is Download Screen</Text>
    </View>
  );
};

export default Download;
