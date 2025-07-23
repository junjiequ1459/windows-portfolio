import { create } from 'zustand';
import { appList } from '../constants/apps';

const useWindowStore = create((set, get) => ({
  // State
  windows: [],
  isStartMenuOpen: false,
  nextZIndex: 10,
  selectedIcon: null,
  isShutdownScreenActive: false,
  focusedWindow: null, // 🔥 Add this

  // Start Menu Actions
  toggleStartMenu: () => {
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen }));
  },
  closeStartMenu: () => set({ isStartMenuOpen: false }),
  openStartMenu: () => set({ isStartMenuOpen: true }),

  // Z-Index Management
  nextZ: () => {
    const next = get().nextZIndex + 1;
    set({ nextZIndex: next });
    return next;
  },

  // Window Actions
  openWindow: (id) => {
    const app = appList.find((a) => a.id === id);
    if (!app) return;

    set((state) => {
      const existing = state.windows.find((w) => w.id === id);
      if (existing) {
        return {
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, minimized: false, z: get().nextZ() } : w
          ),
          focusedWindow: id,
          isStartMenuOpen: false,
        };
      }

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
        focusedWindow: app.id,
        isStartMenuOpen: false,
      };
    });
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
      focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, minimized: false, maximized: false, z: get().nextZ() }
          : w
      ),
      focusedWindow: id,
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              maximized: !w.maximized,
              minimized: false,
              z: get().nextZ(),
            }
          : w
      ),
      focusedWindow: id,
    })),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, z: get().nextZ() } : w
      ),
      focusedWindow: id,
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

  selectIcon: (id) => set({ selectedIcon: id }),
  deselectIcon: () => set({ selectedIcon: null }),

  triggerShutdownScreen: () =>
    set({
      isShutdownScreenActive: true,
      isStartMenuOpen: false,
    }),
  deactivateShutdownScreen: () => set({ isShutdownScreenActive: false }),

  closeAllWindows: () => set({ windows: [], focusedWindow: null }),

  minimizeAllWindows: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimized: true })),
      focusedWindow: null,
    })),

  getWindow: (id) => get().windows.find((w) => w.id === id),
  getActiveWindows: () => get().windows.filter((w) => !w.minimized),
  getMinimizedWindows: () => get().windows.filter((w) => w.minimized),
  windowExists: (id) => get().windows.some((w) => w.id === id),
}));

export default useWindowStore;
