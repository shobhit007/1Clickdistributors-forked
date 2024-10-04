import { useState } from "react";
import Modal from "../utills/Modal";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import moment from "moment";
const ContractDetails = () => {
  const [visible, setVisible] = useState(false);

  const onClose = () => setVisible(false);

  return (
    <div className="p-4">
      <button
        className={`bg-colorPrimary text-white py-2 px-4 rounded-md flex items-center gap-2`}
        onClick={() => setVisible(true)}
      >
        <span>Raise PO</span>
      </button>

      {visible && (
        <Modal>
          <POForm onClose={onClose} />
        </Modal>
      )}
    </div>
  );
};

const POForm = ({ onClose }) => {
  const [formFields, setFormFields] = useState({
    address: "",
    gstNumber: "",
    email: "",
    phone: "",
    package: "",
    receivedAmount: "",
    dueDate: moment().format("YYYY-MM-DDTHH:mm"),
    invoiceDate: moment().format("YYYY-MM-DDTHH:mm"),
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  console.log(formFields);

  return (
    <div className="w-full h-full">
      <div className="bg-white md:rounded p-4 h-full w-full md:w-96 md:h-[70vh] md:mx-auto md:translate-y-1/4 overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-3 rounded bg-white hover:bg-gray-200"
        >
          <AiOutlineClose className="text-xl text-black" />
        </button>
        <div className="w-full mt-4">
          <h2 className="text-black text-xl font-semibold">Raise PO</h2>
          <div className="mt-4 w-full">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="companyName"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Company Name:
                </label>
                <p className="text-base text-gray-700" id="companyName">
                  Test
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="invoiceDate"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Invoice Date:
                </label>
                <input
                  type="datetime-local"
                  id="invoiceDate"
                  name="invoiceDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.invoiceDate}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="dueDate"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Due Date:
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.dueDate}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.address}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="gstNumber"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  GST Number:
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.gstNumber}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.email}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Phone:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.phone}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="package"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Package:
                </label>
                <input
                  type="text"
                  id="package"
                  name="package"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.package}
                  onChange={handleOnChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="receivedAmount"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Received Amount:
                </label>
                <input
                  type="number"
                  id="receivedAmount"
                  name="receivedAmount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={formFields.receivedAmount}
                  onChange={handleOnChange}
                />
              </div>
              <button
                className={`w-full bg-colorPrimary text-white py-2 px-4 rounded-md flex items-center justify-center mt-10`}
                onClick={() => {}}
              >
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
