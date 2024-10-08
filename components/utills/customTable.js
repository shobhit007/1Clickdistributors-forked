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
      style: {
        cursor: "pointer",
        // color: "#fff",
        background:
          selectedRows?.filter((item) => item[uniqueKey] == row[uniqueKey])
            ?.length > 0
            ? "#0000002b"
            : "#fff",
      },
    };
  };

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      defaultColumn,
      autoResetFilters: false,
      initialState: { pageIndex: 0, pageSize: 20 },
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

  return (
    <div className="mx-auto h-full flex flex-col justify-between">
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
      <div className="h-[90%] overflow-auto">
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-200 ">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-2 cursor-pointer w-fit"
                  >
                    <div className="flex flex-col">
                      <div className="flex gap-2 px-2">
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
                      className="px-2 whitespace-nowrap text-base min-w-[80px] max-w-[250px] border border-gray-500 overflow-auto scrollbar-none"
                    >
                      {cell.value && typeof cell.value != "object" ? (
                        <HighlightText
                          text={cell.value || ""}
                          searchValue={searchValue}
                        />
                      ) : (
                        cell.render("Cell") // Use default render function for other columns
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data?.length > 9 && (
        <div className="pagination flex gap-3 mt-5 py-1 h-[10%] justify-center items-center bg-blue-200 flex-wrap">
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
            {[10, 20, 30, 40, 50].map((pageSize) => (
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

  const lowerText = text?.toString().toLowerCase();
  const lowerSearchValue = searchValue.toLowerCase();
  const startIndex = lowerText.indexOf(lowerSearchValue);

  if (startIndex === -1) return <span>{text}</span>;

  const beforeMatch = text.slice(0, startIndex);
  const matchText = text.slice(startIndex, startIndex + searchValue.length);
  const afterMatch = text.slice(startIndex + searchValue.length);

  return (
    <span>
      {beforeMatch}
      <span style={{ backgroundColor: "orange" }}>{matchText}</span>
      {afterMatch}
    </span>
  );
};
