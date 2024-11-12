import React, { useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useColumnOrder,
  useGlobalFilter,
} from "react-table";
import { camelToTitle } from "./commonFunctions";
import ColumnOrderControl from "./columnOrderControl";
import { MdClose } from "react-icons/md";
import Modal from "./Modal";
import { cellColors } from "@/lib/data/commonData";

// Default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows },
}) => (
  <input
    value={filterValue || ""}
    onChange={(e) => setFilter(e.target.value || undefined)} // Set undefined to remove the filter
    className="mt-1 p-1 border rounded w-full"
    placeholder={`Search ${preFilteredRows?.length} data`}
  />
);

const CustomTable = ({
  uniqueDataKey,
  data,
  avoidCols,
  setSelectedRows,
  selectedRows,
  columns,
  openModal,
  closeModal,
  searchValue,
}) => {
  const [uniqueKey, setUniqueKey] = useState(uniqueDataKey);
  useEffect(() => {
    if (uniqueDataKey) {
      setUniqueKey(uniqueDataKey);
    }
  }, [uniqueDataKey]);

  const tableData = useMemo(() => data, [data]);

  const defaultColumn = useMemo(
    () => ({
      // Filter: DefaultColumnFilter,
      maxWidth: 400,
      width: 150,
    }),
    []
  );

  const getRowProps = (row) => {
    return {
      onClick: () => {
        if (uniqueKey) {
          let filtered = selectedRows?.filter(
            (item) => item[uniqueKey] == row[uniqueKey]
          );
          if (filtered.length > 0) {
            setSelectedRows((pre) =>
              pre.filter((item) => item[uniqueKey] !== row[uniqueKey])
            );
          } else {
            setSelectedRows((pre) => [...pre, row]);
          }
        }
      },
      className: `cursor-pointer ${
        selectedRows?.filter((item) => item[uniqueKey] == row[uniqueKey])
          ?.length > 0
          ? "bg-gray-200"
          : "bg-white"
      } hover:bg-gray-200`,
    };
  };

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      defaultColumn,
      autoResetFilters: false,
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useColumnOrder
  );

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    setColumnOrder,
    state,
    resetResizing,
    toggleHideColumn,
    allColumns,
    getToggleHideAllColumnsProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    flatColumns,
    visibleColumns,
    setPageSize,
    filteredRows,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue]);

  const getCellStyle = (name) => {
    const cellName = name === "Followup" ? "FollowUp" : name;
    const color = cellColors[cellName];

    return {
      backgroundColor: color || "#2A80B9",
      color: "white",
    };
  };

  const wrapUpCols = ["Requirement"];
  return (
    <div className="h-[85vh] flex flex-col justify-between">
      {openModal && (
        <Modal>
          <div className="h-[70vh] p-4  min-w-[90vw] md:min-w-[25vw] bg-white rounded-md pt-9 relative">
            <button className="top-1 right-4 absolute" onClick={closeModal}>
              <MdClose className="text-red-500 text-3xl" />
            </button>

            <ColumnOrderControl
              allColumns={allColumns}
              setColumnOrder={setColumnOrder}
              toggleHideColumn={toggleHideColumn}
              close={closeModal}
            />
          </div>
        </Modal>
      )}
      <div className="overflow-auto h-[90%]">
        <table
          {...getTableProps()}
          className="min-w-full divide-y mt-1 divide-gray-200"
        >
          <thead className="bg-blue-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-2 cursor-pointer w-fit min-w-[150px] max-w-[200px]"
                  >
                    <div className="flex flex-col">
                      <div className="flex gap-2 px-2 text-sm">
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </div>
                      {/* <div className="w-full">
                        {column.canFilter ? column.render("Filter") : null}
                      </div> */}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps(getRowProps(row?.original))}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={
                        cell?.column?.Header == "Disposition"
                          ? getCellStyle(cell.value)
                          : {}
                      }
                      className="whitespace-nowrap px-2 text-[12px] min-w-[150px] max-w-[270px] border border-gray-500 overflow-hidden text-gray-700"
                    >
                      <div
                        className={`${
                          wrapUpCols?.includes(cell?.column?.Header)
                            ? "w-[260px] text-wrap"
                            : ""
                        }`}
                        onClick={() => console.log("cell is", cell)}
                      >
                        {cell.value && typeof cell.value != "object" ? (
                          <HighlightText
                            text={cell.value || ""}
                            searchValue={searchValue}
                          />
                        ) : (
                          cell.render("Cell") // Use default render function for other columns
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data?.length > 9 && (
        <div className="pagination flex gap-3 py-1 h-[10%] justify-center items-center bg-blue-200 flex-wrap">
          <div className="flex gap-2 items-center">
            <button
              className="h-[2rem] cursor-pointer border-2 border-slate-500 flex items-center justify-center px-1 font-semibold "
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </button>{" "}
            <button
              className="h-[2rem] cursor-pointer border-2 border-slate-500 flex items-center justify-center px-1 font-semibold "
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {"<"}
            </button>{" "}
            <button
              className="h-[2rem] cursor-pointer border-2 border-slate-500 flex items-center justify-center px-1 font-semibold "
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {">"}
            </button>{" "}
            <button
              className="h-[2rem] cursor-pointer border-2 border-slate-500 flex items-center justify-center px-1 font-semibold "
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>{" "}
          </div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              className="border-2 border-slate-500"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            defaultValue={20}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[50, 70, 90, 120].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CustomTable;

const HighlightText = ({ text, searchValue }) => {
  if (!searchValue) return <span>{text}</span>;
  searchValue = searchValue?.toString();

  const lowerText = text?.toString().toLowerCase();
  const lowerSearchValue = searchValue.toLowerCase();
  const startIndex = lowerText.indexOf(lowerSearchValue);

  if (startIndex === -1) return <span>{text}</span>;

  const beforeMatch = text?.toString()?.slice(0, startIndex);
  const matchText = text
    ?.toString()
    ?.slice(startIndex, startIndex + searchValue.length);
  const afterMatch = text?.toString()?.slice(startIndex + searchValue.length);

  return (
    <span className="">
      {beforeMatch}
      <span style={{ backgroundColor: "orange" }}>{matchText}</span>
      {afterMatch}
    </span>
  );
};
