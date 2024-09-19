"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomizedLayout from "./customizedLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const queryClient = new QueryClient();

// export const metadata = {
//   title: "1clickdistributors",
//   description: "Internal tool for 1clickdistributors",
// };

export default function RootLayout({ children }) {
  // const [hydrated, setHydrated] = useState(false);

  // useEffect(() => {
  //   setHydrated(true);
  // }, []);

  // if (!hydrated) {
  //   return null; // You can also return a loading spinner here if desired
  // }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <CustomizedLayout>{children}</CustomizedLayout>
            <ToastContainer
              autoClose={3000}
              theme="light"
              closeOnClick
              pauseOnFocusLoss
              pauseOnHover
              position="top-right"
            />
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
