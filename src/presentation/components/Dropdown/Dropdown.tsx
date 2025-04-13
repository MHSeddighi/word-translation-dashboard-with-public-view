"use client";

import React, { useState, useRef, memo, useEffect } from "react";
import "./Dropdown.css";

type DropdownProps = {
  options: string[];
  label?: string;
  variant?: string;
  dir?: string;
  onChange: (option: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  variant = "outlined",
  dir = "ltr",
  options = [],
  label = "",
  onChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`dropdown`}>
      <label className={"dropdown__label"}>{label}</label>
      <div
        className={`dropdown__header dropdown__header--${variant} dropdown__header--${dir}`}
        onClick={toggleDropdown}
      >
        <span className={"dropdown__header__selected"}>
          {selectedOption || options.at(0) || "Select an option"}
        </span>
        <span
          className={"dropdown__header__arrow"}
          style={{
            transform: `rotate(${isOpen ? -90 : 90}deg)`,
            transition: "transform 0.2s ease-in-out",
          }}
        >
          {`>`}
        </span>
      </div>
      {isOpen && (
        <div className={`dropdown__list dropdown__list--${dir}`}>
          {options.map((option, index) => (
            <div
              key={index}
              className={"dropdown__list__item"}
              onClick={() => selectOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(Dropdown);
