import { FiImage } from "react-icons/fi";

const BankDetails = ({ register, setValue, errors, watch }) => {
  const cancelChequeImage = watch("cancelCheque");

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
      <legend className="text-lg font-semibold">Bank Details</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Account Number
          </label>
          <input
            {...register("confirmAccountNumber")}
            placeholder="Confirm Account Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
        </div> */}

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
        <label className="block mt-2 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, "cancelChequeUrl")}
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            {cancelChequeImage ? (
              <img
                src={cancelChequeImage}
                alt="Cancel cheque"
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
    </fieldset>
  );
};

export default BankDetails;
