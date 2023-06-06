import Head from 'next/head';
import Navbar from './Navbar';
import { useTheme } from 'next-themes'

const Layout = ({ children }) => {
  const { theme } = useTheme()

  return (
    
    <div className="flex flex-col h-full min-h-screen">
      <Head>
        <title>Boggy Dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      
      <main className="flex-grow">{children}</main>
      <footer className="py-4 px-6 mt-auto">
        <div className="container mx-auto">
          <div className="text-center text-gray-600">
            &copy; {new Date().getFullYear()} boggy dev. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
