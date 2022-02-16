import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import Card from './components/Card';

import {
  Content,
  useDownloadingContext,
  useDownloadingContextDispatch,
} from '../../contexts/DownloadingContext';
import { downloadResumablePhoto } from '../../helpers/resumableDownload';
import { NavigationProp } from '../../types/navigation';

import styles from './styles';
import {
  useDownloadedContext,
  useDownloadedContextDispatch,
} from '../../contexts/DownloadedContext';

const Download = ({ route }: NavigationProp<'Download'>) => {
  const { downloading } = useDownloadingContext();
  const { setDownloading } = useDownloadingContextDispatch();
  const { downloaded } = useDownloadedContext();
  const { setDownloaded } = useDownloadedContextDispatch();

  const [queueLength, setQueueLength] = useState(downloading.length - 6);

  const downloadProgressCallback = useCallback(
    (value: FileSystem.DownloadProgressData, index: number) => {
      const currentProgress =
        value.totalBytesWritten / value.totalBytesExpectedToWrite;

      if (currentProgress === 1) {
        setDownloaded((prev) => [
          ...prev,
          {
            ...downloading[index],
            downloadProgress: 1,
          },
        ]);
        setDownloading((prev) =>
          prev.filter((item) => item.id !== downloading[index].id)
        );
        setQueueLength(queueLength - 1);
      } else if (currentProgress % 0.25 === 0) {
        setDownloading((prev) => {
          prev[index] = {
            ...prev[index],
            downloadProgress: currentProgress,
          };
          return [...prev];
        });
      }
    },
    [setDownloading, setDownloaded]
  );

  useEffect(() => {
    downloading.map((item, index) => {
      if (index <= 5) {
        downloadResumablePhoto({
          fileName: item.id,
          downloadUrl: item.downloadUrl,
          downloadProgressCallback: (value) =>
            downloadProgressCallback(value, index),
        });
      }
    });
  }, []);

  useEffect(() => {
    if (queueLength >= 0) {
      downloading.map((item, index) => {
        if (item.downloadProgress === 0) {
          downloadResumablePhoto({
            fileName: item.id,
            downloadUrl: item.downloadUrl,
            downloadProgressCallback: (value) =>
              downloadProgressCallback(value, index),
          });
        }
      });
    }
  }, [queueLength]);

  const renderItem = ({
    item,
    drag,
    isActive,
    index = Number.MAX_SAFE_INTEGER,
  }: RenderItemParams<Content>) => {
    console.log('re-render');
    return (
      <ScaleDecorator>
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <Card
            imageSrc={item.url}
            description={item.description}
            progress={downloading[index].downloadProgress}
            status={index > 5 ? 'Pending' : 'Downloading'}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {downloaded.length > 0 && (
        <View style={styles.downloadContainer}>
          <Text style={styles.heading}>Downloaded</Text>
          <ScrollView>
            {downloaded.map((item, index) => (
              <Card
                key={index}
                imageSrc={item.url}
                description={item.description}
                progress={downloaded[index].downloadProgress}
                status="Downloaded"
              />
            ))}
          </ScrollView>
        </View>
      )}

      {downloading.length > 0 && (
        <View style={styles.downloadContainer}>
          <Text style={styles.heading}>Downloading</Text>
          <DraggableFlatList
            containerStyle={styles.flex}
            data={downloading}
            onDragEnd={({ data }) => setDownloading(data)}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Download;
