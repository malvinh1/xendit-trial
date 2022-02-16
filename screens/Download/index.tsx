import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';

import Card from './components/Card';

import { useDownloadContext } from '../../contexts/DownloadContext';
import { downloadResumablePhoto } from '../../helpers/resumableDownload';
import { NavigationProp } from '../../types/navigation';

import styles from './styles';

const Download = ({ route }: NavigationProp<'Download'>) => {
  const { downloading } = useDownloadContext();
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    downloadResumablePhoto({
      downloadUrl: downloading[0].downloadUrl,
      downloadProgressCallback,
    });
  }, [downloading]);

  const downloadProgressCallback = (
    downloadProgress: FileSystem.DownloadProgressData
  ) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.heading}>Downloading</Text>
        {downloading?.map((item, index) => (
          <Card
            key={index}
            imageSrc={item.url}
            description={item.description}
            progress={downloadProgress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Download;
