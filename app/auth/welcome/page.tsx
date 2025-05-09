"use client";

// import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();
  // const [userName, setUserName] = useState("User");

  // useEffect(() => {
  //   // Fetch user name from localStorage or API
  //   const storedName = localStorage.getItem("userName") || "Justina Consults";
  //   setUserName(storedName);
  // }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Success Message */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-white">
        <div className="mb-6 flex space-x-2">
          <div className="h-2 w-8 bg-blue-600 rounded-full"></div>
          <div className="h-2 w-8 bg-blue-600 rounded-full"></div>
          <div className="h-2 w-8 bg-blue-600 rounded-full"></div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          Welcome,{" "}
          {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            {userName}!
          </span> */}
        </h1>
        <p className="mt-2 text-lg font-semibold text-gray-700">
          {`Let’s build the future, together!`}
        </p>
        <p className="mt-4 text-gray-500">
          {` With our smart tools, you'll be able to track progress, develop new skills, and connect with opportunities that align with your goals.`}
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Proceed to dashboard
        </button>
      </div>

      {/* Right Side - Marketing Section */}
      <div className="w-1/2 flex flex-col justify-center bg-gradient-to-br from-blue-700 to-purple-600 text-white p-16 relative">
        <h2 className="text-3xl font-bold">
          A smart solution for managing careers and unlocking talent
          potential...
        </h2>
        <p className="mt-4 text-lg">
          Streamline career growth, track progress, and nurture top talent with
          powerful insights—all in one intuitive platform.
        </p>

        {/* Mocked Analytics Graphic */}
        <div className="absolute top-20 right-12 bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
          <h3 className="text-white font-semibold">Ushaseer Academy</h3>
          <p className="text-gray-300 text-sm">
            Real-Time Career Progress Tracking of your talents
          </p>
          <div className="mt-3 w-72 h-40 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            📊 <span className="text-white">Chart Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
