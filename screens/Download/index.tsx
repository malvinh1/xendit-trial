import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Card from './components/Card';

import {
  Content,
  Contents,
  useDownloadingContext,
  useDownloadingContextDispatch,
} from '../../contexts/DownloadingContext';
import { ensureDirExists, saveFile } from '../../helpers/resumableDownload';
import useFirstRender from '../../helpers/useFirstRender';
import { NavigationProp } from '../../types/navigation';

import styles from './styles';

const Download = ({ navigation }: NavigationProp<'Download'>) => {
  const { downloading } = useDownloadingContext();
  const { setDownloading } = useDownloadingContextDispatch();
  const firstRender = useFirstRender();

  const [lastIndex, setLastIndex] = useState(
    downloading.length - 1 > 5 ? 5 : downloading.length - 1
  );
  const [currentCapacity, setCurrentCapacity] = useState(
    downloading.length > 6 ? 6 : downloading.length
  );

  const [saveResult, setSaveResult] = useState<Array<string>>([]);

  const downloadProgressCallback = useCallback(
    (value: FileSystem.DownloadProgressData, index: number) => {
      const currentProgress =
        value.totalBytesWritten / value.totalBytesExpectedToWrite;

      if (currentProgress % 0.25 === 0) {
        setDownloading((prev) => {
          prev[index] = {
            ...prev[index],
            downloadProgress: currentProgress,
          };
          return [...prev];
        });
      }

      if (currentProgress === 1 && lastIndex < downloading.length - 1) {
        setCurrentCapacity((prev) => prev - 1);
        setDownloading((prev) => {
          prev[index] = {
            ...prev[index],
            downloadProgress: currentProgress,
          };
          return [...prev];
        });
      }
    },
    [setDownloading]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.saveAllButton}
          onPress={async () => {
            const endResult = [...new Set(saveResult)];
            const promise = endResult.map((value) => saveFile(value));
            await Promise.all(promise);
            Alert.alert('Success!');
          }}
        >
          <Text>Save All</Text>
        </TouchableOpacity>
      ),
    });
  });

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
          setDownloading((prev) => {
            prev[index] = {
              ...prev[index],
              downloadProgress: 0.0000000001,
              downloadResumable,
            };
            return [...prev];
          });

          try {
            ensureDirExists();
            const result = await downloadResumable.downloadAsync();
            if (result) {
              console.log('Finished downloading to ', result.uri);
              if (!saveResult.includes(result.uri)) {
                setSaveResult((prev) => [...prev, result.uri]);
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (
      !firstRender &&
      currentCapacity < 6 &&
      lastIndex < downloading.length - 1
    ) {
      const newIndex = lastIndex + 1;

      const tempArr = new Array(6 - currentCapacity).fill(0);

      tempArr.map(async () => {
        setDownloading((prev) => {
          prev[newIndex] = {
            ...prev[newIndex],
            downloadProgress: 0.0000000001,
            downloadResumable,
          };
          return [...prev];
        });

        const downloadResumable = FileSystem.createDownloadResumable(
          downloading[newIndex].downloadUrl,
          FileSystem.documentDirectory + downloading[newIndex].id + '.jpg',
          {},
          (value) => downloadProgressCallback(value, newIndex)
        );
        setLastIndex(newIndex);

        try {
          ensureDirExists();
          const result = await downloadResumable.downloadAsync();
          if (result) {
            console.log('Finished downloading to ', result.uri);
            if (!saveResult.includes(result.uri)) {
              setSaveResult((prev) => [...prev, result.uri]);
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [currentCapacity]);

  const onDragEnd = async ({
    data,
    from,
    to,
  }: {
    data: Contents;
    from: number;
    to: number;
  }) => {
    if (
      from > lastIndex &&
      to < lastIndex &&
      downloading[from].downloadProgress === 0
    ) {
      // pause downloading
      downloading[from].downloadResumable?.pauseAsync();
      console.log('Paused download operation, saving for future retrieval');
      AsyncStorage.setItem(
        'pausedDownload',
        JSON.stringify(downloading[from].downloadResumable?.savable())
      );

      // start new downloading progress
      const downloadResumable = FileSystem.createDownloadResumable(
        data[to].downloadUrl,
        FileSystem.documentDirectory + data[to].id + '.jpg',
        {},
        (value) => downloadProgressCallback(value, to)
      );

      data[to] = {
        ...data[to],
        downloadProgress: 0.0000000001,
        downloadResumable,
      };

      setDownloading(data);

      try {
        ensureDirExists();
        const result = await downloadResumable.downloadAsync();
        if (result) {
          console.log('Finished downloading to ', result.uri);

          if (!saveResult.includes(result.uri)) {
            setSaveResult((prev) => [...prev, result.uri]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    setDownloading(data);
  };

  const renderItem = ({
    item,
    drag,
    isActive,
    index = Number.MAX_SAFE_INTEGER,
  }: RenderItemParams<Content>) => {
    const status =
      item.downloadProgress === 1
        ? 'Downloaded'
        : item.downloadProgress === 0
        ? 'Pending'
        : 'Downloading';

    return (
      <ScaleDecorator>
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <Card
            imageSrc={item.url}
            description={item.description}
            progress={item.downloadProgress}
            status={status}
            disabledDownload={item.downloadProgress !== 1 ? true : false}
            onPressMenu={async () => {
              const arr = saveResult.filter(
                (value) =>
                  value.substring(value.lastIndexOf('/') + 1) ===
                  item.id + '.jpg'
              );

              if (arr.length > 0) {
                await saveFile(arr[0]);
                Alert.alert('Success!');
              }
            }}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DraggableFlatList
        containerStyle={styles.flex}
        data={downloading}
        onDragEnd={onDragEnd}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Download;
