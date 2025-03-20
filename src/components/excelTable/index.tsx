import React from "react";

export type IExcelTable = {
  rawData: Array<Array<string>>;
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
            {rawData.slice(1).map((row: Array<string>, rowIndex: number) => (
              <tr key={rowIndex} className="relative hover:bg-gray-50">
                {row.map((cell: string, colIndex: number) => (
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
