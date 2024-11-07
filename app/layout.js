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
import { useSelector } from "react-redux";
import { authSelector } from "@/store/auth/selector";
import React, { useEffect, useState } from "react";
import Modal from "@/components/utills/Modal";
import { IoWarningOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLogoutPopup } from "@/store/auth/authReducer";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // global staleTime
      refetchOnWindowFocus: false, // global refetchOnWindowFocus
      retry: false, // global retry option
    },
  },
});

// export const metadata = {
//   title: "1clickdistributors",
//   description: "Internal tool for 1clickdistributors",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App>{children}</App>
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

const App = ({ children }) => {
  const state = useSelector(authSelector);
  const [visible, setVisible] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.logoutPopup) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [state]);

  const navigateLogin = () => {
    dispatch(setLogoutPopup(false));
    router.push("/login");
  };

  return (
    <React.Fragment>
      <CustomizedLayout>{children}</CustomizedLayout>;
      {visible && (
        <Modal>
          <div className="bg-white rounded-md shadow-sm p-8">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-warning-200 text-warning-500">
                <IoWarningOutline size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {state.authenticationError || "You have been logged out"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Please log in again to continue using this CRM.
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={navigateLogin}
                className="border border-gray-400 rounded-3xl px-4 py-2 text-sm text-gray-800"
              >
                Log In
              </button>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};
