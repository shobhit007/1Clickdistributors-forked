import manufacturerContext from "@/lib/context/manufacturerContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import CustomInput from "@/components/uiCompoents/CustomInput";
import {
  MdOutlineCurrencyRupee,
  MdOutlinePersonPinCircle,
} from "react-icons/md";
import { FaAddressCard, FaBuilding, FaNetworkWired } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import CustomSelector from "@/components/uiCompoents/CustomSelector";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { IoIosSave } from "react-icons/io";
import { bank_accountTypes, company_types } from "@/lib/data/commonData";
import { uploadMediaFileToDB } from "@/lib/commonFunctions";
import { current } from "@reduxjs/toolkit";

const rowStyle = "w-full flex justify-between py-1 flex-col md:flex-row gap-4";
const rowItemStyle = "w-full md:w-[46%]";
const iconStyle = "text-[10px]";

const BankDetails = ({ showFilePreview }) => {
  const { userDetails } = useContext(manufacturerContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [tempImageURL, setTempImageURL] = useState(null);
  const [cancelledChequeImage, setCancelledChequeImage] = useState(null);
  const queryClient = useQueryClient();
  const [fileUploading, setFileUploading] = useState(false);
  const imageref1 = useRef(null);
  const imageref2 = useRef(null);

  const [data, setData] = useState({
    bankAccountType: "",
    bankAccountNumber: null,
    bankIFSC_code: "",
  });

  useEffect(() => {
    if (userDetails) {
      setData({
        bankAccountType: userDetails?.bankAccountType || "",
        bankAccountNumber: userDetails?.bankAccountNumber || null,
        bankIFSC_code: userDetails?.bankIFSC_code || null,
      });

      console.log("user details", userDetails);
      if (userDetails.cancelledChequeImage) {
        setCancelledChequeImage(userDetails.cancelledChequeImage);
      }
    }
  }, [userDetails]);

  const saveChanges = async () => {
    try {
      let body = { ...data };
      let numericVals = ["bankAccountNumber"];

      Object.keys(body).forEach((key) => {
        if (numericVals.includes(key)) {
          body[key] = parseInt(body[key]) || null;
        }
      });
      body.cancelledChequeImage = cancelledChequeImage || null;
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUserProfile`;
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
        queryClient.invalidateQueries(["currentUserDetail"]);
      } else {
        toast.error(ress.message || "Something went wrong");
      }
    } catch (error) {
      console.log("error in savechanges", error.message);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const onChangeValue = (value, fieldName) => {
    setData((pre) => ({ ...pre, [fieldName]: value }));
  };

  const values = [
    { label: "Thousands", value: "thousand" },
    { label: "Lakhs", value: "lakh" },
    { label: "Crores", value: "crore" },
  ];

  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      console.log("url is", url);
      setTempImageURL(url);
      setFile(file);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        return toast.error("No file detected");
      }
      const fileExtension = file.name.split(".").pop();
      const fileName = `${userDetails?.docId}.${fileExtension}`;
      const storagePath = `userDocuments/${userDetails?.docId}/cancelledCheque.${fileExtension}`;
      const uploadRes = await uploadMediaFileToDB(file, storagePath);
      if (uploadRes.success) {
        let { downloadURL } = uploadRes;
        setFileUploading(true);
        const token = localStorage.getItem("authToken");
        let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUserProfile`;
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cancelledChequeImage: downloadURL }),
        });
        const ress = await response.json();
        if (ress.success) {
          toast.success(ress.message);
          queryClient.invalidateQueries(["currentUserDetail"]);
          setFile(null);
          setTempImageURL(null);
        } else {
          toast.error(ress.message || "Something went wrong");
        }
      } else {
        toast.error("Failed to update profile picture.");
      }
    } catch (error) {
      console.log("Error in handleUpload:", error.message);
      toast.error(
        "An error occurred while uploading the cancelled cheque image."
      );
    } finally {
      setFileUploading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full">
        <div className="p-3 w-full bg-white rounded-md">
          {/* Profile Details here */}
          <div className="w-full flex flex-col gap-4 mt-7">
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomSelector
                  label={"Account Type"}
                  options={bank_accountTypes}
                  value={data?.bankAccountType}
                  icon={<FaNetworkWired className={`${iconStyle}`} />}
                  onChangeValue={(value) =>
                    onChangeValue(value, "bankAccountType")
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Account Number"}
                  value={data?.bankAccountNumber}
                  onChangeValue={(value) =>
                    onChangeValue(value, "bankAccountNumber")
                  }
                  type="number"
                  disabled={!isEditing}
                  icon={<FaBuilding className={`${iconStyle}`} />}
                />
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div
                className={`${rowItemStyle} flex items-center justify-between`}
              >
                <div className="w-[100%]">
                  <CustomInput
                    label={"IFSC Code"}
                    value={data?.bankIFSC_code}
                    onChangeValue={(value) =>
                      onChangeValue(value, "bankIFSC_code")
                    }
                    disabled={!isEditing}
                    icon={<MdOutlineCurrencyRupee className={`${iconStyle}`} />}
                  />
                </div>
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className=" flex-col flex">
                <h1 className="text-sm font-semibold text-colorPrimary">
                  Upload cancelled cheque
                </h1>

                {cancelledChequeImage ? (
                  <div className="w-full flex flex-col gap-2 mt-3">
                    <img
                      className="max-h-[220px] max-w-[400px] bg-contain object-contain rounded-md"
                      src={tempImageURL || cancelledChequeImage}
                      onClick={() =>
                        showFilePreview({
                          url: tempImageURL || cancelledChequeImage,
                        })
                      }
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        id={"uploadFile"}
                        ref={imageref1}
                      />
                      <label
                        htmlFor={"uploadFile"}
                        className="text-white font-semibold text-xs bg-blue-500 py-[1px] px-3 rounded"
                      >
                        {"Change file"}
                      </label>

                      {file && (
                        <button
                          onClick={handleUpload}
                          disabled={fileUploading}
                          className="text-white font-semibold text-xs bg-colorPrimary py-[1px] px-3 rounded disabled:animate-pulse"
                        >
                          {fileUploading ? "Uploading" : "Upload"}
                        </button>
                      )}

                      {file && (
                        <button
                          onClick={() => {
                            setFile(null);
                            setTempImageURL(null);
                            if (imageref1?.current) {
                              imageref1.current.value = null;
                            }
                          }}
                          disabled={fileUploading}
                          className="text-white font-semibold text-xs bg-gray-500 py-[1px] px-3 rounded disabled:animate-pulse"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col gap-2 mt-3">
                    {tempImageURL && (
                      <img
                        className="max-h-[220px] max-w-[400px] bg-contain rounded-md object-contain"
                        src={tempImageURL}
                        onClick={() => showFilePreview({ url: tempImageURL })}
                      />
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        id={"uploadFile"}
                        ref={imageref2}
                      />
                      <label
                        htmlFor={"uploadFile"}
                        className="text-white font-semibold text-xs bg-blue-500 py-[1px] px-3 rounded"
                      >
                        {"Choose a file"}
                      </label>

                      {file && (
                        <button
                          onClick={handleUpload}
                          className="text-white font-semibold text-xs bg-colorPrimary py-[1px] px-3 rounded"
                        >
                          Upload
                        </button>
                      )}

                      {file && (
                        <button
                          onClick={() => {
                            setFile(null);
                            setTempImageURL(null);
                            if (imageref2?.current) {
                              imageref2.current.value = null;
                            }
                          }}
                          className="text-white font-semibold text-xs bg-gray-500 py-[1px] px-3 rounded"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`w-full flex justify-end mt-6 gap-3`}>
              {isEditing ? (
                <>
                  <button
                    onClick={saveChanges}
                    disabled={loading}
                    className="px-2 md:px-3 flex disabled:bg-blue-300 disabled:animate-pulse items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-blue-600 text-white hover:bg-blue-600/80 w-fit"
                  >
                    <IoIosSave />
                    {loading ? "Saving..." : "Save changes"}
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    disabled={loading}
                    className="px-2 md:px-3 flex disabled:bg-gray-300 disabled:animate-pulse items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-gray-600 text-white hover:bg-gray-600/80 w-fit"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2 md:px-3 flex items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-sm bg-colorPrimary text-white hover:bg-colorPrimary/80 w-fit"
                >
                  <MdOutlineEdit />
                  Edit details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
