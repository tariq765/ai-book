import React from 'react';
import ChatBot from '../components/ChatBot/ChatBot';

// Docusaurus Root theme wrapper — wraps every page
export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <ChatBot />
    </>
  );
}
