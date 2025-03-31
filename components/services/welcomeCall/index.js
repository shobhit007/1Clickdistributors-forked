import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useForm, useFieldArray } from "react-hook-form";
import { FcDocument, FcImageFile } from "react-icons/fc";
import { FiPlus, FiTrash } from "react-icons/fi";
import { IoMdCloudUpload } from "react-icons/io";
import { convertToTimeStamp, uploadFile } from "@/lib/commonFunctions";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import PersonalDetails from "./tabs/PersonalDetails";
import BusinessDetails from "./tabs/BusinessDetails";
import ProductDetails from "./tabs/ProductDetails";
import TaxDetails from "./tabs/TaxDetails";
import BankDetails from "./tabs/BankDetails";
import { toggle } from "@nextui-org/theme";
import { company_types, welcomeCallDispositions } from "@/lib/data/commonData";

const TABS = [
  {
    label: "Personal Details",
    value: "personal_details",
  },
  {
    label: "Business Details",
    value: "business_details",
  },
  {
    label: "Product Details",
    value: "product_details",
  },
  {
    label: "Tax Details",
    value: "tax_details",
  },
  {
    label: "Bank Details",
    value: "bank_details",
  },
];

function WelcomeCall({
  closeModal,
  selectedRow,
  serviceType,
  refetchServiceLeads,
}) {
  if (!selectedRow) {
    return null;
  }

  // console.log("selected row", selectedRow);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      productImage: null,
      brands: [],
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("personal_details");
  const [selectedDisposition, setSelectedDisposition] = useState(
    welcomeCallDispositions[0].value
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "brands",
  });

  const addBrands = () => {
    const brand = watch("brandName");
    console.log("brand name entered", brand);
    if (!brand) {
      toast.error("Please enter a brand name");
      return;
    }
    append({ name: brand });
    setValue("brandName", "");
  };

  const getWelcomeCallData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/getWelcomeCallData`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leadId: selectedRow?.leadId,
        }),
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      } else {
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getWelcomeCallData", selectedRow?.leadId],
    queryFn: getWelcomeCallData,
    enabled: !!selectedRow?.leadId,
  });

  // setting data
  useEffect(() => {
    // Set personal details
    setValue("tag", selectedRow?.tag || "");
    setValue("full_name", selectedRow?.full_name || "");
    setValue("designation", selectedRow?.designation || "");
    setValue("mobile", selectedRow?.phone_number || "");
    setValue("city", selectedRow?.city || "");
    setValue("email", selectedRow?.email || "");
    setValue("altEmail", selectedRow?.email_2 || "");

    // Set business details
    setValue("companyName", selectedRow?.companyName || "");
    setValue("company_type", selectedRow?.company_type || "");
    setValue("turnOver", selectedRow?.turnOver || "");
    setValue("turnover_type", selectedRow?.turnover_type || "");
    setValue("yearOfEstablishment", selectedRow?.yearOfEstablishment || "");
    setValue("address", selectedRow?.address || "");
    setValue("pincode", selectedRow?.pincode || "");
    setValue("businessCity", selectedRow?.businessCity || "");
    setValue("businessState", selectedRow?.businessState || "");

    // Set tax details
    setValue("gstNumber", selectedRow?.taxDetails?.gst?.number || "");
    setValue("gstImage", selectedRow?.taxDetails?.gst?.image || "");
    setValue("panNumber", selectedRow?.taxDetails?.pan?.number || "");
    setValue("panImage", selectedRow?.taxDetails?.pan?.image || "");
    setValue("tanNumber", selectedRow?.taxDetails?.tan?.number || "");
    setValue("tanImage", selectedRow?.taxDetails?.tan?.image || "");

    // Set bank details
    setValue("accountType", selectedRow?.bankAccountType || "");
    setValue("accountNumber", selectedRow?.bankAccountNumber || "");
    setValue("ifsc", selectedRow?.bankIFSC_code || "");
    setValue("cancelCheque", selectedRow?.cancelledChequeImage || "");
  }, [setValue, selectedRow]);

  // set default company name
  useEffect(() => {
    const welcomeCallData = data?.welcomeCallData;
    if (selectedRow && !welcomeCallData?.companyName) {
      setValue("companyName", selectedRow?.company_name);
    }
  }, [selectedRow, setValue, data]);

  const onSubmit = async (data) => {
    const leadId = selectedRow.leadId;

    if (data.accountNumber !== data.confirmAccountNumber) {
      toast.error("Account numbers do not match");
      return;
    }

    let gstPdfUrl = "";
    let panPdfUrl = "";

    // Helper to upload a file if provided
    const uploadIfExists = async (fileData, label) => {
      if (fileData && fileData instanceof File) {
        try {
          const url = await uploadFile({
            file: fileData,
            path: `service/${leadId}/documents/${fileData.name}`,
          });
          if (url.success) {
            return url.downloadURL;
          }
        } catch (error) {
          console.error(`Error uploading ${label} file:`, error);
        }
      } else {
        console.log(`No ${label} file selected.`);
      }
      return "";
    };

    gstPdfUrl = await uploadIfExists(data?.gstPdf, "GST");
    panPdfUrl = await uploadIfExists(data?.panPdf, "PAN");
    tanPdfUrl = await uploadIfExists(data?.tanPdf, "TAN");
    cancelChequeUrl = await uploadIfExists(data?.cancelCheque, "Cancel Cheque");

    const groupedData = {
      full_name: data.full_name,
      designation: data.designation,
      phone_number: data.mobile,
      email: data.email,
      email_2: data.altEmail,
      city: data.city,
      companyName: data.companyName,
      company_type: data.company_type,
      turnOver: data.turnOver,
      turnover_type: data.turnover_type,
      yearOfEstablishment: data.yearOfEstablishment,
      address: data.address,
      pincode: data.pincode,
      businessCity: data.businessCity,
      businessState: data.businessState,
      taxDetails: {
        gst: {
          number: data.gst,
          image: gstPdfUrl,
        },
        pan: {
          number: data.pan,
          image: panPdfUrl,
        },
        tan: {
          number: data.tan,
          image: tanPdfUrl,
        },
      },
      bankAccountNumber: data.accountNumber,
      bankAccountType: data.accountType,
      bankIFSC_code: data.ifsc,
      cancelledChequeImage: data.cancelChequeUrl,
      leadId: leadId,
      tag: data.tag,
    };

    const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/updateWelcomeCall`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: groupedData }),
      });

      if (response.ok) {
        toast.success("Lead updated successfully");
        refetch();
      } else {
        const errorResponse = await response.json();
        console.error("Error submitting form:", errorResponse.message);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const addRemark = async () => {
    const remark = watch("remark");
    if (!remark) {
      toast.error("Please enter a remark");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/addWwelcomeCallRemarks`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leadId: selectedRow?.leadId,
          remark,
          disposition: selectedDisposition,
        }),
      });

      if (response.ok) {
        setValue("remark", "");
        refetch();
        if (selectedDisposition === "complete_details") {
          refetchServiceLeads();
          toast.success("Welcome call completed");
          closeModal();
        } else {
          toast.success("Remarks added");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleBrandModal = () => setShowModal((p) => !p);

  // fields
  const full_name = watch("full_name");
  const designation = watch("designation");
  const mobile = watch("mobile");
  const email = watch("email");
  const tag = watch("tag");
  const companyName = watch("companyName");
  const turnOver = watch("turnOver");
  const establishmentYear = watch("yearOfEstablishment");
  const gstNumber = watch("gstNumber");
  const pantNumber = watch("panNumber");
  const businessState = watch("businessState");
  const businessCity = watch("businessCity");
  const pincode = watch("pincode");
  const category = watch("category");
  const subCategory = watch("subCategory");

  const progressFields = {
    full_name: full_name,
    companyName: companyName,
    phone: mobile,
    email: email,
    designation: designation,
    tag: tag,
    turnOver: turnOver,
    establishmentYear: establishmentYear,
    gstNumber: gstNumber,
    pantNumber: pantNumber,
    pincode,
    businessState,
    businessCity,
    category,
    subCategory,
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(progressFields).length;
    const completedFields = Object.values(progressFields).filter(
      (value) => value
    ).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  const render = () => (
    <>
      <div
        style={{
          display: currentTab === "personal_details" ? "block" : "none",
        }}
      >
        <PersonalDetails
          register={register}
          errors={errors}
          serviceType={serviceType}
        />
      </div>
      <div
        style={{
          display: currentTab === "business_details" ? "block" : "none",
        }}
      >
        <BusinessDetails
          register={register}
          errors={errors}
          serviceType={serviceType}
          showModal={showModal}
          toggleBrandModal={toggleBrandModal}
          fields={fields}
          remove={remove}
          addBrands={addBrands}
        />
      </div>
      <div
        style={{ display: currentTab === "product_details" ? "block" : "none" }}
      >
        <ProductDetails selectedRow={selectedRow} />
      </div>
      <div style={{ display: currentTab === "tax_details" ? "block" : "none" }}>
        <TaxDetails
          register={register}
          errors={errors}
          serviceType={serviceType}
          setValue={setValue}
          watch={watch}
        />
      </div>
      <div
        style={{ display: currentTab === "bank_details" ? "block" : "none" }}
      >
        <BankDetails
          register={register}
          errors={errors}
          serviceType={serviceType}
          setValue={setValue}
          watch={watch}
        />
      </div>
    </>
  );

  const getWelcomeCallDesposition = (value) => {
    return (
      welcomeCallDispositions.find((item) => item.value === value).label || ""
    );
  };

  return (
    <div className="absolute inset-0 w-full z-50">
      <div className="flex flex-col bg-gray-100 h-full">
        {/* Header */}
        <div className="sticky top-0 w-full bg-gray-100 z-10">
          <div className="flex justify-between items-center py-6 px-8">
            <h1 className="text-xl font-semibold">
              Welcome Call
              <span className="ml-2">{`(Profile Completion ${progress}%)`}</span>
            </h1>
            <button className="text-xl font-semibold" onClick={closeModal}>
              <IoClose size={24} color="black" />
            </button>
          </div>
          <div className="w-full">
            <div className="w-full relative bg-gray-300 h-[3px] overflow-hidden">
              <div
                className="bg-green-600 h-[3px] transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {/* <div className="w-full flex justify-end pr-2">
              <p className="text-sm text-gray-600">{`${progress}%`}</p>
            </div> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto mt-4 px-4">
          <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row gap-2">
            {/* Left Panel */}
            <div className="w-full sm:w-1/4 h-full bg-transparent">
              <div className="w-full bg-white px-4 py-6 rounded">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Profile Id
                  </label>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedRow?.profileId}
                  </p>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedRow?.full_name}
                  </p>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedRow?.phone_number}
                  </p>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedRow?.email}
                  </p>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company Name
                  </label>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedRow?.company_name}
                  </p>
                </div>
              </div>

              <div className="w-full bg-white px-4 py-6 rounded mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Disposition
                  </label>
                  <select
                    className="select w-full border rounded border-gray-300 p-3"
                    value={selectedDisposition}
                    onChange={(e) => setSelectedDisposition(e.target.value)}
                  >
                    {welcomeCallDispositions.map((dispos, index) => (
                      <option key={index} value={dispos.value}>
                        {dispos.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Remarks
                  </label>

                  <textarea
                    {...register("remark")}
                    placeholder="Enter Remarks"
                    className="w-full border rounded border-gray-300 p-3 h-24"
                  />
                </div>

                <button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={addRemark}
                >
                  Add Remark
                </button>

                {data?.remarks?.length > 0 && (
                  <div className="w-full h-60 overflow-x-hidden overflow-y-auto mt-4">
                    {data?.remarks?.map((remark, index) => (
                      <div
                        key={index}
                        className="w-full bg-gray-100 p-2 rounded first:mt-0 mt-2"
                      >
                        <div className="w-full flex flex-row items-center gap-2">
                          <span className="block text-xs text-gray-600">
                            {convertToTimeStamp(remark?.createdAt)}
                          </span>
                          <span className="block text-xs text-gray-600">
                            {getWelcomeCallDesposition(remark?.disposition)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium mt-2">
                          {remark?.remark}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Main form */}
            <div className="w-full sm:w-3/4 bg-white p-4">
              <h1 className="text-2xl font-bold mb-4">Welcome Call Form</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="w-full flex flex-row">
                  {TABS.map((tab) => (
                    <button
                      key={tab.label}
                      type="button"
                      className={`px-3 py-1 border-b-2 ${
                        currentTab === tab.value
                          ? "border-b-blue-500"
                          : "border-b-transparent"
                      } ${
                        currentTab === tab.value
                          ? "text-blue-500"
                          : "text-gray-600"
                      } text-sm font-medium`}
                      onClick={() => setCurrentTab(tab.value)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {render()}
                {currentTab !== "product_details" && (
                  <div className="flex w-full justify-end mt-4 py-2">
                    <button
                      type="submit"
                      className="btn btn-primary ml-auto mr-0 w-36 p-3 rounded bg-blue-400 hover:bg-blue-500 text-white font-medium"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PDFFileSelector({
  register,
  setValue,
  fieldName,
  fileType = "application/pdf",
  text = "Select PDF",
}) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValue(fieldName, file);
  };

  return (
    <div>
      <div
        className="flex  mt-2 items-center justify-center h-36 w-full border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
        onClick={() =>
          document.getElementById(`fileInput-${fieldName}`).click()
        }
      >
        <input
          id={`fileInput-${fieldName}`}
          type="file"
          accept={fileType}
          className="hidden"
          {...register(fieldName)}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center">
          {fileType === "application/pdf" ? (
            <FcDocument className="text-4xl mb-2" />
          ) : (
            <FcImageFile className="text-4xl mb-2" />
          )}
          <p className="text-gray-600 font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeCall;
