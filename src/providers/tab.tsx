"use client";
import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { type TabStore, createTabStore, initTabStore } from "@/stores/tabs";

type TabStoreApi = ReturnType<typeof createTabStore>;

const TabStoreContext = createContext<TabStoreApi | null>(null);

interface TabProviderProps {
  children: React.ReactNode;
}

const TabStoreProvider = ({ children }: TabProviderProps) => {
  // @ts-expect-error - This is a hack to avoid creating a new store on each render
  const storeRef = useRef<TabStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createTabStore(initTabStore());
  }

  return (
    <TabStoreContext.Provider value={storeRef.current}>
      {children}
    </TabStoreContext.Provider>
  );
};

const useTabStore = <T,>(selector: (store: TabStore) => T): T => {
  const tabStoreContext = useContext(TabStoreContext);

  if (!tabStoreContext) {
    throw new Error("useTabStore must be used within a TabStoreProvider");
  }

  return useStore(tabStoreContext, selector);
};

export { TabStoreProvider, useTabStore };
