"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTheme } from "@/lib/context/ThemeContext";
import styles from "./Auth.module.scss";
import EyeIcon from "../icons/EyeIcon";
import EyeSlashIcon from "../icons/EyeSlashIcon";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { darkMode } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        console.error("Invalid email format.");
        setError("Invalid email format.");
        return; // Exit if email format is invalid
      }
      const options = { redirect: false, email, password };

      const result = await signIn("credentials", options);

      if (result?.error) {
        if (result.status === 401) {
          setError("User does not exist");
        } else if (result.status === 500) {
          setError("Network error! try again");
        } else {
          console.error("Failed to sign in:", result.error);
        }
      } else {
        router.push("/dashboard"); // Redirect after successful login
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles["auth-container"]} ${darkMode ? "dark" : "light"}`}
    >
      <div className={`${styles["auth-form"]} ${darkMode ? "dark" : "light"}`}>
        <h1>Login</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showPasswordButton}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={!email || !password || isLoading}>
            {isLoading ? "Loading..." : " Login"}
          </button>
        </form>
        <p>
          Don’t have an account?{" "}
          <a
            href="/auth/signup"
            style={{ color: darkMode ? "#7C5DFA" : "#9277FF" }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
