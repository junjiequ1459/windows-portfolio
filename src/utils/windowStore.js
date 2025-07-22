// src/utils/windowStore.js
import { create } from 'zustand';

let id = 0;

const useWindowStore = create((set) => ({
  windows: [],
  openWindow: (type) =>
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id: id++,
          type,
          position: { x: 100 + id * 10, y: 100 + id * 10 },
        },
      ],
    })),
  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((win) => win.id !== id),
    })),
}));

export default useWindowStore;