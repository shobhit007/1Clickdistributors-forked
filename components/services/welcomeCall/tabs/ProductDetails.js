import ProductDetailView, {
  getIcon,
} from "@/components/manufacturer/ProductDetailView";
import CustomInput from "@/components/uiCompoents/CustomInput";
import CustomSelector from "@/components/uiCompoents/CustomSelector";
import { uploadMediaFileToDB } from "@/lib/commonFunctions";
import { units } from "@/lib/data/servicePanelData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FcImageFile } from "react-icons/fc";
import { FiPlus, FiTrash } from "react-icons/fi";
import { IoMdCloudUpload } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdCurrencyRupee, MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import useModal from "@/components/hooks/useModal";
import AnimatedModal from "@/components/utills/AnimatedModal";
import ConfirmationModal from "@/components/uiCompoents/ConfirmationModal";

function ProductDetails({ selectedRow }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { open, close, modalOpen } = useModal();

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 769) {
        setIsSmallDevice(true);
      } else {
        setIsSmallDevice(false);
      }
    };
    check();

    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  const getUserProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/getAllProductsOfUser`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leadId: selectedRow?.leadId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (selectedProduct) {
          let found = data?.products.find(
            (item) => item.productId === selectedProduct.productId
          );
          if (found != -1) {
            setSelectedProduct(found);
          }
        }
        return data?.products || [];
      } else {
        toast.error(data.message || "Something went wrong");
        return null;
      }
    } catch (error) {
      console.log("error in getting products", error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ["currentUserProducts", selectedRow?.leadId],
    queryFn: getUserProducts,
    enabled: !!selectedRow?.leadId,
  });

  // Clear selected product along with closing the modal
  const onCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleProductClick = (item, isEdit = false) => {
    if (isEdit) {
      setShowModal(true);
      setSelectedProduct(item);
    } else {
      setSelectedProduct(item);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      console.log("deleting product", productId, selectedRow);
      if (!productId || !selectedRow?.leadId) {
        toast.error("Invalid product or something went wrong");
        return;
      }

      setDeletingProduct(true);
      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/deleteProduct`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, leadId: selectedRow?.leadId }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        setProductToDelete(null);
        refetchProducts();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error("Error deleting product");
    } finally {
      setDeletingProduct(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold">Products Details</h3>
        <div className="w-full flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        <div className="mt-4 max-h-[100vh] overflow-y-auto">
          {products?.map((item, index) => {
            return (
              <div
                key={index}
                className="w-full bg-white/60 h-auto rounded-md overflow-hidden flex gap-2 p-3 cursor-pointer hover:bg-blue-100/20 items-center"
                onClick={(e) => {
                  // Only open detail view if not clicking on action buttons
                  if (!e.defaultPrevented) {
                    handleProductClick(item);
                  }
                }}
              >
                <div className="w-[70px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-md overflow-hidden">
                  <Image
                    src={item.image || "/products.png"}
                    alt="Item Image"
                    width={110}
                    height={110}
                    priority
                    objectFit="contain"
                  />
                </div>

                <div className="flex flex-1 flex-col items-start py-2 ml-5">
                  <h1 className="text-sm sm:text-base font-semibold text-orange-800">
                    {item.title} , {item.brand}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-orange-800 text-[10px] sm:text-xs py-[2px] px-2 rounded-full bg-orange-500/20">
                      {item.category}
                      <span className="text-[11px] ml-1">
                        ({item.subCategory})
                      </span>
                    </span>

                    <div className="flex items-center gap-1">
                      <MdCurrencyRupee className="text-xs sm:text-base text-orange-800" />
                      <span className="text-orange-800 text-xs sm:text-sm">
                        {item.MRP}
                      </span>
                    </div>
                  </div>

                  <p className="text-orange-700/60 mt-1 text-xs sm:text-sm">
                    {item.description}
                  </p>

                  <div
                    className="flex items-center gap-4 mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip title="Edit Product" placement="top">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleProductClick(item, true);
                        }}
                      >
                        <CiEdit className="text-blue-700 text-lg cursor-pointer" />
                      </button>
                    </Tooltip>

                    <Tooltip title="Delete item" placement="top">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setProductToDelete(item);
                          open();
                        }}
                      >
                        <MdDeleteOutline className="text-red-700 text-lg cursor-pointer" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Product</h2>
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose className="text-lg" />
                </button>
              </div>
              <EditProduct
                data={selectedProduct || null}
                close={onCloseModal}
                userDetails={selectedRow}
              />
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && !showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[95%] max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Product Details</h2>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose className="text-lg" />
                </button>
              </div>
              <ProductDetailView
                product={selectedProduct}
                close={() => setSelectedProduct(null)}
                visibleEditButton={false}
              />
            </div>
          </div>
        )}
      </div>

      <AnimatedModal close={close} open={open} modalOpen={modalOpen}>
        <ConfirmationModal
          heading="Are you sure?"
          subHeading={`You really want to delete this product?\nThis cannot be undone later.`}
          confirmationText="Yes, delete"
          cancelText="Not now"
          onConfirm={() => {
            if (productToDelete) {
              handleDeleteProduct(productToDelete.productId);
              close();
            }
          }}
          onCancel={() => {
            setProductToDelete(null);
            close();
          }}
          loading={deletingProduct}
        />
      </AnimatedModal>
    </>
  );
}

