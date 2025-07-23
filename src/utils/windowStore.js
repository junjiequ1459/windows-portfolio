// src/utils/windowStore.js
import { create } from 'zustand';
import { appList } from '../constants/apps';

const useWindowStore = create((set, get) => ({
  // State
  windows: [],
  isStartMenuOpen: false,
  nextZIndex: 10,
  selectedIcon: null,
  isShutdownScreenActive: false,

  // Start Menu Actions
  toggleStartMenu: () => {
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen }));
  },

  closeStartMenu: () => {
    set({ isStartMenuOpen: false });
  },

  openStartMenu: () => {
    set({ isStartMenuOpen: true });
  },

  // Z-Index Management
  nextZ: () => {
    const next = get().nextZIndex + 1;
    set({ nextZIndex: next });
    return next;
  },

  // Window Management Actions
  openWindow: (id) => {
    const app = appList.find((a) => a.id === id);
    if (!app) return;

    set((state) => {
      // Check if window already exists
      const existing = state.windows.find((w) => w.id === id);
      if (existing) {
        // If exists, restore and focus it
        return {
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, minimized: false, z: get().nextZ() } : w
          ),
          isStartMenuOpen: false, // Close start menu when opening window
        };
      }

      // Create new window
      return {
        windows: [
          ...state.windows,
          {
            id: app.id,
            title: app.name,
            icon: app.icon,
            component: app.component,
            minimized: false,
            maximized: false,
            z: get().nextZ(),
            size: { width: 700, height: 500 },
            position: { x: 120, y: 120 },
          },
        ],
        isStartMenuOpen: false, // Close start menu when opening window
      };
    });
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: false, maximized: false, z: get().nextZ() } : w
      ),
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, maximized: !w.maximized, minimized: false, z: get().nextZ() }
          : w
      ),
    })),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, z: get().nextZ() } : w
      ),
    })),

  updateWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    })),

  updateWindowSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    })),

  // Desktop Icon Selection
  selectIcon: (id) => set({ selectedIcon: id }),
  
  deselectIcon: () => set({ selectedIcon: null }),

  // Shutdown Screen Actions
  triggerShutdownScreen: () => 
    set({ 
      isShutdownScreenActive: true,
      isStartMenuOpen: false, // Close start menu when shutting down
    }),

  deactivateShutdownScreen: () => 
    set({ isShutdownScreenActive: false }),

  // Utility Actions
  closeAllWindows: () =>
    set({ windows: [] }),

  minimizeAllWindows: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimized: true }))
    })),

  // Get specific window
  getWindow: (id) => {
    const state = get();
    return state.windows.find((w) => w.id === id);
  },

  // Get active (non-minimized) windows
  getActiveWindows: () => {
    const state = get();
    return state.windows.filter((w) => !w.minimized);
  },

  // Get minimized windows
  getMinimizedWindows: () => {
    const state = get();
    return state.windows.filter((w) => w.minimized);
  },

  // Check if window exists
  windowExists: (id) => {
    const state = get();
    return state.windows.some((w) => w.id === id);
  },
}));

export default useWindowStore;