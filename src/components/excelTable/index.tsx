import React from "react";

export type IExcelTable = {
  rawData: any;
};

export const ExcelTable = ({ rawData }: IExcelTable) => {
  return (
    <div>
      <div className="overflow-x-auto w-full ">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
          <thead>
            <tr>
              {rawData[0].map((header: string, index: number) => (
                <th
                  key={index}
                  className="px-4 py-2 border-b border-gray-300 bg-gray-200 text-left text-sm font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable @typescript-eslint/no-explicit-any */}
            {rawData.slice(1).map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="relative hover:bg-gray-50">
                {/* eslint-disable @typescript-eslint/no-explicit-any */}
                {row.map((cell: any, colIndex: any) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 border-b border-gray-300 text-sm text-gray-600"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
