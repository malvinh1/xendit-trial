import React from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { useDownloadContext } from '../../contexts/DownloadContext';
import { NavigationProp } from '../../types/navigation';
import Card from './components/Card';

import styles from './styles';

const Download = ({ route }: NavigationProp<'Download'>) => {
  const { downloading } = useDownloadContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.heading}>Downloading</Text>

        {downloading?.map((item, index) => (
          <Card
            key={index}
            imageSrc={item.url}
            description={item.description}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Download;
