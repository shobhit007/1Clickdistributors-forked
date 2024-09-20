import moment from "moment";
import React from "react";

const ShowDetails = ({ data, close }) => {
  const renderObject = (key) => {
    if (data?.[key]?._seconds) {
      return moment(new Date(data[key]._seconds * 1000)).format(
        "DD-MM-YYYY hh:mm"
      );
    }
  };

  return (
    <div className="p-3 flex flex-col h-full overflow-auto gap-3">
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
    </div>
  );
};

export default ShowDetails;
