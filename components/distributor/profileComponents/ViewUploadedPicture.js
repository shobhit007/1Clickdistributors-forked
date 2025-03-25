import { fileToBlob } from "@/lib/commonFunctions";
import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const ViewUploadedPicture = ({ file, url, close }) => {
  console.log("file is in view", file, url);
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState(null);

  const findUrl = async () => {
    let response = URL.createObjectURL(file);
    if (response) {
      setFileURL(response);
    } else {
      setError("Error in showing image");
    }
  };

  useEffect(() => {
    if (file) {
      findUrl();
    } else if (url) {
      setFileURL(url);
    }
  }, [file, url]);

  console.log("file url is", fileURL);

  return (
    <div className="w-full max-h-[95vh] h-full bg-black flex justify-center items-center relative">
      <button
        onClick={() => {
          close && close();
        }}
        className="h-8 w-8 absolute top-2 right-2 bg-gray-600/20 rounded-full flex items-center justify-center"
      >
        <MdClose className="text-red-600 text-xl" />
      </button>
      {fileURL && (
        <img className="max-h-[95vh] w-auto object-contain" src={fileURL} />
      )}
    </div>
  );
};

export default ViewUploadedPicture;
