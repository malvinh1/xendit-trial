import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDownloadContext } from '../../contexts/DownloadContext';

import { NavigationProp } from '../../types/navigation';

import styles from './styles';

const Home = ({ navigation }: NavigationProp<'Home'>) => {
  const { downloading, setDownloading } = useDownloadContext();

  const [photos, setPhotos] = useState<
    Array<{ id: string; url: string; description: string }>
  >([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Download')}>
          <Text>Download</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    fetch(
      'https://api.unsplash.com/photos/?client_id=OGgW-yt6DR91IbY7pHO-EWY1F1j2BH0MdoCHeQGS_kI&per_page=18&order_by=popular'
    )
      .then((res) => res.json())
      .then((data: Array<any>) => {
        const unsplashImages = data.map((item) => ({
          id: item.id,
          url: item.urls.thumb,
          description: item.description || 'Winter in Portugal',
        }));
        setPhotos(unsplashImages);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={photos}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={`${item.id}-${index}`}
            style={styles.imageContainer}
            onPress={() => setDownloading([...downloading, item])}
          >
            <Image source={{ uri: item.url }} style={styles.image} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Home;
