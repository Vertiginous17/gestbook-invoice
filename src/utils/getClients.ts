import { toast } from "sonner";

export type GetClientsProps = {
  customer_business_name?: string;
  customer_tax_registration_number: string;
  customer_country?: string;
  date: string;
  due_date: string;
  finalize: boolean;
  lines: Array<{
    item_type: string;
    description: string;
    quantity: number;
    unit_price: number;
    item_code: string;
    tax_percentage?: number;
    settlement_expression?: string;
  }>;
  address?: {
    id: string;
    type: string;
    attributes: {
      address_detail?: string;
      city?: string;
      code?: string;
      for_charge: boolean;
      for_discharge: boolean;
      is_national_holidays_workday: boolean;
      is_primary: boolean;
      is_saturday_workday: boolean;
      is_sunday_workday: boolean;
      name: string;
      payroll_enumerations_tax_office_id?: string;
      postcode: string;
      region?: string;
      subtype?: string;
    };
    relationships: unknown;
  };
};

export const getClients = async (data: Array<GetClientsProps>) => {
  const response = await fetch(process.env.NEXT_PUBLIC_GET_CLIENTS || "");
  const client = await response.json();

  if (!client?.data) {
    console.error("No client data returned from API");
    toast.error("Erro ao obter clientes");
    return [];
  }

  const matchingClients = client.data.filter((item) => {
    return data.some((foo) => {
      return (
        item.attributes.tax_registration_number.toString() ===
        foo.customer_tax_registration_number.toString()
        // &&
        // remove this logic once it's fully working
        // item.attributes.business_name === foo.customer_business_name
      );
    });
  });
  return matchingClients;
};

export const createDocumentoVenda = async (props: Array<GetClientsProps>) => {
  props.map(async (item) => {
    const body = {
      document_type: "FT",
      customer_address_detail: item.address?.attributes.address_detail,
      // customer_business_name: item.customer_business_name,
      customer_city: item.address?.attributes.city,
      customer_country: item.customer_country,
      customer_postcode: item.address?.attributes.postcode,
      customer_tax_registration_number: item.customer_tax_registration_number,
      date: item.date,
      due_date: item.due_date,
      finalize: item.finalize,
      lines: [
        {
          item_type: "Service",
          description: item.lines[0].description,
          quantity: 1,
          unit_price: item.lines[0].unit_price,
          item_code: item.lines[0].item_code,
          tax_percentage: item.lines[0].tax_percentage,
          settlement_expression: item.lines[0].settlement_expression,
        },
      ],
    };

    try {
      const response = await fetch("/api/createFatura", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating Fatura:", error);
      } else {
        toast("Fatura criada com sucesso");
      }
    } catch (error) {
      console.error("Error making request to create Fatura:", error);
    }
  });
};
