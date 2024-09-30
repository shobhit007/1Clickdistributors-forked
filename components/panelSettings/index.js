import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "/lib/firebase";
import { toast } from "react-toastify";
import TableColumns from "./tableColumns";

const index = () => {
  const [loginImage, setLoginImage] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    try {
      console.log("Uploading...");
      if (!file) return;
      console.log("Uploading... 2");

      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress); // Update progress state
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error during upload:", error);
        },
        () => {
          // On successful upload, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at:", downloadURL);
          });
        }
      );
    } catch (error) {
      console.log("Error during upload:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-auto p-3">
      <div className="flex flex-col gap-2 ">
        <span className="text-gray-600 text-lg underline font-semibold">
          1. Login cover picture
        </span>

        <img src="/loginbg.jpg" className="h-auto rounded w-[300px]" />
        <div className="flex gap-1 items-center">
          <span className="text-gray-500 font-semibold">Change image</span>
          <input
            type="file"
            className="text-sm ml-1 w-fit"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {file && (
            <button className="text-blue-500  underline" onClick={handleUpload}>
              Upload
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 w-full">
        <TableColumns />
      </div>
    </div>
  );
};

export default index;
