import './globals.css';

export const metadata = {
  title: 'JunjieQu Portfolio',
  description: 'Portfolio styled like a Windows desktop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
