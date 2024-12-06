import panelContext from "@/lib/context/panelContext";
import React, { useContext, useMemo, useState } from "react";
import { MdArrowBack, MdClose, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import { RiCloseCircleFill } from "react-icons/ri";
import Modal from "../utills/Modal";
import LeadUpdateHistory from "../leadUpdateHistory";
import ShowDetails from "../allocateLead/showDetails";
import { leadsPanelColumns } from "@/lib/data/commonData";

const index = () => {
  const { previousComponent, setDisplayComponent } = useContext(panelContext);
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("leadId");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showUpdateHistoryModal, setShowUpdateHistoryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const searchByField = [
    { label: "Lead Id", value: "leadId" },
    { label: "Phone", value: "phone" },
    { label: "Company name", value: "companyName" },
    { label: "Profile Id", value: "profileId" },
  ];

  const handleSearch = async () => {
    try {
      if (!searchText) return toast.error("Please enter a number to search");

      let token = localStorage.getItem("authToken");
      setSelectedRows([]);
      setLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/globalSearch`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ searchBy, searchText }),
      });
      setLoading(false);
      const data = await response.json();
      if (data.success && data.data) {
        setData(data.data);
      } else {
        toast.error(data.message || "couldn't find sales managers");
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log("error in globalSearch", error.message);
    }
  };

  const staticColumns = [
    "createdAt",
    "source",
    "dataType",
    "profileId",
    "company_name",
    "looking_for",
    "your_mobile_number",
    "email",
    "city",
    "whats_is_your_requirement_?_write_in_brief",
    "disposition",
  ];

  const columns = useMemo(() => {
    return staticColumns.map((key) => {
      if (key == "followUpDate" || key == "createdAt" || key == "updatedAt") {
        return {
          Header: leadsPanelColumns[key] || key,
          accessor: key,
          Cell: ({ value }) => {
            return (
              value && (
                <p>{new Date(value?._seconds * 1000)?.toLocaleDateString()}</p>
              )
            );
          },
          sortType: (rowA, rowB, columnId) => {
            const dateA = rowA.values[columnId]?._seconds
              ? new Date(rowA.values[columnId]?._seconds * 1000)
              : null;
            const dateB = rowB.values[columnId]?._seconds
              ? new Date(rowB.values[columnId]?._seconds * 1000)
              : null;

            if (!dateA && !dateB) return 0; // Both dates are missing
            if (!dateA) return 1; // dateA is missing, place it after dateB
            if (!dateB) return -1; // dateB is missing, place it after dateA

            return dateA > dateB ? 1 : -1; // Compare valid dates
          },
          id: key,
        };
      }
      return {
        Header: leadsPanelColumns[key] || camelToTitle(key),
        accessor: key,
        id: key,
      };
    });
  }, []);

  return (
    <div className="w-full h-full p-4">
      {showUpdateHistoryModal && (
        <Modal>
          <div className="p-3 w-[90vw] sm:w-[65vw] md:w-[50vw] bg-white lg:w-[35vw] rounded-md h-[80vh] overflow-auto relative">
            <MdClose
              className="text-red-600 absolute top-1 right-1 text-xl cursor-pointer"
              onClick={() => setShowUpdateHistoryModal(false)}
            />

            <LeadUpdateHistory
              leadId={selectedRows[0]?.leadId}
              close={() => setShowUpdateHistoryModal(false)}
            />
          </div>
        </Modal>
      )}

      {showDetailsModal && (
        <Modal>
          <div className="w-[90vw] sm:w-[55vw] md:w-[45vw] xl:w-[35vw] h-[70vh] bg-white rounded-md p-2 relative">
            <MdClose
              className="text-red-500 absolute top-2 right-4 cursor-pointer text-2xl"
              onClick={() => setShowDetailsModal(false)}
            />

            <ShowDetails
              data={selectedRows?.[0]}
              close={() => setShowDetailsModal(false)}
            />
          </div>
        </Modal>
      )}
      <MdArrowBack
        onClick={() => setDisplayComponent(previousComponent)}
        className="text-gray-600 text-2xl"
      />

      <div className="flex mt-3 items-center justify-center">
        <div className="flex border border-gray-400 items-center max-w-[98vw]">
          <select
            className="py-1 px-3 w-fit md:w-auto  border-gray-400 outline-none h-auto border-r"
            onChange={(e) => setSearchBy(e.target.value)}
          >
            {searchByField?.map((field) => (
              <option
                value={field.value}
                selected={searchBy == field}
                className="capitalize"
              >
                {field.label}
              </option>
            ))}
          </select>
          <form
            action="#"
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault(); // Prevent the default form submission
              handleSearch(); // Call the search handler
            }}
          >
            <input
              className="py-1 px-3 rounded-md w-[150px] md:w-auto  border-gray-400 outline-none"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <MdSearch
              className="text-xl cursor-pointer text-colorPrimary"
              onClick={handleSearch}
            />
          </form>
        </div>
      </div>

      {Array.isArray(data) && data.length > 0 ? (
        <div className="mt-2">
          <div className="w-full flex flex-wrap gap-2 my-2">
            <div className="flex items-center gap-1 md:gap-4 flex-wrap">
              <button
                onClick={() => setSelectedRows([])}
                disabled={!selectedRows.length}
                className={`text-nowrap rounded px-3 py-1 text-sm flex gap-2 items-center ${
                  selectedRows.length > 0 ? "bg-colorPrimary" : "bg-gray-400"
                } text-white`}
              >
                Unselect All{" "}
                {selectedRows?.length > 0 ? selectedRows.length : ""}
                <RiCloseCircleFill />
              </button>

              <button
                onClick={() => setShowDetailsModal(true)}
                disabled={!selectedRows.length || selectedRows.length > 1}
                className={`rounded text-nowrap px-3 py-1 text-sm ${
                  selectedRows.length === 1 ? "bg-colorPrimary" : "bg-gray-400"
                } text-white`}
              >
                View Details
              </button>

              <button
                disabled={selectedRows?.length != 1}
                className={`rounded text-nowrap px-3 py-1 text-sm bg-colorPrimary disabled:bg-gray-400 text-white`}
                onClick={() => setShowUpdateHistoryModal(true)}
              >
                View Update History
              </button>
            </div>
          </div>
          <CustomTable
            data={data || []}
            uniqueDataKey={"leadId"}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            columns={columns}
            openModal={false}
            closeModal={() => {}}
          />
        </div>
      ) : (
        Array.isArray(data) &&
        data?.length == 0 && (
          <div className="w-full flex justify-center mt-8">
            <h1 className="text-xl text-gray-500 font-semibold">
              No leads found with this search
            </h1>
          </div>
        )
      )}
    </div>
  );
};

export default index;
