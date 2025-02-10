import { createStore } from "zustand/vanilla";

type TabState = {
  tab: "devices" | "details";
  ip?: string;
  counter: number;
};

type TabActions = {
  setTab: (tab: TabState["tab"]) => void;
  setDeviceIp: (ip: string | undefined) => void;
  setCounter: (counter: number) => void;
};

type TabStore = TabState & TabActions;

const initTabStore = (): TabState => {
  return { tab: "devices", ip: undefined, counter: 0 };
};

const defaultInitState: TabState = {
  tab: "devices",
  ip: undefined,
  counter: 0,
};

const createTabStore = (initState: TabState = defaultInitState) => {
  return createStore<TabStore>()((set) => ({
    ...initState,
    setTab: (tab) => set({ tab }),
    setDeviceIp: (ip) => set({ ip }),
    setCounter: (counter) => set({ counter }),
  }));
};

export {
  type TabState,
  type TabActions,
  type TabStore,
  createTabStore,
  initTabStore,
};
