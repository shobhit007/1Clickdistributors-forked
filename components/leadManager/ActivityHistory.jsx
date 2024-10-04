import moment from "moment";
import Table from "../utills/Table";

const columns = [
  {
    Header: "Last Updated",
    accessor: "updatedAt",
  },
  {
    Header: "Executive",
    accessor: "executive",
  },
  {
    Header: "Disposition",
    accessor: "disposition",
  },
  {
    Header: "Remarks",
    accessor: "remarks",
  },
];

const data = [
  {
    updatedAt: moment().toLocaleString(),
    executive: "Test",
    disposition: "Not Open",
    remarks:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis eos assumenda in voluptatibus dolorum ad sit vel ducimus tempora nam ipsa dicta aspernatur, aut saepe repudiandae provident natus itaque pariatur.",
  },
];

const ActivityHistory = () => {
  return (
    <div className="p-4">
      <Table data={data} columns={columns} />
    </div>
  );
};

export default ActivityHistory;
