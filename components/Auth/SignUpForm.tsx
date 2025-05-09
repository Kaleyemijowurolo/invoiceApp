"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useTheme } from "@/lib/context/ThemeContext";
import styles from "./Auth.module.scss";
import { SignupSchema } from "@/schema";
import { set } from "mongoose";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/apiServices";
import { signIn } from "next-auth/react";
import EyeSlashIcon from "../icons/EyeSlashIcon";
import EyeIcon from "../icons/EyeIcon";

type SignupFormData = z.infer<typeof SignupSchema>;

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { darkMode } = useTheme();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: apiService.signup,
    mutationKey: ["signup"],
    onSuccess: async (data) => {
      console.log("Signup successful:", data);

      const options = {
        redirect: false,
        email: formData.email,
        password: formData.password,
      };

      const result = await signIn("credentials", options);
      if (result?.error) {
        if (result.status === 401) {
          setError("User does not exist");
        } else if (result.status === 500) {
          setError("Network error! try again");
          setLoading(false);
          return router.push("/auth/signin");
        }
      } else {
        router.push("/dashboard"); // Redirect after successful login
      }
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      setError("Signup failed. Please try again.");
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const result = SignupSchema.safeParse(formData);
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }
      mutateAsync(formData);
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className={`${styles["auth-container"]} ${darkMode ? "dark" : "light"}`}
    >
      <div className={`${styles["auth-form"]} ${darkMode ? "dark" : "light"}`}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {/* <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          /> */}
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
          <button
            type="submit"
            disabled={
              !formData.email ||
              !formData.password ||
              !formData.name ||
              isLoading
            }
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a
            href="/auth/signin"
            style={{ color: darkMode ? "#7C5DFA" : "#9277FF" }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
