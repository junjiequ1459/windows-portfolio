import MusicApp from '../components/apps/MusicPlayerApp';
import BrowserApp from '../components/apps/BrowserApp';
import ChatGPTApp from '../components/apps/ChatGPTApp'; // ✅

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
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/icons/chatgpt.png',
    component: ChatGPTApp,
    openable: true,
  },
];
