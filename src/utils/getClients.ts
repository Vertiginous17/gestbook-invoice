import { toast } from "sonner";

export type GetClientsProps = {
  customer_business_name: string;
  customer_tax_registration_number: string;
  customer_country: string;
  date: string;
  due_date: string;
  finalize: boolean;
  lines: Array<{
    item_type: string;
    description: string;
    quantity: number;
    unit_price: number;
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
      name: "Sede";
      payroll_enumerations_tax_office_id?: string;
      postcode: "4750-536";
      region?: string;
      subtype?: string;
    };
    relationships: any;
  };
};

export const getClients = async (data: any) => {
  const response = await fetch(process.env.NEXT_PUBLIC_GET_CLIENTS || "");
  const client = await response.json();

  if (!client?.data) {
    console.error("No client data returned from API");
    toast("Erro ao obter clientes");
    return [];
  }

  const matchingClients = client.data.filter((item: any) => {
    return data.some((foo: any) => {
      return (
        item.attributes.tax_registration_number.toString() ===
          foo.customer_tax_registration_number.toString() &&
        // remove this logic once it's fully working
        item.attributes.business_name === foo.customer_business_name
      );
    });
  });
  return matchingClients;
};

export const createDocumentoVenda = async (props: Array<GetClientsProps>) => {
  const response = await fetch(process.env.NEXT_PUBLIC_GET_CLIENTS || "");

  const client = await response.json();

  console.log(client);

  props.map(async (item) => {
    const body = {
      document_type: "FT",
      customer_address_detail: item.address?.attributes.address_detail,
      customer_business_name: item.customer_business_name,
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
        const data = await response.json();
        console.log("Fatura created successfully:", data);
      }
    } catch (error) {
      console.error("Error making request to create Fatura:", error);
    }
  });
};
