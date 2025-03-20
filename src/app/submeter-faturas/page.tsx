"use client";
import { Alert } from "@/components/alert/alert";
import { ExcelTable } from "@/components/excelTable";
import { getAddress } from "@/utils/getAddress";
import { createDocumentoVenda, GetClientsProps } from "@/utils/getClients";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Image from "next/image";
import { useAuthToken } from "@/utils/useAuthToken";
import { useRouter } from "next/navigation";

export default function Page() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [data, setData] = useState<any>([]);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [rawData, setRawData] = useState<any>([]);
  const [address, setAddress] = useState([]);

  const { token, isLoadingToken } = useAuthToken();

  const router = useRouter();

  const formatDate = (value: unknown): string => {
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
    }

    return "";
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event?.target?.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const rawData: Array<any> = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const maxColumns = rawData.reduce(
        (max, row) => Math.max(max, row.length),
        0
      );

      const updatedRawData = rawData.map((row, rowIndex) => {
        const paddedRow = [...row];
        while (paddedRow.length < maxColumns) {
          paddedRow.push(null);
        }

        const normalizedRow = paddedRow.map((cell) => {
          if (cell === undefined || cell === "") {
            return null;
          }
          return cell;
        });

        if (rowIndex > 0) {
          const thirdColumnValue = normalizedRow[2];
          if (thirdColumnValue) {
            normalizedRow[2] = formatDate(thirdColumnValue);
          }

          const fourthColumnValue = normalizedRow[3];
          if (fourthColumnValue) {
            normalizedRow[3] = formatDate(fourthColumnValue);
          }
        }

        return normalizedRow;
      });

      setRawData(updatedRawData);

      const headers: Array<string> = updatedRawData[0];

      const rows = updatedRawData.slice(1);

      const dataObjects = rows.map((row) => {
        const obj: GetClientsProps = {
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
              item_code: 0,
              tax_percentage: 0,
              settlement_expression: "",
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
          } else if (header === "Código do Serviço") {
            obj.lines[0].item_code = row[index];
          } else if (header === "Percentagem IVA") {
            obj.lines[0].tax_percentage = row[index];
          } else if (header === "Desconto") {
            obj.lines[0].settlement_expression = row[index];
          }
        });
        return obj;
      });

      setData(dataObjects);
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (!isLoadingToken && !token) router.push("/login");
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getAddress();

      if (address) {
        setAddress(address);
      } else {
        toast("Error");
      }
    };

    fetchAddress();
  }, []);

  const handleSubmitFaturas = async () => {
    await createDocumentoVenda(data);
  };

  return (
    <div className={"relative min-h-screen"}>
      <div className="flex flex-col gap-8 mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Upload do Ficheiro Excel
        </h1>

        {/* Step 1 - Download Example */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Passo 1: Descarregue o ficheiro de exemplo
          </h2>
          <p className="text-gray-600">
            Faça o download do ficheiro de exemplo abaixo, edite os dados
            localmente e guarde no seu computador.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Image src="/excel-icon.svg" alt="excel" width={32} height={32} />
              <span className="text-gray-700 font-medium">
                Excel de exemplo
              </span>
            </div>
            <a
              href="Pasta.xlsx"
              download="MyExampleDoc"
              target="_blank"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition-all"
            >
              Download
            </a>
          </div>
        </div>

        {/* Step 2 - Upload Edited File */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Passo 2: Faça upload do ficheiro preenchido
          </h2>
          <p className="text-gray-600">
            Selecione o ficheiro que acabou de editar e guardei no seu
            computador.
          </p>
          <input
            type="file"
            accept=".ods, .xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="file-input cursor-pointer px-4 py-2 border rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Step 3 - Review and Submit */}
        {rawData.length > 0 && (
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Passo 3: Reveja e submeta os dados
            </h2>
            <p className="text-gray-600">
              Confirme que os dados estão corretos antes de submeter as faturas.
            </p>
            <p className="text-sm text-red-600 bg-red-100 border border-red-300 rounded-md p-3">
              ⚠️ Atenção: Por favor, atualize a tabela antes de submeter.
            </p>

            {/* Excel Table */}
            <ExcelTable
              data={data}
              rawData={rawData}
              setData={setData}
              address={address}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
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
          </div>
        )}
      </div>
    </div>
  );
}
