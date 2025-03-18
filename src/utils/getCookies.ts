import { cookies } from "next/headers";
import React from "react";

export const getCookies = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("toc_access_token");
  console.log(token);

  return token;
};
