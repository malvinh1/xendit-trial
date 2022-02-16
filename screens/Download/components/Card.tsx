import React from 'react';
import { View, Text, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import styles from './styles';

type Props = {
  imageSrc: string;
  description: string;
};

const Card = ({ imageSrc, description }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageSrc }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.imageTitle}>{description}</Text>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Downloaded</Text>
        </View>
        <ProgressBar
          style={styles.progressBar}
          progress={0.5}
          color={'#ff8137'}
        />
      </View>
    </View>
  );
};

export default Card;
