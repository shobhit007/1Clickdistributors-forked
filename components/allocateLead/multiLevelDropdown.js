import React, { useEffect, useState } from "react";
import {
  MdArrowDownward,
  MdArrowDropDown,
  MdArrowDropUp,
} from "react-icons/md";

const MultiLevelDropdown = ({ items, level = 0, onSelect, allItems }) => {
  const [openItems, setOpenItems] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (searchText == "") {
      setFilteredItems(allItems);
    }
    let filtered = allItems?.filter((item) =>
      item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [allItems, searchText]);

  const toggleOpen = (itemId) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [itemId]: !prevOpenItems[itemId],
    }));
  };

  return (
    <ul style={{ margin: 0, padding: 0, paddingLeft: level * 10 }}>
      {level == 0 && (
        <div className="w-full p-1 border border-gray-400 rounded">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="outline-none w-full text-gray-700"
            placeholder="Enter to search"
          />
        </div>
      )}

      {searchText != "" ? (
        filteredItems?.length > 0 ? (
          filteredItems?.map((item) => {
            return (
              <li
                onClick={() => onSelect && onSelect(item)}
                className="p-1 my-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                {item.name} ({item.department})
              </li>
            );
          })
        ) : (
          <h1 className="text-gray-500 mt-4 w-full text-center">
            No data for searched text
          </h1>
        )
      ) : (
        items.map((item) => (
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
        ))
      )}
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
