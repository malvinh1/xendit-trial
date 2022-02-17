import React from 'react';
import { View, Text, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type Props = {
  imageSrc: string;
  description: string;
  progress: number;
  status: 'Downloading' | 'Pending' | 'Downloaded';
  disabledDownload?: boolean;
  onPressMenu?: () => void;
};

const Card = ({
  imageSrc,
  description,
  progress,
  status,
  disabledDownload = true,
  onPressMenu = () => {},
}: Props) => {
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
      <Menu
        onSelect={(value) => {
          if (value === 1) {
            onPressMenu();
          }
        }}
      >
        <MenuTrigger>
          <Ionicons name="ellipsis-vertical-sharp" size={24} color="black" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption value={1} text="Save" disabled={disabledDownload} />
          <MenuOption value={2}>
            <Text style={{ color: 'red' }}>Close</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default Card;
