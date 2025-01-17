import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import PersonalDetails from "./tabs/PersonalDetails";
import BusinessDetails from "./tabs/BusinessDetails";
import AboutUs from "./tabs/AboutUs";
import { useForm, useFieldArray } from "react-hook-form";
import { FcDocument, FcImageFile } from "react-icons/fc";
import { FiPlus, FiTrash } from "react-icons/fi";
import { IoMdCloudUpload } from "react-icons/io";
import { uploadFile } from "@/lib/commonFunctions";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CiImageOn } from "react-icons/ci";
import { dispositions, subDispositions } from "@/lib/data/commonData";

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
    label: "About Us",
    value: "about_us",
  },
];

function UpdateLeadModal({ closeModal, selectedRow, serviceType }) {
  if (!selectedRow) {
    return null;
  }

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

  const [visibleProducts, setVisibleProducts] = useState(false);
  const [visibleCategoryModal, setVisibleCategoryModal] = useState(false);
  const [visibleSubCategoryModal, setVisibleSubCategoryModal] = useState(false);
  const [serviceProducts, setServiceProducts] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "brands", // Connects to the `brands` array in the form
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
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const {
    data: welcomeCallData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["getWelcomeCallData", selectedRow?.leadId],
    queryFn: getWelcomeCallData,
    enabled: !!selectedRow?.leadId,
  });

  // setting data
  useEffect(() => {
    if (!welcomeCallData) {
      return;
    }

    const {
      personalDetails,
      businessDetails,
      productdDetails,
      taxDetails,
      bankDetails,
      products,
    } = welcomeCallData;

    // Set personal details
    if (personalDetails) {
      setValue("firstName", personalDetails?.firstName);
      setValue("lastName", personalDetails?.lastName);
      setValue("jobTitle", personalDetails?.jobTitle);
      setValue("mobile", personalDetails?.mobile);
      setValue("location", personalDetails?.location);
      setValue("email", personalDetails?.email);
      setValue("altEmail", personalDetails?.altEmail);
    }

    // Set business details
    if (businessDetails) {
      setValue("companyName", businessDetails?.companyName);
      setValue("companyType", businessDetails?.companyType);
      setValue("turnover", businessDetails?.turnover);
      setValue("type", businessDetails?.type);
      setValue("yearOfEstablishment", businessDetails?.yearOfEstablishment);
      setValue("address", businessDetails?.address);
      setValue("pincode", businessDetails?.pincode);
      setValue("city", businessDetails?.city);
      setValue("state", businessDetails?.state);
    }

    // Set product details
    if (productdDetails) {
      setValue("category", productdDetails?.category);
      setValue("subCategory", productdDetails?.subCategory);
      setValue("tag", productdDetails?.tag);
    }

    // Set tax details
    if (taxDetails) {
      setValue("gstNumber", taxDetails?.gst?.gstNumber);
      setValue("gstDocument", taxDetails?.gst?.document);
      setValue("panNumber", taxDetails?.pan?.panNumber);
      setValue("panDocument", taxDetails?.pan?.document);
      setValue("tanNumber", taxDetails?.tan?.tanNumber);
      setValue("tanDocument", taxDetails?.tan?.document);
    }

    // Set bank details
    if (bankDetails) {
      setValue("accountType", bankDetails?.accountType);
      setValue("accountNumber", bankDetails?.accountNumber);
      setValue("confirmAccountNumber", bankDetails?.confirmAccountNumber);
      setValue("ifsc", bankDetails?.ifsc);
      setValue("cancelCheque", bankDetails?.cancelCheque);
    }

    if (products) {
      setServiceProducts(products);
    }
  }, [welcomeCallData, setValue]);

  const selectedCategory = watch("category");
  const selectedImage = watch("productImage");

  const [categories, setCategories] = useState([
    "Electronics",
    "Clothing",
    "Furniture",
  ]);

  const [subCategories, setSubCategories] = useState({
    Electronics: ["Mobile", "Laptop"],
    Clothing: ["Men", "Women"],
    Furniture: ["Table", "Chair"],
  });

  useEffect(() => {
    setValue("category", categories[0]);
  }, []);

  const uploadProduct = async () => {
    const title = watch("productName");
    const image = watch("productImage");

    if (!title || !image) {
      alert("Both title and image are required.");
      return;
    }

    try {
      setImageLoading(true);
      const result = await uploadFile({
        file: image,
        path: `service/${selectedRow?.leadId}/productImages`,
      });

      if (result.success) {
        const token = localStorage.getItem("authToken");
        let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/uploadServiceProduct`;
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            leadId: selectedRow?.leadId,
            product: {
              title,
              image: result.downloadURL,
            },
          }),
        });

        if (response.ok) {
          setValue("productName", "");
          setValue("productImage", null);
          setImageLoading(false);
          refetch();
        }
      } else {
        toast.error(result.error);
        setImageLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setImageLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/deleteServiceProduct`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leadId: selectedRow?.leadId,
          productId,
        }),
      });

      if (response.ok) {
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValue("productImage", file);
  };

  const onSubmit = async (data) => {
    const leadId = selectedRow.leadId;

    let gstPdfUrl = "";
    let tanPdfUrl = "";
    let panPdfUrl = "";
    let cancelChequeUrl = "";

    if (data.gstPdf.length !== 0) {
      console.log("gstPdf", data.gstPdf);
      const url = await uploadFile({
        file: data.gstPdf,
        path: `service/${leadId}/documents/${data.gstPdf.originalName}`,
      });

      if (url.success) {
        gstPdfUrl = url.downloadURL;
      }
    }

    if (data.panPdf.length !== 0) {
      console.log("panPdf", data.panPdf);
      const url = await uploadFile({
        file: data.panPdf,
        path: `service/${leadId}/documents/${data.panPdf.originalName}`,
      });

      if (url.success) {
        panPdfUrl = url.downloadURL;
      }
    }
    if (data.tanPdf.length !== 0) {
      console.log("tanPdf", data.tanPdf);
      const url = await uploadFile({
        file: data.tanPdf,
        path: `service/${leadId}/documents/${data.tanPdf.originalName}`,
      });

      if (url.success) {
        tanPdfUrl = url.downloadURL;
      }
    }
    if (data.cancelCheque.length !== 0) {
      console.log("cancelCheque", data.cancelCheque);
      const url = await uploadFile({
        file: data.cancelCheque,
        path: `service/${leadId}/documents/${data.cancelCheque.originalName}`,
      });

      if (url.success) {
        cancelChequeUrl = url.downloadURL;
      }
    }

    const groupedData = {
      personalDetails: {
        firstName: data.firstName,
        lastName: data.lastName,
        jobTitle: data.jobTitle,
        mobile: data.mobile,
        email: data.email,
        altEmail: data.altEmail,
        location: data.location,
      },
      businessDetails: {
        companyName: data.companyName,
        companyType: data.companyType,
        turnover: data.turnover,
        type: data.type,
        yearOfEstablishment: data.yearOfEstablishment,
        address: data.address,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
      },
      productdDetails: {
        category: data.category,
        subCategory: data.subCategory,
        tag: data.tag,
      },
      taxDetails: {
        gst: {
          gstNumber: data.gst,
          document: gstPdfUrl,
        },
        pan: {
          panNumber: data.pan,
          document: panPdfUrl,
        },
        tan: {
          tanNumber: data.tan,
          document: tanPdfUrl,
        },
      },
      bankDetails: {
        accountType: data.accountType,
        accountNumber: data.accountNumber,
        confirmAccountNumber: data.confirmAccountNumber,
        ifsc: data.ifsc,
        cancelCheque: cancelChequeUrl,
      },
    };

    groupedData.leadId = selectedRow?.leadId;
    groupedData.isLive = isLive;
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
        const error = await response.json();
        console.error("Error submitting form:", error.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleCategoryModal = () => setVisibleCategoryModal((p) => !p);
  const toggleSubCategoryModal = () => setVisibleSubCategoryModal((p) => !p);

  const handleCategory = (val) => {
    setCategories((prev) => [...prev, val]);
    toggleCategoryModal();
  };

  const handleSubCategory = (category, value) => {
    const updatedSubCategories = { ...subCategories };
    if (!updatedSubCategories[category]) {
      updatedSubCategories[category] = [];
    }

    updatedSubCategories[category] = [...updatedSubCategories[category], value];

    setSubCategories(updatedSubCategories);
    toggleSubCategoryModal();
  };

  const toggleBrandModal = () => setShowModal((p) => !p);

  const contact = {
    firstName: "John",
    lastName: "",
    companyName: "Tech Solutions Inc.",
    phone: "+1-555-123-4567",
    email: "john.doe@example.com",
    city: "New York",
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(contact).length;
    const completedFields = Object.values(contact).filter(
      (value) => value
    ).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  return (
    // <div className="absolute inset-0 w-full z-50">
    //   <div className="flex flex-col bg-gray-100">
    //     {/* header */}
    //     <div className="flex justify-between items-center py-6 px-8">
    //       <h1 className="text-xl font-semibold">Welcome Call</h1>
    //       <button className="text-xl font-semibold" onClick={closeModal}>
    //         <IoClose size={24} color="black" />
    //       </button>
    //     </div>

    //     <div className="w-full">
    //       <div className="w-full relative bg-gray-300 h-[3px] overflow-hidden">
    //         <div
    //           className="bg-green-600 h-[3px] transition-all duration-500 ease-in-out"
    //           style={{ width: `${progress}%` }}
    //         ></div>
    //       </div>
    //       <div className="w-full flex justify-end pr-2">
    //         <p className="text-sm text-gray-600">{`${progress}%`}</p>
    //       </div>
    //     </div>

    //     {/* Main content */}
    //     <div className="w-full overflow-hidden mt-4">
    //       <div className="container mx-auto p-4 flex flex-col sm:flex-row gap-2">
    //         <div className="w-1/4 h-full bg-white px-4 py-6 rounded">
    //           <div>
    //             <label className="block text-sm font-medium text-gray-500 mb-1">
    //               Profile Id
    //             </label>
    //             <p className="text-sm text-gray-700 font-medium">
    //               {selectedRow?.profileId}
    //             </p>
    //           </div>
    //           <div className="mt-2">
    //             <label className="block text-sm font-medium text-gray-500 mb-1">
    //               Full Name
    //             </label>
    //             <p className="text-sm text-gray-700 font-medium">
    //               {selectedRow?.full_name}
    //             </p>
    //           </div>
    //           <div className="mt-2">
    //             <label className="block text-sm font-medium text-gray-500 mb-1">
    //               Phone Number
    //             </label>
    //             <p className="text-sm text-gray-700 font-medium">
    //               {selectedRow?.phone_number}
    //             </p>
    //           </div>
    //           <div className="mt-2">
    //             <label className="block text-sm font-medium text-gray-500 mb-1">
    //               Email
    //             </label>
    //             <p className="text-sm text-gray-700 font-medium">
    //               {selectedRow?.email}
    //             </p>
    //           </div>
    //           <div className="mt-2">
    //             <label className="block text-sm font-medium text-gray-500 mb-1">
    //               Company Name
    //             </label>
    //             <p className="text-sm text-gray-700 font-medium">
    //               {selectedRow?.company_name}
    //             </p>
    //           </div>
    //         </div>
    //         <div className="w-3/4 bg-white p-4">
    //           <h1 className="text-2xl font-bold mb-4">Welcome Call Form</h1>
    //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    //             {/* Personal Details */}
    //             <fieldset className="bg-white p-4">
    //               <legend className="text-lg font-semibold">
    //                 Personal Details
    //               </legend>
    //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     First Name
    //                   </label>
    //                   <input
    //                     {...register("firstName", { required: true })}
    //                     placeholder="First Name"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                   {errors.firstName && (
    //                     <p className="text-red-500">First Name is required</p>
    //                   )}
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Last Name
    //                   </label>
    //                   <input
    //                     {...register("lastName", { required: true })}
    //                     placeholder="Last Name"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Designation/Job Title
    //                   </label>
    //                   <input
    //                     {...register("jobTitle")}
    //                     placeholder="Designation/Job Title"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Mobile Number
    //                   </label>
    //                   <input
    //                     {...register("mobile")}
    //                     placeholder="Mobile Number"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Email
    //                   </label>
    //                   <input
    //                     {...register("email", { pattern: /^\S+@\S+$/i })}
    //                     placeholder="Email"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 {serviceType === "distributor" ? (
    //                   <div>
    //                     <label className="block text-sm font-medium text-gray-700 mb-1">
    //                       WhatsApp Number
    //                     </label>
    //                     <input
    //                       {...register("whatsAppNumber")}
    //                       placeholder="WhatsApp Number"
    //                       type="number"
    //                       className="input w-full border rounded border-gray-300 p-3"
    //                     />
    //                   </div>
    //                 ) : (
    //                   <div>
    //                     <label className="block text-sm font-medium text-gray-700 mb-1">
    //                       Alt Email
    //                     </label>
    //                     <input
    //                       {...register("altEmail")}
    //                       placeholder="Alternative Email"
    //                       className="input w-full border rounded border-gray-300 p-3"
    //                     />
    //                   </div>
    //                 )}

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Location/City
    //                   </label>
    //                   <input
    //                     {...register("location")}
    //                     placeholder="Location/City"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>
    //               </div>
    //             </fieldset>

    //             {/* Business Details */}
    //             <fieldset className="bg-white p-4">
    //               <legend className="text-lg font-semibold">
    //                 Business Details
    //               </legend>
    //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Company Name
    //                   </label>
    //                   <input
    //                     {...register("companyName", { required: true })}
    //                     placeholder="Company Name"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Company Type
    //                   </label>
    //                   <select
    //                     {...register("companyType")}
    //                     className="select w-full border rounded border-gray-300 p-3"
    //                   >
    //                     <option value="Proprietorship">Proprietorship</option>
    //                     <option value="Partnership">Partnership</option>
    //                     <option value="Private Limited">Private Limited</option>
    //                     <option value="Public Limited">Public Limited</option>
    //                     <option value="LLP">LLP</option>
    //                     <option value="Other">Other</option>
    //                   </select>
    //                 </div>

    //                 {serviceType === "distributor" && (
    //                   <div>
    //                     <label className="block text-sm font-medium text-gray-700 mb-1">
    //                       Experience
    //                     </label>
    //                     <input
    //                       {...register("experience", { required: true })}
    //                       placeholder="Experience (in years)"
    //                       type="number"
    //                       className="input w-full border rounded border-gray-300 p-3"
    //                     />
    //                   </div>
    //                 )}

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Turnover
    //                   </label>
    //                   <div className="flex gap-2">
    //                     <input
    //                       {...register("turnover")}
    //                       placeholder="Turnover"
    //                       className="input w-full border rounded border-gray-300 p-3"
    //                     />
    //                     <select
    //                       {...register("type")}
    //                       className="select w-full border rounded border-gray-300 p-3"
    //                     >
    //                       <option value="lakh">Lakh</option>
    //                       <option value="crore">Crore</option>
    //                       <option value="million">Million</option>
    //                       <option value="billion">Billion</option>
    //                     </select>
    //                   </div>
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Year of Establishment
    //                   </label>
    //                   <input
    //                     {...register("yearOfEstablishment")}
    //                     placeholder="Year of Establishment"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Full Address
    //                   </label>
    //                   <input
    //                     {...register("address")}
    //                     placeholder="Full Address"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Pincode
    //                   </label>
    //                   <input
    //                     {...register("pincode")}
    //                     placeholder="Pincode"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     City
    //                   </label>
    //                   <input
    //                     {...register("city")}
    //                     placeholder="City"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     State
    //                   </label>
    //                   <input
    //                     {...register("state")}
    //                     placeholder="State"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Investment Budget
    //                   </label>
    //                   <input
    //                     {...register("investmentBudget")}
    //                     placeholder="Investment Budget"
    //                     type="number"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 {serviceType === "distributor" && (
    //                   <div>
    //                     <label className="block text-sm font-medium text-gray-700 mb-1">
    //                       Visiting Card
    //                     </label>
    //                     <div
    //                       className="w-full flex items-center gap-2 border rounded border-gray-300 p-3 hover:cursor-pointer"
    //                       onClick={() =>
    //                         document.getElementById("visitingCard").click()
    //                       }
    //                     >
    //                       <CiImageOn size={24} />
    //                       <span className="block text-sm font-medium text-gray-700">
    //                         Select visiting card
    //                       </span>
    //                       <input
    //                         {...register("visitingCard")}
    //                         id="visitingCard"
    //                         type="file"
    //                         accept={"image/*"}
    //                         className="hidden"
    //                       />
    //                     </div>
    //                   </div>
    //                 )}

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Brands Working With
    //                   </label>
    //                   <button
    //                     type="button"
    //                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center gap-2"
    //                     onClick={toggleBrandModal}
    //                   >
    //                     <FiPlus size={24} className="text-white" />
    //                     Add Brand
    //                   </button>

    //                   {showModal && (
    //                     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    //                       <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-96 overflow-hidden">
    //                         <div className="w-full flex items-center justify-between">
    //                           <h3 className="text-lg font-semibold mb-4">
    //                             Add Brand
    //                           </h3>
    //                           <IoClose
    //                             size={24}
    //                             color="black"
    //                             onClick={toggleBrandModal}
    //                             className="cursor-pointer"
    //                           />
    //                         </div>
    //                         <div className="w-full flex gap-2">
    //                           <input
    //                             placeholder="Brand Name"
    //                             {...register("brandName")}
    //                             type="text"
    //                             className="input w-full border rounded border-gray-300 p-2"
    //                           />
    //                           <button
    //                             type="button"
    //                             className="w-16 border rounded-sm border-gray-300 flex items-center justify-center"
    //                             onClick={addBrands}
    //                           >
    //                             <FiPlus size={24} className="text-black" />
    //                           </button>
    //                         </div>
    //                         <div className="w-full h-64 mt-2 p-2 overflow-x-hidden overflow-y-auto">
    //                           {fields.map((item, index) => (
    //                             <div
    //                               key={item.id} // Use `item.id` provided by `useFieldArray`
    //                               className="w-full flex items-center justify-between p-2 rounded border border-gray-300 mt-1 first:mt-0"
    //                             >
    //                               <span className="block text-sm text-gray-600 break-words max-w-[90%]">
    //                                 {/* Ensure the text wraps properly and doesn't overflow */}
    //                                 {item.name}
    //                               </span>
    //                               <button
    //                                 onClick={() => remove(index)}
    //                                 className="flex-shrink-0" // Ensure button doesn't shrink
    //                               >
    //                                 <IoClose
    //                                   size={18}
    //                                   className="text-gray-400 hover:text-gray-600"
    //                                 />
    //                               </button>
    //                             </div>
    //                           ))}
    //                         </div>
    //                       </div>
    //                     </div>
    //                   )}
    //                 </div>
    //               </div>
    //             </fieldset>

    //             {/* Product Details */}
    //             <fieldset className="bg-white p-4">
    //               <legend className="text-lg font-semibold">
    //                 Products Details
    //               </legend>

    //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Category
    //                   </label>
    //                   <div className="flex justify-between gap-2">
    //                     <select
    //                       {...register("category")}
    //                       className="select w-[90%] border rounded border-gray-300 p-3"
    //                     >
    //                       {categories.map((category) => (
    //                         <option value={category}>{category}</option>
    //                       ))}
    //                     </select>
    //                     <button
    //                       className="p-3 border rounded border-gray-300"
    //                       type="button"
    //                       onClick={toggleCategoryModal}
    //                     >
    //                       <FiPlus size={24} className="text-gray-600" />
    //                     </button>
    //                   </div>
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Sub Category
    //                   </label>
    //                   <div className="flex justify-between gap-2">
    //                     <select
    //                       {...register("subCategory")}
    //                       className="select w-[90%] border rounded border-gray-300 p-3"
    //                       disabled={!selectedCategory} // Disable if no category is selected
    //                     >
    //                       <option value="">Select a subcategory</option>
    //                       {selectedCategory &&
    //                         subCategories[selectedCategory]?.map((item) => (
    //                           <option key={item} value={item}>
    //                             {item}
    //                           </option>
    //                         ))}
    //                     </select>
    //                     <button
    //                       className="p-3 border rounded border-gray-300"
    //                       type="button"
    //                       onClick={toggleSubCategoryModal}
    //                     >
    //                       <FiPlus size={24} className="text-gray-600" />
    //                     </button>
    //                   </div>
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Tag
    //                   </label>
    //                   <input
    //                     {...register("tag")}
    //                     placeholder="Tag"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>
    //               </div>

    //               <div className="w-full px-6">
    //                 <div className="flex items-end justify-start gap-2">
    //                   <div>
    //                     <label className="block text-sm font-medium text-gray-700 mb-1">
    //                       Add Product
    //                     </label>
    //                     <input
    //                       type="text"
    //                       {...register("productName")}
    //                       placeholder="Enter Product Name"
    //                       className="input w-52 border rounded border-gray-300 p-3"
    //                     />
    //                   </div>

    //                   <div
    //                     className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
    //                     onClick={() =>
    //                       document.getElementById("inputImage").click()
    //                     }
    //                   >
    //                     <input
    //                       disabled={imageLoading}
    //                       id="inputImage"
    //                       type="file"
    //                       accept={"image/*"}
    //                       className="hidden"
    //                       onChange={handleFileChange}
    //                     />
    //                     <div className="flex flex-col items-center justify-center">
    //                       {!selectedImage ? (
    //                         <FcImageFile className="text-4xl" />
    //                       ) : (
    //                         <img
    //                           src={URL.createObjectURL(selectedImage)}
    //                           className="h-9 w-9 object-cover rounded"
    //                         />
    //                       )}
    //                     </div>
    //                   </div>
    //                   {/* <button
    //                   type="button"
    //                   className="w-12 h-12 flex items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
    //                   onClick={uploadProduct}
    //                 >
    //                   <FiPlus size={20} />
    //                 </button> */}
    //                   <button
    //                     disabled={imageLoading}
    //                     onClick={uploadProduct}
    //                     type="button"
    //                     className="h-12 px-4 py-2 gap-2 flex items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
    //                   >
    //                     {imageLoading ? "Uploading" : "Upload"}
    //                     <IoMdCloudUpload size={20} />
    //                   </button>
    //                 </div>
    //                 {/* List of Products */}
    //                 <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
    //                   {serviceProducts.slice(0, 4).map((product, index) => (
    //                     <div
    //                       key={index}
    //                       className="flex items-center gap-2 border p-2 rounded"
    //                     >
    //                       {product.image && (
    //                         <img
    //                           src={product.image}
    //                           alt={product.title}
    //                           className="h-20 w-20 object-cover rounded"
    //                         />
    //                       )}
    //                       <div className="flex-1">
    //                         <p className="text-sm font-medium">
    //                           Title: {product.title}
    //                         </p>
    //                       </div>

    //                       <button
    //                         type="button"
    //                         onClick={() => deleteProduct(product.id)}
    //                         className="p-2 text-red-600 border border-red-500 rounded hover:bg-red-100"
    //                       >
    //                         <FiTrash size={20} />
    //                       </button>
    //                     </div>
    //                   ))}
    //                 </div>
    //                 {serviceProducts.length > 4 && (
    //                   <div className="w-full flex justify-end mt-1">
    //                     <button
    //                       className="text-sm text-blue-500 hover:text-blue-600"
    //                       type="button"
    //                       onClick={() => setVisibleProducts(true)}
    //                     >
    //                       View more
    //                     </button>
    //                   </div>
    //                 )}
    //               </div>
    //             </fieldset>

    //             {/* Tax Details */}
    //             <fieldset className="bg-white p-4">
    //               <legend className="text-lg font-semibold">Tax Details</legend>
    //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     GST
    //                   </label>
    //                   <input
    //                     {...register("gst")}
    //                     placeholder="Enter GST Number"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                   <PDFFileSelector
    //                     register={register}
    //                     setValue={setValue}
    //                     errors={errors}
    //                     fieldName={"gstPdf"}
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     PAN
    //                   </label>
    //                   <input
    //                     {...register("pan")}
    //                     placeholder="Enter PAN Number"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                   <PDFFileSelector
    //                     register={register}
    //                     setValue={setValue}
    //                     errors={errors}
    //                     fieldName={"panPdf"}
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     TAN
    //                   </label>
    //                   <input
    //                     {...register("tan")}
    //                     placeholder="Enter TAN Number"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                   <PDFFileSelector
    //                     register={register}
    //                     setValue={setValue}
    //                     errors={errors}
    //                     fieldName={"tanPdf"}
    //                   />
    //                 </div>
    //               </div>
    //             </fieldset>

    //             {/* Bank Details */}
    //             <fieldset className="bg-white p-4">
    //               <legend className="text-lg font-semibold">
    //                 Bank Details
    //               </legend>
    //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Account Type
    //                   </label>
    //                   <select
    //                     {...register("accountType")}
    //                     className="select w-full border rounded border-gray-300 p-3"
    //                   >
    //                     <option value="Saving">Saving</option>
    //                     <option value="Current">Current</option>
    //                   </select>
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Account Number
    //                   </label>
    //                   <input
    //                     {...register("accountNumber")}
    //                     placeholder="Account Number"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Confirm Account Number
    //                   </label>
    //                   <input
    //                     {...register("confirmAccountNumber")}
    //                     placeholder="Confirm Account Number"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>

    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     IFSC Code
    //                   </label>
    //                   <input
    //                     {...register("ifsc")}
    //                     placeholder="IFSC Code"
    //                     className="input w-full border rounded border-gray-300 p-3"
    //                   />
    //                 </div>
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Cancel Cheque
    //                   </label>
    //                   <PDFFileSelector
    //                     register={register}
    //                     setValue={setValue}
    //                     errors={errors}
    //                     fieldName={"cancelCheque"}
    //                   />
    //                 </div>
    //               </div>
    //             </fieldset>

    //             <div className="flex items-center space-x-2 mt-4 w-full bg-white p-4">
    //               <input
    //                 type="checkbox"
    //                 id="terms"
    //                 checked={isLive}
    //                 onChange={(e) => setIsLive(e.target.checked)}
    //                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
    //               />
    //               <label htmlFor="terms" className="text-sm text-gray-700">
    //                 Mark as Live
    //               </label>
    //             </div>

    //             <div className="flex w-full justify-end mt-4 py-2">
    //               <button
    //                 type="submit"
    //                 className="btn btn-primary ml-auto mr-0 w-36 p-3 rounded bg-blue-400 hover:bg-blue-500 text-white font-medium"
    //               >
    //                 Submit
    //               </button>
    //             </div>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {visibleProducts && (
    //     <ProductsList
    //       products={serviceProducts}
    //       onClose={() => setVisibleProducts(false)}
    //       remove={deleteProduct}
    //     />
    //   )}

    //   {visibleCategoryModal && (
    //     <AddCategory
    //       onClose={toggleCategoryModal}
    //       handleCategory={handleCategory}
    //     />
    //   )}

    //   {visibleSubCategoryModal && (
    //     <AddSubCategory
    //       categories={categories}
    //       onClose={toggleSubCategoryModal}
    //       handleSubCategory={handleSubCategory}
    //     />
    //   )}
    // </div>

    <div className="absolute inset-0 w-full z-50">
      <div className="flex flex-col bg-gray-100 h-full">
        {/* Header */}
        <div className="sticky top-0 w-full bg-gray-100 z-10">
          <div className="flex justify-between items-center py-6 px-8">
            <h1 className="text-xl font-semibold">Welcome Call</h1>
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
            <div className="w-full flex justify-end pr-2">
              <p className="text-sm text-gray-600">{`${progress}%`}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto mt-4 px-4">
          <div className="container mx-auto flex flex-col sm:flex-row gap-2">
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
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Remarks
                </label>

                <textarea
                  placeholder="Enter Remarks"
                  className="w-full border rounded border-gray-300 p-3 h-24"
                />

                <button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>
                    console.log("Add remark functionality not implemented yet")
                  }
                >
                  Add Remark
                </button>

                {/* <div className="w-full flex flex-col sm:flex-row gap-2 mt-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Disposition
                    </label>
                    <select className="select w-full border rounded border-gray-300 p-3">
                      {dispositions.map((disposition) => (
                        <option key={disposition} value={disposition}>
                          {disposition}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Sub Disposition
                    </label>
                    <select className="select w-full border rounded border-gray-300 p-3">
                      {subDispositions[dispositions[0]].map((disposition) => (
                        <option key={disposition} value={disposition}>
                          {disposition}
                        </option>
                      ))}
                    </select>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Right Panel - Main form */}
            <div className="w-full sm:w-3/4 bg-white p-4">
              <h1 className="text-2xl font-bold mb-4">Welcome Call Form</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <fieldset className="bg-white p-4">
                  <legend className="text-lg font-semibold">
                    Personal Details
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        {...register("firstName", { required: true })}
                        placeholder="First Name"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                      {errors.firstName && (
                        <p className="text-red-500">First Name is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        {...register("lastName", { required: true })}
                        placeholder="Last Name"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation/Job Title
                      </label>
                      <input
                        {...register("jobTitle")}
                        placeholder="Designation/Job Title"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        {...register("mobile")}
                        placeholder="Mobile Number"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        {...register("email", { pattern: /^\S+@\S+$/i })}
                        placeholder="Email"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    {serviceType === "distributor" ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          {...register("whatsAppNumber")}
                          placeholder="WhatsApp Number"
                          type="number"
                          className="input w-full border rounded border-gray-300 p-3"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alt Email
                        </label>
                        <input
                          {...register("altEmail")}
                          placeholder="Alternative Email"
                          className="input w-full border rounded border-gray-300 p-3"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location/City
                      </label>
                      <input
                        {...register("location")}
                        placeholder="Location/City"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Business Details */}
                <fieldset className="bg-white p-4">
                  <legend className="text-lg font-semibold">
                    Business Details
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        {...register("companyName", { required: true })}
                        placeholder="Company Name"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Type
                      </label>
                      <select
                        {...register("companyType")}
                        className="select w-full border rounded border-gray-300 p-3"
                      >
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Private Limited">Private Limited</option>
                        <option value="Public Limited">Public Limited</option>
                        <option value="LLP">LLP</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {serviceType === "distributor" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience
                        </label>
                        <input
                          {...register("experience", { required: true })}
                          placeholder="Experience (in years)"
                          type="number"
                          className="input w-full border rounded border-gray-300 p-3"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Turnover
                      </label>
                      <div className="flex gap-2">
                        <input
                          {...register("turnover")}
                          placeholder="Turnover"
                          className="input w-full border rounded border-gray-300 p-3"
                        />
                        <select
                          {...register("type")}
                          className="select w-full border rounded border-gray-300 p-3"
                        >
                          <option value="lakh">Lakh</option>
                          <option value="crore">Crore</option>
                          <option value="million">Million</option>
                          <option value="billion">Billion</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Establishment
                      </label>
                      <input
                        {...register("yearOfEstablishment")}
                        placeholder="Year of Establishment"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address
                      </label>
                      <input
                        {...register("address")}
                        placeholder="Full Address"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        {...register("pincode")}
                        placeholder="Pincode"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        {...register("city")}
                        placeholder="City"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        {...register("state")}
                        placeholder="State"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    {serviceType === "distributor" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Investment Budget
                          </label>
                          <input
                            {...register("investmentBudget")}
                            placeholder="Investment Budget"
                            type="number"
                            className="input w-full border rounded border-gray-300 p-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Visiting Card
                          </label>
                          <div
                            className="w-full flex items-center gap-2 border rounded border-gray-300 p-3 hover:cursor-pointer"
                            onClick={() =>
                              document.getElementById("visitingCard").click()
                            }
                          >
                            <CiImageOn size={24} />
                            <span className="block text-sm font-medium text-gray-700">
                              Select visiting card
                            </span>
                            <input
                              {...register("visitingCard")}
                              id="visitingCard"
                              type="file"
                              accept={"image/*"}
                              className="hidden"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brands Working With
                          </label>
                          <button
                            type="button"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center gap-2"
                            onClick={toggleBrandModal}
                          >
                            <FiPlus size={24} className="text-white" />
                            Add Brand
                          </button>

                          {showModal && (
                            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-96 overflow-hidden">
                                <div className="w-full flex items-center justify-between">
                                  <h3 className="text-lg font-semibold mb-4">
                                    Add Brand
                                  </h3>
                                  <IoClose
                                    size={24}
                                    color="black"
                                    onClick={toggleBrandModal}
                                    className="cursor-pointer"
                                  />
                                </div>
                                <div className="w-full flex gap-2">
                                  <input
                                    placeholder="Brand Name"
                                    {...register("brandName")}
                                    type="text"
                                    className="input w-full border rounded border-gray-300 p-2"
                                  />
                                  <button
                                    type="button"
                                    className="w-16 border rounded-sm border-gray-300 flex items-center justify-center"
                                    onClick={addBrands}
                                  >
                                    <FiPlus size={24} className="text-black" />
                                  </button>
                                </div>
                                <div className="w-full h-64 mt-2 p-2 overflow-x-hidden overflow-y-auto">
                                  {fields.map((item, index) => (
                                    <div
                                      key={item.id} // Use `item.id` provided by `useFieldArray`
                                      className="w-full flex items-center justify-between p-2 rounded border border-gray-300 mt-1 first:mt-0"
                                    >
                                      <span className="block text-sm text-gray-600 break-words max-w-[90%]">
                                        {/* Ensure the text wraps properly and doesn't overflow */}
                                        {item.name}
                                      </span>
                                      <button
                                        onClick={() => remove(index)}
                                        className="flex-shrink-0" // Ensure button doesn't shrink
                                      >
                                        <IoClose
                                          size={18}
                                          className="text-gray-400 hover:text-gray-600"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </fieldset>

                {/* Product Details */}
                <fieldset className="bg-white p-4">
                  <legend className="text-lg font-semibold">
                    Products Details
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <div className="flex justify-between gap-2">
                        <select
                          {...register("category")}
                          className="select w-[90%] border rounded border-gray-300 p-3"
                        >
                          {categories.map((category) => (
                            <option value={category}>{category}</option>
                          ))}
                        </select>
                        <button
                          className="p-3 border rounded border-gray-300"
                          type="button"
                          onClick={toggleCategoryModal}
                        >
                          <FiPlus size={24} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Category
                      </label>
                      <div className="flex justify-between gap-2">
                        <select
                          {...register("subCategory")}
                          className="select w-[90%] border rounded border-gray-300 p-3"
                          disabled={!selectedCategory} // Disable if no category is selected
                        >
                          <option value="">Select a subcategory</option>
                          {selectedCategory &&
                            subCategories[selectedCategory]?.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                        </select>
                        <button
                          className="p-3 border rounded border-gray-300"
                          type="button"
                          onClick={toggleSubCategoryModal}
                        >
                          <FiPlus size={24} className="text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tag
                      </label>
                      <input
                        {...register("tag")}
                        placeholder="Tag"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>
                  </div>

                  <div className="w-full px-6">
                    <div className="flex items-end justify-start gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Add Product
                        </label>
                        <input
                          type="text"
                          {...register("productName")}
                          placeholder="Enter Product Name"
                          className="input w-52 border rounded border-gray-300 p-3"
                        />
                      </div>

                      <div
                        className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          document.getElementById("inputImage").click()
                        }
                      >
                        <input
                          disabled={imageLoading}
                          id="inputImage"
                          type="file"
                          accept={"image/*"}
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div className="flex flex-col items-center justify-center">
                          {!selectedImage ? (
                            <FcImageFile className="text-4xl" />
                          ) : (
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              className="h-9 w-9 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                      {/* <button
                      type="button"
                      className="w-12 h-12 flex items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
                      onClick={uploadProduct}
                    >
                      <FiPlus size={20} />
                    </button> */}
                      <button
                        disabled={imageLoading}
                        onClick={uploadProduct}
                        type="button"
                        className="h-12 px-4 py-2 gap-2 flex items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
                      >
                        {imageLoading ? "Uploading" : "Upload"}
                        <IoMdCloudUpload size={20} />
                      </button>
                    </div>
                    {/* List of Products */}
                    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                      {serviceProducts.slice(0, 4).map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 border p-2 rounded"
                        >
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-20 w-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Title: {product.title}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-red-600 border border-red-500 rounded hover:bg-red-100"
                          >
                            <FiTrash size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {serviceProducts.length > 4 && (
                      <div className="w-full flex justify-end mt-1">
                        <button
                          className="text-sm text-blue-500 hover:text-blue-600"
                          type="button"
                          onClick={() => setVisibleProducts(true)}
                        >
                          View more
                        </button>
                      </div>
                    )}
                  </div>
                </fieldset>

                {/* Tax Details */}
                <fieldset className="bg-white p-4">
                  <legend className="text-lg font-semibold">Tax Details</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST
                      </label>
                      <input
                        {...register("gst")}
                        placeholder="Enter GST Number"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                      <PDFFileSelector
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        fieldName={"gstPdf"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN
                      </label>
                      <input
                        {...register("pan")}
                        placeholder="Enter PAN Number"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                      <PDFFileSelector
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        fieldName={"panPdf"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TAN
                      </label>
                      <input
                        {...register("tan")}
                        placeholder="Enter TAN Number"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                      <PDFFileSelector
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        fieldName={"tanPdf"}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Bank Details */}
                <fieldset className="bg-white p-4">
                  <legend className="text-lg font-semibold">
                    Bank Details
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type
                      </label>
                      <select
                        {...register("accountType")}
                        className="select w-full border rounded border-gray-300 p-3"
                      >
                        <option value="Saving">Saving</option>
                        <option value="Current">Current</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        {...register("accountNumber")}
                        placeholder="Account Number"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Account Number
                      </label>
                      <input
                        {...register("confirmAccountNumber")}
                        placeholder="Confirm Account Number"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code
                      </label>
                      <input
                        {...register("ifsc")}
                        placeholder="IFSC Code"
                        className="input w-full border rounded border-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cancel Cheque
                      </label>
                      <PDFFileSelector
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        fieldName={"cancelCheque"}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Submit Button */}
                <div className="flex w-full justify-end mt-4 py-2">
                  <button
                    type="submit"
                    className="btn btn-primary ml-auto mr-0 w-36 p-3 rounded bg-blue-400 hover:bg-blue-500 text-white font-medium"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Product list, Category, SubCategory, etc. */}
      {visibleProducts && (
        <ProductsList
          products={serviceProducts}
          onClose={() => setVisibleProducts(false)}
          remove={deleteProduct}
        />
      )}

      {visibleCategoryModal && (
        <AddCategory
          onClose={toggleCategoryModal}
          handleCategory={handleCategory}
        />
      )}

      {visibleSubCategoryModal && (
        <AddSubCategory
          categories={categories}
          onClose={toggleSubCategoryModal}
          handleSubCategory={handleSubCategory}
        />
      )}
    </div>
  );
}

const AddCategory = ({ onClose, handleCategory }) => {
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full bg-black/35 z-[100]">
      <div className="w-full max-w-96 mx-auto bg-white rounded-lg overflow-x-hidden overflow-y-auto p-6">
        <div className="flex w-full p-2 justify-end">
          <button onClick={onClose}>
            <IoClose size={24} color="black" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 mt-2">
          <input
            type="text"
            placeholder={"Enter Category Name"}
            className="input w-full border rounded border-gray-300 p-3"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={() => {
              if (!text) {
                alert("Please enter category name");
                return;
              }
              handleCategory(text);
            }}
            type="button"
            className="w-full h-12 flex gap-2 items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
          >
            <FiPlus size={20} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const AddSubCategory = ({ onClose, categories, handleSubCategory }) => {
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleChange = () => {
    if (!text) {
      alert("Please enter sub category name");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category");
    }

    handleSubCategory(selectedCategory, text);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full bg-black/35 z-[100]">
      <div className="w-full max-w-96 mx-auto bg-white rounded-lg overflow-x-hidden overflow-y-auto p-6">
        <div className="flex w-full p-2 justify-end">
          <button onClick={onClose}>
            <IoClose size={24} color="black" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 mt-2">
          <select
            className="select w-full border rounded border-gray-300 p-3 mb-2"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value={""}>Select Category</option>
            {categories.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={"Enter Sub Category Name"}
            className="input w-full border rounded border-gray-300 p-3"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleChange}
            type="button"
            className="w-full h-12 flex gap-2 items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
          >
            <FiPlus size={20} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsList = ({ products, onClose, remove }) => {
  return (
    <div className="fixed inset-0 w-full bg-black/35 z-[100] p-6">
      <div className="w-full max-w-96 mx-auto bg-white rounded-lg overflow-x-hidden overflow-y-auto">
        <div className="flex w-full p-2 justify-end">
          <button onClick={onClose}>
            <IoClose size={24} color="black" />
          </button>
        </div>
        <div className="w-full flex flex-col gap-2 mt-4">
          {products.map((field, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border p-2 rounded"
            >
              {field.image && (
                <img
                  src={field.image}
                  alt={field.title}
                  className="h-20 w-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">Title: {field.title}</p>
              </div>

              <button
                type="button"
                onClick={() => remove(field.id)}
                className="p-2 text-red-600 border border-red-500 rounded hover:bg-red-100"
              >
                <FiTrash size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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

export default UpdateLeadModal;
