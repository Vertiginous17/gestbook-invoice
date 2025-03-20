export type IUserType = {
  type: string;
  id: string;
  attributes: {
    tax_registration_number: string;
    business_name: string;
    contact_name?: string;
    website?: string;
    phone_number?: string;
    mobile_number?: string;
    email?: string;
    observations?: string;
    internal_observations?: string;
    not_final_customer?: boolean;
    cashed_vat?: boolean;
    tax_country_region?: string;
    country_iso_alpha_2?: string;
    saft_import_id?: string;
    is_tax_exempt?: false;
    active?: boolean;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    data?: any;
  };
  relationships: {
    addresses: {
      data: [
        {
          type: string;
          id: string;
        }
      ];
    };
    company: {
      data: {
        type: string;
        id: string;
      };
    };
    defaults: {
      data: {
        type: string;
        id: string;
      };
    };
    email_addresses: {
      data: [
        {
          type: string;
          id: string;
        },
        {
          type: string;
          id: string;
        }
      ];
    };
    main_address: {
      data: {
        type: "addresses";
        id: "1471223";
      };
    };
    main_email_address: {
      data: {
        type: string;
        id: string;
      };
    };
    tax_exemption_reason: {
      data?: string;
    };
  };
};
