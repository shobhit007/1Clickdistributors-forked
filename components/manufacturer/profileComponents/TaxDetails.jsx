import useModal from "@/components/hooks/useModal";
import AnimatedModal from "@/components/utills/AnimatedModal";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MdClose, MdOutlineVerified } from "react-icons/md";
import ViewUploadedPicture from "./ViewUploadedPicture";
import manufacturerContext from "@/lib/context/manufacturerContext";
import { toast } from "react-toastify";
import { uploadMediaFileToDB } from "@/lib/commonFunctions";
import { useQueryClient } from "@tanstack/react-query";

const TaxDetails = ({ showFilePreview }) => {
  const queryClient = useQueryClient();
  const [fileToShow, setFileToShow] = useState(null);
  const { open, close, modalOpen } = useModal();
  const { userDetails } = useContext(manufacturerContext);
  const inputFileRef = useRef({});
  const [loading, setLoading] = useState(false);
  const [taxDetails, setTaxDetails] = useState({
    gst: {
      number: null,
      image: null,
    },
    pan: {
      number: "",
      image: null,
    },
    tan: {
      number: null,
      image: null,
    },
  });

  useEffect(() => {
    if (userDetails.taxDetails) {
      setTaxDetails(userDetails.taxDetails);
    }
  }, [userDetails]);

  const images = {
    gst: "/gst.png",
    pan: "/pan.png",
    tan: "/tan.png",
  };

  const onChangeFile = (file, type) => {
    let tempURL = URL.createObjectURL(file);
    setTaxDetails((pre) => ({
      ...pre,
      [type]: { ...pre[type], tempURL, file },
    }));

    inputFileRef.current[type].value = null;
  };

  const cancelUpload = (type) => {
    setTaxDetails((pre) => ({
      ...pre,
      [type]: userDetails?.taxDetails?.[type] || { image: null, number: null },
    }));
    inputFileRef.current[type].value = null;
  };

  // console.log("taxDetails", taxDetails);

  const saveTaxDetails = async (type) => {
    try {
      if (!taxDetails[type]["image"] && !taxDetails[type]["file"]) {
        toast.error("Please upload a valid document.");
        return;
      }

      if (!taxDetails[type]["number"]) {
        return toast.error(`Please enter a valid ${type} number.`);
      }
      setLoading(true);
      const taxDetailsCopy = { ...taxDetails };
      let obj = taxDetails[type];
      if (obj["file"]) {
        const fileExtension = obj["file"]?.name.split(".").pop();
        const storagePath = `tax_details/${userDetails?.docId}/${type}.${fileExtension}`;
        const uploadRes = await uploadMediaFileToDB(obj["file"], storagePath);
        if (uploadRes.success) {
          let { downloadURL } = uploadRes;

          obj.image = downloadURL;
          delete obj.file;
          delete obj.tempURL;
          taxDetailsCopy[type] = obj;
        } else {
          return toast.error("Could not upload file");
        }
      }

      let finalData = {};
      Object.entries(taxDetailsCopy || {}).forEach(([key, value]) => {
        delete value.tempURL;
        delete value.file;
        finalData[key] = { ...value };
      });

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUserProfile`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taxDetails: finalData }),
      });
      const ress = await response.json();
      if (ress.success) {
        toast.success(ress.message);
        queryClient.invalidateQueries(["currentUserDetail"]);
      } else {
        toast.error(ress.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error in saveTaxDetails", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center w-full bg-white rounded-md py-3 px-2">
      <AnimatedModal
        onClose={() => {
          setFileToShow(null);
          close();
        }}
        open={open}
        close={close}
        modalOpen={modalOpen}
      >
        <div className="flex bg-white h-[80vh] max-w-[90vw]  relative">
          <button
            onClick={() => {
              setFileToShow(null);
              close();
            }}
            className="h-8 w-8 absolute top-2 right-2 bg-gray-600/20 rounded-full flex items-center justify-center"
          >
            <MdClose className="text-red-600 text-xl" />
          </button>
          <ViewUploadedPicture {...fileToShow} />
        </div>
      </AnimatedModal>

      <div className="grid w-full grid-cols-3 gap-4 h-[230px] relative">
        {loading && (
          <img
            src="/loader.gif"
            className="mx-auto absolute -top-12 left-[50%] h-8 w-8 "
          />
        )}
        {Object.entries(taxDetails || {}).map(([key, value]) => {
          return (
            <div
              key={key}
              className="w-full flex h-full flex-col rounded-md overflow-hidden border border-gray-200"
            >
              <div className="h-[70%] bg-gray-400/20 w-full flex items-center justify-center">
                {value.image || value?.tempURL ? (
                  <img
                    src={value?.tempURL || value.image}
                    className="max-h-[90%] w-auto object-contain"
                    onClick={() =>
                      showFilePreview({ url: value.tempURL || value.image })
                    }
                  />
                ) : (
                  <img
                    src={images[key]}
                    className="max-h-[60%] w-auto object-contain"
                  />
                )}
              </div>

              <div className="w-full flex flex-col items-start h-[30%] pb-1 justify-between ">
                <input
                  className="text-gray-600 py-1 px-2 w-full border-b border-gray-300"
                  placeholder={`Enter your ${key} number`}
                  value={taxDetails[key]?.number || ""}
                  onChange={(e) =>
                    setTaxDetails((pre) => ({
                      ...pre,
                      [key]: { ...pre[key], number: e.target.value },
                    }))
                  }
                />

                <div className="flex items-center gap-2 mt-1 px-2">
                  <button
                    disabled={
                      (!taxDetails[key].image && !taxDetails[key].file) ||
                      loading
                    }
                    onClick={() => saveTaxDetails(key)}
                    className="py-1 px-3 rounded bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-xs outline-none text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => cancelUpload(key)}
                    className="py-1 px-3 rounded bg-blue-500 text-xs outline-none text-white"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => inputFileRef.current[key].click()}
                    className="py-1 px-3 rounded bg-blue-500 text-xs outline-none text-white"
                  >
                    Change/upload
                  </button>
                  <input
                    type="file"
                    ref={(el) => (inputFileRef.current[key] = el)}
                    className="hidden"
                    onChange={(e) => onChangeFile(e.target.files[0], key)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaxDetails;

{
  /* <img
              className="h-[60px] w-[60px] object-contain"
              src={images[key]}
            />
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-center">
                <label className="text-gray-700 font-semibold text-base">
                  {item.label}
                </label>
                {uploadStatus[item.value] && !files[item.value] && (
                  <MdOutlineVerified className="text-xl text-green-600 ml-1" />
                )}
              </div>
              <input
                type="file"
                onChange={handleFileChange(item.value)}
                className="hidden"
                id={item.value}
              />
              {!files[item.value] && !uploadStatus[item.value] && (
                <label
                  htmlFor={item.value}
                  className="text-blue-500 underline text-sm cursor-pointer"
                >
                  {"Choose a file"}
                </label>
              )}
              {files[item.value] && (
                <div className="flex gap-1 items-center flex-col">
                  <label className="text-gray-500 text-xs">
                    {files[item.value]?.name}
                  </label>
                  <div className="flex gap-1 items-center">
                    <button
                      onClick={() => handleUpload(item.value)}
                      className="text-white font-semibold text-xs bg-blue-500 py-[1px] px-3 rounded"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => {
                        setFileToShow({
                          file: files[item.value],
                        });
                        open();
                      }}
                      className="text-white font-semibold text-xs bg-blue-500 py-[1px] px-3 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setFiles((prev) => ({ ...prev, [item.value]: null }));
                      }}
                      className="text-white font-semibold text-xs bg-blue-500 py-[1px] px-3 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {uploadStatus[item.value] && !files[item.value] && (
                <div className="flex items-center justify-center gap-2">
                  <label className="text-green-500 text-sm">{"uploaded"}</label>
                  <label
                    htmlFor={item.value}
                    className="text-blue-500 underline text-sm cursor-pointer"
                  >
                    {"Change"}
                  </label>
                </div>
              )}
            </div> */
}
