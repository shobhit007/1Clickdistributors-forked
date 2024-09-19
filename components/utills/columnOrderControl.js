// ColumnReorder.js
import React, { useState } from "react";
import { useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "tailwindcss/tailwind.css";

const ItemTypes = {
  COLUMN: "COLUMN",
};

// Draggable Column Component
const DraggableColumn = ({ column, index, moveColumn, toggleColumn }) => {
  const [, ref] = useDrag({
    type: ItemTypes.COLUMN,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    hover: (item) => {
      if (item.index === index) return;
      moveColumn(item.index, index);
      item.index = index;
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="p-1 bg-white border rounded shadow cursor-move flex justify-between items-center px-4 w-full"
    >
      <span>{column.name}</span>
      <input
        type="checkbox"
        className="h-4 w-4 border-2 border-blue-500"
        checked={column.isVisible}
        onChange={() => toggleColumn(column.id, column.isVisible)}
      />
    </div>
  );
};

// Main Column Reorder Component
const ColumnReorder = ({
  allColumns,
  setColumnOrder,
  toggleHideColumn,
  close,
}) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (allColumns) {
      setColumns(
        allColumns.map((item) => ({
          name: item.Header,
          id: item.id,
          Header: item.Header,
          isVisible: item.isVisible,
        }))
      );
    }
  }, [allColumns]);

  const toggleColumnVisibility = (id, visibility) => {
    console.log("id ", id, visibility);
    // toggleHideColumn(id, !visibility);
    let newArray = columns.map((column) => {
      if (column.id == id) {
        return { ...column, isVisible: !column.isVisible };
      }
      return column;
    });

    setColumns(newArray);
  };

  const moveColumn = (fromIndex, toIndex) => {
    const updatedColumns = [...columns];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);
    setColumns(updatedColumns);
  };

  const applyChanges = () => {
    columns.forEach((col) => toggleHideColumn(col.id, !col.isVisible));
    const columnOrder = columns.map((col) => col.id);
    setColumnOrder(columnOrder);
    close && close();
  };

  return (
    <div className="h-full flex flex-col w-full items-center">
      <div className="flex h-[90%] overflow-auto w-full">
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col gap-2 w-full">
            {columns.map((column, index) => (
              <DraggableColumn
                key={column.id}
                column={column}
                index={index}
                moveColumn={moveColumn}
                toggleColumn={toggleColumnVisibility}
              />
            ))}
          </div>
        </DndProvider>
      </div>
      <div className="mt-4 h-[10%] w-full">
        <button
          onClick={applyChanges}
          className="bg-blue-500 text-white px-4 py-1 mt-4 rounded w-full"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ColumnReorder;
