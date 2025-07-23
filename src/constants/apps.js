import MusicApp from '../components/apps/MusicPlayerApp';
import BrowserApp from '../components/apps/BrowserApp';

export const appList = [
  {
    id: 'music',
    name: 'Music Player',
    icon: '/icons/music-player.png',
    component: MusicApp,
    openable: true,
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: '/icons/browser.png',
    component: BrowserApp,
    openable: true,
  }

];
