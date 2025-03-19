"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [data, setData] = useState<any>([]);
  const handleFetchSalesDocument = async () => {
    const response = await fetch("/api/documentos-venda");

    const documents = await response.json();

    if (!documents) {
      console.error("No documents returned from API");
      toast("Erro ao retornar os documentos de venda");
      return [];
    }

    const reversed = [...documents].reverse();
    setData(reversed);
    return reversed;
  };

  return (
    <div>
      <button onClick={handleFetchSalesDocument}>cenouras</button>
      <div>
        {data.map((item) => (
          <div>{item.date}</div>
        ))}
      </div>
    </div>
  );
}
