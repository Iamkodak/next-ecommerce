"use client";

import React, { useState } from "react";
import { products } from "@wix/stores";

interface CustomizeProductsProps {
  options?: products.ProductOption[];
}

interface SelectedOptions {
  [key: string]: string;
}

interface ExtendedChoice extends products.Choice {
  availability?: "IN_STOCK" | "OUT_OF_STOCK";
  description?: string;
  value: string; // Explicitly mark value as required
}

export default function CustomizeProducts({
  options = [],
}: CustomizeProductsProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const handleOptionSelect = (optionName: string, choiceValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: choiceValue,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => {
        if (!option?.name || !option?.choices) return null;

        const safeOptionName = option.name;
        // Filter and cast to ensure all choices have values
        const safeChoices = option.choices
          .filter((choice): choice is ExtendedChoice => !!choice.value)
          .map((choice) => ({
            ...choice,
            value: choice.value!,
            availability: choice.availability,
            description: choice.description,
          }));

        return (
          <div key={safeOptionName}>
            <h3 className="font-medium">Choose {safeOptionName}</h3>

            {safeOptionName.toLowerCase() === "color" ? (
              <ul className="flex items-center gap-3">
                {safeChoices.map((choice) => {
                  const isAvailable = choice.availability === "IN_STOCK";
                  const isSelected =
                    selectedOptions[safeOptionName] === choice.value;

                  return (
                    <li
                      key={choice.value}
                      className={`w-8 h-8 rounded-full cursor-pointer relative ${
                        !isAvailable ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      style={{ backgroundColor: choice.value }}
                      onClick={() =>
                        isAvailable &&
                        handleOptionSelect(safeOptionName, choice.value)
                      }
                    >
                      {isSelected && (
                        <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                      {!isAvailable && (
                        <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="flex items-center gap-3">
                {safeChoices.map((choice) => {
                  const isAvailable = choice.availability === "IN_STOCK";
                  const isSelected =
                    selectedOptions[safeOptionName] === choice.value;

                  return (
                    <li
                      key={choice.value}
                      className={`
                        ring-1 rounded-md py-1 px-4 text-sm 
                        ${
                          isSelected
                            ? "bg-rogue text-white ring-rogue"
                            : "ring-gray-300 text-gray-700"
                        }
                        ${
                          !isAvailable
                            ? "bg-pink-200 text-white ring-pink-200 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      `}
                      onClick={() =>
                        isAvailable &&
                        handleOptionSelect(safeOptionName, choice.value)
                      }
                    >
                      {choice.description || choice.value}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
