import React, { createContext, useContext, useState } from 'react';

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
  setDownloading: (content: Contents) => void;
};

const DownloadContext = createContext<Context>({
  downloading: [],
  setDownloading: () => {},
});

const useDownloadContext = () => {
  return useContext(DownloadContext);
};

const DownloadContextProvider: React.FC = ({ children }) => {
  const [downloading, setDownloading] = useState<Contents>([]);

  return (
    <DownloadContext.Provider value={{ downloading, setDownloading }}>
      {children}
    </DownloadContext.Provider>
  );
};

export { DownloadContextProvider, useDownloadContext };
