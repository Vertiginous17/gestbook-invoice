import React from "react";
import { Loader } from ".";

export const LoaderMiddlePage = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded-xl shadow-lg flex flex-col items-center justify-center gap-4 flex-1">
        <Loader />
        <span className="text-gray-700 text-lg font-medium">A carregar...</span>
      </div>
    </div>
  );
};
