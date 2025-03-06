const { FcDocument, FcImageFile } = require("react-icons/fc");

export default function PDFFileSelector({
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
