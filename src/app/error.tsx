"use client";
import React from "react";

interface ErrorProps {
  message: string;
}

const ErrorMessageComponent: React.FC<ErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-2 animate-shake">
      <span className="block font-medium">Error:</span>
      <span>{message}</span>
    </div>
  );
};

export default function GlobalError({ error }: { error: Error }) {
  return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <ErrorMessageComponent message={error.message} />
        </div>
  );
}
