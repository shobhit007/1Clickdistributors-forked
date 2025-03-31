import { uploadMediaFileToDB } from "@/lib/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddImages = ({ type, close, previousData = { url: "asdh f" } }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hyperLink, setHyperLink] = useState("");
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("previous data", previousData);
    if (previousData) {
      setImagePreview(previousData.url || null);
      setHyperLink(previousData.hyperLink || "");
      setHeading(previousData.heading || "");
    }
  }, [previousData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedImage && !previousData?.url) {
        return toast.error("Please upload an image");
      }

      let body = {};

      setLoading(true);
      if (selectedImage) {
        let file = selectedImage;
        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        const storagePath = `lead_detail_images/${fileName}`;
        const uploadRes = await uploadMediaFileToDB(file, storagePath);
        if (uploadRes.success) {
          let { downloadURL } = uploadRes;
          body.url = downloadURL;
        } else {
          return toast.error("Could not upload file");
        }
      } else {
        body.url = previousData?.url;
      }

      if (previousData?.docId) {
        body.docId = previousData?.docId;
      }

      body.heading = heading;
      body.hyperLink = hyperLink;
      body.type = type;
      let token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/saveImageToShowInLeadPanel`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const ress = await response.json();
      if (ress.success) {
        toast.success(ress.message);
        queryClient.invalidateQueries(["leadpanelImages"]);
        close();
      } else {
        toast.error(ress.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-md object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            hyperlink
          </label>
          <input
            type="url"
            value={hyperLink}
            onChange={(e) => setHyperLink(e.target.value)}
            placeholder="Enter URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heading
          </label>
          <textarea
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Enter heading (max 20 words)"
            maxLength={100}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum 20 words allowed</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={close}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm disabled:animate-pulse font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImages;
