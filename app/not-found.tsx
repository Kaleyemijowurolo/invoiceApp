// pages/_error.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { NextPage } from "next";

// Define props interface
interface ErrorPageProps {
  statusCode: number;
}

const Error: NextPage<ErrorPageProps> = ({ statusCode }) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/auth/siginin");
  };

  // Custom messages based on status code
  const getErrorMessage = (): { title: string; message: string } => {
    switch (statusCode) {
      case 404:
        return {
          title: "Page Not Found",
          message:
            "The page you're looking for doesn't exist or has been moved.",
        };
      case 500:
        return {
          title: "Server Error",
          message: "Something went wrong on our end. Please try again later.",
        };
      default:
        return {
          title: "An Error Occurred",
          message: "An unexpected error has occurred.",
        };
    }
  };

  const { title, message } = getErrorMessage();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">
      <h1 className="text-6xl md:text-8xl font-bold text-red-500 mb-4">
        {statusCode}
      </h1>
      <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>
      <p className="text-lg text-gray-600 max-w-md mb-8 text-center">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Go Back
        </button>
        <button
          onClick={handleGoHome}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};
// Error.getInitialProps = async ({ res, err }: { res?: { statusCode: number }; err?: Error & { statusCode?: number | undefined; } }) => {
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
//   return { statusCode };
// };

export default Error;
