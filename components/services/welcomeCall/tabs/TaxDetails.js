import FileSelector from "../FileSelector";

const TaxDetails = ({ register, errors, setValue }) => {
  return (
    <fieldset className="bg-white p-4">
      <legend className="text-lg font-semibold">Tax Details</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GST *
          </label>
          <input
            {...register("gst")}
            placeholder="Enter GST Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
          <FileSelector
            register={register}
            setValue={setValue}
            errors={errors}
            fieldName={"gstPdf"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PAN *
          </label>
          <input
            {...register("pan")}
            placeholder="Enter PAN Number"
            className="input w-full border rounded border-gray-300 p-3"
          />
          <FileSelector
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
          <FileSelector
            register={register}
            setValue={setValue}
            errors={errors}
            fieldName={"tanPdf"}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default TaxDetails;
