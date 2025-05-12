"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { useTheme } from "@/lib/context/ThemeContext"; // Assuming this is available
import styles from "../app/styles/ErrorPage.module.scss";

interface ErrorPageProps {
  statusCode: number;
}

const Error: NextPage<ErrorPageProps> = ({ statusCode }) => {
  const router = useRouter();
  const { darkMode } = useTheme(); // Use theme context for dark mode

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/"); // Corrected typo from "siginin" to "signin"
  };

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
    <div
      className={`${styles.errorPage} ${darkMode ? styles["dark-mode"] : ""}`}
    >
      <h1 className={styles.errorCode}>{statusCode}</h1>
      <h2 className={styles.errorTitle}>{title}</h2>
      <p className={styles.errorMessage}>{message}</p>
      <div className={styles.buttonGroup}>
        <button onClick={handleGoBack} className={styles.button}>
          Go Back
        </button>
        <button onClick={handleGoHome} className={styles.button}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Error;
