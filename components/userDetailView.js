import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const UserDetailView = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [user, setuser] = useState(false);
  const [showResetPasswordView, setShowResetPasswordView] = useState(false);
  const [otpData, setOtpData] = useState({
    otp: "",
    otpToken: "",
    otpLoading: false,
  });
  const [passwordView, setPasswordView] = useState(false);
  const [password, setPassword] = useState("");

  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      setLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/getUserDetails`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.log("error in getting leads", error.message);
      return null;
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["userDetail"],
    queryFn: getUserDetails,
  });

  useEffect(() => {
    if (data) {
      setuser(data);
    }
  }, [data]);

  const handleFieldsChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setuser((pre) => ({ ...pre, [name]: value }));
  };

  // send otp to that email
  const sendEmailOtp = async () => {
    try {
      if (!user) {
        return toast.error("Something went wrong");
      }

      setOtpData((pre) => ({ ...pre, otpLoading: true }));

      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/sendEmailOtp`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpData((pre) => ({ ...pre, otpToken: data.otpToken }));
        toast.success("OTP sent successfully!");
      } else {
        toast.error(data.message);
      }
      setOtpData((pre) => ({ ...pre, otpLoading: false }));
    } catch (err) {
      toast.error("Error sending OTP. Please try again.");
      setOtpData((pre) => ({ ...pre, otpLoading: false }));
    }
  };

  // Verify otp
  const verifyOtp = async () => {
    try {
      console.log("otpDt", otpData);
      const otpToken = otpData.otpToken;
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/verifyOtp`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpData.otp, otpToken }),
      });

      const result = await res.json();

      if (!result.success) {
        if (result.message === "jwt expired") {
          toast.error("OTP expired");
        } else if (result.message === "Invalid OTP") {
          toast.error("Invalid OTP");
        } else {
          toast.error("Something went wrong");
        }
      } else {
        setShowResetPasswordView(false);
        setPasswordView(true);
      }
    } catch (err) {
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    console.log("password", password);
    try {
      if (!password) {
        return toast.error("Please enter a password");
      }

      const token = localStorage.getItem("authToken");
      const API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUser`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password, email: user.email }),
      });

      const result = await res.json();

      console.log("result", result);

      if (result.success) {
        toast.success("Password updated!");
        close();
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center">
        <img src="/loader.gif" className="h-[60px] w-auto" alt="loading" />
        <p className="text-xl font-bold text-gray-500 mt-3">
          Loading... please wait
        </p>
      </div>
    );
  }

  if (showResetPasswordView) {
    return (
      <div className="w-full h-full overflow-auto p-3">
        <button
          className="flex items-center gap-2 text-gray-500 text-lg"
          onClick={() => setShowResetPasswordView(false)}
        >
          Back <FaArrowCircleLeft className="text-2xl" />
        </button>

        <div className="w-full flex flex-col gap-1 mt-6">
          <input
            className="py-1 px-2 w-full text-gray-500 border border-gray-400 rounded-md "
            disabled={true}
            value={user?.email}
          />

          <button
            onClick={sendEmailOtp}
            className="text-white text-sm font-semibold bg-blue-500 py-1 px-2 rounded-md w-fit mt-1"
          >
            Send otp to this email
          </button>
        </div>
        <div className="w-full flex flex-col gap-1 mt-6">
          <span className="text-lg font-semibold text-gray-500 ml-1">
            Enter OTP sent to your email
          </span>
          <input
            className="py-1 px-2 w-full text-gray-500 border border-gray-400 rounded-md"
            placeholder="OTP"
            type="tel"
            value={otpData.otp}
            onChange={(e) =>
              setOtpData((pre) => ({ ...pre, otp: e.target.value }))
            }
          />

          <button
            onClick={verifyOtp}
            className={`text-white text-sm font-semibold ${
              otpData.otpToken && otpData.otp
                ? "bg-colorPrimary"
                : "bg-gray-300"
            } py-1 px-4 rounded-md w-fit mt-1`}
            disabled={!otpData.otpToken || !otpData.otp}
          >
            Verify
          </button>
        </div>
      </div>
    );
  }

  if (passwordView) {
    return (
      <div className="w-full h-full overflow-auto p-3">
        <button
          className="flex items-center gap-2 text-gray-500 text-lg"
          onClick={() => {
            setPasswordView(false);
            setShowResetPasswordView(true);
          }}
        >
          Back <FaArrowCircleLeft className="text-2xl" />
        </button>
        <div className="w-full flex flex-col gap-1 mt-6">
          <span className="text-lg font-semibold text-gray-500 ml-1">
            Enter new password
          </span>
          <input
            className="py-1 px-2 w-full text-gray-500 border border-gray-400 rounded-md"
            placeholder="Password"
            type="tel"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleUpdatePassword}
            className={`text-white text-sm font-semibold ${
              password ? "bg-colorPrimary" : "bg-gray-300"
            } py-1 px-4 rounded-md w-fit mt-1`}
            disabled={!password}
          >
            Update
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-2 flex">
        <button
          onClick={() => setIsEditable(!isEditable)}
          className="text-white bg-blue-500 py-1 px-2 rounded-md"
        >
          {isEditable ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="flex flex-col px-2 gap-3 mt-3">
        <div className="w-full flex flex-col gap-1">
          <span className="text-lg font-semibold text-gray-500 ml-1">Name</span>
          <input
            className="py-1 px-2 w-full text-gray-500 border-2 border-gray-500 disabled:border-gray-400 disabled:border rounded-md"
            disabled={!isEditable}
            value={user?.name}
            name="name"
            onChange={handleFieldsChange}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-lg font-semibold text-gray-500 ml-1">
            Email
          </span>
          <input
            className="py-1 px-2 w-full text-gray-500 border border-gray-400 rounded-md"
            disabled={true}
            value={user?.email}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-lg font-semibold text-gray-500 ml-1">Role</span>
          <input
            className="py-1 px-2 w-full text-gray-500 border border-gray-400 rounded-md"
            disabled={true}
            value={user?.role}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-lg font-semibold text-gray-500 ml-1">
            Password
          </span>
          <input
            className="py-1 px-2 w-full text-gray-500 border border-gray-400 rounded-md"
            disabled={true}
            value={user?.password}
          />

          <button
            onClick={() => setShowResetPasswordView(true)}
            className="text-blue-500 w-fit text-xs ml-1 cursor-pointer font-semibold hover:underline"
          >
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailView;