"use client";

import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import Checkbox from "../Form/Checkbox";
import IconComponent from "../IconComponent/IconComponent";
import { InputSearch } from "../InputSearch/InputSearch";

const CustomDropdown = ({
  options = [],
  placeholder = "Select value",
  searchPlaceholder = "Search...",
  isMultipleSelected = false,
  onSelected = () => {},
  className = "",
  disabled = false,
  defaultValue = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Sync selected state with defaultValue when it changes
  useEffect(() => {
    console.log(
      "CustomDropdown useEffect - defaultValue changed:",
      defaultValue
    );
    console.log("CustomDropdown useEffect - current selected:", selected);
    setSelected(defaultValue);
  }, [defaultValue, selected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    if (isMultipleSelected) {
      const isAlreadySelected = selected.some(
        (item) => item.value === option.value
      );
      let newSelected;

      if (isAlreadySelected) {
        newSelected = selected.filter((item) => item.value !== option.value);
      } else {
        newSelected = [...selected, option];
      }

      setSelected(newSelected);
      onSelected(newSelected);
    } else {
      setSelected([option]);
      onSelected([option]);
      setIsOpen(false);
      setSearch("");
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearch("");
      }
    }
  };

  const getDisplayText = () => {
    console.log("CustomDropdown getDisplayText - selected:", selected);
    if (selected.length === 0) return placeholder;

    if (isMultipleSelected) {
      // Untuk multiple selection, selalu tampilkan jumlah item yang dipilih
      return `${selected.length} Transporter Terpilih`;
    }

    return selected[0].name;
  };

  const isOptionSelected = (option) => {
    return selected.some((item) => item.value === option.value);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex h-8 w-full items-center justify-between rounded-md border border-neutral-600 bg-white px-3 text-xs font-medium text-neutral-900 transition-colors duration-200 hover:border-primary-700 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500`}
      >
        <span className="truncate">{getDisplayText()}</span>
        <IconComponent
          src="/icons/chevron-down.svg"
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[212px] overflow-hidden rounded-md border border-neutral-600 bg-white">
          {/* Search Input */}
          <div className="mb-2 mt-2 px-2.5">
            <div className="mb-1 w-full">
              <InputSearch
                placeholder={searchPlaceholder}
                searchValue={search}
                setSearchValue={setSearch}
                options={[]}
                getOptionLabel={() => ""}
                onSelectValue={() => {}}
                hideDropdown={true}
                appearance={{
                  inputClassName: "h-[32px] text-xs",
                }}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[212px] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar]:w-1">
            <div
              className={`mb-4 w-full ${filteredOptions.length !== 0 ? "pb-10" : ""}`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`flex cursor-pointer items-center gap-1 px-1 py-2 transition-colors duration-150 hover:bg-neutral-200 ${index === 0 ? "rounded-t-md" : ""} ${index === filteredOptions.length - 1 ? "rounded-b-md" : ""} `}
                  >
                    {isMultipleSelected && (
                      <Checkbox
                        checked={isOptionSelected(option)}
                        onChange={() => handleSelect(option)}
                        value={option.value}
                        label=""
                        className="ms-3 flex-shrink-0"
                      />
                    )}
                    <span className="truncate text-xs font-medium text-neutral-900">
                      {option.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs">
                  Data tidak ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  isMultipleSelected: PropTypes.bool,
  onSelected: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.array,
};

export default CustomDropdown;
