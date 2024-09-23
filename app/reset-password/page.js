"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PasswordReset() {
  const [currentStep, setCurrentStep] = useState(0);
  const [otpData, setOtpData] = useState(null);
  const [email, setEmail] = useState("");

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleOtp = (d) => {
    setOtpData(d);
    nextStep();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 md:px-0">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        {currentStep === 0 && (
          <EmailStep
            onNext={nextStep}
            handleOtp={handleOtp}
            email={email}
            setEmail={setEmail}
          />
        )}
        {currentStep === 1 && (
          <OtpStep onBack={previousStep} onNext={nextStep} data={otpData} />
        )}
        {currentStep === 2 && (
          <UpdatePassword onBack={previousStep} data={otpData} email={email} />
        )}
      </div>
    </div>
  );
}

const EmailStep = ({ handleOtp, email, setEmail }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/sendEmailOtp`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP sent successfully!");
        handleOtp(data);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (err) {
      toast.error("Error sending OTP. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
        Enter Your Email
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "loading..." : "Get OTP"}
        </button>
      </form>
    </div>
  );
};

// OtpStep component to simulate the next step after email submission
const OtpStep = ({ onBack, onNext, data }) => {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    try {
      const otpToken = data.otpToken;
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/verifyOtp`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, otpToken }),
      });

      const result = await res.json();

      if (result.success) {
        onNext();
      } else {
        if (result.message === "jwt expired") {
          toast.error("OTP expired");
        } else if (result.message === "Invalid OTP") {
          toast.error("Invalid OTP");
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
        Enter OTP
      </h2>
      <p className="text-center mb-4">
        Please enter the OTP sent to your email.
      </p>
      <div className="mb-4">
        <label
          htmlFor="otp"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Enter OTP
        </label>
        <input
          type="tel"
          id="otp"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-4">
        <button
          className="w-full bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition duration-300 mt-4"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition duration-300 mt-4"
          onClick={verifyOtp}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const UpdatePassword = ({ onBack, email }) => {
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleUpdatePassword = async () => {
    try {
      if (!password) {
        return toast.error("Please enter a password");
      }

      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/resetPassword`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, email }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Password updated!");
        router.push("/login");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
        Enter Password
      </h2>
      <p className="text-center mb-4">Enter you new password</p>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Enter password
        </label>
        <input
          type="text"
          id="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-4">
        <button
          className="w-full bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition duration-300 mt-4"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition duration-300 mt-4"
          onClick={() => handleUpdatePassword(password)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
