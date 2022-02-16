import React, { createContext, useCallback, useContext, useState } from 'react';

export type Content = {
  id: string;
  url: string;
  description: string;
  downloadUrl: string;
  downloadProgress: number;
};

export type Contents = Array<Content>;

type Context = {
  downloading: Contents;
  setDownloading: (content: React.SetStateAction<any[]>) => void;
};

const DownloadContext = createContext<Omit<Context, 'setDownloading'>>({
  downloading: [],
});

const DownloadContextDispatch = createContext<Omit<Context, 'downloading'>>({
  setDownloading: () => {},
});

const DownloadingContextProvider: React.FC = ({ children }) => {
  const [downloading, setDownloading] = useState<Contents>([]);

  const handleSetDownloading = useCallback(
    (value) => setDownloading(value),
    [downloading]
  );

  return (
    <DownloadContext.Provider value={{ downloading }}>
      <DownloadContextDispatch.Provider
        value={{ setDownloading: handleSetDownloading }}
      >
        {children}
      </DownloadContextDispatch.Provider>
    </DownloadContext.Provider>
  );
};

const useDownloadingContext = () => {
  return useContext(DownloadContext);
};

const useDownloadingContextDispatch = () => {
  return useContext(DownloadContextDispatch);
};

export {
  DownloadingContextProvider,
  useDownloadingContext,
  useDownloadingContextDispatch,
};
