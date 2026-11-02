import React, { createContext, useContext, useState } from "react";

const AppLoaderContext = createContext({
  loaderDone: false,
  setLoaderDone: () => {},
  heroEntranceDone: false,
  setHeroEntranceDone: () => {},
});

export function AppLoaderProvider({ children }) {
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroEntranceDone, setHeroEntranceDone] = useState(false);
  return (
    <AppLoaderContext.Provider
      value={{ loaderDone, setLoaderDone, heroEntranceDone, setHeroEntranceDone }}
    >
      {children}
    </AppLoaderContext.Provider>
  );
}

export function useAppLoader() {
  const ctx = useContext(AppLoaderContext);
  return ctx;
}
