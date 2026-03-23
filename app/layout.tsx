import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeuralSpace — Second Brain',
  description: 'Your AI-powered second brain for finance, research, and deep work',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
