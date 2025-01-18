import React, { createContext, useContext, useState } from 'react';

interface PreviewVideoContextProps {
    isPreview: boolean;
    setIsPreview: (isBack: boolean) => void;
    videoUri?: string;
    setVideoUri: (uri: string) => void;
    isRewatch: boolean,
    setIsRewatch : (isRewatch: boolean) => void;
  }

  const defaultValue: PreviewVideoContextProps = {
    isPreview: false,
    setIsPreview: (isBack: boolean) => {},
    videoUri : "",
    setVideoUri: (string)  => {},
    isRewatch : false,
    setIsRewatch : (isBack: boolean) => {}

  };
  
  const PreviewContext = createContext<PreviewVideoContextProps>(defaultValue);


export const PreviewVideoProvider = ({ children }: {
    children: React.ReactNode
  }) =>  {
    const [isPreview, setIsPreview] = useState(false);
    const [videoUri, setVideoUri] = useState("");
    const [isRewatch, setIsRewatch] = useState(false);

    return (
        <PreviewContext.Provider
            value={{
              isPreview,
              setIsPreview,
              videoUri,
              setVideoUri,
              isRewatch,
              setIsRewatch
            }}>
            {children}
        </PreviewContext.Provider>
    );
}

// Custom hook for consuming the context
export const usePreviewContext = () => useContext(PreviewContext);