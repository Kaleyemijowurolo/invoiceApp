import React from "react";

const OfflinePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 text-gray-800">
      <div className="mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-12 h-12 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M12 3.75C7.167 3.75 3.75 7.167 3.75 12C3.75 16.833 7.167 20.25 12 20.25C16.833 20.25 20.25 16.833 20.25 12C20.25 7.167 16.833 3.75 12 3.75Z"
          />
        </svg>
      </div>
      <h1 className="text-2xl mb-2">You are offline</h1>
      <p className="text-lg">
        Please check your internet connection and try again.
      </p>
    </div>
  );
};

export default OfflinePage;
