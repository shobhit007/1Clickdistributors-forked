import FileSelector from "../FileSelector";

const BankDetails = ({ register, setValue, errors }) => {
  return (
    <fieldset className="bg-white p-4">
      <legend className="text-lg font-semibold">Bank Details</legend>
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
          <FileSelector
            register={register}
            setValue={setValue}
            errors={errors}
            fieldName={"cancelCheque"}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default BankDetails;
