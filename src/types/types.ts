type IUserType = {
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
    data?: {};
  };
  relationships: {
    addresses: {
      data: [
        {
          type: "addresses";
          id: "1471223";
        }
      ];
    };
    company: {
      data: {
        type: "current_company";
        id: "42328";
      };
    };
    defaults: {
      data: {
        type: "customers_defaults";
        id: "1460467";
      };
    };
    email_addresses: {
      data: [
        {
          type: "email_addresses";
          id: "136630";
        },
        {
          type: "email_addresses";
          id: "136631";
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
        type: "email_addresses";
        id: "136630";
      };
    };
    tax_exemption_reason: {
      data: null;
    };
  };
};
