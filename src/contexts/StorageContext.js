import React, { createContext, useContext } from 'react';
import { useStorage } from '../hooks/useStorage';

const StorageContext = createContext({});

export function createStorageContext(key) {
  const Context = createContext({});

  function Provider({ children }) {
    const storage = useStorage(key);

    return (
      <Context.Provider value={storage}>
        {children}
      </Context.Provider>
    );
  }

  function useStorageContext() {
    const context = useContext(Context);
    
    if (!context) {
      throw new Error(`useStorageContext deve ser usado dentro de um Provider para a chave ${key}`);
    }
    
    return context;
  }

  return {
    Provider,
    useStorageContext
  };
} 