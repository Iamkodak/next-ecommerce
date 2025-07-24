"use client";

import React, { useState } from "react";
import { products } from "@wix/stores";

interface CustomizeProductsProps {
  productId: string;
  variants?: products.Variant[];
  productOptions?: products.ProductOption[];
}

interface SelectedOptions {
  [key: string]: string;
}

export default function CustomizeProducts({
  productId,
  variants = [],
  productOptions = [],
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
      {productOptions.map((option) => {
        if (!option?.name || !option?.choices) return null;

        const safeOptionName = option.name;
        const safeChoices = option.choices.filter(choice => choice.value);

        return (
          <div key={safeOptionName}>
            <h3 className="font-medium">Choose {safeOptionName}</h3>

            {safeOptionName.toLowerCase() === "color" ? (
              <ul className="flex items-center gap-3">
                {safeChoices.map((choice) => {
                  const isSelected = selectedOptions[safeOptionName] === choice.value;

                  return (
                    <li
                      key={choice.value}
                      className="w-8 h-8 rounded-full cursor-pointer relative"
                      style={{ backgroundColor: choice.value }}
                      onClick={() => handleOptionSelect(safeOptionName, choice.value!)}
                    >
                      {isSelected && (
                        <div className="absolute w-10 h-10 rounded-full ring-2 ring-gray-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="flex items-center gap-3">
                {safeChoices.map((choice) => {
                  const isSelected = selectedOptions[safeOptionName] === choice.value;

                  return (
                    <li
                      key={choice.value}
                      className={`
                        ring-1 rounded-md py-1 px-4 text-sm cursor-pointer
                        ${
                          isSelected
                            ? "bg-indigo-600 text-white ring-indigo-600"
                            : "ring-gray-300 text-gray-700 hover:bg-gray-50"
                        }
                      `}
                      onClick={() => handleOptionSelect(safeOptionName, choice.value!)}
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