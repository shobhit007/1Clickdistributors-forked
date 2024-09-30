import moment from "moment";
import React, { useState } from "react";

const ShowDetails = ({ data, close }) => {
  const [selectedViewType, setSelectedViewType] = useState("User details");

  const renderObject = (key) => {
    if (data?.[key]?._seconds) {
      return moment(new Date(data[key]._seconds * 1000)).format(
        "DD-MM-YYYY hh:mm"
      );
    }
  };

  return (
    <div className="p-1 flex flex-col h-full overflow-auto gap-3">
      <div className="w-full flex justify-center gap-3 items-center">
        {/* {["User details"].map((item) => {
          return (
            <button
              className={`py-1 px-3 rounded-md ${
                selectedViewType == item
                  ? "text-white bg-colorPrimary"
                  : "text-white bg-gray-500"
              }`}
              onClick={() => setSelectedViewType(item)}
            >
              {item}
            </button>
          );
        })} */}
        <h1 className="text-colorPrimary text-xl font-semibold">Complete lead details</h1>
      </div>
      {selectedViewType == "User details" && (
        <>
          {data &&
            Object.keys(data || {}).map((key) => {
              if (typeof data[key] == "object") {
                return (
                  <div className="flex gap-1 flex-wrap">
                    <span className="text-gray-700 font-semibold">{key}:</span>
                    <span className="text-gray-600">{renderObject(key)}</span>
                  </div>
                );
              }
              return (
                <div className="flex gap-1 flex-wrap">
                  <span className="text-gray-700 font-semibold">{key}:</span>
                  <span className="text-gray-600">{data[key]}</span>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};

export default ShowDetails;
