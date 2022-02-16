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

const ensureDirExists = async () => {
  const downloadDirectory = FileSystem.cacheDirectory + 'xendit-trial/';

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

export { ensureDirExists, saveFile };
