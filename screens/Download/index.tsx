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
import AsyncStorage from '@react-native-async-storage/async-storage';

import Card from './components/Card';

import {
  Content,
  useDownloadingContext,
  useDownloadingContextDispatch,
} from '../../contexts/DownloadingContext';
import { ensureDirExists, saveFile } from '../../helpers/resumableDownload';

import styles from './styles';
import {
  useDownloadedContext,
  useDownloadedContextDispatch,
} from '../../contexts/DownloadedContext';
import useFirstRender from '../../helpers/useFirstRender';

const Download = () => {
  const { downloading } = useDownloadingContext();
  const { setDownloading } = useDownloadingContextDispatch();
  const { downloaded } = useDownloadedContext();
  const { setDownloaded } = useDownloadedContextDispatch();
  const firstRender = useFirstRender();

  const [queueLength, setQueueLength] = useState(downloading.length - 6);
  const [shouldPause, setShouldpause] = useState(false);

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
    downloading.map(async (item, index) => {
      const downloadResumable = FileSystem.createDownloadResumable(
        item.downloadUrl,
        FileSystem.documentDirectory + item.id + '.jpg',
        {},
        (value) => downloadProgressCallback(value, index)
      );

      {
        if (index <= 5 && item.downloadProgress === 0) {
          try {
            ensureDirExists();
            const result = await downloadResumable.downloadAsync();
            if (result) {
              console.log('Finished downloading to ', result.uri);
              saveFile(result.uri);
            }
          } catch (e) {
            console.error(e);
          }

          if (shouldPause && index === 5) {
            try {
              console.log('paused');
              await downloadResumable.pauseAsync();
              setShouldpause(false);
              console.log(
                'Paused download operation, saving for future retrieval'
              );
              AsyncStorage.setItem(
                'pausedDownload',
                JSON.stringify(downloadResumable.savable())
              );
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (queueLength > 0 && !firstRender) {
      downloading.map(async (item, index) => {
        if (item.downloadProgress === 0) {
          const downloadResumable = FileSystem.createDownloadResumable(
            item.downloadUrl,
            FileSystem.documentDirectory + item.id + '.jpg',
            {},
            (value) => downloadProgressCallback(value, index)
          );
          try {
            ensureDirExists();
            const result = await downloadResumable.downloadAsync();
            if (result) {
              console.log('Finished downloading to ', result.uri);
              saveFile(result.uri);
            }
          } catch (e) {
            console.error(e);
          }
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
            onDragEnd={({ data, from, to }) => {
              data.map((item, index) => {
                const shouldPause =
                  item.id !== downloading[index].id &&
                  downloading.indexOf(item) > 5;
                if (shouldPause) {
                  console.log('called here');
                  setShouldpause(true);
                }
                setDownloading(data);
              });
            }}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Download;
