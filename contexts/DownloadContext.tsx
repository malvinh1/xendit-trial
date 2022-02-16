import React, { createContext, useContext, useState } from 'react';

type Content = Array<{ id: string; url: string; description: string }>;

type Context = {
  downloading: Content;
  setDownloading: (content: Content) => void;
};

const DownloadContext = createContext<Context>({
  downloading: [],
  setDownloading: () => {},
});

const useDownloadContext = () => {
  return useContext(DownloadContext);
};

const DownloadContextProvider: React.FC = ({ children }) => {
  const [downloading, setDownloading] = useState<Content>([]);

  return (
    <DownloadContext.Provider value={{ downloading, setDownloading }}>
      {children}
    </DownloadContext.Provider>
  );
};

export { DownloadContextProvider, useDownloadContext };
