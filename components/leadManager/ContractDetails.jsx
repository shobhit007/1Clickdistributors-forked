import { Fragment, useEffect, useState } from "react";
import Modal from "../utills/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { convertTimeStamp } from "@/lib/commonFunctions";

const ContractDetails = ({ data }) => {
  const leadData = data?.leadData;

  const [visible, setVisible] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentContractId, setCurrentContractId] = useState("");

  const onClose = () => setVisible(false);

  const getContracts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getContractDetails`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId: leadData?.leadId }),
      });

      const data = await response.json();
      if (data.success) {
        return data.contracts;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      return null;
    }
  };

  const { data: contracts, refetch: refetchContracts } = useQuery({
    queryKey: ["contracts", leadData?.leadId],
    queryFn: getContracts,
  });

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <button
          className={`bg-colorPrimary text-white py-2 px-4 rounded-md flex items-center gap-2`}
          onClick={() => setVisible(true)}
        >
          <span>Raise PI</span>
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={refetchContracts}
        >
          Refresh
        </button>
      </div>

      <div className="w-full mt-6">
        <ContractsList
          contracts={contracts || []}
          setShowInvoiceModal={setShowInvoiceModal}
          setCurrentContractId={setCurrentContractId}
        />
      </div>

      {visible && (
        <Modal>
          <PIForm
            onClose={onClose}
            leadData={leadData}
            refetchContracts={refetchContracts}
          />
        </Modal>
      )}

      {showInvoiceModal && (
        <Modal>
          <InvoiceForm
            onClose={() => setShowInvoiceModal(false)}
            leadData={leadData}
            currentContractId={currentContractId}
            refetchContracts={refetchContracts}
          />
        </Modal>
      )}
    </div>
  );
};

const ContractsList = ({
  contracts,
  setShowInvoiceModal,
  setCurrentContractId,
}) => {
  const [expandedContractId, setExpandedContractId] = useState(null);

  const handleRowClick = (contractId) => {
    setExpandedContractId(
      expandedContractId === contractId ? null : contractId
    );
    setCurrentContractId(contractId);
  };

  return (
    <table className="min-w-full bg-white border border-gray-200 table-fixed">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2 text-left">
            Unique Id
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Contract Type
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Invoice Date
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Company Name
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Phone Number
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Package
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Total Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((contract) => (
          <Fragment key={contract.id}>
            <tr
              onClick={() => handleRowClick(contract.id)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="border border-gray-300 px-4 py-2">
                {contract?.id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {contract?.contractType || "NA"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {convertTimeStamp(contract?.createdAt)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {convertTimeStamp(contract?.invoiceDate)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {contract?.company_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {contract?.email}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {contract?.phone_number}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {contract?.package}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {contract?.totalAmount}
              </td>
            </tr>
            {expandedContractId === contract.id && (
              <tr className="mt-4">
                <td className="px-4 py-2 border-b" colSpan="8">
                  <InvoiceList
                    invoices={contract.orders}
                    setShowInvoiceModal={setShowInvoiceModal}
                  />
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

const InvoiceList = ({ invoices, setShowInvoiceModal }) => {
  return (
    <div className="mt-4">
      <div className="flex items-start gap-4 mb-2">
        <h3 className="text-lg font-semibold">Invoices</h3>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowInvoiceModal(true)}
        >
          Add New Invoice
        </button>
      </div>
      <table className="min-w-full bg-gray-50 border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Invoice Id</th>
            <th className="px-4 py-2 border-b text-left">Date</th>
            <th className="px-4 py-2 border-b text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b text-left">{invoice.id}</td>
              <td className="px-4 py-2 border-b text-left">
                {convertTimeStamp(invoice?.createdAt)}
              </td>
              <td className="px-4 py-2 border-b text-left">
                {invoice?.receivedAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InvoiceForm = ({ onClose, currentContractId, refetchContracts }) => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    receivedAmount: "",
    invoiceDate: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formFields.receivedAmount || !formFields.invoiceDate) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);

      const body = {
        ...formFields,
        contractId: currentContractId,
      };

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/addNewInvoice`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        refetchContracts();
        toast.success(result.message);
        setLoading(false);
        onClose();
      } else {
        toast.error(result.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded p-4 w-full md:max-w-96 md:py-8 md:pb-4 md:px-4 md:mx-auto overflow-auto relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 p-3 rounded bg-white hover:bg-gray-200"
      >
        <AiOutlineClose className="text-xl text-black" />
      </button>
      <div className="w-full mt-4">
        <h2 className="text-black text-xl font-semibold">Add New Invoice</h2>
        <div className="mt-4 w-full">
          <div className="flex flex-col space-y-4">
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
          </div>
          <button
            disabled={loading}
            className={`w-full bg-colorPrimary text-white py-2 px-4 rounded-md mt-8`}
            onClick={handleSubmit} // Updated to call handleSubmit
          >
            <span>{loading ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const PIForm = ({ onClose, leadData, refetchContracts }) => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    address: "",
    gstNumber: "",
    receivedAmount: "",
    dueDate: "",
    invoiceDate: "",
    totalAmount: "",
    duration: 0,
    period: "",
    contractType: "NC",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "duration") {
      setFormFields((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formFields.duration) {
        toast.error("Package duration can't be 0");
        return;
      }

      if (
        !formFields.address ||
        !formFields.gstNumber ||
        !formFields.receivedAmount ||
        !formFields.dueDate ||
        !formFields.invoiceDate ||
        !formFields.totalAmount ||
        !formFields.period ||
        !formFields.contractType
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);

      const body = {
        ...formFields,
        package:
          parseInt(formFields.duration) > 1
            ? `${formFields.duration} ${formFields.period}s`
            : `${formFields.duration} ${formFields.period}`,
        leadId: leadData?.leadId,
      };

      body.email = leadData?.email;
      body.phone = leadData?.phone_number;
      body.company_name = leadData?.company_name;

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/raisePI`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        refetchContracts();
        toast.success(result.message);
        setLoading(false);
        onClose();
      } else {
        toast.error(result.message);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in raisePI", error.message);
      toast.error(error.message);
      setLoading(false);
    }
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
                    htmlFor="duration"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Package:
                  </label>
                </LeftBox>
                <RightBox>
                  <div className="w-full flex gap-4">
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      value={formFields.duration}
                      onChange={handleOnChange}
                    />

                    <select
                      className={`border p-2 rounded-md border-gray-400 w-36`}
                      name="period"
                      id="period"
                      value={formFields.period}
                      onChange={handleOnChange}
                    >
                      <option value={""}>Select period</option>
                      <option value={"month"}>{"Month(s)"}</option>
                      <option value={"year"}>{"Year(s)"}</option>
                    </select>
                  </div>
                </RightBox>
              </div>
              <div className="flex items-center gap-2">
                <LeftBox>
                  <label
                    htmlFor="contractType"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Contract Type:
                  </label>
                </LeftBox>
                <RightBox>
                  <select
                    className={`border p-2 rounded-md border-gray-400 w-36`}
                    name="contractType"
                    id="contractType"
                    value={formFields.contractType}
                    onChange={handleOnChange}
                  >
                    <option value={"NC"}>NC</option>
                    <option value={"EC"}>EC</option>
                    <option value={"UPGRADE"}>UPGRADE</option>
                  </select>
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
              disabled={loading}
              className={`w-full bg-colorPrimary text-white py-2 px-4 rounded-md mt-8`}
              onClick={handleSubmit} // Updated to call handleSubmit
            >
              <span>{loading ? "Submitting..." : "Submit"}</span>
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
