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
  downloaded: Contents;
  setDownloaded: (content: React.SetStateAction<any[]>) => void;
};

const DownloadedContext = createContext<Omit<Context, 'setDownloaded'>>({
  downloaded: [],
});

const DownloadedContextDispatch = createContext<Omit<Context, 'downloaded'>>({
  setDownloaded: () => {},
});

const DownloadedContextProvider: React.FC = ({ children }) => {
  const [downloaded, setDownloaded] = useState<Contents>([]);

  const handleSetDownloaded = useCallback(
    (value) => setDownloaded(value),
    [downloaded]
  );

  return (
    <DownloadedContext.Provider value={{ downloaded }}>
      <DownloadedContextDispatch.Provider
        value={{ setDownloaded: handleSetDownloaded }}
      >
        {children}
      </DownloadedContextDispatch.Provider>
    </DownloadedContext.Provider>
  );
};

const useDownloadedContext = () => {
  return useContext(DownloadedContext);
};

const useDownloadedContextDispatch = () => {
  return useContext(DownloadedContextDispatch);
};

export {
  DownloadedContextProvider,
  useDownloadedContext,
  useDownloadedContextDispatch,
};
