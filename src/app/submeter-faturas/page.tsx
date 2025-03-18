"use client";
import { Alert } from "@/components/alert/alert";
import { ExcelTable } from "@/components/excelTable";
import { Loader } from "@/components/loader";
import { getAddress } from "@/utils/getAddress";
import { getAuthToken } from "@/utils/getAuthToken";
import {
  createDocumentoVenda,
  getClients,
  GetClientsProps,
} from "@/utils/getClients";
import React, { EffectCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function Page() {
  const [data, setData] = useState<any>([]);
  const [rawData, setRawData] = useState<any>([]);
  const [address, setAddress] = useState<any>([]);

  const formatDate = (value: any): string => {
    // Handle numbers (Excel serial dates)
    if (typeof value === "number") {
      const jsDate = XLSX.SSF.parse_date_code(value);
      if (!jsDate) return ""; // invalid
      const year = jsDate.y;
      const month = String(jsDate.m).padStart(2, "0");
      const day = String(jsDate.d).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Handle strings (dd/mm/yyyy or other)
    if (typeof value === "string") {
      // Try to split dd/mm/yyyy
      const parts = value.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }

      // If it's already yyyy-mm-dd, return as-is
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }

      // You could add more parsing here if needed
    }

    return ""; // fallback if none of the above worked
  };

  const { isLoading } = getAuthToken();

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event?.target?.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData: Array<any> = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const updatedRawData = rawData.map((row, rowIndex) => {
        if (rowIndex > 0) {
          // Normalize column 2 (index 2)
          const thirdColumnValue = row[2];
          if (thirdColumnValue) {
            row[2] = formatDate(thirdColumnValue);
          }

          // Normalize column 3 (index 3)
          const fourthColumnValue = row[3];
          if (fourthColumnValue) {
            row[3] = formatDate(fourthColumnValue);
          }
        }
        return row;
      });

      setRawData(updatedRawData);

      // Get headers from the first row
      const headers: Array<string> = rawData[0];

      // Get the rows from index 1 onwards
      const rows = rawData.slice(1);

      // Map each row to an object using headers as keys
      const dataObjects = rows.map((row) => {
        let obj: GetClientsProps = {
          date: "",
          due_date: "",
          finalize: false,
          customer_tax_registration_number: "",
          customer_business_name: "",
          lines: [
            {
              item_type: "Service",
              description: "",
              quantity: 1,
              unit_price: 1,
            },
          ],
          customer_country: "",
        };
        headers.forEach((header, index) => {
          if (header === "Valor (sem IVA)") {
            obj.lines[0].unit_price = row[index];
          } else if (header === "Descrição / Nome") {
            obj.lines[0].description = row[index];
          } else if (header === "NIF Cliente") {
            obj.customer_tax_registration_number = row[index];
          } else if (header === "Nome cliente") {
            obj.customer_business_name = row[index];
          } else if (header === "Data de emissão") {
            obj.date = row[index];
          } else if (header === "Data de vencimento") {
            obj.due_date = row[index];
          }
        });
        return obj;
      });
      setData(dataObjects);
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const address: any = await getAddress();

      if (address) {
        setAddress(address);
      } else {
        toast("Error");
      }
    };

    fetchAddress();
  }, []);

  const handleSubmitFaturas = async () => {
    const fatura = await createDocumentoVenda(data);

    console.log(fatura);
  };

  return (
    <>
      {isLoading ? (
        <div className="w-1/2">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold mb-6">Upload do Ficheiro Excel</h1>

          {/* Custom Styled File Input */}
          <input
            type="file"
            accept=".ods, .xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="file-input mb-6 cursor-pointer px-4 py-2 border rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />

          <ExcelTable
            data={data}
            rawData={rawData}
            setData={setData}
            address={address}
          />
          {/* Custom Styled Button */}
          {rawData.length ? (
            <div>
              <Alert
                buttonText="Submeter Faturas"
                title="Está certo que quer continuar?"
                description="Vai submeter faturas"
                leftAction="Cancelar"
                rightAction="Confirmar"
                handleRightClickAction={handleSubmitFaturas}
                data={data}
              />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
