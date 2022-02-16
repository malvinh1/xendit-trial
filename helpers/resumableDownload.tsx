import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

type Props = {
  fileName: string;
  downloadUrl: string;
  downloadProgressCallback: (
    downloadProgress: FileSystem.DownloadProgressData
  ) => void;
};

const downloadResumablePhoto = ({
  fileName,
  downloadUrl,
  downloadProgressCallback,
}: Props) => {
  const downloadDirectory = FileSystem.cacheDirectory + 'xendit-trial/';

  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(downloadDirectory);
    if (!dirInfo.exists) {
      console.log("Directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(downloadDirectory, {
        intermediates: true,
      });
    }
  };

  const saveFile = async (fileUri: string) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(fileUri);
    }
  };

  const downloadResumable = FileSystem.createDownloadResumable(
    downloadUrl,
    FileSystem.documentDirectory + fileName + '.jpg',
    {},
    downloadProgressCallback
  );

  try {
    ensureDirExists();

    downloadResumable.downloadAsync().then((result) => {
      if (result) {
        console.log('Finished downloading to ', result.uri);
        saveFile(result.uri);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export { downloadResumablePhoto };