export const EditProduct = ({ data, close, userDetails }) => {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  // const { userDetails } = useContext(manufacturerContext);

  const productSchema = {
    title: "",
    brand: "",
    category: "",
    subCategory: "",
    ingredients: "",
    MRP: null,
    material: null,
    thickness: null,
    dimension: null,
    measuringUnit: "",
    quantityOrSize: "",
    foodType: "",
    description: "",
    shelfLife: "",
    FSSAI_Lic_No: null,
    countryOfOrigin: "",
  };
  const productFieldNames = {
    title: "Prduct title",
    brand: "Brand",
    category: "Product Category",
    subCategory: "Sub Category",
    ingredients: "Ingredients",
    MRP: "MRP",
    material: "Material",
    thickness: "Thickness",
    dimension: "Dimensions",
    measuringUnit: "Measuring unit",
    quantityOrSize: "Quantity or Size",
    foodType: "Food Type",
    description: "Description",
    shelfLife: "Shelf Life",
    FSSAI_Lic_No: "FSSAI License no",
    countryOfOrigin: "Coutry of origin",
  };
  const [product, setProduct] = useState(productSchema);
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [otherDataFields, setOtherDataFields] = useState({});

  const handleOtherFieldsChange = (value, key) => {
    setOtherDataFields((pre) => ({ ...pre, [key]: value }));
  };

  const simpleFields = [
    "title",
    "brand",
    "ingredients",
    "material",
    "dimension",
    "description",
    "countryOfOrigin",
    "thickness",
  ];

  const simpleFieldsWithNum = ["FSSAI_Lic_No", "MRP", "quantityOrSize"];
  const selectors = {
    category: [
      {
        label: "Fitness",
        value: "fitness",
        subCategory: [
          { label: "Gym Equipment", value: "gym_equipment" },
          { label: "Yoga Mats", value: "yoga_mats" },
          { label: "Dumbbells", value: "dumbbells" },
          { label: "Supplements", value: "supplements" },
          { label: "Wearables", value: "wearables" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Electronics",
        value: "electronics",
        subCategory: [
          { label: "Mobile Phones", value: "mobile_phones" },
          { label: "Laptops", value: "laptops" },
          { label: "Headphones", value: "headphones" },
          { label: "Smartwatches", value: "smartwatches" },
          { label: "Gaming Consoles", value: "gaming_consoles" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Fashion",
        value: "fashion",
        subCategory: [
          { label: "Men's Clothing", value: "mens_clothing" },
          { label: "Women's Clothing", value: "womens_clothing" },
          { label: "Footwear", value: "footwear" },
          { label: "Accessories", value: "accessories" },
          { label: "Jewelry", value: "jewelry" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Home & Kitchen",
        value: "home_kitchen",
        subCategory: [
          { label: "Furniture", value: "furniture" },
          { label: "Kitchen Appliances", value: "kitchen_appliances" },
          { label: "Cookware", value: "cookware" },
          { label: "Home Decor", value: "home_decor" },
          { label: "Storage & Organization", value: "storage_organization" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Beauty & Personal Care",
        value: "beauty_personal_care",
        subCategory: [
          { label: "Skincare", value: "skincare" },
          { label: "Haircare", value: "haircare" },
          { label: "Makeup", value: "makeup" },
          { label: "Fragrances", value: "fragrances" },
          { label: "Grooming Essentials", value: "grooming_essentials" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Sports & Outdoors",
        value: "sports_outdoors",
        subCategory: [
          { label: "Camping & Hiking", value: "camping_hiking" },
          { label: "Cycling", value: "cycling" },
          { label: "Team Sports", value: "team_sports" },
          { label: "Water Sports", value: "water_sports" },
          { label: "Outdoor Gear", value: "outdoor_gear" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Automotive",
        value: "automotive",
        subCategory: [
          { label: "Car Accessories", value: "car_accessories" },
          { label: "Bike Accessories", value: "bike_accessories" },
          { label: "Car Maintenance", value: "car_maintenance" },
          { label: "Motorcycle Gear", value: "motorcycle_gear" },
          { label: "Tires & Wheels", value: "tires_wheels" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Toys & Games",
        value: "toys_games",
        subCategory: [
          { label: "Board Games", value: "board_games" },
          { label: "Action Figures", value: "action_figures" },
          { label: "Educational Toys", value: "educational_toys" },
          { label: "Dolls & Plush Toys", value: "dolls_plush_toys" },
          { label: "Outdoor Play", value: "outdoor_play" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Books & Stationery",
        value: "books_stationery",
        subCategory: [
          { label: "Fiction", value: "fiction" },
          { label: "Non-Fiction", value: "non_fiction" },
          { label: "Educational Books", value: "educational_books" },
          { label: "Notebooks & Journals", value: "notebooks_journals" },
          { label: "Art Supplies", value: "art_supplies" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Health & Wellness",
        value: "health_wellness",
        subCategory: [
          { label: "Vitamins & Supplements", value: "vitamins_supplements" },
          { label: "Medical Equipment", value: "medical_equipment" },
          { label: "Mental Wellness", value: "mental_wellness" },
          { label: "Pain Relief", value: "pain_relief" },
          { label: "Weight Management", value: "weight_management" },
          { label: "Others", value: "others" },
        ],
      },
      {
        label: "Other",
        value: "others",
        subCategory: [{ label: "Other", value: "others" }],
      },
    ],
    subCategory: [
      { label: "Gym Equipment", value: "gym_equipment" },
      { label: "Yoga Mats", value: "yoga_mats" },
      { label: "Dumbbells", value: "dumbbells" },
      { label: "Supplements", value: "supplements" },
      { label: "Wearables", value: "wearables" },
    ],
    measuringUnit: units,
  };

  useEffect(() => {
    if (data) {
      setProduct((pre) => ({ ...pre, ...data }));
    }
  }, [data]);

  const isValidImageSize = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = img;
        console.log("width, height", width, height);
        URL.revokeObjectURL(img.src); // Clean up object URL
        if (width >= 500 && width <= 1025 && height >= 500 && height <= 1025) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const onChangeFile = async (e) => {
    let file = e.target.files[0];
    if (!file) {
      return;
    }

    // const isValid = await isValidImageSize(file);

    // if (!isValid) {
    //   toast.error("Image dimensions must be between 500x500 and 1000x1000.");
    //   return;
    // }

    if (inputRef?.current?.value) {
      inputRef.current.value = "";
    }
    const tempURL = URL.createObjectURL(file);
    if (tempURL) {
      setFile(file);
      setProduct((pre) => ({ ...pre, tempImageURL: tempURL }));
    } else {
      toast.error(message || "Error uploading file");
    }
  };

  const onChangeValue = (value, key) => {
    setProduct((pre) => ({ ...pre, [key]: value }));
  };

  const rowItemStyle = "w-full my-1";

  const feildsValidated = () => {
    if (!product.title || product.title?.length < 3) {
      toast.error("Product title must be atleast 3 characters long");
      return false;
    }
    if (product.MRP < 1) {
      toast.error("MRP must be greater than 0");
      return false;
    }
    if (!product.brand || product.brand?.length < 3) {
      toast.error("Brand name must be atleast 3 characters long");
      return false;
    }
    if (!product.description || product.description?.length < 10) {
      toast.error("Description must be atleast 10 characters long");
      return false;
    }

    return true;
  };

  const updateDetails = async () => {
    try {
      let body = { ...product, leadId: userDetails?.leadId };

      if (body.category == "others") {
        body.category = otherDataFields?.category;
        body.subCategory = otherDataFields?.subCategory;
      } else if (body.subCategory == "others") {
        body.subCategory = otherDataFields?.subCategory;
      }

      setUploading(true);
      if (file) {
        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        const storagePath = `userProducts/${userDetails?.docId}/${fileName}`;
        const uploadRes = await uploadMediaFileToDB(file, storagePath);
        console.log("upload res is", uploadRes);
        if (uploadRes.success) {
          let { downloadURL } = uploadRes;
          body.image = downloadURL;
          delete body.tempImageURL;
          setFile(null);
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // uncomment later
      // if (file) {
      //   console.log("file is", file);
      //   const resp = await uploadMediaFileToDB(file, `/products/${file.name}`);
      //   console.log("resp", resp);
      //   body.image = resp.downloadURL;
      //   delete body.tempImageURL;
      // }

      delete body.tempImageURL;
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/updateProduct`;
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
        queryClient.invalidateQueries(["userProducts"]);
        close();
      } else {
        toast.error(ress.message || "Something went wrong");
      }
    } catch (error) {
      console.log("error in updatePrduct", error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    setOtherDataFields({});
    setProduct((product) => ({ ...product, subCategory: "" }));
  }, [product?.category]);

  const getSubCategories = () => {
    if (!product.category) {
      return [];
    }
    let category = selectors?.category?.find(
      (item) => item.value == product.category
    );

    return category?.subCategory;
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[90%] w-full overflow-auto mt-2 py-2 px-3">
        {/* Image section */}
        <div
          className={`${rowItemStyle} my-2 pt-3 flex gap-2 flex-col items-start`}
        >
          <img
            src={product.tempImageURL || product.image}
            className="h-24 w-24 rounded-full shadow-xl border"
          />
          <button
            type="button"
            onClick={() => {
              inputRef?.current?.click();
            }}
            className="text-blue-500 underline"
          >
            Change image
          </button>

          <input
            accept="image/*"
            type={"file"}
            className="hidden"
            ref={inputRef}
            onChange={onChangeFile}
          />
        </div>

        {/* Fields grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4">
          {Object.keys(productSchema)?.map((key) => {
            if (
              simpleFields?.includes(key) ||
              simpleFieldsWithNum?.includes(key)
            ) {
              return (
                <div className={`${rowItemStyle} my-2 pt-3`}>
                  <CustomInput
                    label={productFieldNames[key] || key}
                    value={product[key]}
                    type={
                      simpleFieldsWithNum?.includes(key) ? "number" : "string"
                    }
                    onChangeValue={(value) => onChangeValue(value, key)}
                    icon={getIcon(key)}
                  />
                </div>
              );
            } else if (selectors[key]) {
              if (key == "category" && product.category == "others") {
                return (
                  <>
                    <div className={`${rowItemStyle} my-2 pt-3`}>
                      <CustomSelector
                        label={productFieldNames[key] || key}
                        options={
                          key == "subCategory"
                            ? product?.category
                              ? getSubCategories()
                              : []
                            : selectors[key]
                        }
                        value={product[key]}
                        onChangeValue={(value) => onChangeValue(value, key)}
                        icon={getIcon(key)}
                      />
                    </div>

                    <div className={`${rowItemStyle} my-2 pt-3`}>
                      <CustomInput
                        label={"Type category"}
                        value={otherDataFields[key]}
                        type={"string"}
                        onChangeValue={(value) =>
                          handleOtherFieldsChange(value, key)
                        }
                        icon={getIcon("category")}
                      />
                    </div>

                    <div className={`${rowItemStyle} my-2 pt-3`}>
                      <CustomInput
                        label={"Type sub category"}
                        value={otherDataFields["subCategory"]}
                        type={"string"}
                        onChangeValue={(value) =>
                          handleOtherFieldsChange(value, "subCategory")
                        }
                        icon={getIcon("subCategory")}
                      />
                    </div>
                  </>
                );
              }

              if (key == "subCategory" && product["category"] == "others") {
                return null;
              }

              if (key == "subCategory" && product["subCategory"] == "others") {
                return (
                  <>
                    <div className={`${rowItemStyle} my-2 pt-3`}>
                      <CustomSelector
                        label={productFieldNames[key] || key}
                        options={
                          key == "subCategory"
                            ? product?.category
                              ? getSubCategories()
                              : []
                            : selectors[key]
                        }
                        value={product[key]}
                        onChangeValue={(value) => onChangeValue(value, key)}
                        icon={getIcon(key)}
                      />
                    </div>

                    <div className={`${rowItemStyle} my-2 pt-3`}>
                      <CustomInput
                        label={"Type sub category"}
                        value={otherDataFields["subCategory"]}
                        type={"string"}
                        onChangeValue={(value) =>
                          handleOtherFieldsChange(value, "subCategory")
                        }
                        icon={getIcon("subCategory")}
                      />
                    </div>
                  </>
                );
              }

              return (
                <div className={`${rowItemStyle} my-2 pt-3`}>
                  <CustomSelector
                    label={productFieldNames[key] || key}
                    options={
                      key == "subCategory"
                        ? product?.category
                          ? getSubCategories()
                          : []
                        : selectors[key]
                    }
                    value={product[key]}
                    onChangeValue={(value) => onChangeValue(value, key)}
                    icon={getIcon(key)}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="h-[10%] w-full flex justify-center gap-3 items-center">
        <button
          onClick={close}
          className="bg-blue-500 rounded py-1 px-3 h-fit text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={updateDetails}
          disabled={uploading}
          className="bg-colorPrimary disabled:bg-colorPrimary/40 disabled:animate-pulse rounded py-1 px-3 h-fit text-white"
        >
          {uploading ? "Saving.." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
