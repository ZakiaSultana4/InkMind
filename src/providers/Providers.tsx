// src/Providers/Providers.tsx
"use client"; // MUST be the very first line

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import { Provider } from 'react-redux'
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast";


const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        {children}
      </Provider>
    </SessionProvider>
  );
};

export default Providers;
