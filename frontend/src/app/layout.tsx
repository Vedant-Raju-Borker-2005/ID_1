import './globals.css';

export const metadata = {
  title: 'Interior Design Platform',
  description: 'AI-Based Modular Interior Design & Visualization Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-800 bg-gray-50/50">
        {children}
      </body>
    </html>
  );
}
