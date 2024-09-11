import { Dialog } from "@headlessui/react";
import { useEffect } from "react";
export default function Modal({ children }) {
  useEffect(() => {
    // Disable background scrolling
    document.body.style.overflow = "hidden";

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <Dialog
        open={true}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => {}}
        __demoMode
      >
        <div className="fixed inset-0 z-10  bg-black/60 h-[100vh] w-[100vw] flex items-center justify-center">
          {children}
        </div>
      </Dialog>
    </>
  );
}
