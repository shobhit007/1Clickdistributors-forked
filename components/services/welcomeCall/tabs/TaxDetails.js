import { FiImage } from "react-icons/fi";

const TaxDetails = ({ register, setValue, watch }) => {
  const gstImage = watch("gstImage");
  const panImage = watch("panImage");
  const tanImage = watch("tanImage");

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setValue(field, e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <fieldset className="bg-white p-4">
      <legend className="text-lg font-semibold">Tax Details</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GST *
          </label>
          <input
            {...register("gstNumber")}
            placeholder="Enter GST Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
          <label className="block mt-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "gstImage")}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              {gstImage ? (
                <img
                  src={gstImage}
                  alt="GST"
                  className="mx-auto h-20 object-contain"
                />
              ) : (
                <>
                  <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">
                    Select Image
                  </span>
                </>
              )}
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PAN *
          </label>
          <input
            {...register("panNumber")}
            placeholder="Enter PAN Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
          <label className="block mt-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "panImage")}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              {panImage ? (
                <img
                  src={panImage}
                  alt="PAN"
                  className="mx-auto h-20 object-contain"
                />
              ) : (
                <>
                  <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">
                    Select Image
                  </span>
                </>
              )}
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            TAN
          </label>
          <input
            {...register("tanNumber")}
            placeholder="Enter TAN Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
          <label className="block mt-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "tanImage")}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              {tanImage ? (
                <img
                  src={tanImage}
                  alt="TAN"
                  className="mx-auto h-20 object-contain"
                />
              ) : (
                <>
                  <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">
                    Select Image
                  </span>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
    </fieldset>
  );
};

export default TaxDetails;
