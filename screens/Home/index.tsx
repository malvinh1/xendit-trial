import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  Contents,
  useDownloadingContext,
  useDownloadingContextDispatch,
} from '../../contexts/DownloadingContext';
import { NavigationProp } from '../../types/navigation';

import styles from './styles';

const Home = ({ navigation }: NavigationProp<'Home'>) => {
  const { downloading } = useDownloadingContext();
  const { setDownloading } = useDownloadingContextDispatch();

  const [photos, setPhotos] = useState<Contents>([]);

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
          downloadUrl: item.links.download,
          downloadProgress: 0,
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
            onPress={() => {
              if (!downloading.includes(item)) {
                setDownloading([...downloading, item]);
              }
            }}
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
