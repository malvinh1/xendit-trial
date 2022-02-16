import React from 'react';
import { View, Text, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import styles from './styles';

type Props = {
  imageSrc: string;
  description: string;
  progress: number;
  status: 'Downloading' | 'Pending' | 'Downloaded';
};

const Card = ({ imageSrc, description, progress, status }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageSrc }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.imageTitle}>{description}</Text>
        <View
          style={[
            styles.labelContainer,
            status === 'Downloaded' || status === 'Downloading'
              ? { backgroundColor: '#ff8137' }
              : { backgroundColor: '#7f7d7c' },
          ]}
        >
          <Text style={styles.labelText}>{status}</Text>
        </View>
        <ProgressBar
          style={styles.progressBar}
          progress={progress}
          color={'#ff8137'}
        />
      </View>
    </View>
  );
};

export default Card;
