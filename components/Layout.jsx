import React from 'react';
import Header from './Header';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => (
  <>
    <Header />
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <Head>
      <title>GraphBlog | NextJS | GraphQL</title>
      <meta name="description" content="A blog built using NEXTJS and GraphQL" />
    </Head>
    {children}
  </>
);

export default Layout;
