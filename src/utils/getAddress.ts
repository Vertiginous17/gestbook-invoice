export const getAddress = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_GET_ADDRESS || "");
  const address = await response.json();

  if (!address?.data) {
    console.error("No client data returned from API");
    return [];
  }

  return address.data;
};
