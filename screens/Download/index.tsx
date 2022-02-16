import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import DraggableFlatList, {
  RenderItem,
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import Card from './components/Card';

import { Content, useDownloadContext } from '../../contexts/DownloadContext';
import { downloadResumablePhoto } from '../../helpers/resumableDownload';
import { NavigationProp } from '../../types/navigation';

import styles from './styles';

const Download = ({ route }: NavigationProp<'Download'>) => {
  const { downloading, setDownloading } = useDownloadContext();
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    downloading.map((item) => {
      downloadResumablePhoto({
        fileName: item.id,
        downloadUrl: item.downloadUrl,
        downloadProgressCallback,
      });
    });

    // downloadResumablePhoto({
    //   fileName: downloading[0].id,
    //   downloadUrl: downloading[0].downloadUrl,
    //   downloadProgressCallback,
    // });
  }, [downloading]);

  const downloadProgressCallback = (
    downloadProgress: FileSystem.DownloadProgressData
  ) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };

  const renderItem = ({
    item,
    drag,
    isActive,
    index = Number.MAX_SAFE_INTEGER,
  }: RenderItemParams<{
    id: string;
    url: string;
    description: string;
    downloadUrl: string;
  }>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <Card
            imageSrc={item.url}
            description={item.description}
            progress={downloadProgress}
            status={index > 5 ? 'Pending' : 'Downloading'}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.downloadContainer}>
        <Text style={styles.heading}>Downloading</Text>
        <DraggableFlatList
          containerStyle={styles.flex}
          data={downloading}
          onDragEnd={({ data }) => setDownloading(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default Download;
