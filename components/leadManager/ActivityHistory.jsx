import { useMemo } from "react";
import Table from "../utills/Table";
import { convertTimeStamp } from "@/lib/commonFunctions";

const ActivityHistory = ({ data: leadData }) => {
  const updatedData = leadData?.historyData?.map((item) => {
    return {
      ...item,
      followUpDate: convertTimeStamp(item?.followUpDate),
      updatedAt: convertTimeStamp(item?.updatedAt),
    };
  });

  const columns = useMemo(
    () => [
      {
        Header: "Call Back Date",
        accessor: "followUpDate",
      },
      {
        Header: "Disposition",
        accessor: "disposition",
      },
      {
        Header: "Sub-Disposition",
        accessor: "subDisposition",
      },
      {
        Header: "Remarks",
        accessor: "remarks",
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <Table data={updatedData} columns={columns} />
    </div>
  );
};

export default ActivityHistory;
