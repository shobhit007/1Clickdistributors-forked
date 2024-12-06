import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "/lib/firebase";
import { toast } from "react-toastify";
import TableColumns from "./tableColumns";
import { useQuery } from "@tanstack/react-query";

const index = () => {
  const [loginImage, setLoginImage] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingImage, setEditingImage] = useState(false);

  const getLoginPageImage = async () => {
    try {
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/getLoginPageImageLink`;
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        return data.link;
      } else {
        return null;
      }
    } catch (error) {
      toast.error("Error in getting image link");
    }
  };

  const { data: loginPageImage, refetch } = useQuery({
    queryKey: ["loginPageImage"],
    queryFn: getLoginPageImage,
  });

  const handleUpload = async () => {
    try {
      if (!file) {
        toast.error("No file selected");
        return;
      }

      // Reference to Firebase storage
      const storageRef = ref(storage, `loginImages/loginBg.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the upload progress
      setLoading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress); // Update progress state
        },
        (error) => {
          // Handle upload error
          console.error("Error during file upload:", error);
          toast.error("File upload failed: " + error.message);
          setLoading(false);
          return;
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Make POST request to API with the image URL
            const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/saveImageLinkForLoginPage`;
            const token = localStorage.getItem("authToken");
            const response = await fetch(API_URL, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageLink: downloadURL }),
            });

            // Handle API response
            const data = await response.json();
            setLoading(false);
            if (data.success) {
              toast.success(data.message || "Successfully uploaded image");
              refetch();
              setFile(null);
            } else {
              toast.error("Failed to fetch leads");
              console.log("Failed to fetch leads:", data.message);
              return null;
            }
          } catch (apiError) {
            setLoading(false);
            toast.error("Error uploading image:" + apiError.message);
          }
        }
      );
    } catch (error) {
      // General error handling
      setLoading(false);
      console.error("Error during upload process:", error);
      toast.error("Error during upload: " + error.message);
    }
  };

  console.log("editingImage", editingImage);

  return (
    <div className="w-full h-auto p-3">
      <div className="flex flex-col gap-2 ">
        <div className="flex flex-col">
          <span className="text-gray-600 text-lg underline font-semibold">
            1. Login cover picture
          </span>
          <span className="text-gray-600 text-sm">
            Note. upload image with 16:9 ratio full hd image roughly "1920px x
            1080px"
          </span>
        </div>

        <img src={loginPageImage} className="h-auto rounded w-[300px]" />
        <div className="flex gap-1 items-center">
          <span className="text-gray-500 font-semibold">Change image</span>

          {!editingImage ? (
            <>
              <button
                className="text-blue-500 ml-3 underline"
                onClick={() => setEditingImage(true)}
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                disabled={loading}
                className="text-blue-500 mx-2 underline"
                onClick={() => setEditingImage(false)}
              >
                Cancel
              </button>

              <input
                type="file"
                className="text-sm ml-1 w-fit"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file && (
                <button
                  disabled={loading}
                  className={`text-blue-500 underline ${
                    loading ? "animate-pulse" : ""
                  }`}
                  onClick={handleUpload}
                >
                  {loading ? "Uploading" : "Upload"}
                </button>
              )}
            </>
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
