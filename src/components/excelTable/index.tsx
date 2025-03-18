import { getClients, GetClientsProps } from "@/utils/getClients";
import Image from "next/image";
import React from "react";

export type IExcelTable = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  rawData: any;
  setData: React.Dispatch<React.SetStateAction<Array<GetClientsProps>>>;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  address: any;
};

export const ExcelTable = ({
  data,
  rawData,
  setData,
  address,
}: IExcelTable) => {
  const handleUpdateTable = async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const clients: any = await getClients(data);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const updatedData = data.map((item: any) => {
      const client = clients.find(
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (client: any) =>
          client.attributes.tax_registration_number.toString() ===
          item.customer_tax_registration_number.toString()
      );

      if (!client) return item;

      const foundAddress = address.find(
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (element: any) =>
          element.id === client.relationships.main_address.data.id
      );

      return {
        ...item,
        address: foundAddress,
        customer_country: client.attributes.country_iso_alpha_2,
      };
    });

    console.log(updatedData);

    setData(updatedData);
  };

  return (
    <div>
      {rawData.length > 0 ? (
        <div className="overflow-x-auto w-full ">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-colors hover:bg-gray-200 cursor-pointer"
              onClick={handleUpdateTable}
            >
              <Image
                alt="reload"
                src="reload.svg"
                width={16}
                height={16}
                className="opacity-70"
              />
              Atualizar Tabela
            </button>
          </div>

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
      ) : (
        <div className="text-lg text-gray-500 mt-4">
          Nenhum ficheiro selecionado
        </div>
      )}
    </div>
  );
};
