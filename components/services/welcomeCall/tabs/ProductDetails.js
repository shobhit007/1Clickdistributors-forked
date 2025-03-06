import React from "react";
import { FcImageFile } from "react-icons/fc";
import { FiPlus, FiTrash } from "react-icons/fi";
import { IoMdCloudUpload } from "react-icons/io";

function ProductDetails({
  register,
  categories,
  subCategories,
  toggleCategoryModal,
  toggleSubCategoryModal,
  handleFileChange,
  imageLoading,
  uploadProduct,
  selectedCategory,
  selectedImage,
}) {
  return (
    <fieldset className="bg-white p-4">
      <legend className="text-lg font-semibold">Products Details</legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
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
            Sub Category *
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
            Tag *
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
            onClick={() => document.getElementById("inputImage").click()}
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
        {/* <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
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
                <p className="text-sm font-medium">Title: {product.title}</p>
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
        </div> */}
        {/* {serviceProducts.length > 4 && (
          <div className="w-full flex justify-end mt-1">
            <button
              className="text-sm text-blue-500 hover:text-blue-600"
              type="button"
              onClick={() => setVisibleProducts(true)}
            >
              View more
            </button>
          </div>
        )} */}
      </div>
    </fieldset>
  );
}

export default ProductDetails;
