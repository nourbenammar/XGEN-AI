"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identifiant: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, identifiant, email, password } = formData;

    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!identifiant) newErrors.identifiant = "Identifiant is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number.";
    }

    if (Object.keys(newErrors).length === 0) {
      router.push("/dashboard");
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="alumni-verse-theme">
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.png"
            alt="Background"
            fill={true} // Use "fill" instead of "layout"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80"></div>
        </div>

        {/* Form Popup */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-lg shadow-2xl max-w-lg w-full backdrop-blur-md">
            <h2 className="text-3xl font-bold text-center text-red-800 mb-6">
              Sign Up
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

              {/* Identifiant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Identifiant <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="identifiant"
                  value={formData.identifiant}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.identifiant && (
                  <p className="text-red-500 text-sm">{errors.identifiant}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button className="bg-gradient-to-r from-red-800 to-red-600 text-white px-10 py-5 text-lg rounded-full shadow-2xl hover:from-red-800 hover:to-red-500 transition-transform transform hover:scale-110">
                  Sign Up
                </Button>
              </div>

              {/* Redirect to Login */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-red-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </form>          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
