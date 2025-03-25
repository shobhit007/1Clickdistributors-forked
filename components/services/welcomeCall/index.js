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

  const [visibleProducts, setVisibleProducts] = useState(false);
  const [visibleCategoryModal, setVisibleCategoryModal] = useState(false);
  const [visibleSubCategoryModal, setVisibleSubCategoryModal] = useState(false);
  const [serviceProducts, setServiceProducts] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("personal_details");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedDisposition, setSelectedDisposition] = useState(
    welcomeCallDispositions[0].value
  );
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

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

  // set category and sub category
  useEffect(() => {
    if (categories.length > 0) {
      const category = selectedRow?.category || categories[0];
      const subCategory =
        selectedRow?.subCategory ||
        (subCategories[category] && subCategories[category].length > 0
          ? subCategories[category][0]
          : "");

      setSelectedCategory(category);
      setSelectedSubCategory(subCategory);
    }
  }, [categories, subCategories, selectedRow]);

  // set default company name
  useEffect(() => {
    const welcomeCallData = data?.welcomeCallData;
    if (selectedRow && !welcomeCallData?.companyName) {
      setValue("companyName", selectedRow?.company_name);
    }
  }, [selectedRow, setValue, data]);

  // set products
  useEffect(() => {
    const products = data?.products;
    if (products) {
      setServiceProducts(products);
    }
  }, [data]);

  const fetchCategoriesAndSubCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/getCategoriesAndSubCategories`;

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the states with fetched data
          setCategories(data.categories || []);
          setSubCategories(data.subCategories || {});
        } else {
          toast.error(data.message || "Failed to fetch categories");
        }
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubCategories();
  }, []); // Empty dependency array means this runs once when component mounts

  const selectedImage = watch("productImage");

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
              image: "www.example.com",
            },
          }),
        });

        if (response.ok) {
          setValue("productName", "");
          setValue("productImage", null);
          setImageLoading(false);
          refetch();
          toast.success("Product uploaded successfully");
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
      category: selectedCategory,
      subCategory: selectedSubCategory,
      // whatsAppNumber: data.whatsAppNumber,
      tag: data.tag,
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

  const toggleCategoryModal = () => setVisibleCategoryModal((p) => !p);
  const toggleSubCategoryModal = () => setVisibleSubCategoryModal((p) => !p);

  const handleCategory = (val) => {
    if (!val) {
      toast.error("Please enter a category");
    }
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
    category: selectedCategory,
    subCategory: selectedSubCategory,
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

  // remove category
  const removeCategory = async (categoryToRemove) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/removeProductCategory`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: categoryToRemove,
        }),
      });

      if (response.ok) {
        toast.success("Category removed successfully");
        setCategories((prev) => prev.filter((cat) => cat !== categoryToRemove));
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to remove category");
      }
    } catch (error) {
      toast.error("Error removing category");
      console.error(error);
    }
  };

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
        <ProductDetails
          register={register}
          errors={errors}
          serviceType={serviceType}
          categories={categories}
          subCategories={subCategories}
          toggleCategoryModal={toggleCategoryModal}
          toggleSubCategoryModal={toggleSubCategoryModal}
          handleFileChange={handleFileChange}
          imageLoading={imageLoading}
          uploadProduct={uploadProduct}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedImage={selectedImage}
          setSelectedCategory={setSelectedCategory}
          setSelectedSubCategory={setSelectedSubCategory}
        />
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
          categories={categories}
          removeCategory={removeCategory}
        />
      )}

      {visibleSubCategoryModal && (
        <AddSubCategory
          categories={categories}
          onClose={toggleSubCategoryModal}
          handleSubCategory={handleSubCategory}
          subCategories={subCategories}
          setSubCategories={setSubCategories}
        />
      )}
    </div>
  );
}

const AddCategory = ({
  onClose,
  handleCategory,
  categories,
  removeCategory,
}) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewCategory = async () => {
    if (!text) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/addProductCategory`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: text,
        }),
      });

      if (response.ok) {
        toast.success("Category added successfully");
        handleCategory(text);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add category");
      }
    } catch (error) {
      toast.error("Error adding category");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full bg-black/35 z-[100]">
      <div className="w-full max-w-96 mx-auto bg-white rounded-lg overflow-x-hidden overflow-y-auto p-6">
        <div className="flex w-full p-2 justify-end">
          <button onClick={onClose}>
            <IoClose size={24} color="black" />
          </button>
        </div>

        {/* Category List */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Existing Categories
          </h3>
          <div className="max-h-40 overflow-y-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border-b hover:bg-gray-50"
              >
                <span className="text-sm text-gray-700">{category}</span>
                <button
                  onClick={() => removeCategory(category)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Category Form */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Enter Category Name"
            className="input w-full border rounded border-gray-300 p-3"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={addNewCategory}
            disabled={loading}
            type="button"
            className={`w-full h-12 flex gap-2 items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              "Adding..."
            ) : (
              <>
                <FiPlus size={20} />
                Add Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddSubCategory = ({
  onClose,
  categories,
  handleSubCategory,
  subCategories,
  setSubCategories,
}) => {
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewSubCategory = async () => {
    if (!text || !selectedCategory) {
      toast.error("Please select category and enter subcategory name");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/addProductSubCategory`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: selectedCategory,
          subCategory: text,
        }),
      });

      if (response.ok) {
        toast.success("Subcategory added successfully");
        handleSubCategory(selectedCategory, text);
        setText("");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add subcategory");
      }
    } catch (error) {
      toast.error("Error adding subcategory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeSubCategory = async (category, subCategory) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/removeProductSubCategory`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          subCategory,
        }),
      });

      if (response.ok) {
        toast.success("Subcategory removed successfully");
        setSubCategories((prev) => ({
          ...prev,
          [category]: prev[category].filter((sub) => sub !== subCategory),
        }));
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to remove subcategory");
      }
    } catch (error) {
      toast.error("Error removing subcategory");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full bg-black/35 z-[100]">
      <div className="w-full max-w-96 mx-auto bg-white rounded-lg overflow-x-hidden overflow-y-auto p-6">
        <div className="flex w-full p-2 justify-end">
          <button onClick={onClose}>
            <IoClose size={24} color="black" />
          </button>
        </div>

        {/* Existing SubCategories List */}
        {selectedCategory && subCategories[selectedCategory]?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Existing Subcategories for {selectedCategory}
            </h3>
            <div className="max-h-40 overflow-y-auto">
              {subCategories[selectedCategory]?.map((subCat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border-b hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{subCat}</span>
                  <button
                    onClick={() => removeSubCategory(selectedCategory, subCat)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New SubCategory Form */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <select
            className="select w-full border rounded border-gray-300 p-3 mb-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter Sub Category Name"
            className="input w-full border rounded border-gray-300 p-3"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={addNewSubCategory}
            disabled={loading}
            type="button"
            className={`w-full h-12 flex gap-2 items-center justify-center text-blue-600 border border-blue-500 rounded hover:bg-blue-100 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              "Adding..."
            ) : (
              <>
                <FiPlus size={20} />
                Add Subcategory
              </>
            )}
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

export default WelcomeCall;
