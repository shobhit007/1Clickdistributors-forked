import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "/lib/firebase";
import { toast } from "react-toastify";
import TableColumns from "./tableColumns";
import { useQuery } from "@tanstack/react-query";
import Modal from "../utills/Modal";
import { MdClose, MdDelete, MdEdit } from "react-icons/md";
import AddImages from "./addImages";
import useModal from "../hooks/useModal";
import AnimatedModal from "../utills/AnimatedModal";
import ConfirmationModal from "../uiCompoents/ConfirmationModal";

const index = () => {
  const [loginImage, setLoginImage] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [showAddNewImageModal, setShowAddNewImageModal] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const { open, close, modalOpen } = useModal();
  const [deltetingItem, setDeletingItem] = useState(false);

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

  const getImagesForPanel = async () => {
    try {
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/getLeadPanelImages`;
      let token = localStorage.getItem("authToken");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { data: allImages, refetch: refetchImage } = useQuery({
    queryKey: ["leadpanelImages"],
    queryFn: getImagesForPanel,
  });

  const handleDeleteItem = async () => {
    try {
      setDeletingItem(true);
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/deleteImageFromLeadPanel/${selectedItemToDelete.docId}`;
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Item deleted successfully");
        refetchImage();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error("Error deleting product");
    } finally {
      setDeletingItem(false);
    }
  };

  return (
    <div className="w-full h-auto p-3">
      {showAddNewImageModal && (
        <Modal>
          <div className="min-w-[45vw] min-h-[60vh] bg-white relative rounded-md">
            <button
              onClick={() => setShowAddNewImageModal(false)}
              className="absolute top-0 right-0 p-2 bg-red-500"
            >
              <MdClose className="text-white text-xl" />
            </button>
            <AddImages
              type={showAddNewImageModal?.type}
              previousData={showAddNewImageModal}
              close={() => setShowAddNewImageModal(false)}
            />
          </div>
        </Modal>
      )}

      <AnimatedModal close={close} open={open} modalOpen={modalOpen}>
        <ConfirmationModal
          heading="Are you sure?"
          subHeading={`You really want to delete this image?\nThis cannot be undone later.`}
          confirmationText="Yes, delete"
          cancelText="Not now"
          onConfirm={() => {
            if (selectedItemToDelete) {
              handleDeleteItem();
              close();
            }
          }}
          onCancel={() => close()}
          loading={deltetingItem}
        />
      </AnimatedModal>

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

      <div className="flex flex-col mt-3">
        <span className="text-gray-600 text-lg underline font-semibold">
          3. Pictures to show in manufacturer panel
        </span>
        <div className="flex items-center gap-2 my-2">
          <button
            onClick={() =>
              setShowAddNewImageModal({
                type: "manufacturer",
              })
            }
            className="text-white bg-blue-500 p-2 rounded"
          >
            Add image
          </button>
          <button
            onClick={() => refetchImage()}
            className="text-white bg-blue-500 p-2 rounded"
          >
            Refetch Images
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
          {allImages
            ?.filter((item) => item.type == "manufacturer")
            ?.map((item, index) => (
              <div
                key={index}
                className="border rounded-md shadow-md flex flex-col"
              >
                <img
                  src={item.url}
                  alt={item.heading}
                  className="h-auto rounded w-full max-h-[150px] object-cover"
                />
                <div className="p-2 flex flex-col">
                  <span className="text-gray-800 capitalize font-semibold text-xl">
                    {item.heading}
                  </span>
                  <a
                    href={item.hyperLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm underline -mt-1"
                  >
                    Hyperlink
                  </a>
                  <div className="flex gap-2 mt-1">
                    <MdEdit
                      onClick={() => setShowAddNewImageModal(item)}
                      className="text-base text-blue-500 cursor-pointer"
                    />
                    <MdDelete
                      onClick={() => {
                        setSelectedItemToDelete(item);
                        open();
                      }}
                      className="text-red-500 text-base cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <span className="text-gray-600 text-lg underline font-semibold">
          4. Pictures to show in Distributor panel
        </span>
        <div className="flex items-center gap-2 my-2">
          <button
            onClick={() =>
              setShowAddNewImageModal({
                type: "distributor",
              })
            }
            className="text-white bg-blue-500 p-2 rounded"
          >
            Add image
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
          {allImages
            ?.filter((item) => item.type == "distributor")
            ?.map((item, index) => (
              <div
                key={index}
                className="border rounded-md shadow-md flex flex-col"
              >
                <img
                  src={item.url}
                  alt={item.heading}
                  className="h-auto rounded w-full max-h-[150px] object-cover"
                />
                <div className="p-2 flex flex-col">
                  <span className="text-gray-800 capitalize font-semibold text-xl">
                    {item.heading}
                  </span>
                  <a
                    href={item.hyperLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm underline -mt-1"
                  >
                    Hyperlink
                  </a>
                  <div className="flex gap-2 mt-1">
                    <MdEdit
                      onClick={() => setShowAddNewImageModal(item)}
                      className="text-base text-blue-500 cursor-pointer"
                    />
                    <MdDelete
                      onClick={() => {
                        setSelectedItemToDelete(item);
                        open();
                      }}
                      className="text-red-500 text-base cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default index;
