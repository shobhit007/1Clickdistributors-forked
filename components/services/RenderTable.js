import { useMemo } from "react";
import { camelToTitle } from "../utills/commonFunctions";
import CustomTable from "../utills/customTable";
import moment from "moment";
import { leadsPanelColumns } from "@/lib/data/commonData";

const RenderTable = ({
  leads,
  selectedRows,
  setSelectedRows,
  searchValue,
  setUpdateLead,
}) => {
  const columnsOrder = [
    "createdAt",
    "source",
    // "dataType",
    "profileId",
    "serviceExecutiveName",
    "assignedServiceLeadBy",
    "company_name",
    // "looking_for",
    "your_mobile_number",
    "email",
    "disposition",
    "city",
    "whats_is_your_requirement_?_write_in_brief",
  ];

  let checkMarkCol = ["Select"].map((key) => {
    return {
      Header: camelToTitle(key),
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={
              selectedRows?.filter(
                (item) => item.leadId == row?.original?.leadId
              )?.length > 0
            }
            readOnly={true}
          />
        </div>
      ),
    };
  });

  const columns = useMemo(() => {
    if (leads?.length > 0) {
      let dynamicCols = columnsOrder.map((key) => {
        // Split key by underscore and capitalize the first letter of each part
        const headerParts = key
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
        const header = headerParts.join(" "); // Join parts with a space

        if (key == "assignedAt" || key == "createdAt" || key == "updatedAt") {
          return {
            Header: leadsPanelColumns[key] || key,
            accessor: key,
            Cell: ({ value }) => {
              return (
                value && (
                  <p>{moment(value?._seconds * 1000).format("DD/MM/YYYY")}</p>
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

        if (key == "profileId") {
          return {
            Header: leadsPanelColumns[key] || key,
            accessor: key,
            Cell: ({ row }) => {
              return (
                <button
                  className="text-blue-500 font-semibold hover:underline"
                  onClick={() => setUpdateLead(true)}
                >
                  {row?.original?.profileId}
                </button>
              );
            },
          };
        }

        return {
          Header: leadsPanelColumns[key] || header, // Use the modified header
          accessor: key,
          id: key,
        };
      });
      return [...checkMarkCol, ...dynamicCols];
    } else {
      return [];
    }
  }, [leads, selectedRows, columnsOrder]);
  return (
    <CustomTable
      data={leads || []}
      uniqueDataKey={"leadId"}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      columns={columns}
      openModal={false}
      closeModal={() => {}}
      searchValue={searchValue}
    />
  );
};

export default RenderTable;
