import { useState } from "react";
import Modal from "../utills/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

const ContractDetails = ({ data }) => {
  const leadData = data?.leadData;

  const [visible, setVisible] = useState(false);

  const onClose = () => setVisible(false);

  return (
    <div className="p-4">
      <button
        className={`bg-colorPrimary text-white py-2 px-4 rounded-md flex items-center gap-2`}
        onClick={() => setVisible(true)}
      >
        <span>Raise PI</span>
      </button>

      {visible && (
        <Modal>
          <PIForm onClose={onClose} leadData={leadData} />
        </Modal>
      )}
    </div>
  );
};

const PIForm = ({ onClose, leadData }) => {
  const [formFields, setFormFields] = useState({
    address: "",
    gstNumber: "",
    package: "",
    receivedAmount: "",
    dueDate: "",
    invoiceDate: "",
    totalAmount: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formFields.address ||
      !formFields.gstNumber ||
      !formFields.package ||
      !formFields.receivedAmount ||
      !formFields.dueDate ||
      !formFields.invoiceDate ||
      !formFields.totalAmount
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    console.log("Submitting form with data:", formFields);
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white md:rounded p-4 h-full w-full md:w-[576px] md:h-[70vh] md:mx-auto md:translate-y-1/4 overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-3 rounded bg-white hover:bg-gray-200"
        >
          <AiOutlineClose className="text-xl text-black" />
        </button>
        <div className="w-full mt-4">
          <h2 className="text-black text-xl font-semibold">Raise PI</h2>
          <div className="mt-4 w-full">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="companyName"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Company Name:
                  </label>
                </LeftBox>
                <RightBox>
                  <p className="text-base text-gray-700" id="companyName">
                    {leadData?.company_name || "NA"}
                  </p>
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="invoiceDate"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Invoice Date:
                  </label>
                </LeftBox>
                <RightBox>
                  <input
                    type="datetime-local"
                    id="invoiceDate"
                    name="invoiceDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formFields.invoiceDate}
                    onChange={handleOnChange}
                  />
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="dueDate"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Due Date:
                  </label>
                </LeftBox>
                <RightBox>
                  <input
                    type="datetime-local"
                    id="dueDate"
                    name="dueDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formFields.dueDate}
                    onChange={handleOnChange}
                  />
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Address:
                  </label>
                </LeftBox>
                <RightBox>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formFields.address}
                    onChange={handleOnChange}
                  />
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="gstNumber"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    GST Number:
                  </label>
                </LeftBox>
                <RightBox>
                  <input
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formFields.gstNumber}
                    onChange={handleOnChange}
                  />
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Email:
                  </label>
                </LeftBox>
                <RightBox>
                  <RightBox>
                    <p className="text-base text-gray-700" id="email">
                      {leadData?.email || "NA"}
                    </p>
                  </RightBox>
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Phone:
                  </label>
                </LeftBox>
                <RightBox>
                  <RightBox>
                    <p className="text-base text-gray-700" id="phone">
                      {leadData?.phone_number || "NA"}
                    </p>
                  </RightBox>
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="package"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Package:
                  </label>
                </LeftBox>
                <RightBox>
                  <input
                    type="text"
                    id="package"
                    name="package"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formFields.package}
                    onChange={handleOnChange}
                  />
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="receivedAmount"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Received Amount:
                  </label>
                </LeftBox>
                <RightBox>
                  <input
                    type="number"
                    id="receivedAmount"
                    name="receivedAmount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formFields.receivedAmount}
                    onChange={handleOnChange}
                  />
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="totalAmount"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Total Contract Value:
                  </label>
                </LeftBox>
                <RightBox>
                  <input
                    type="number"
                    id="totalAmount"
                    name="totalAmount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={formFields.totalAmount}
                    onChange={handleOnChange}
                  />
                </RightBox>
              </div>
            </div>
            <button
              className={`w-full bg-colorPrimary text-white py-2 px-4 rounded-md mt-8`}
              onClick={handleSubmit} // Updated to call handleSubmit
            >
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeftBox = ({ children }) => {
  return <div className="w-40 text-left">{children}</div>;
};
const RightBox = ({ children }) => {
  return <div className="flex-1 text-left">{children}</div>;
};

export default ContractDetails;
