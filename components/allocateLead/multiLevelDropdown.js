import React, { useState } from "react";
import {
  MdArrowDownward,
  MdArrowDropDown,
  MdArrowDropUp,
} from "react-icons/md";

const MultiLevelDropdown = ({ items, level = 0, onSelect }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleOpen = (itemId) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [itemId]: !prevOpenItems[itemId],
    }));
  };

  console.log("openItems is", openItems);
  return (
    <ul style={{ margin: 0, padding: 0, paddingLeft: level * 10 }}>
      {items.map((item) => (
        <li key={item.id} style={{ listStyle: "none" }}>
          <div
            onClick={() => {
              onSelect && onSelect(item);
            }}
            style={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor: "#fff",
              borderBottom: "1px solid #ddd",
            }}
          >
            {item.name}{" "}
            {item.teamMembers && item.teamMembers.length > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOpen(item.id);
                }}
              >
                {" "}
                {openItems[item.id] ? (
                  <MdArrowDropUp />
                ) : (
                  <MdArrowDropDown />
                )}{" "}
              </button>
            ) : (
              ""
            )}
          </div>

          {/* Nested Submenu (children) shown inline */}
          {openItems[item.id] &&
            item.teamMembers &&
            item.teamMembers.length > 0 && (
              <MultiLevelDropdown
                items={item.teamMembers}
                level={level + 1}
                onSelect={onSelect}
              />
            )}
        </li>
      ))}
    </ul>
  );
};

// Example data
const dropdownData = [
  {
    name: "first",
    id: "first",
    teamMembers: [
      {
        name: "first-1",
        id: "first-1",
        teamMembers: [
          {
            name: "first-1-1",
            id: "first-1-1",
            teamMembers: [],
          },
        ],
      },
    ],
  },
  {
    name: "second",
    id: "second",
    teamMembers: [],
  },
];

const App = () => {
  return (
    <div>
      <h1>Multi-Level Dropdown</h1>
      <MultiLevelDropdown items={dropdownData} />
    </div>
  );
};

export default MultiLevelDropdown;
